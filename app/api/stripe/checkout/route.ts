import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { calculateCost } from "@/app/lib/lulu";

const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
const stripe = new Stripe(stripeKey, {
  timeout: 20000,
  maxNetworkRetries: 0,
  httpClient: Stripe.createNodeHttpClient(),
});

const BASE_PRICE_CENTS = 2900; // 29 €
const EXTRA_PER_PAGE_CENTS = 50; // 0.50 € per extra page
const INCLUDED_PAGES = 24;

function calculatePrice(pageCount: number): number {
  const extraPages = Math.max(0, pageCount - INCLUDED_PAGES);
  return BASE_PRICE_CENTS + extraPages * EXTRA_PER_PAGE_CENTS;
}

/** Recompute shipping server-side instead of trusting the client. Falls back
 *  to a sane default (5.90€) if Lulu API is unreachable so checkout never
 *  blocks on a transient outage. */
async function calculateShippingCents(pageCount: number, countryCode: string): Promise<number> {
  try {
    // Lulu requires even page count
    const luluPageCount = pageCount % 2 === 0 ? pageCount : pageCount + 1;
    const result = await calculateCost(Math.max(24, luluPageCount), countryCode);
    const shipping = parseFloat(result.shipping_cost?.total_cost_incl_tax ?? "0");
    if (shipping > 0 && shipping < 100) return Math.round(shipping * 100);
  } catch (err) {
    console.error("[Checkout] Shipping recalc failed, using fallback:", err);
  }
  return 590; // 5.90 € fallback
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPageCount = typeof body.pageCount === "number" ? body.pageCount : INCLUDED_PAGES;
    const pageCount = Math.min(Math.max(Math.round(rawPageCount), 2), 400); // Lulu supports 2-400 pages
    const albumTitle = (body.albumTitle as string)?.slice(0, 200) || "Mon Album";
    const interiorUrl = (body.interiorUrl as string) || "";
    const coverUrl = (body.coverUrl as string) || "";
    const shippingCountry = (body.shippingCountry as string)?.slice(0, 2).toUpperCase() || "FR";

    // Recompute shipping cost server-side. Never trust the client value: a
    // tampered request could send shippingCents=0 for an expensive country.
    const shippingCents = await calculateShippingCents(pageCount, shippingCountry);

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
            description: `Album "${albumTitle}" · Hardcover 21×28 cm · Papier glacé premium 170 g/m²`,
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
