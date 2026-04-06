import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.includes("placeholder")) return null;
  return new Resend(key);
}

/**
 * POST /api/lulu/webhook
 * Receives status updates from Lulu when a print job changes state.
 * Statuses: CREATED → UNPAID → PAYMENT_IN_PROGRESS → PRODUCTION_READY
 *           → IN_PRODUCTION → SHIPPED → DELIVERED
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

    if (status === "SHIPPED") {
      const lineItems = printJob.line_items || [];
      const trackingId = lineItems[0]?.tracking_id;
      const trackingUrls = lineItems[0]?.tracking_urls;
      const carrier = lineItems[0]?.carrier_name;

      console.log(`[Lulu] Order ${externalId} shipped! Carrier: ${carrier}, Tracking: ${trackingId}`);
      console.log(`[Lulu] Tracking URLs:`, trackingUrls);

      // TODO: Send shipping notification email to customer via Resend
      // TODO: Update order status in database when we add one
    }

    if (status === "REJECTED" || status === "ERROR" || status === "CANCELED") {
      console.error(`[Lulu] Order ${externalId} failed with status: ${status}`);

      // Alert admin via email
      try {
        const resend = getResend();
        if (resend) {
          const statusMessage = printJob.status?.message || "Aucun détail fourni";
          await resend.emails.send({
            from: "L'Instantané <contact@linstantane.fr>",
            to: "contact@linstantane.fr",
            subject: `[URGENT] Impression Lulu ${status} — Job ${printJobId}`,
            html: `
<h2>Job d'impression Lulu en échec</h2>
<p><strong>Statut :</strong> ${status}</p>
<p><strong>Détail :</strong> ${statusMessage}</p>
<hr />
<table>
  <tr><td><strong>Print Job ID</strong></td><td>${printJobId}</td></tr>
  <tr><td><strong>Commande Stripe (external_id)</strong></td><td>${externalId ?? "N/A"}</td></tr>
  <tr><td><strong>Topic</strong></td><td>${topic}</td></tr>
</table>
<p>Merci de vérifier la commande et procéder au remboursement si nécessaire.</p>`,
          });
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
