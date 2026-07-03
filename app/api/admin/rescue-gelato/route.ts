import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { createGelatoOrder, GELATO_MIN_PAGES } from "@/app/lib/gelato";

// Admin allowlist
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? "hbbhugo.thomas@gmail.com,linstantane.officiel@gmail.com")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim(), {
  httpClient: Stripe.createNodeHttpClient(),
});

export async function POST(req: NextRequest) {
  // ── Admin auth ──
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  if (!email || !ADMIN_EMAILS.has(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ── Input ──
  const { sessionId, interiorUrl, coverUrl } = (await req.json()) as {
    sessionId?: string;
    interiorUrl?: string;
    coverUrl?: string;
  };
  if (!sessionId || !interiorUrl || !coverUrl) {
    return NextResponse.json(
      { error: "sessionId, interiorUrl, coverUrl required" },
      { status: 400 }
    );
  }

  // ── Fetch Stripe session ──
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    return NextResponse.json(
      { error: `Stripe session fetch failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 404 }
    );
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { error: `Session not paid (status: ${session.payment_status})` },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sAny = session as any;
  const shipping = (sAny.collected_information?.shipping_details
    ?? sAny.customer_details?.shipping_details
    ?? sAny.shipping_details) as
    | { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; country?: string; postal_code?: string } }
    | undefined;
  const address = shipping?.address;
  if (!address) {
    return NextResponse.json({ error: "No shipping address in session" }, { status: 400 });
  }

  const customerEmail = session.customer_details?.email ?? "";
  const customerName = session.customer_details?.name ?? shipping?.name ?? "Client";
  const albumTitle = session.metadata?.albumTitle ?? "Mon Album";
  const pageCount = Math.max(GELATO_MIN_PAGES, parseInt(session.metadata?.pageCount ?? "32", 10));

  // Split name into first/last for Gelato
  const nameParts = customerName.trim().split(" ");
  const firstName = nameParts[0] ?? "Client";
  const lastName = nameParts.slice(1).join(" ") || firstName;

  // ── Submit to Gelato ──
  try {
    const order = await createGelatoOrder({
      externalId: session.id,
      title: albumTitle,
      pageCount,
      coverUrl,
      interiorUrl,
      shippingAddress: {
        firstName,
        lastName,
        street1: address.line1 || "",
        street2: address.line2 || "",
        city: address.city || "",
        stateCode: address.state || "",
        countryCode: address.country || "FR",
        postcode: address.postal_code || "",
        phoneNumber: session.customer_details?.phone || "+33600000000",
        email: customerEmail,
      },
    });

    console.log(`[Rescue] Gelato order created: ${order.id} for session ${session.id}`);
    return NextResponse.json({
      ok: true,
      gelatoOrderId: order.id,
      status: order.status,
      albumTitle,
      customerEmail,
      shippingTo: `${address.city}, ${address.country}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Rescue] Gelato createOrder failed:`, msg);
    return NextResponse.json({ error: `Gelato submission failed: ${msg}` }, { status: 500 });
  }
}
