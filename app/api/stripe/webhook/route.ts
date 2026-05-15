import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { createPrintJob } from "@/app/lib/lulu";
import { buildConfirmationEmail, buildAdminLuluFailureEmail } from "@/app/lib/emails";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim(), {
  httpClient: Stripe.createNodeHttpClient(),
});

const FROM = "L'Instantané <contact@linstantane.fr>";
const ADMIN_EMAIL = "linstantane.officiel@gmail.com";

function getResend() {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key || key.includes("placeholder")) return null;
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const email = session.customer_details?.email;
    const name = session.customer_details?.name ?? "";
    const albumTitle = session.metadata?.albumTitle ?? "votre album";
    const pageCount = session.metadata?.pageCount ?? "24";
    const amountPaid = session.amount_total ? `${(session.amount_total / 100).toFixed(2)} €` : "";
    const interiorUrl = session.metadata?.interiorUrl;
    const coverUrl = session.metadata?.coverUrl;

    // ── Send confirmation email ──
    const resend = getResend();
    if (email && resend) {
      try {
        const { subject, html } = buildConfirmationEmail({ name, albumTitle, pageCount, amountPaid });
        await resend.emails.send({ from: FROM, to: email, subject, html });
        console.log(`Confirmation email sent to ${email}`);
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    }

    // ── Create Lulu print job ──
    if (interiorUrl && coverUrl) {
      // Stripe Dahlia API (2026-03-25+) moved shipping_details into
      // collected_information.shipping_details. Fall back to legacy top-level
      // for older sessions, and customer_details as a secondary fallback.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sAny = session as any;
      const shipping = (sAny.collected_information?.shipping_details
        ?? sAny.customer_details?.shipping_details
        ?? sAny.shipping_details) as { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; country?: string; postal_code?: string } } | undefined;
      const address = shipping?.address;

      if (address) {
        try {
          const printJob = await createPrintJob({
            externalId: session.id,
            title: albumTitle,
            interiorUrl,
            coverUrl,
            shippingAddress: {
              name: shipping?.name || name || "Client",
              street1: address.line1 || "",
              street2: address.line2 || "",
              city: address.city || "",
              stateCode: address.state || "",
              countryCode: address.country || "FR",
              postcode: address.postal_code || "",
              phoneNumber: session.customer_details?.phone || "+33600000000",
              email: email || "",
            },
            contactEmail: ADMIN_EMAIL,
          });

          console.log(`Lulu print job created: ${printJob.id} for session ${session.id}`);
        } catch (luluErr) {
          console.error("Failed to create Lulu print job:", luluErr);
          // Alert admin via email
          try {
            const alertResend = getResend();
            if (alertResend) {
              const { subject, html } = buildAdminLuluFailureEmail({
                errorMessage: luluErr instanceof Error ? luluErr.message : String(luluErr),
                sessionId: session.id,
                albumTitle,
                customerEmail: email ?? "",
                interiorUrl,
                coverUrl,
              });
              await alertResend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject, html });
              console.log(`Admin alert sent for failed Lulu job (session ${session.id})`);
            }
          } catch (alertErr) {
            console.error("Failed to send admin alert email:", alertErr);
          }
        }
      } else {
        console.error("No shipping address found in Stripe session");
      }
    } else {
      console.error("⚠️ PAID SESSION WITHOUT PDFs — Lulu order NOT created, manual rescue required:", session.id);
      // Critical alert: payment was taken but PDFs are missing. Without the URLs,
      // the print job can never be created automatically. Notify admin immediately.
      try {
        const alertResend = getResend();
        if (alertResend) {
          await alertResend.emails.send({
            from: FROM,
            to: ADMIN_EMAIL,
            subject: `[URGENT] Paiement reçu sans PDFs — Rescue requis pour ${session.id}`,
            html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0f172a;">
<h2>Paiement reçu sans PDFs — Rescue requis</h2>
<p>Le client a payé mais les URLs PDF (interiorUrl/coverUrl) sont absentes du metadata.
La création du job Lulu a été <strong>skippée</strong>. Il faut traiter cette commande manuellement.</p>
<hr />
<table cellpadding="6">
  <tr><td><strong>Session Stripe</strong></td><td>${session.id}</td></tr>
  <tr><td><strong>Email client</strong></td><td>${email ?? "N/A"}</td></tr>
  <tr><td><strong>Nom</strong></td><td>${name || "N/A"}</td></tr>
  <tr><td><strong>Album</strong></td><td>${albumTitle}</td></tr>
  <tr><td><strong>Montant</strong></td><td>${amountPaid}</td></tr>
</table>
<p style="margin-top:20px;"><a href="https://linstantane.fr/admin/rescue" style="display:inline-block;background:#0f172a;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;">Lancer le rescue →</a></p>
<p>Sur la page de rescue, colle l'ID de session ci-dessus et l'outil regénèrera les PDFs depuis l'IndexedDB du client (à exécuter depuis le navigateur du client) ou depuis ton propre navigateur si tu as accès aux mêmes sources.</p>
</body></html>`,
          });
          console.log(`[Webhook] Admin rescue alert sent for ${session.id}`);
        }
      } catch (alertErr) {
        console.error("[Webhook] Failed to send rescue alert email:", alertErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
