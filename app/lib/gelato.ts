/**
 * Gelato Direct Print API helper
 * Replaces lulu.ts — hardcover photobook 210×280mm
 *
 * Auth: X-API-KEY header (key stored in GELATO_API_KEY env var)
 * Base URLs:
 *   Orders  → https://order.gelatoapis.com
 *   Products → https://product.gelatoapis.com
 */

const GELATO_ORDER_API = "https://order.gelatoapis.com";
const GELATO_PRODUCT_API = "https://product.gelatoapis.com";

// Hardcover casewrap, 210×280mm (8×11in), 170gsm coated silk interior,
// 4-4 color, glued left binding, matte lamination, 130gsm cover.
export const GELATO_PRODUCT_UID =
  "photobooks-hardcover_pf_210x280-mm-8x11-inch_pt_170-gsm-65lb-coated-silk_cl_4-4_ccl_4-4_bt_glued-left_ct_matt-lamination_prt_1-0_cpt_130-gsm-65-lb-cover-coated-silk_ver";

// Gelato's hard limits for this hardcover product are 28–200 interior pages.
// We use 32 as our floor (safely above the 28 minimum, matches INCLUDED_PAGES
// in pricing.ts) and always round up to an even count.
export const GELATO_MIN_PAGES = 32;

// Cover dimensions for GELATO_MIN_PAGES (32 pages), used as fallback
// Verified via Gelato cover-dimensions API.
export const GELATO_DEFAULT_COVER_WIDTH_MM = 478;
export const GELATO_DEFAULT_COVER_HEIGHT_MM = 326;

function gelatoHeaders() {
  const key = (process.env.GELATO_API_KEY ?? "").trim();
  if (!key) throw new Error("GELATO_API_KEY env var not set");
  return {
    "Content-Type": "application/json",
    "X-API-KEY": key,
  };
}

/**
 * Get exact cover (wraparound) dimensions for a given interior page count.
 * Returns width/height in mm.
 *
 * Falls back to hardcoded defaults if the API call fails so checkout
 * never hard-blocks on a temporary API outage.
 */
export async function getGelatoCoverDimensions(pageCount: number): Promise<{
  widthMm: number;
  heightMm: number;
  spineWidthMm: number;
}> {
  const safeCount = Math.max(
    GELATO_MIN_PAGES,
    pageCount % 2 === 0 ? pageCount : pageCount + 1
  );

  try {
    // Primary: GET product cover-dimensions endpoint.
    // NOTE: the Gelato Product API is v3 (the Orders API is v4 — they version
    // independently). Using v4 here returns 404 and silently falls back.
    const key = (process.env.GELATO_API_KEY ?? "").trim();
    const res = await fetch(
      `${GELATO_PRODUCT_API}/v3/products/${GELATO_PRODUCT_UID}/cover-dimensions?pageCount=${safeCount}`,
      {
        headers: { "X-API-KEY": key },
        signal: AbortSignal.timeout(15_000),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const widthMm = data.wraparoundInsideSize?.width ?? GELATO_DEFAULT_COVER_WIDTH_MM;
      const heightMm = data.wraparoundInsideSize?.height ?? GELATO_DEFAULT_COVER_HEIGHT_MM;
      const spineWidthMm = data.spineSize?.width ?? 6;
      return { widthMm, heightMm, spineWidthMm };
    }
    console.warn(`[Gelato] cover-dimensions API returned ${res.status}, using fallback`);
  } catch (err) {
    console.warn("[Gelato] cover-dimensions API failed:", err, "— using fallback");
  }

  // Fallback: 32-page base + ~0.1 mm per additional page (spine grows linearly)
  const extraPages = safeCount - GELATO_MIN_PAGES;
  const spineWidthMm = 6 + extraPages * 0.1;
  return {
    widthMm: GELATO_DEFAULT_COVER_WIDTH_MM + extraPages * 0.1,
    heightMm: GELATO_DEFAULT_COVER_HEIGHT_MM,
    spineWidthMm,
  };
}

/** Create a Gelato order after Stripe payment */
export async function createGelatoOrder(params: {
  /** Stripe checkout session ID — used as order reference for tracing */
  externalId: string;
  title: string;
  pageCount: number;
  /** URL of the cover PDF (full wraparound) */
  coverUrl: string;
  /** URL of the interior PDF */
  interiorUrl: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street1: string;
    street2?: string;
    city: string;
    stateCode?: string;
    countryCode: string;
    postcode: string;
    phoneNumber: string;
    email: string;
  };
}) {
  const safePageCount = Math.max(
    GELATO_MIN_PAGES,
    params.pageCount % 2 === 0 ? params.pageCount : params.pageCount + 1
  );

  const body = {
    orderType: "order",
    orderReferenceId: params.externalId,
    customerReferenceId: params.shippingAddress.email,
    currency: "EUR",
    items: [
      {
        itemReferenceId: `${params.externalId}-item`,
        productUid: GELATO_PRODUCT_UID,
        quantity: 1,
        pageCount: safePageCount,
        files: [
          { type: "cover", url: params.coverUrl },
          { type: "default", url: params.interiorUrl },
        ],
      },
    ],
    shippingAddress: {
      firstName: params.shippingAddress.firstName,
      lastName: params.shippingAddress.lastName,
      addressLine1: params.shippingAddress.street1,
      addressLine2: params.shippingAddress.street2 ?? "",
      city: params.shippingAddress.city,
      state: params.shippingAddress.stateCode ?? "",
      country: params.shippingAddress.countryCode,
      postCode: params.shippingAddress.postcode,
      phone: params.shippingAddress.phoneNumber,
      email: params.shippingAddress.email,
    },
    metadata: [{ key: "albumTitle", value: params.title }],
  };

  const res = await fetch(`${GELATO_ORDER_API}/v4/orders`, {
    method: "POST",
    headers: gelatoHeaders(),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gelato order creation failed: ${res.status} ${text}`);
  }
  return res.json();
}

/** Get a Gelato order by its internal ID */
export async function getGelatoOrder(orderId: string) {
  const res = await fetch(`${GELATO_ORDER_API}/v4/orders/${orderId}`, {
    headers: gelatoHeaders(),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Get Gelato order failed: ${res.status}`);
  return res.json();
}

/** Find a Gelato order by its orderReferenceId (= Stripe session ID) */
export async function findGelatoOrderByRef(refId: string) {
  try {
    const res = await fetch(
      `${GELATO_ORDER_API}/v4/orders?orderReferenceId=${encodeURIComponent(refId)}&limit=5`,
      {
        headers: gelatoHeaders(),
        signal: AbortSignal.timeout(15_000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    // Gelato returns { orders: [...] }
    const orders: GelatoOrder[] = data.orders ?? [];
    if (orders.length === 0) return null;
    // Prefer non-failed orders, then pick most recent
    const alive = orders.filter(o => !["failed", "canceled"].includes(o.status ?? ""));
    return (alive.length > 0 ? alive : orders).sort((a, b) =>
      new Date(b.created ?? 0).getTime() - new Date(a.created ?? 0).getTime()
    )[0];
  } catch {
    return null;
  }
}

interface GelatoOrder {
  id?: string;
  status?: string;
  created?: string;
  shipments?: GelatoShipment[];
}
interface GelatoShipment {
  trackingCode?: string;
  trackingUrl?: string;
  shipmentMethodUid?: string;
  fulfillmentCountry?: string;
}

/**
 * Batch-fetch Gelato statuses for multiple Stripe session IDs.
 * Returns a Map<sessionId, { status, trackingCode?, trackingUrl? }>
 */
export async function batchGelatoStatuses(sessionIds: string[]) {
  const result = new Map<string, {
    status: string;
    gelatoOrderId?: string;
    trackingCode?: string;
    trackingUrl?: string;
  }>();

  // Fetch in parallel (max 5 concurrent)
  const chunks: string[][] = [];
  for (let i = 0; i < sessionIds.length; i += 5) {
    chunks.push(sessionIds.slice(i, i + 5));
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (sid) => {
      try {
        const order = await findGelatoOrderByRef(sid);
        if (!order) return;
        const shipment = order.shipments?.[0];
        result.set(sid, {
          status: order.status ?? "created",
          gelatoOrderId: order.id,
          trackingCode: shipment?.trackingCode,
          trackingUrl: shipment?.trackingUrl,
        });
      } catch {
        // silently skip — order just won't show status
      }
    });
    await Promise.all(promises);
  }

  return result;
}

/**
 * Map Gelato order status to a human-readable label in French.
 * Gelato statuses: created | passed | failed | canceled |
 *                  in_production | shipped | delivered | pending_approval | draft
 */
export function gelatoStatusLabel(status: string): string {
  const map: Record<string, string> = {
    created: "Commande reçue",
    passed: "Acceptée",
    pending_approval: "En attente",
    draft: "Brouillon",
    in_production: "En production",
    shipped: "Expédiée",
    delivered: "Livrée",
    failed: "Échec",
    canceled: "Annulée",
  };
  return map[status] ?? status;
}
