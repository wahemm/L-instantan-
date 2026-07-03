import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { batchGelatoStatuses, gelatoStatusLabel } from "@/app/lib/gelato";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim(), {
  httpClient: Stripe.createNodeHttpClient(),
});

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
    });

    const paidSessions = sessions.data.filter(s => s.payment_status === "paid");

    // Fetch Gelato statuses in parallel
    let gelatoStatuses = new Map<string, { status: string; gelatoOrderId?: string; trackingCode?: string; trackingUrl?: string }>();
    try {
      gelatoStatuses = await batchGelatoStatuses(paidSessions.map(s => s.id));
    } catch {
      // Gelato API down — still return orders without status
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = paidSessions.map((s: any) => {
      // Stripe Dahlia API (2026-03-25+) moved shipping_details
      const shipping = s.collected_information?.shipping_details
        ?? s.customer_details?.shipping_details
        ?? s.shipping_details;
      const gelato = gelatoStatuses.get(s.id);

      return {
        id: s.id,
        date: new Date(s.created * 1000).toISOString(),
        amount: s.amount_total ? s.amount_total / 100 : 0,
        albumTitle: s.metadata?.albumTitle ?? "Mon Album",
        pageCount: s.metadata?.pageCount ?? "32",
        status: gelato?.status ?? "created",
        statusLabel: gelatoStatusLabel(gelato?.status ?? "created"),
        trackingUrl: gelato?.trackingUrl,
        shippingCity: shipping?.address?.city ?? "",
      };
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ orders: [] });
  }
}
