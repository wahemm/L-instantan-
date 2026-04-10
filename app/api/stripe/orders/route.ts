import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import Stripe from "stripe";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email) {
    return NextResponse.json({ orders: [] });
  }

  const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!stripeKey) {
    return NextResponse.json({ orders: [] });
  }

  const stripe = new Stripe(stripeKey, {
    timeout: 15000,
    maxNetworkRetries: 1,
    httpClient: Stripe.createNodeHttpClient(),
  });

  // Find Stripe customers matching this email
  const customers = await stripe.customers.list({ email, limit: 10 });

  if (customers.data.length === 0) {
    return NextResponse.json({ orders: [] });
  }

  // Fetch paid checkout sessions for each customer
  const allSessions: Stripe.Checkout.Session[] = [];
  for (const customer of customers.data) {
    const sessions = await stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 50,
    });
    allSessions.push(
      ...sessions.data.filter((s) => s.payment_status === "paid")
    );
  }

  // Sort by date (newest first)
  allSessions.sort((a, b) => b.created - a.created);

  const orders = allSessions.map((session) => ({
    id: session.id,
    albumTitle: session.metadata?.albumTitle ?? "Mon Album",
    pageCount: Number(session.metadata?.pageCount ?? 24),
    amount: session.amount_total ?? 0,
    currency: session.currency ?? "eur",
    createdAt: session.created,
    shippingName:
      session.shipping_details?.name ??
      session.customer_details?.name ??
      "",
    shippingCity: session.shipping_details?.address?.city ?? "",
    shippingCountry:
      session.shipping_details?.address?.country ??
      session.metadata?.shippingCountry ??
      "FR",
  }));

  return NextResponse.json({ orders });
}
