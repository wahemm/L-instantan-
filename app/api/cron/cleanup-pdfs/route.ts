import { NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

/**
 * Tâche planifiée (vercel.json, chaque nuit) : supprime les fichiers
 * d'impression (albums/<commande>/cover|interior.pdf) de plus de 6 mois,
 * comme promis dans la politique de confidentialité. Ne touche à rien d'autre
 * (les albums enregistrés dans les comptes sont dans drafts/).
 */
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
const PDF_PATH = /^albums\/(order|rescue)-[a-z0-9-]{8,48}\/(cover|interior)\.pdf$/;
const MAX_PER_RUN = 500;

function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret) return req.headers.get("authorization") === `Bearer ${secret}`;
  // Sans secret configuré : seuls les appels du planificateur Vercel.
  return (req.headers.get("user-agent") ?? "").startsWith("vercel-cron/");
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cutoff = Date.now() - MAX_AGE_MS;
  const old: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: "albums/", cursor, limit: 1000 });
    for (const b of page.blobs) {
      if (PDF_PATH.test(b.pathname) && new Date(b.uploadedAt).getTime() < cutoff) old.push(b.url);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && old.length < MAX_PER_RUN);

  const batch = old.slice(0, MAX_PER_RUN);
  for (let i = 0; i < batch.length; i += 100) await del(batch.slice(i, i + 100));
  return NextResponse.json({ deleted: batch.length });
}
