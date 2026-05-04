/**
 * Centralized email templates for L'Instantané.
 * Single source of truth for branding, voice (tutoiement), and HTML layout.
 *
 * All templates wrap content in `wrap()` for consistent header/footer.
 */

const BRAND = "L'INSTANTANÉ";
const TAGLINE = "Tes souvenirs, sublimés";
const CONTACT = "linstantane.officiel@gmail.com";

function firstName(full: string | null | undefined): string {
  if (!full) return "";
  const trimmed = full.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0];
}

function escape(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Wraps inner HTML in the standard L'Instantané email shell (header + card + footer). */
function wrap(innerHtml: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Georgia,serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f8f7f4;">${escape(preheader)}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:0.08em;color:#0f172a;font-family:Georgia,serif;">${BRAND}</p>
              <p style="margin:4px 0 0;font-size:12px;letter-spacing:0.15em;color:#94a3b8;font-family:Arial,sans-serif;text-transform:uppercase;">${TAGLINE}</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:20px;padding:40px 36px;box-shadow:0 2px 20px rgba(0,0,0,0.06);">
              ${innerHtml}
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-family:Arial,sans-serif;line-height:1.6;">
                Une question ? Réponds directement à cet email.<br />
                L'Instantané · Paris, France
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Primary CTA button — black pill, white text. */
function ctaButton(label: string, href: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding-top:8px;">
      <a href="${escape(href)}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.04em;padding:14px 32px;border-radius:100px;font-family:Arial,sans-serif;">
        ${escape(label)}
      </a>
    </td></tr>
  </table>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0;" />`;
}

function sectionLabel(text: string): string {
  return `<p style="margin:0 0 16px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;font-family:Arial,sans-serif;">${escape(text)}</p>`;
}

function row(label: string, value: string, last = false): string {
  const border = last ? "" : "border-bottom:1px solid #f1f5f9;";
  return `<tr>
    <td style="padding:10px 0;${border}"><span style="font-size:14px;color:#64748b;font-family:Arial,sans-serif;">${escape(label)}</span></td>
    <td align="right" style="padding:10px 0;${border}"><span style="font-size:14px;font-weight:600;color:#0f172a;font-family:Arial,sans-serif;">${value}</span></td>
  </tr>`;
}

// ─── 1. CONFIRMATION DE COMMANDE ─────────────────────────────────────────────
export function buildConfirmationEmail(args: {
  name: string;
  albumTitle: string;
  pageCount: string;
  amountPaid: string;
}): { subject: string; html: string } {
  const fname = firstName(args.name);
  const greeting = fname ? `Merci ${escape(fname)} 🎉` : "Merci 🎉";

  const inner = `
    <p style="margin:0 0 8px;font-size:26px;color:#0f172a;font-family:Georgia,serif;">${greeting}</p>
    <p style="margin:0 0 28px;font-size:15px;color:#475569;font-family:Arial,sans-serif;line-height:1.6;">
      Ta commande a bien été reçue. Ton album est en cours d'impression et sera expédié sous 5 à 7 jours ouvrés.
    </p>
    ${divider()}
    ${sectionLabel("Récapitulatif de commande")}
    <table width="100%" cellpadding="0" cellspacing="0">
      ${row("Album", `&laquo;&nbsp;${escape(args.albumTitle)}&nbsp;&raquo;`)}
      ${row("Format", "Hardcover 21×28 cm · Papier glacé")}
      ${row("Pages", `${escape(args.pageCount)} pages`, !args.amountPaid)}
      ${args.amountPaid ? `<tr>
        <td style="padding:14px 0 0;"><span style="font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,sans-serif;">Total</span></td>
        <td align="right" style="padding:14px 0 0;"><span style="font-size:15px;font-weight:700;color:#0f172a;font-family:Arial,sans-serif;">${escape(args.amountPaid)}</span></td>
      </tr>` : ""}
    </table>
    ${divider()}
    ${sectionLabel("Livraison")}
    <p style="margin:0 0 28px;font-size:14px;color:#475569;font-family:Arial,sans-serif;line-height:1.7;">
      Album imprimé hardcover · Papier glacé premium 170 g/m² · Livraison sous 5–7 jours ouvrés. Tu recevras un email avec ton numéro de suivi dès l'expédition.
    </p>
    ${ctaButton("Créer un nouvel album →", "https://linstantane.fr/create")}
  `;

  return {
    subject: `Ta commande « ${args.albumTitle} » est confirmée ✨`,
    html: wrap(inner, `Ton album est en cours d'impression. Livraison sous 5–7 jours.`),
  };
}

// ─── 2. EXPÉDITION ──────────────────────────────────────────────────────────
export function buildShippingEmail(args: {
  name: string;
  albumTitle: string;
  carrier?: string;
  trackingId?: string;
  trackingUrl?: string | null;
}): { subject: string; html: string } {
  const fname = firstName(args.name);
  const greeting = fname ? `C'est parti ${escape(fname)} ! 🚚` : "C'est parti ! 🚚";

  let trackingBlock = "";
  if (args.trackingId) {
    trackingBlock = `
      ${divider()}
      ${sectionLabel("Suivi de livraison")}
      <table width="100%" cellpadding="0" cellspacing="0">
        ${args.carrier ? row("Transporteur", escape(args.carrier)) : ""}
        ${row("Numéro de suivi", escape(args.trackingId), true)}
      </table>
      ${args.trackingUrl ? `<div style="margin-top:20px;">${ctaButton("Suivre mon colis →", args.trackingUrl)}</div>` : ""}
    `;
  }

  const inner = `
    <p style="margin:0 0 8px;font-size:26px;color:#0f172a;font-family:Georgia,serif;">${greeting}</p>
    <p style="margin:0 0 8px;font-size:15px;color:#475569;font-family:Arial,sans-serif;line-height:1.6;">
      Ton album <strong>« ${escape(args.albumTitle)} »</strong> vient d'être expédié. Il devrait arriver chez toi dans les prochains jours.
    </p>
    ${trackingBlock}
    ${divider()}
    <p style="margin:0;font-size:13px;color:#64748b;font-family:Arial,sans-serif;line-height:1.7;">
      Une question sur ta commande ? Réponds directement à cet email ou contacte-nous à
      <a href="mailto:${CONTACT}" style="color:#0f172a;">${CONTACT}</a>.
    </p>
  `;

  return {
    subject: `Ton album « ${args.albumTitle} » est en route ! 🚚`,
    html: wrap(inner, `Ton colis a été expédié${args.carrier ? " via " + args.carrier : ""}.`),
  };
}

// ─── 3. ALBUM LIVRÉ + DEMANDE D'AVIS ─────────────────────────────────────────
export function buildDeliveredEmail(args: {
  name: string;
  albumTitle: string;
  reviewUrl?: string;
}): { subject: string; html: string } {
  const fname = firstName(args.name);
  const greeting = fname ? `Alors ${escape(fname)}, il te plaît ? ✨` : "Alors, il te plaît ? ✨";
  const reviewUrl = args.reviewUrl ?? "https://linstantane.fr/avis";

  const inner = `
    <p style="margin:0 0 8px;font-size:26px;color:#0f172a;font-family:Georgia,serif;">${greeting}</p>
    <p style="margin:0 0 24px;font-size:15px;color:#475569;font-family:Arial,sans-serif;line-height:1.6;">
      Ton album <strong>« ${escape(args.albumTitle)} »</strong> a été livré. On espère que le résultat est à la hauteur de tes souvenirs.
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#475569;font-family:Arial,sans-serif;line-height:1.6;">
      Si tu as une minute, ton avis nous aiderait énormément — et il aide aussi d'autres parents/couples à se décider.
    </p>
    ${ctaButton("Laisser un avis (1 min)", reviewUrl)}
    ${divider()}
    <p style="margin:0 0 12px;font-size:13px;color:#64748b;font-family:Arial,sans-serif;line-height:1.7;">
      Un défaut d'impression, une page abîmée, une couverture qui ne correspond pas à ton aperçu ? On te rembourse intégralement sous 14 jours, sans conditions.
    </p>
    <p style="margin:0;font-size:13px;color:#64748b;font-family:Arial,sans-serif;line-height:1.7;">
      Réponds à cet email ou écris-nous à <a href="mailto:${CONTACT}" style="color:#0f172a;">${CONTACT}</a>.
    </p>
  `;

  return {
    subject: `Ton album « ${args.albumTitle} » est arrivé ✨`,
    html: wrap(inner, `On espère qu'il te plaît. Un avis ?`),
  };
}

// ─── 4. ALERTE ADMIN — ÉCHEC LULU IMPRESSION (Stripe webhook) ───────────────
export function buildAdminLuluFailureEmail(args: {
  errorMessage: string;
  sessionId: string;
  albumTitle: string;
  customerEmail: string;
  interiorUrl: string;
  coverUrl: string;
}): { subject: string; html: string } {
  return {
    subject: `[URGENT] Échec impression Lulu — Commande ${args.sessionId}`,
    html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0f172a;">
<h2>Échec de création du job d'impression Lulu</h2>
<p><strong>Erreur :</strong> ${escape(args.errorMessage)}</p>
<hr />
<table cellpadding="6">
  <tr><td><strong>Session Stripe</strong></td><td>${escape(args.sessionId)}</td></tr>
  <tr><td><strong>Album</strong></td><td>${escape(args.albumTitle)}</td></tr>
  <tr><td><strong>Email client</strong></td><td>${escape(args.customerEmail || "N/A")}</td></tr>
  <tr><td><strong>Interior PDF</strong></td><td><a href="${escape(args.interiorUrl)}">${escape(args.interiorUrl)}</a></td></tr>
  <tr><td><strong>Cover PDF</strong></td><td><a href="${escape(args.coverUrl)}">${escape(args.coverUrl)}</a></td></tr>
</table>
<p>Merci de traiter cette commande manuellement.</p>
</body></html>`,
  };
}

// ─── 5. ALERTE ADMIN — STATUS LULU REJECTED/ERROR/CANCELED ──────────────────
export function buildAdminLuluStatusEmail(args: {
  status: string;
  statusMessage: string;
  printJobId: string;
  externalId: string;
  topic: string;
}): { subject: string; html: string } {
  return {
    subject: `[URGENT] Impression Lulu ${args.status} — Job ${args.printJobId}`,
    html: `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;color:#0f172a;">
<h2>Job d'impression Lulu en échec</h2>
<p><strong>Statut :</strong> ${escape(args.status)}</p>
<p><strong>Détail :</strong> ${escape(args.statusMessage)}</p>
<hr />
<table cellpadding="6">
  <tr><td><strong>Print Job ID</strong></td><td>${escape(args.printJobId)}</td></tr>
  <tr><td><strong>Commande Stripe (external_id)</strong></td><td>${escape(args.externalId || "N/A")}</td></tr>
  <tr><td><strong>Topic</strong></td><td>${escape(args.topic)}</td></tr>
</table>
<p>Merci de vérifier la commande et procéder au remboursement si nécessaire.</p>
</body></html>`,
  };
}
