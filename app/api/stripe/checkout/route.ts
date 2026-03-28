import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PRICES: Record<string, number> = {
  digital: 1000,
  physique: 3500,
  duo: 4000,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pack = body.pack as string;

    if (!pack || !(pack in PRICES)) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: PRICES[pack],
            product_data: {
              name:
                pack === "digital"
                  ? "Pack Digital — L'Instantané"
                  : pack === "physique"
                  ? "Pack Physique — L'Instantané"
                  : "Pack Duo — L'Instantané",
            },
          },
        },
      ],
      success_url: `${origin}/result?success=true`,
      cancel_url: `${origin}/result`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
