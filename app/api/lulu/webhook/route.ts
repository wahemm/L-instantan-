import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.includes("placeholder")) return null;
  return new Resend(key);
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/**
 * POST /api/lulu/webhook
 * Receives status updates from Lulu when a print job changes state.
 * Statuses: CREATED → UNPAID → PAYMENT_IN_PROGRESS → PRODUCTION_READY
 *           → IN_PRODUCTION → SHIPPED → DELIVERED
 *
 * The external_id of a Lulu print job is the Stripe checkout session ID,
 * which lets us look up the customer email.
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
    const externalId = printJob.external_id; // = Stripe session ID
    const printJobId = printJob.id;

    console.log(`[Lulu Webhook] Job ${printJobId} (order: ${externalId}) → ${status}`);

    // ── SHIPPED: envoyer email de suivi au client ──────────────────────────
    if (status === "SHIPPED") {
      const lineItems = printJob.line_items || [];
      const trackingId = lineItems[0]?.tracking_id;
      const trackingUrls: string[] = lineItems[0]?.tracking_urls || [];
      const carrier = lineItems[0]?.carrier_name || "le transporteur";

      console.log(`[Lulu] Order ${externalId} shipped! Carrier: ${carrier}, Tracking: ${trackingId}`);

      // Récupérer l'email client via Stripe
      try {
        const stripe = getStripe();
        const resend = getResend();

        if (stripe && resend && externalId) {
          const session = await stripe.checkout.sessions.retrieve(externalId);
          const email = session.customer_details?.email;
          const name = session.customer_details?.name ?? "cher client";
          const albumTitle = session.metadata?.albumTitle ?? "votre album";
          const firstName = name.split(" ")[0];

          if (email) {
            const trackingUrl = trackingUrls[0] || null;

            await resend.emails.send({
              from: "L'Instantané <contact@linstantane.fr>",
              to: email,
              subject: `Votre album "${albumTitle}" est en route ! 📦`,
              html: buildShippingEmail(firstName, albumTitle, carrier, trackingId, trackingUrl),
            });
            console.log(`[Lulu] Shipping email sent to ${email}`);
          }
        }
      } catch (emailErr) {
        console.error("[Lulu] Failed to send shipping email:", emailErr);
      }
    }

    // ── REJECTED / ERROR / CANCELED : alerter l'admin ─────────────────────
    if (status === "REJECTED" || status === "ERROR" || status === "CANCELED") {
      console.error(`[Lulu] Order ${externalId} failed with status: ${status}`);

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

function buildShippingEmail(
  firstName: string,
  albumTitle: string,
  carrier: string,
  trackingId: string | undefined,
  trackingUrl: string | null,
): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.08em;color:#0f172a;font-family:Georgia,serif;">L'INSTANTANÉ</p>
              <p style="margin:4px 0 0;font-size:12px;letter-spacing:0.15em;color:#94a3b8;font-family:Arial,sans-serif;text-transform:uppercase;">Vos souvenirs, sublimés</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 2px 20px rgba(0,0,0,0.06);">
              <p style="margin:0 0 8px;font-size:26px;color:#0f172a;font-family:Georgia,serif;">Votre album est en route ${firstName} 📦</p>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;font-family:Arial,sans-serif;line-height:1.6;">
                Bonne nouvelle ! Votre album <strong>"${albumTitle}"</strong> vient d'être expédié par <strong>${carrier}</strong>. Il devrait arriver dans les prochains jours.
              </p>
              ${trackingId ? `
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;" />
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;font-family:Arial,sans-serif;">Suivi de colis</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;border-radius:12px;padding:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:12px;color:#64748b;font-family:Arial,sans-serif;">Numéro de suivi</p>
                    <p style="margin:0;font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,sans-serif;letter-spacing:0.05em;">${trackingId}</p>
                  </td>
                </tr>
              </table>
              ${trackingUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                <tr>
                  <td align="center">
                    <a href="${trackingUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.04em;padding:14px 32px;border-radius:100px;font-family:Arial,sans-serif;">
                      Suivre mon colis →
                    </a>
                  </td>
                </tr>
              </table>` : ""}
              ` : ""}
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />
              <p style="margin:0;font-size:13px;color:#64748b;font-family:Arial,sans-serif;line-height:1.6;">
                Une question ? Répondez directement à cet email ou écrivez-nous à <a href="mailto:contact@linstantane.fr" style="color:#0f172a;">contact@linstantane.fr</a>
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-family:Arial,sans-serif;">L'Instantané · Paris, France</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
