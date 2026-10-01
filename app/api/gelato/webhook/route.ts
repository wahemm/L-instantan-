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
 * Statuts : created → passed → in_production → printed → shipped →
 * in_transit → delivered. Alertes admin : failed | canceled | on_hold |
 * pending_approval | returned.
 *
 * ⚠️ D'après la doc Gelato (v4), les webhooks ne sont PAS signés : ne pas
 * définir GELATO_WEBHOOK_SECRET, sinon tous les événements seraient rejetés.
 * Dans le tableau de bord Gelato, webhook « Order Status Updated » vers :
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

    // Doc v4 : l'événement utile est « order_status_updated » (statut de la
    // commande dans fulfillmentStatus, suivi dans items[].fulfillments[]).
    // Les événements par article (item_status / tracking_code) doublonneraient
    // les emails d'une commande à 1 article → ignorés.
    const eventType = String(event.event ?? "");
    if (eventType && eventType !== "order_status_updated") {
      console.log(`[Gelato Webhook] ${eventType} ignoré (seul order_status_updated est traité)`);
      return NextResponse.json({ received: true });
    }

    const status = String(order.fulfillmentStatus ?? order.status ?? "").toLowerCase();
    const externalId = order.orderReferenceId ?? order.external_id;
    const orderId = order.orderId ?? order.id;

    console.log(`[Gelato Webhook] Order ${orderId} (ref: ${externalId}) → ${status}`);

    // ── SHIPPED ────────────────────────────────────────────────────────────
    if (status === "shipped") {
      // v4 : items[].fulfillments[] ; ancien format : shipments[]
      const fulfillments = Array.isArray(order.items)
        ? order.items.flatMap((it: { fulfillments?: unknown[] }) => it.fulfillments ?? [])
        : [];
      const shipment = (fulfillments[0] ?? order.shipments?.[0]) as
        | { trackingCode?: string; tracking_code?: string; trackingUrl?: string; tracking_url?: string; shipmentMethodName?: string; shipmentMethodUid?: string }
        | undefined;
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
              carrier: shipment?.shipmentMethodName ?? shipment?.shipmentMethodUid ?? undefined,
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

    // ── ÉCHEC / ACTION REQUISE ────────────────────────────────────────────
    // failed/canceled : rien ne partira. on_hold / pending_approval : Gelato
    // attend une action dans son tableau de bord (sinon la commande reste
    // bloquée). returned : le colis est revenu à l'expéditeur.
    if (["failed", "canceled", "on_hold", "pending_approval", "returned"].includes(status)) {
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
