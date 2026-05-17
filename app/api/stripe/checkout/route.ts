import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPageCount = typeof body.pageCount === "number" ? body.pageCount : INCLUDED_PAGES;
    const pageCount = Math.min(Math.max(Math.round(rawPageCount), 2), 400); // Lulu supports 2-400 pages
    const albumTitle = (body.albumTitle as string)?.slice(0, 200) || "Mon Album";
    const interiorUrl = (body.interiorUrl as string) || "";
    const coverUrl = (body.coverUrl as string) || "";
    const shippingCents = typeof body.shippingCents === "number" ? Math.max(0, Math.round(body.shippingCents)) : 0;
    const shippingCountry = (body.shippingCountry as string)?.slice(0, 2).toUpperCase() || "FR";

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
