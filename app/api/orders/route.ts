import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { currentVerifiedEmail } from "@/app/lib/auth";
import { listPaidSessionsByEmail } from "@/app/lib/orders";
import Stripe from "stripe";
import { batchGelatoStatuses, gelatoStatusLabel } from "@/app/lib/gelato";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim(), {
  httpClient: Stripe.createNodeHttpClient(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const email = await currentVerifiedEmail();
  if (!email) return NextResponse.json({ orders: [] });

  try {
    const paidSessions = await listPaidSessionsByEmail(stripe, email);

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
