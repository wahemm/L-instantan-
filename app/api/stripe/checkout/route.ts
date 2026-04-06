import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const INCLUDED_PAGES = 24;
const BASE_PRICE_CENTS = 2900;      // 29 €
const EXTRA_PER_PAGE_CENTS = 50;    // 0,50 € par page supplémentaire

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

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const totalCents = calculatePrice(pageCount);
    const pageDesc = pageCount > INCLUDED_PAGES ? ` (${pageCount} pages)` : "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU", "MC"],
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: totalCents,
            product_data: {
              name: `Album imprimé — L'Instantané${pageDesc}`,
              description: `"${albumTitle}" · Hardcover 8.5×11" · Papier glacé premium · Livraison incluse`,
            },
          },
        },
      ],
      metadata: {
        pack: "physique",
        pageCount: String(pageCount),
        albumTitle,
        interiorUrl,
        coverUrl,
      },
      success_url: `${origin}/result?success=true`,
      cancel_url: `${origin}/result`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
