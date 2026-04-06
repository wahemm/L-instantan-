/**
 * Lulu Print API helper
 * Handles authentication and API calls to Lulu's print-on-demand service.
 */

const LULU_API_BASE = "https://api.lulu.com";
const LULU_AUTH_URL = `${LULU_API_BASE}/auth/realms/glasstree/protocol/openid-connect/token`;

// Hardcover casewrap, full color, premium, 80# coated white, glossy cover, 8.5x11"
export const LULU_POD_PACKAGE_ID = "0850X1100FCPRECW080CW444GXX";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getLuluToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.LULU_CLIENT_KEY!;
  const clientSecret = process.env.LULU_CLIENT_SECRET!;

  const res = await fetch(LULU_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Lulu auth failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.token;
}

async function luluFetch(path: string, options: RequestInit = {}) {
  const token = await getLuluToken();
  const res = await fetch(`${LULU_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  return res;
}

/** Get exact cover dimensions for a given page count */
export async function getCoverDimensions(pageCount: number) {
  const res = await luluFetch("/cover-dimensions/", {
    method: "POST",
    body: JSON.stringify({
      pod_package_id: LULU_POD_PACKAGE_ID,
      interior_page_count: pageCount,
    }),
  });
  if (!res.ok) throw new Error(`Cover dimensions failed: ${res.status}`);
  return res.json();
}

/** Calculate print + shipping cost */
export async function calculateCost(pageCount: number, countryCode = "FR", postcode = "75001") {
  const res = await luluFetch("/print-job-cost-calculations/", {
    method: "POST",
    body: JSON.stringify({
      line_items: [{
        pod_package_id: LULU_POD_PACKAGE_ID,
        page_count: pageCount,
        quantity: 1,
      }],
      shipping_address: {
        name: "Cost Estimate",
        street1: "1 Rue Test",
        city: "Paris",
        country_code: countryCode,
        postcode,
        phone_number: "+33600000000",
      },
      shipping_option: "MAIL",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cost calculation failed: ${res.status} ${text}`);
  }
  return res.json();
}

/** Create a print job (order) on Lulu */
export async function createPrintJob(params: {
  externalId: string;
  title: string;
  interiorUrl: string;
  coverUrl: string;
  shippingAddress: {
    name: string;
    street1: string;
    street2?: string;
    city: string;
    stateCode?: string;
    countryCode: string;
    postcode: string;
    phoneNumber: string;
    email: string;
  };
  contactEmail: string;
}) {
  const res = await luluFetch("/print-jobs/", {
    method: "POST",
    body: JSON.stringify({
      external_id: params.externalId,
      contact_email: params.contactEmail,
      production_delay: 120,
      line_items: [{
        external_id: `${params.externalId}-item`,
        pod_package_id: LULU_POD_PACKAGE_ID,
        quantity: 1,
        title: params.title,
        interior: { source_url: params.interiorUrl },
        cover: { source_url: params.coverUrl },
      }],
      shipping_level: "MAIL",
      shipping_address: {
        name: params.shippingAddress.name,
        street1: params.shippingAddress.street1,
        street2: params.shippingAddress.street2 || "",
        city: params.shippingAddress.city,
        state_code: params.shippingAddress.stateCode || "",
        country_code: params.shippingAddress.countryCode,
        postcode: params.shippingAddress.postcode,
        phone_number: params.shippingAddress.phoneNumber,
        email: params.shippingAddress.email,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create print job failed: ${res.status} ${text}`);
  }
  return res.json();
}

/** Get print job status */
export async function getPrintJob(printJobId: string) {
  const res = await luluFetch(`/print-jobs/${printJobId}/`);
  if (!res.ok) throw new Error(`Get print job failed: ${res.status}`);
  return res.json();
}
