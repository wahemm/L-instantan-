/**
 * Sauvegarde des albums dans le compte (clients connectés) : retrouver ses
 * albums sur un autre appareil, ou après un nettoyage du navigateur (Safari
 * efface les données locales d'un site non visité depuis 7 jours).
 * Données sur Vercel Blob via /api/drafts ; le stockage local (albumStore)
 * reste la copie de travail.
 */

import type { DraftSummary } from "@/app/lib/albumStore";

export interface CloudDraft extends DraftSummary {
  dataUrl: string;
}

// Une même photo est à la fois dans la bibliothèque et dans les pages : on
// ne l'envoie qu'une fois (les images sont des data URL base64).
type Packed = { v: 1; photos: string[]; album: unknown };
const REF = "@@photo:";

export function pack(album: unknown): Packed {
  const photos: string[] = [];
  const index = new Map<string, number>();
  const walk = (v: unknown): unknown => {
    if (typeof v === "string" && v.startsWith("data:image")) {
      let i = index.get(v);
      if (i === undefined) { i = photos.length; photos.push(v); index.set(v, i); }
      return REF + i;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, walk(x)]));
    }
    return v;
  };
  return { v: 1, photos, album: walk(album) };
}

export function unpack(p: Packed): unknown {
  const walk = (v: unknown): unknown => {
    if (typeof v === "string" && v.startsWith(REF)) return p.photos[Number(v.slice(REF.length))] ?? "";
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, walk(x)]));
    }
    return v;
  };
  return walk(p.album);
}

/** Petite miniature (≈ 240 px) si la couverture est une photo du client. */
export async function coverThumb(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  if (!src.startsWith("data:")) return src; // couverture illustrée : simple chemin
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    const scale = 240 / Math.max(img.naturalWidth, img.naturalHeight);
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * Math.min(1, scale));
    c.height = Math.round(img.naturalHeight * Math.min(1, scale));
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.7);
  } catch {
    return null;
  }
}

export async function cloudSaveDraft(userId: string, summary: DraftSummary, album: unknown): Promise<void> {
  const { upload } = await import("@vercel/blob/client");
  const base = `drafts/${userId}/${summary.id}`;
  const data = new Blob([JSON.stringify(pack(album))], { type: "application/json" });
  await upload(`${base}/data.json`, data, {
    access: "public",
    handleUploadUrl: "/api/drafts/upload",
    contentType: "application/json",
    multipart: data.size > 8 * 1024 * 1024,
  });
  // Les métadonnées APRÈS les données : la liste ne montre un album que s'il est complet.
  const meta = new Blob([JSON.stringify({ ...summary, cover: await coverThumb(summary.cover) })], { type: "application/json" });
  await upload(`${base}/meta.json`, meta, {
    access: "public",
    handleUploadUrl: "/api/drafts/upload",
    contentType: "application/json",
  });
  // Ménage des anciennes versions (sans bloquer si ça échoue)
  fetch("/api/drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "cleanup", id: summary.id }),
  }).catch(() => {});
}

export async function cloudListDrafts(): Promise<CloudDraft[]> {
  const res = await fetch("/api/drafts", { cache: "no-store" });
  if (!res.ok) return [];
  const json = (await res.json()) as { albums?: CloudDraft[] };
  return json.albums ?? [];
}

export async function cloudLoadDraft<T = unknown>(dataUrl: string): Promise<T> {
  const res = await fetch(dataUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`Téléchargement impossible (${res.status})`);
  return unpack((await res.json()) as Packed) as T;
}

export async function cloudDeleteDraft(id: string): Promise<void> {
  await fetch(`/api/drafts?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Liste fusionnée local + compte (la version la plus récente gagne). */
export async function listAllDrafts(userId: string | null): Promise<(DraftSummary & { dataUrl?: string; local: boolean })[]> {
  const { listDrafts } = await import("@/app/lib/albumStore");
  const local = await listDrafts(userId).catch(() => [] as DraftSummary[]);
  // Côté serveur, le dossier est celui du compte de la session (jamais un autre)
  const cloud = userId ? await cloudListDrafts().catch(() => [] as CloudDraft[]) : [];
  const byId = new Map<string, DraftSummary & { dataUrl?: string; local: boolean }>();
  for (const d of local) byId.set(d.id, { ...d, local: true });
  for (const c of cloud) {
    const l = byId.get(c.id);
    if (!l) byId.set(c.id, { ...c, local: false });
    else if (c.updatedAt > l.updatedAt + 1000) byId.set(c.id, { ...c, local: false });
    else byId.set(c.id, { ...l, dataUrl: c.dataUrl });
  }
  return [...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Charge un album (local, ou depuis le compte si plus récent / absent ici) et
 * en fait l'album courant de l'éditeur. Renvoie l'album, ou null.
 */
export async function openDraft<T extends object = Record<string, unknown>>(id: string, userId: string | null): Promise<T | null> {
  const { getDraft, saveAlbum, saveDraft } = await import("@/app/lib/albumStore");
  const all = await listAllDrafts(userId);
  const entry = all.find((d) => d.id === id);
  let album: T | null = null;
  if (entry && !entry.local && entry.dataUrl) {
    album = await cloudLoadDraft<T>(entry.dataUrl);
    const summary: DraftSummary = { id: entry.id, title: entry.title, pageCount: entry.pageCount, photoCount: entry.photoCount, cover: entry.cover, updatedAt: entry.updatedAt };
    // Copie locale pour la suite (sans bloquer si l'appareil est plein)
    await saveDraft({ ...summary, owner: userId ?? "guest" }, album).catch((e) => console.warn("[drafts] copie locale impossible", e));
  } else if (entry) {
    album = (await getDraft<T>(id))?.album ?? null;
  }
  if (album) await saveAlbum({ ...album, id }).catch((e) => console.warn("[drafts] album courant non enregistré", e));
  return album;
}

/** Charge un album (compte ou appareil) SANS l'écrire sur l'appareil. */
export async function readDraft<T = unknown>(id: string, userId: string | null): Promise<T | null> {
  const { getDraft } = await import("@/app/lib/albumStore");
  const all = await listAllDrafts(userId);
  const entry = all.find((d) => d.id === id);
  if (!entry) return null;
  if (!entry.local && entry.dataUrl) return cloudLoadDraft<T>(entry.dataUrl);
  return (await getDraft<T>(id))?.album ?? null;
}
