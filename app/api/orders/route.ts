import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email) return NextResponse.json({ orders: [] });

  try {
    // Find customer by email
    const customers = await stripe.customers.list({ email, limit: 5 });
    if (customers.data.length === 0) return NextResponse.json({ orders: [] });

    // Get all completed checkout sessions for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customers.data[0].id,
      limit: 20,
      expand: ["data.line_items"],
    });

    const orders = sessions.data
      .filter(s => s.payment_status === "paid")
      .map(s => ({
        id: s.id,
        date: new Date(s.created * 1000).toISOString(),
        amount: s.amount_total ? s.amount_total / 100 : 0,
        albumTitle: s.metadata?.albumTitle ?? "Mon Album",
        pageCount: s.metadata?.pageCount ?? "24",
        status: "En cours de production",
      }));

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ orders: [] });
  }
}
