import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";
import {
  buildShippingEmail,
  buildDeliveredEmail,
  buildAdminLuluStatusEmail,
} from "@/app/lib/emails";
import { getGelatoOrder, type GelatoOrderDetails } from "@/app/lib/gelato";

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

// Étapes qui déclenchent une action (email client ou alerte admin)
const SHIPPED_OR_LATER = ["shipped", "in_transit", "delivered"];
const ALERT_STATUSES = ["failed", "canceled", "on_hold", "pending_approval", "returned"];

/** Suivi colis lu dans la commande vérifiée (colis, sinon envois par article). */
function trackingOf(order: GelatoOrderDetails) {
  const pkg = order.shipment?.packages?.find((p) => p.trackingCode || p.trackingUrl);
  const ful = order.items
    ?.flatMap((it) => it.fulfillments ?? [])
    .find((f) => f.trackingCode || f.trackingUrl);
  return {
    trackingCode: pkg?.trackingCode ?? ful?.trackingCode,
    trackingUrl: pkg?.trackingUrl ?? ful?.trackingUrl,
    carrier: order.shipment?.shipmentMethodName ?? ful?.shipmentMethodName,
  };
}

/**
 * POST /api/gelato/webhook
 * Receives status updates from Gelato when an order changes state.
 *
 * Statuts : created → passed → in_production → printed → shipped →
 * in_transit → delivered. Alertes admin : failed | canceled | on_hold |
 * pending_approval | returned.
 *
 * Gelato ne signe pas ses webhooks (doc v4) : n'importe qui peut appeler
 * cette URL. Avant toute action, on relit donc la commande chez Gelato avec
 * notre clé API : elle doit exister dans NOTRE compte, avec la même
 * référence, et le suivi colis envoyé au client vient de cette réponse,
 * jamais du message reçu.
 * Dans le tableau de bord Gelato, webhook « Order Status Updated » vers :
 *   https://linstantane.fr/api/gelato/webhook
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

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
    const claimedRef = order.orderReferenceId ?? order.external_id;
    const orderId = String(order.orderId ?? order.id ?? "");

    console.log(`[Gelato Webhook] Order ${orderId} (ref: ${claimedRef}) → ${status}`);

    // Étapes intermédiaires (created, passed, in_production…) : rien à faire
    if (status !== "shipped" && status !== "delivered" && !ALERT_STATUSES.includes(status)) {
      return NextResponse.json({ received: true });
    }

    // ── Vérification auprès de Gelato ─────────────────────────────────────
    if (!/^[A-Za-z0-9-]{8,64}$/.test(orderId)) {
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
    }
    let verified: GelatoOrderDetails | null;
    try {
      verified = await getGelatoOrder(orderId);
    } catch (err) {
      // API injoignable : 503 → Gelato renvoie l'événement (3 essais, 5 s)
      console.error("[Gelato Webhook] Vérification impossible :", err);
      return NextResponse.json({ error: "Verification unavailable" }, { status: 503 });
    }
    if (!verified?.orderReferenceId || (claimedRef && claimedRef !== verified.orderReferenceId)) {
      console.warn(`[Gelato Webhook] Commande ${orderId} absente de notre compte ou référence différente — ignoré`);
      return NextResponse.json({ received: true });
    }
    const externalId = verified.orderReferenceId;
    const apiStatus = String(verified.fulfillmentStatus ?? "").toLowerCase();

    // ── SHIPPED ────────────────────────────────────────────────────────────
    if (status === "shipped") {
      // Pas encore visible côté API (ou faux message) : Gelato réessaiera
      if (!SHIPPED_OR_LATER.includes(apiStatus)) {
        console.warn(`[Gelato Webhook] ${orderId} annoncé expédié, statut API : ${apiStatus}`);
        return NextResponse.json({ error: "Status not confirmed" }, { status: 503 });
      }
      const { trackingCode, trackingUrl, carrier } = trackingOf(verified);

      console.log(`[Gelato] Order ${externalId} shipped! Tracking: ${trackingCode}`);

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
            trackingId: trackingCode,
            trackingUrl,
          });
          await resend.emails.send({ from: FROM, to: customerEmail, subject, html });
          console.log(`[Gelato] Shipping email sent to ${customerEmail}`);
        }
      } catch (err) {
        console.error("[Gelato] Failed to send shipping email:", err);
      }
    }

    // ── DELIVERED ─────────────────────────────────────────────────────────
    if (status === "delivered") {
      if (apiStatus !== "delivered") {
        console.warn(`[Gelato Webhook] ${orderId} annoncé livré, statut API : ${apiStatus}`);
        return NextResponse.json({ error: "Status not confirmed" }, { status: 503 });
      }
      console.log(`[Gelato] Order ${externalId} delivered!`);

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

    // ── ÉCHEC / ACTION REQUISE ────────────────────────────────────────────
    // failed/canceled : rien ne partira. on_hold / pending_approval : Gelato
    // attend une action dans son tableau de bord (sinon la commande reste
    // bloquée). returned : le colis est revenu à l'expéditeur.
    if (ALERT_STATUSES.includes(status)) {
      console.error(`[Gelato] Order ${externalId} → ${status}`);

      try {
        const resend = getResend();
        if (resend) {
          const statusMessage = order.comment ?? order.statusMessage ?? "Aucun détail fourni";
          const { subject, html } = buildAdminLuluStatusEmail({
            status: status.toUpperCase(),
            statusMessage,
            printJobId: String(orderId),
            externalId,
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
