import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { INCLUDED_PAGES, PACKS } from "@/app/lib/pricing";

const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
const stripe = new Stripe(stripeKey, {
  timeout: 20000,
  maxNetworkRetries: 0,
});

const PACK = PACKS.find(p => p.id === "physique")!;
const BASE_PRICE_CENTS = Math.round(PACK.basePrice * 100);
const EXTRA_PER_PAGE_CENTS = Math.round(PACK.extraPerPage * 100);

function calculatePrice(pageCount: number): number {
  const extraPages = Math.max(0, pageCount - INCLUDED_PAGES);
  return BASE_PRICE_CENTS + extraPages * EXTRA_PER_PAGE_CENTS;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pageCount = typeof body.pageCount === "number" ? body.pageCount : INCLUDED_PAGES;
    const albumTitle = (body.albumTitle as string) || "Mon Album";
    const interiorUrl = (body.interiorUrl as string) || "";
    const coverUrl = (body.coverUrl as string) || "";
    const shippingCents = typeof body.shippingCents === "number" ? body.shippingCents : 0;
    const shippingCountry = (body.shippingCountry as string) || "FR";

    // Utilise toujours une URL absolue de prod pour éviter les rejets Stripe live
    const origin = process.env.NEXT_PUBLIC_SITE_URL
      || req.headers.get("origin")
      || "https://linstantane.vercel.app";
    const albumCents = calculatePrice(pageCount);
    const pageDesc = pageCount > INCLUDED_PAGES ? ` (${pageCount} pages)` : "";
    console.log(`[Stripe] Creating session: ${albumCents/100}€ + shipping ${shippingCents/100}€, origin: ${origin}`);

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
    const message = err instanceof Error ? err.message : String(err);
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
