import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import {
  buildShippingEmail,
  buildDeliveredEmail,
  buildAdminLuluStatusEmail,
} from "@/app/lib/emails";

const FROM = "L'Instantané <contact@linstantane.fr>";
const ADMIN_EMAIL = "linstantane.officiel@gmail.com";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.includes("placeholder")) return null;
  return new Resend(key);
}

async function fetchStripeSession(externalId: string) {
  const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  const stripe = new Stripe(stripeKey, { httpClient: Stripe.createNodeHttpClient() });
  return stripe.checkout.sessions.retrieve(externalId);
}

/**
 * POST /api/lulu/webhook
 * Receives status updates from Lulu when a print job changes state.
 * Statuses: CREATED → UNPAID → PAYMENT_IN_PROGRESS → PRODUCTION_READY
 *           → IN_PRODUCTION → SHIPPED → DELIVERED
 * Or failure: REJECTED / ERROR / CANCELED
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const topic = body.topic;
    const printJob = body.data;

    if (!printJob) {
      return NextResponse.json({ error: "No data" }, { status: 400 });
    }

    const status = printJob.status?.name;
    const externalId = printJob.external_id;
    const printJobId = printJob.id;

    console.log(`[Lulu Webhook] Job ${printJobId} (order: ${externalId}) → ${status}`);

    // ─── SHIPPED ─────────────────────────────────────────────────────────────
    if (status === "SHIPPED") {
      const lineItems = printJob.line_items || [];
      const trackingId = lineItems[0]?.tracking_id;
      const trackingUrls: string[] = lineItems[0]?.tracking_urls || [];
      const carrier = lineItems[0]?.carrier_name;
      const trackingUrl = trackingUrls[0] || null;

      console.log(`[Lulu] Order ${externalId} shipped! Carrier: ${carrier}, Tracking: ${trackingId}`);

      try {
        const session = await fetchStripeSession(externalId);
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name ?? "";
        const albumTitle = session.metadata?.albumTitle ?? "votre album";

        const resend = getResend();
        if (customerEmail && resend) {
          const { subject, html } = buildShippingEmail({
            name: customerName,
            albumTitle,
            carrier,
            trackingId,
            trackingUrl,
          });
          await resend.emails.send({ from: FROM, to: customerEmail, subject, html });
          console.log(`[Lulu] Shipping email sent to ${customerEmail}`);
        }
      } catch (err) {
        console.error("[Lulu] Failed to send shipping email:", err);
      }
    }

    // ─── DELIVERED ───────────────────────────────────────────────────────────
    if (status === "DELIVERED") {
      console.log(`[Lulu] Order ${externalId} delivered!`);

      try {
        const session = await fetchStripeSession(externalId);
        const customerEmail = session.customer_details?.email;
        const customerName = session.customer_details?.name ?? "";
        const albumTitle = session.metadata?.albumTitle ?? "votre album";

        const resend = getResend();
        if (customerEmail && resend) {
          const { subject, html } = buildDeliveredEmail({
            name: customerName,
            albumTitle,
          });
          await resend.emails.send({ from: FROM, to: customerEmail, subject, html });
          console.log(`[Lulu] Delivered/review email sent to ${customerEmail}`);
        }
      } catch (err) {
        console.error("[Lulu] Failed to send delivered email:", err);
      }
    }

    // ─── REJECTED / ERROR / CANCELED ────────────────────────────────────────
    if (status === "REJECTED" || status === "ERROR" || status === "CANCELED") {
      console.error(`[Lulu] Order ${externalId} failed with status: ${status}`);

      try {
        const resend = getResend();
        if (resend) {
          const statusMessage = printJob.status?.message || "Aucun détail fourni";
          const { subject, html } = buildAdminLuluStatusEmail({
            status,
            statusMessage,
            printJobId: String(printJobId),
            externalId: externalId ?? "",
            topic: topic ?? "",
          });
          await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject, html });
          console.log(`Admin alert sent for Lulu job ${printJobId} (${status})`);
        }
      } catch (alertErr) {
        console.error("Failed to send admin alert email:", alertErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Lulu webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
