import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
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
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key || key.includes("placeholder")) return null;
  return new Resend(key);
}

async function fetchStripeSession(externalId: string) {
  const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  const stripe = new Stripe(stripeKey, { httpClient: Stripe.createNodeHttpClient() });
  return stripe.checkout.sessions.retrieve(externalId);
}

/**
 * POST /api/gelato/webhook
 * Receives status updates from Gelato when an order changes state.
 *
 * Gelato statuses: created → passed → in_production → shipped → delivered
 * Failures: failed | canceled
 *
 * Gelato signs webhooks with HMAC-SHA256.
 * Configure GELATO_WEBHOOK_SECRET in Vercel env vars.
 * Set the webhook URL in Gelato dashboard to:
 *   https://linstantane.fr/api/gelato/webhook
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // ── Signature verification ──────────────────────────────────────────────
  const webhookSecret = (process.env.GELATO_WEBHOOK_SECRET ?? "").trim();
  if (webhookSecret) {
    const signature = req.headers.get("x-gelato-signature") ?? "";
    const expected = createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");
    if (signature !== expected) {
      console.warn("[Gelato Webhook] Invalid signature — request rejected");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn("[Gelato Webhook] GELATO_WEBHOOK_SECRET not set — skipping signature check");
  }

  try {
    const event = JSON.parse(rawBody);
    const order = event.payload ?? event.order ?? event;
    if (!order) {
      return NextResponse.json({ error: "No payload" }, { status: 400 });
    }

    const status = (order.status ?? "").toLowerCase();
    const externalId = order.orderReferenceId ?? order.external_id;
    const orderId = order.id;

    console.log(`[Gelato Webhook] Order ${orderId} (ref: ${externalId}) → ${status}`);

    // ── SHIPPED ────────────────────────────────────────────────────────────
    if (status === "shipped") {
      const shipment = order.shipments?.[0];
      const trackingCode = shipment?.trackingCode ?? shipment?.tracking_code;
      const trackingUrl = shipment?.trackingUrl ?? shipment?.tracking_url;

      console.log(`[Gelato] Order ${externalId} shipped! Tracking: ${trackingCode}`);

      if (externalId) {
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
              carrier: shipment?.shipmentMethodUid ?? undefined,
              trackingId: trackingCode ?? undefined,
              trackingUrl: trackingUrl ?? undefined,
            });
            await resend.emails.send({ from: FROM, to: customerEmail, subject, html });
            console.log(`[Gelato] Shipping email sent to ${customerEmail}`);
          }
        } catch (err) {
          console.error("[Gelato] Failed to send shipping email:", err);
        }
      }
    }

    // ── DELIVERED ─────────────────────────────────────────────────────────
    if (status === "delivered") {
      console.log(`[Gelato] Order ${externalId} delivered!`);

      if (externalId) {
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
            console.log(`[Gelato] Delivered email sent to ${customerEmail}`);
          }
        } catch (err) {
          console.error("[Gelato] Failed to send delivered email:", err);
        }
      }
    }

    // ── FAILED / CANCELED ─────────────────────────────────────────────────
    if (status === "failed" || status === "canceled") {
      console.error(`[Gelato] Order ${externalId} → ${status}`);

      try {
        const resend = getResend();
        if (resend) {
          const statusMessage = order.comment ?? order.statusMessage ?? "Aucun détail fourni";
          const { subject, html } = buildAdminLuluStatusEmail({
            status: status.toUpperCase(),
            statusMessage,
            printJobId: String(orderId),
            externalId: externalId ?? "",
            topic: event.event ?? "order_status_updated",
          });
          await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject, html });
          console.log(`[Gelato] Admin alert sent for order ${orderId} (${status})`);
        }
      } catch (alertErr) {
        console.error("[Gelato] Failed to send admin alert:", alertErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Gelato Webhook] Processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
