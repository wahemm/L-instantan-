import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { createGelatoOrder, findGelatoOrderByRef } from "@/app/lib/gelato";
import { buildConfirmationEmail, buildAdminLuluFailureEmail } from "@/app/lib/emails";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim(), {
  httpClient: Stripe.createNodeHttpClient(),
});

const FROM = "L'Instantané <contact@linstantane.fr>";
const ADMIN_EMAIL = "linstantane.officiel@gmail.com";

/** Une commande d'impression « vivante » existe déjà pour cette session ? (une
 *  commande échouée/annulée ne doit pas bloquer une nouvelle tentative) */
async function alreadyPrinted(sessionId: string) {
  const existing = await findGelatoOrderByRef(sessionId);
  if (existing && !["failed", "canceled"].includes(existing.fulfillmentStatus ?? "")) return existing;
  return null;
}

function getResend() {
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key || key.includes("placeholder")) return null;
  return new Resend(key);
}

async function sendAdminEmail(subject: string, html: string): Promise<boolean> {
  try {
    const resend = getResend();
    if (!resend) return false;
    await resend.emails.send({ from: FROM, to: ADMIN_EMAIL, subject, html });
    return true;
  } catch (err) {
    console.error("[Webhook] Failed to send admin email:", err);
    return false;
  }
}

/**
 * Commande d'impression Gelato pour une session encaissée. L'appelant a déjà
 * vérifié qu'aucune commande n'existe pour cette session (anti-doublon).
 */
async function createPrintOrder(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const name = session.customer_details?.name ?? "";
  const albumTitle = session.metadata?.albumTitle ?? "votre album";
  const amountPaid = session.amount_total ? `${(session.amount_total / 100).toFixed(2)} €` : "";
  const interiorUrl = session.metadata?.interiorUrl;
  const coverUrl = session.metadata?.coverUrl;

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
      // Gelato needs separate firstName/lastName
      const fullName = (shipping?.name || name || "Client").trim();
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] ?? "Client";
      const lastName = nameParts.slice(1).join(" ") || firstName;

      const pageCount = parseInt(session.metadata?.pageCount ?? "32", 10);
      // Pin the exact shipping method the customer paid for at checkout, so
      // Gelato ships the method they were charged for. May be empty for older
      // sessions — Gelato then falls back to the cheapest available method.
      const shipmentMethodUid = session.metadata?.shipmentMethodUid || undefined;

      try {
        const order = await createGelatoOrder({
          externalId: session.id,
          title: albumTitle,
          pageCount,
          coverUrl,
          interiorUrl,
          shipmentMethodUid,
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
            email: email || "",
          },
        });

        console.log(`Gelato order created: ${order.id} for session ${session.id}`);
      } catch (gelatoErr) {
        console.error("Failed to create Gelato order:", gelatoErr);
        // Alert admin via email
        const { subject, html } = buildAdminLuluFailureEmail({
          errorMessage: gelatoErr instanceof Error ? gelatoErr.message : String(gelatoErr),
          sessionId: session.id,
          albumTitle,
          customerEmail: email ?? "",
          interiorUrl,
          coverUrl,
        });
        if (await sendAdminEmail(subject, html)) {
          console.log(`Admin alert sent for failed Gelato order (session ${session.id})`);
        }
      }
    } else {
      console.error("No shipping address found in Stripe session");
    }
  } else {
    console.error("⚠️ PAID SESSION WITHOUT PDFs — Gelato order NOT created, manual rescue required:", session.id);
    // Critical alert: payment was taken but PDFs are missing. Without the URLs,
    // the print job can never be created automatically. Notify admin immediately.
    const alerted = await sendAdminEmail(
      `[URGENT] Paiement reçu sans PDFs — Rescue requis pour ${session.id}`,
      `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0f172a;">
<h2>Paiement reçu sans PDFs — Rescue requis</h2>
<p>Le client a payé mais les URLs PDF (interiorUrl/coverUrl) sont absentes du metadata.
La création de la commande Gelato a été <strong>skippée</strong>. Il faut traiter cette commande manuellement.</p>
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
</body></html>`
    );
    if (alerted) console.log(`[Webhook] Admin rescue alert sent for ${session.id}`);
  }
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

    // Anti-doublon : Stripe rejoue un événement si on répond trop lentement.
    // Une commande Gelato existe déjà pour cette session → tout a été fait.
    const existing = await alreadyPrinted(session.id);
    if (existing) {
      console.log(`[Webhook] Session ${session.id} déjà traitée (Gelato ${existing.id}) — rejeu ignoré`);
      return NextResponse.json({ received: true });
    }

    const email = session.customer_details?.email;
    const name = session.customer_details?.name ?? "";
    const albumTitle = session.metadata?.albumTitle ?? "votre album";
    const pageCount = session.metadata?.pageCount ?? "32"; // Gelato floor, matches INCLUDED_PAGES
    const amountPaid = session.amount_total ? `${(session.amount_total / 100).toFixed(2)} €` : "";

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

    // ── Create Gelato print order (seulement si l'argent est encaissé) ──
    if (session.payment_status === "unpaid") {
      // Moyen de paiement différé (ex. prélèvement SEPA) : rien n'est encore
      // encaissé. L'impression part sur checkout.session.async_payment_succeeded.
      console.log(`[Webhook] Session ${session.id} : paiement en attente — impression différée`);
      await sendAdminEmail(
        `Paiement en attente — impression différée (${session.id})`,
        `<p>Le client a validé sa commande avec un moyen de paiement différé (ex. prélèvement). L'impression Gelato partira <strong>automatiquement à l'encaissement</strong> (événement <code>checkout.session.async_payment_succeeded</code>, à activer sur le webhook Stripe).</p><p>Session : ${session.id}<br/>Client : ${email ?? "N/A"}<br/>Album : ${albumTitle}<br/>Montant : ${amountPaid}</p>`
      );
    } else {
      await createPrintOrder(session);
    }
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const existing = await alreadyPrinted(session.id);
    if (existing) {
      console.log(`[Webhook] Session ${session.id} déjà imprimée (Gelato ${existing.id}) — rejeu ignoré`);
    } else {
      console.log(`[Webhook] Paiement différé encaissé pour ${session.id} — lancement de l'impression`);
      await createPrintOrder(session);
    }
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.error(`[Webhook] Paiement différé échoué pour ${session.id} — rien n'a été imprimé`);
    await sendAdminEmail(
      `Paiement échoué — commande non imprimée (${session.id})`,
      `<p>Le paiement différé de cette commande a échoué. <strong>Aucune impression n'a été lancée.</strong> Tu peux recontacter le client.</p><p>Session : ${session.id}<br/>Client : ${session.customer_details?.email ?? "N/A"}<br/>Album : ${session.metadata?.albumTitle ?? "N/A"}</p>`
    );
  }

  return NextResponse.json({ received: true });
}
