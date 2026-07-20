import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getGelatoShippingQuote } from "@/app/lib/gelato";

const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
const stripe = new Stripe(stripeKey, {
  timeout: 20000,
  maxNetworkRetries: 0,
  httpClient: Stripe.createNodeHttpClient(),
});

const BASE_PRICE_CENTS = 2900; // 29 €
const EXTRA_PER_PAGE_CENTS = 50; // 0.50 € per extra page
// Gelato prints a minimum of 32 interior pages; the base price covers this
// count. MUST match INCLUDED_PAGES in pricing.ts and the "32 pages" site copy,
// otherwise the amount charged here diverges from the price shown on /result.
const INCLUDED_PAGES = 32;

function calculatePrice(pageCount: number): number {
  const extraPages = Math.max(0, pageCount - INCLUDED_PAGES);
  return BASE_PRICE_CENTS + extraPages * EXTRA_PER_PAGE_CENTS;
}

/** Recompute shipping server-side instead of trusting the client. Returns both
 *  the cents to charge and the Gelato shipment method to pin on the order, so
 *  the customer pays for exactly the method that will be shipped. Falls back to
 *  a sane default (8.60€, no pinned method) if the quote is unreachable so
 *  checkout never blocks on a transient outage. */
async function calculateShipping(
  pageCount: number,
  countryCode: string
): Promise<{ cents: number; methodUid: string | null }> {
  try {
    const quote = await getGelatoShippingQuote(pageCount, countryCode);
    if (quote && quote.price > 0 && quote.price < 100) {
      return { cents: Math.round(quote.price * 100), methodUid: quote.shipmentMethodUid };
    }
  } catch (err) {
    console.error("[Checkout] Shipping recalc failed, using fallback:", err);
  }
  return { cents: 860, methodUid: null }; // 8.60 € fallback (tracked standard)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPageCount = typeof body.pageCount === "number" ? body.pageCount : INCLUDED_PAGES;
    // Mirror Gelato's real limits (even count, floor 32, ceiling 200) so the
    // charge is based on the exact page count that gets printed — and therefore
    // equals the price shown to the customer on /result (same flooring there).
    const clampedPages = Math.min(Math.max(Math.round(rawPageCount), 2), 200);
    const pageCount = Math.max(
      INCLUDED_PAGES,
      clampedPages % 2 === 0 ? clampedPages : clampedPages + 1
    );
    const albumTitle = (body.albumTitle as string)?.slice(0, 200) || "Mon Album";
    const interiorUrl = (body.interiorUrl as string) || "";
    const coverUrl = (body.coverUrl as string) || "";
    const shippingCountry = (body.shippingCountry as string)?.slice(0, 2).toUpperCase() || "FR";

    // Recompute shipping cost server-side. Never trust the client value: a
    // tampered request could send shippingCents=0 for an expensive country.
    const { cents: shippingCents, methodUid: shipmentMethodUid } =
      await calculateShipping(pageCount, shippingCountry);

    // Validate PDF URLs (must be https Vercel Blob URLs)
    if (interiorUrl && !interiorUrl.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid interior URL" }, { status: 400 });
    }
    if (coverUrl && !coverUrl.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid cover URL" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const albumCents = calculatePrice(pageCount);
    const pageDesc = pageCount > INCLUDED_PAGES ? ` (${pageCount} pages)` : "";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: albumCents,
          product_data: {
            name: `Album Photo — L'Instantané${pageDesc}`,
            description: `Album "${albumTitle}" · Hardcover 21×28 cm · Papier satiné premium 170 g/m²`,
          },
        },
      },
    ];

    if (shippingCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: shippingCents,
          product_data: {
            name: "Frais de livraison",
            description: `Livraison standard vers ${shippingCountry}`,
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC"],
      },
      line_items: lineItems,
      metadata: {
        pack: "physique",
        pageCount: String(pageCount),
        albumTitle,
        interiorUrl,
        coverUrl,
        shippingCountry,
        shipmentMethodUid: shipmentMethodUid ?? "",
      },
      success_url: `${origin}/result?success=true`,
      cancel_url: `${origin}/result`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
