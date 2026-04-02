import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY ?? "");
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

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
    const name = session.customer_details?.name ?? "cher client";
    const albumTitle = session.metadata?.albumTitle ?? "votre album";
    const pack = session.metadata?.pack ?? "digital";
    const pageCount = session.metadata?.pageCount ?? "24";
    const amountPaid = session.amount_total ? `${(session.amount_total / 100).toFixed(2)} €` : "";

    const packLabel =
      pack === "digital" ? "Pack Digital" :
      pack === "physique" ? "Pack Physique" : "Pack Duo";

    const packDetails =
      pack === "digital"
        ? "Fichier PDF haute résolution · Téléchargement sécurisé"
        : pack === "physique"
        ? "Album imprimé A4 · Papier brillant 170 g/m² · Livraison sous 7–10 jours ouvrés"
        : "Album imprimé A4 + Fichier PDF haute résolution · Livraison sous 7–10 jours ouvrés";

    if (email) {
      try {
        await resend.emails.send({
          from: "L'Instantané <bonjour@linstantane.fr>",
          to: email,
          subject: `Votre album "${albumTitle}" est confirmé ✨`,
          html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation de commande — L'Instantané</title>
</head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.08em;color:#0f172a;font-family:Georgia,serif;">
                L'INSTANTANÉ
              </p>
              <p style="margin:4px 0 0;font-size:12px;letter-spacing:0.15em;color:#94a3b8;font-family:Arial,sans-serif;text-transform:uppercase;">
                Vos souvenirs, sublimés
              </p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 2px 20px rgba(0,0,0,0.06);">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:26px;color:#0f172a;font-family:Georgia,serif;">
                Merci ${name.split(" ")[0]} 🎉
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#475569;font-family:Arial,sans-serif;line-height:1.6;">
                Votre commande a bien été reçue. On s'occupe de tout pour que votre album soit parfait.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 28px;" />

              <!-- Order summary -->
              <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;font-family:Arial,sans-serif;">
                Récapitulatif de commande
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:14px;color:#64748b;font-family:Arial,sans-serif;">Album</span>
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:14px;font-weight:600;color:#0f172a;font-family:Arial,sans-serif;">"${albumTitle}"</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:14px;color:#64748b;font-family:Arial,sans-serif;">Formule</span>
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:14px;font-weight:600;color:#0f172a;font-family:Arial,sans-serif;">${packLabel}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:14px;color:#64748b;font-family:Arial,sans-serif;">Pages</span>
                  </td>
                  <td align="right" style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <span style="font-size:14px;font-weight:600;color:#0f172a;font-family:Arial,sans-serif;">${pageCount} pages</span>
                  </td>
                </tr>
                ${amountPaid ? `
                <tr>
                  <td style="padding:14px 0 0;">
                    <span style="font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,sans-serif;">Total</span>
                  </td>
                  <td align="right" style="padding:14px 0 0;">
                    <span style="font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,sans-serif;">${amountPaid}</span>
                  </td>
                </tr>` : ""}
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />

              <!-- Delivery info -->
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;font-family:Arial,sans-serif;">
                Livraison & format
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#475569;font-family:Arial,sans-serif;line-height:1.7;">
                ${packDetails}
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://linstantane.vercel.app/create"
                       style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.04em;padding:14px 32px;border-radius:100px;font-family:Arial,sans-serif;">
                      Créer un nouvel album →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-family:Arial,sans-serif;line-height:1.6;">
                Une question ? Répondez directement à cet email.<br />
                L'Instantané · Paris, France
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `,
        });

        console.log(`Confirmation email sent to ${email}`);
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
