/**
 * IndexedDB-backed shopping cart for L'Instantané.
 *
 * Each entry stores the full album payload (which can be many MB of base64
 * photos) plus a small summary used to render the cart list quickly. We
 * deliberately avoid localStorage because it caps at ~5 MB and an album with
 * a few photos already busts that limit.
 */

import { openDB } from "@/app/lib/albumStore";

const ALBUMS_STORE = "albums"; // single in-progress album under key "current"
const CART_STORE = "cart";     // multiple cart items keyed by id

export interface CartItemSummary {
  id: string;
  title: string;
  pageCount: number;
  cover: string | null; // tiny thumbnail (base64) or null
  addedAt: number;
}

// Internal: an entry stored in IndexedDB. `album` is the full payload.
interface CartItemFull extends CartItemSummary {
  album: unknown;
}

/** Add an album to the cart. Returns the generated cart item id. */
export async function addToCart(args: {
  album: unknown;
  title: string;
  pageCount: number;
  cover: string | null;
}): Promise<string> {
  const id = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const entry: CartItemFull = {
    id,
    title: args.title,
    pageCount: args.pageCount,
    cover: args.cover,
    addedAt: Date.now(),
    album: args.album,
  };
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(CART_STORE, "readwrite");
    tx.objectStore(CART_STORE).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
    tx.onabort    = () => reject(tx.error ?? new Error("Écriture annulée (stockage plein ?)"));
  });
  db.close();
  // Notify any listening UI (e.g. the Nav cart badge) without forcing a reload.
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("linstantane:cart-changed"));
  }
  return id;
}

/** Lightweight list (no full album payload) for the cart UI. */
export async function listCart(): Promise<CartItemSummary[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CART_STORE, "readonly");
    const req = tx.objectStore(CART_STORE).getAll();
    req.onsuccess = () => {
      db.close();
      const all = (req.result as CartItemFull[]) || [];
      const summaries: CartItemSummary[] = all
        .map(({ album: _omit, ...rest }) => rest)
        .sort((a, b) => b.addedAt - a.addedAt);
      resolve(summaries);
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

/** Total number of items in the cart (cheap, used by Nav badge). */
export async function cartCount(): Promise<number> {
  try {
    const db = await openDB();
    return await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(CART_STORE, "readonly");
      const req = tx.objectStore(CART_STORE).count();
      req.onsuccess = () => { db.close(); resolve(req.result || 0); };
      req.onerror   = () => { db.close(); reject(req.error); };
    });
  } catch {
    return 0;
  }
}

/** Get the full album payload for a cart entry. */
export async function getCartItem<T = unknown>(id: string): Promise<{ summary: CartItemSummary; album: T } | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CART_STORE, "readonly");
    const req = tx.objectStore(CART_STORE).get(id);
    req.onsuccess = () => {
      db.close();
      const r = req.result as CartItemFull | undefined;
      if (!r) { resolve(null); return; }
      const { album, ...summary } = r;
      resolve({ summary, album: album as T });
    };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function removeFromCart(id: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(CART_STORE, "readwrite");
    tx.objectStore(CART_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
    tx.onabort    = () => reject(tx.error ?? new Error("Écriture annulée (stockage plein ?)"));
  });
  db.close();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("linstantane:cart-changed"));
  }
}

/** Move a cart item back into the editor "current album" slot for editing/checkout. */
export async function loadCartItemAsCurrent(id: string): Promise<boolean> {
  const item = await getCartItem<unknown>(id);
  if (!item) return false;
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(ALBUMS_STORE, "readwrite");
    tx.objectStore(ALBUMS_STORE).put(item.album, "current");
    tx.oncomplete = () => resolve();
    tx.onerror    = () => reject(tx.error);
    tx.onabort    = () => reject(tx.error ?? new Error("Écriture annulée (stockage plein ?)"));
  });
  db.close();
  return true;
}
