import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { list, del, type ListBlobResultBlob } from "@vercel/blob";

/**
 * Albums sauvegardés dans le compte (dossier drafts/<userId>/ du Blob).
 *  GET                       → liste (titre, miniature, date, adresse des données)
 *  POST {action:"cleanup",id}→ ne garde que la dernière version de l'album
 *  DELETE ?id=               → supprime l'album du compte
 */

const ALBUM_ID = /^alb-[a-z0-9-]{6,40}$/;

async function listAll(prefix: string): Promise<ListBlobResultBlob[]> {
  const out: ListBlobResultBlob[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    out.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

// drafts/<userId>/<albumId>/(data|meta)-<suffixe>.json
function parse(pathname: string) {
  const m = pathname.match(/\/(alb-[a-z0-9-]{6,40})\/(data|meta)-[A-Za-z0-9]+\.json$/);
  return m ? { id: m[1], kind: m[2] as "data" | "meta" } : null;
}

function newestByKind(blobs: ListBlobResultBlob[]) {
  const latest = new Map<string, ListBlobResultBlob>(); // `${id}:${kind}`
  for (const b of blobs) {
    const p = parse(b.pathname);
    if (!p) continue;
    const k = `${p.id}:${p.kind}`;
    const cur = latest.get(k);
    if (!cur || new Date(b.uploadedAt) > new Date(cur.uploadedAt)) latest.set(k, b);
  }
  return latest;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const latest = newestByKind(await listAll(`drafts/${userId}/`));
    const ids = new Set([...latest.keys()].map((k) => k.split(":")[0]));
    const albums = (
      await Promise.all(
        [...ids].map(async (id) => {
          const meta = latest.get(`${id}:meta`);
          const data = latest.get(`${id}:data`);
          if (!meta || !data) return null;
          try {
            const m = await fetch(meta.url, { cache: "no-store" }).then((r) => r.json());
            return {
              id,
              title: String(m.title ?? "Mon Album").slice(0, 200),
              pageCount: Number(m.pageCount) || 0,
              photoCount: Number(m.photoCount) || 0,
              cover: typeof m.cover === "string" ? m.cover : null,
              updatedAt: Number(m.updatedAt) || new Date(data.uploadedAt).getTime(),
              dataUrl: data.url,
            };
          } catch {
            return null;
          }
        })
      )
    ).filter(Boolean);
    return NextResponse.json({ albums }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[drafts] list failed:", err);
    return NextResponse.json({ error: "List failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { action, id } = (await req.json().catch(() => ({}))) as { action?: string; id?: string };
  if (action !== "cleanup" || !id || !ALBUM_ID.test(id)) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const blobs = await listAll(`drafts/${userId}/${id}/`);
  const keep = new Set([...newestByKind(blobs).values()].map((b) => b.url));
  const old = blobs.filter((b) => !keep.has(b.url)).map((b) => b.url);
  if (old.length) await del(old);
  return NextResponse.json({ deleted: old.length });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!ALBUM_ID.test(id)) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const blobs = await listAll(`drafts/${userId}/${id}/`);
  if (blobs.length) await del(blobs.map((b) => b.url));
  return NextResponse.json({ deleted: blobs.length });
}
