import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { currentUser } from "@clerk/nextjs/server";
import { createPrintJob } from "@/app/lib/lulu";

const ADMIN_EMAILS = new Set([
  "hbbhugo.thomas@gmail.com",
  "linstantane.officiel@gmail.com",
]);

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

  // Stripe Dahlia API (2026-03-25+) moved shipping_details into
  // collected_information.shipping_details. Fall back to legacy top-level
  // for older sessions, and customer_details as a secondary fallback.
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

  // ── Submit to Lulu ──
  try {
    const printJob = await createPrintJob({
      externalId: session.id,
      title: albumTitle,
      interiorUrl,
      coverUrl,
      shippingAddress: {
        name: shipping?.name || customerName,
        street1: address.line1 || "",
        street2: address.line2 || "",
        city: address.city || "",
        stateCode: address.state || "",
        countryCode: address.country || "FR",
        postcode: address.postal_code || "",
        phoneNumber: session.customer_details?.phone || "+33600000000",
        email: customerEmail,
      },
      contactEmail: "linstantane.officiel@gmail.com",
    });
    console.log(`[Rescue] Lulu print job created: ${printJob.id} for session ${session.id}`);
    return NextResponse.json({
      ok: true,
      printJobId: printJob.id,
      status: printJob.status?.name,
      albumTitle,
      customerEmail,
      shippingTo: `${address.city}, ${address.country}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Rescue] Lulu createPrintJob failed:`, msg);
    return NextResponse.json({ error: `Lulu submission failed: ${msg}` }, { status: 500 });
  }
}
