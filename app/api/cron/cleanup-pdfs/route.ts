import { NextResponse } from "next/server";
import Stripe from "stripe";
import { list, del } from "@vercel/blob";

/**
 * Tâche planifiée (vercel.json, chaque nuit) : ménage des fichiers
 * d'impression (albums/<dossier>/cover|interior.pdf). Ne touche à rien
 * d'autre (les albums enregistrés dans les comptes sont dans drafts/).
 *
 * - Paiement abandonné : les PDF sont créés AVANT le paiement. Un dossier
 *   order-… sans paiement Stripe après 3 jours est supprimé.
 * - Commande payée / relance (rescue-…) : gardés 60 jours (garantie 30 jours
 *   après réception), puis supprimés. Gelato garde sa propre copie pour
 *   une éventuelle réimpression (« Reorder »).
 */
const DAY = 24 * 60 * 60 * 1000;
const UNPAID_MAX_AGE = 3 * DAY;
const KEEP_MAX_AGE = 60 * DAY;
const PDF_PATH = /^albums\/((?:order|rescue|test)-[a-z0-9-]{1,48})\/(cover|interior)\.pdf$/;
const MAX_PER_RUN = 500;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret) return req.headers.get("authorization") === `Bearer ${secret}`;
  // Sans secret configuré : seuls les appels du planificateur Vercel.
  return (req.headers.get("user-agent") ?? "").startsWith("vercel-cron/");
}

/** Dossiers albums/… référencés par une session Stripe payée (65 derniers jours). */
async function paidFolders(): Promise<Set<string>> {
  const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? "").trim(), {
    httpClient: Stripe.createNodeHttpClient(),
  });
  const since = Math.floor((Date.now() - 65 * DAY) / 1000);
  const folders = new Set<string>();
  for await (const s of stripe.checkout.sessions.list({ created: { gte: since }, limit: 100 })) {
    if (s.payment_status !== "paid" && s.status !== "complete") continue;
    for (const url of [s.metadata?.interiorUrl, s.metadata?.coverUrl]) {
      const m = url?.match(/\/albums\/([^/]+)\//);
      if (m) folders.add(m[1]);
    }
  }
  return folders;
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Sans la liste des commandes payées, on ne supprime que ce qui a plus de 60 jours.
  let paid: Set<string> | null = null;
  try { paid = await paidFolders(); } catch (err) { console.error("[cleanup] Stripe indisponible:", err); }

  const now = Date.now();
  const toDelete: string[] = [];
  let freed = 0;
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "albums/", cursor, limit: 1000 });
    for (const b of page.blobs) {
      const m = b.pathname.match(PDF_PATH);
      if (!m) continue;
      const folder = m[1];
      const age = now - new Date(b.uploadedAt).getTime();
      const abandoned = paid !== null && folder.startsWith("order-") && !paid.has(folder) && age > UNPAID_MAX_AGE;
      if (age > KEEP_MAX_AGE || abandoned) { toDelete.push(b.url); freed += b.size; }
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && toDelete.length < MAX_PER_RUN);

  const batch = toDelete.slice(0, MAX_PER_RUN);
  for (let i = 0; i < batch.length; i += 100) await del(batch.slice(i, i + 100));
  console.log(`[cleanup] ${batch.length} PDF supprimés (${Math.round(freed / 1e6)} Mo)`);
  return NextResponse.json({ deleted: batch.length, freedMb: Math.round(freed / 1e6) });
}
