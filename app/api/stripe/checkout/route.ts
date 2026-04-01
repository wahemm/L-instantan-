import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const BASE_PRICES: Record<string, number> = {
  digital: 1000,
  physique: 2900,
  duo: 3500,
};

const EXTRA_PER_PAGE: Record<string, number> = {
  digital: 25,
  physique: 50,
  duo: 60,
};

const INCLUDED_PAGES = 24;

function calculatePrice(pack: string, pageCount: number): number {
  const base = BASE_PRICES[pack] ?? 0;
  const extra = EXTRA_PER_PAGE[pack] ?? 0;
  const extraPages = Math.max(0, pageCount - INCLUDED_PAGES);
  return base + extraPages * extra;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pack = body.pack as string;
    const pageCount = typeof body.pageCount === "number" ? body.pageCount : INCLUDED_PAGES;
    const albumTitle = (body.albumTitle as string) || "Mon Album";

    if (!pack || !(pack in BASE_PRICES)) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const totalCents = calculatePrice(pack, pageCount);

    const packLabel =
      pack === "digital" ? "Pack Digital" :
      pack === "physique" ? "Pack Physique" : "Pack Duo";

    const pageDesc = pageCount > INCLUDED_PAGES ? ` (${pageCount} pages)` : "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: totalCents,
            product_data: {
              name: `${packLabel} — L'Instantané${pageDesc}`,
              description: `Album "${albumTitle}" · Format A4 · Papier brillant 170g/m²`,
            },
          },
        },
      ],
      metadata: {
        pack,
        pageCount: String(pageCount),
        albumTitle,
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
