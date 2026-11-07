/**
 * IndexedDB-based album storage.
 * SessionStorage is limited to ~5MB which breaks with many photos.
 * IndexedDB can handle hundreds of MB.
 *
 * - "albums"/"current" : l'album ouvert dans l'éditeur (lu par /result).
 * - "drafts"           : TOUS les albums du client, un par id (« Mes albums »).
 *   Avant, il n'y avait que "current" : commencer un 2ᵉ album écrasait le 1er
 *   et gardait ses photos dans la bibliothèque.
 */

const DB_NAME = "linstantane";
const DB_VERSION = 3;
const STORE_NAME = "albums";
const CART_STORE = "cart";
const DRAFTS_STORE = "drafts";
const KEY = "current";

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
      if (!db.objectStoreNames.contains(CART_STORE)) db.createObjectStore(CART_STORE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) db.createObjectStore(DRAFTS_STORE, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("IndexedDB upgrade blocked — close other tabs and retry."));
  });
}

export async function saveAlbum(data: unknown): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(data, KEY);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function loadAlbum<T = unknown>(): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(KEY);
    req.onsuccess = () => { db.close(); resolve(req.result ?? null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

// ── Mes albums (brouillons) ─────────────────────────────────────────────

export interface DraftSummary {
  id: string;
  title: string;
  pageCount: number;
  photoCount: number;
  cover: string | null; // chemin de couverture ou petite miniature
  updatedAt: number;
  // Compte propriétaire (id Clerk) ou "guest". Le navigateur peut servir à
  // plusieurs comptes : chacun ne voit que ses albums (+ ceux faits sans compte).
  owner?: string;
}

/** Albums visibles pour ce compte (null = non connecté). */
export function visibleTo(owner: string | undefined, userId: string | null): boolean {
  if (!owner || owner === "guest") return true;
  return owner === userId;
}

interface DraftEntry extends DraftSummary {
  album: unknown;
}

export function newAlbumId(): string {
  return `alb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function notifyDraftsChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("linstantane:drafts-changed"));
}

export async function saveDraft(summary: DraftSummary, album: unknown): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DRAFTS_STORE, "readwrite");
    tx.objectStore(DRAFTS_STORE).put({ ...summary, album } satisfies DraftEntry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  notifyDraftsChanged();
}

export async function listDrafts(userId: string | null): Promise<DraftSummary[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFTS_STORE, "readonly");
    const req = tx.objectStore(DRAFTS_STORE).getAll();
    req.onsuccess = () => {
      db.close();
      const all = (req.result as DraftEntry[]) || [];
      resolve(
        all
          .map(({ album: _album, ...s }) => s) // eslint-disable-line @typescript-eslint/no-unused-vars
          .filter((s) => visibleTo(s.owner, userId))
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function getDraft<T = unknown>(id: string): Promise<{ summary: DraftSummary; album: T } | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DRAFTS_STORE, "readonly");
    const req = tx.objectStore(DRAFTS_STORE).get(id);
    req.onsuccess = () => {
      db.close();
      const r = req.result as DraftEntry | undefined;
      if (!r) { resolve(null); return; }
      const { album, ...summary } = r;
      resolve({ summary, album: album as T });
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function deleteDraft(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DRAFTS_STORE, "readwrite");
    tx.objectStore(DRAFTS_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  notifyDraftsChanged();
}
