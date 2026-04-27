"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  listCart,
  removeFromCart,
  loadCartItemAsCurrent,
  type CartItemSummary,
} from "@/app/lib/cartStore";

interface Order {
  id: string;
  date: string;
  amount: number;
  albumTitle: string;
  pageCount: string;
  status: string;
}

export default function MonComptePage() {
  const { user } = useUser();
  const router = useRouter();
  const [albums, setAlbums] = useState<CartItemSummary[] | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    try { setAlbums(await listCart()); }
    catch { setAlbums([]); }
  }

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("linstantane:cart-changed", onChange);
    fetch("/api/orders")
      .then(r => r.json())
      .then(d => setOrders(d.orders ?? []))
      .finally(() => setLoadingOrders(false));
    return () => window.removeEventListener("linstantane:cart-changed", onChange);
  }, []);

  async function deleteAlbum(id: string) {
    setBusy(id);
    try { await removeFromCart(id); } finally { setBusy(null); }
  }

  async function openAlbum(id: string) {
    setBusy(id);
    try {
      const ok = await loadCartItemAsCurrent(id);
      if (ok) router.push("/create?restore=true");
    } finally {
      setBusy(null);
    }
  }

  async function orderAlbum(id: string) {
    setBusy(id);
    try {
      const ok = await loadCartItemAsCurrent(id);
      if (ok) router.push("/result");
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4]">
      <Nav />
      <div className="mx-auto max-w-4xl px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Mon compte</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900">
            Bonjour {user?.firstName ?? ""}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{user?.emailAddresses?.[0]?.emailAddress}</p>
        </div>

        {/* Albums sauvegardés */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Mes albums sauvegardés</h2>
            <Link href="/create" className="text-xs text-slate-500 hover:text-slate-900 transition">
              + Créer un album
            </Link>
          </div>

          {albums === null ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-400">Chargement…</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-sm text-slate-400 mb-4">Aucun album sauvegardé pour le moment</p>
              <Link href="/create"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
              >
                Créer mon premier album →
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map(album => (
                <div key={album.id} className="group relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                  {/* Couverture miniature */}
                  <div className="mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl bg-slate-100">
                    {album.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-3xl">📷</span>
                      </div>
                    )}
                  </div>
                  <p className="font-[family-name:var(--font-playfair)] font-semibold text-slate-900 truncate">{album.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {album.pageCount} pages · {new Date(album.addedAt).toLocaleDateString("fr-FR")}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => openAlbum(album.id)}
                      disabled={busy === album.id}
                      className="flex-1 rounded-full bg-slate-900 py-2 text-xs font-medium text-white hover:bg-slate-700 transition disabled:opacity-60"
                    >
                      Ouvrir
                    </button>
                    <button
                      onClick={() => orderAlbum(album.id)}
                      disabled={busy === album.id}
                      className="flex-1 rounded-full border border-gray-200 py-2 text-xs font-medium text-slate-600 hover:border-slate-400 transition disabled:opacity-60"
                    >
                      Commander
                    </button>
                  </div>
                  <button
                    onClick={() => deleteAlbum(album.id)}
                    disabled={busy === album.id}
                    aria-label={`Supprimer ${album.title}`}
                    className="absolute top-3 right-3 hidden group-hover:flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition text-xs disabled:opacity-60"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Commandes */}
        <section>
          <h2 className="font-semibold text-slate-900 mb-4">Mes commandes</h2>

          {loadingOrders ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-400">Chargement…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-sm text-slate-400">Aucune commande pour l&apos;instant</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              {orders.map((order, i) => (
                <div key={order.id} className={`flex items-center justify-between px-5 py-4 ${i < orders.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">&ldquo;{order.albumTitle}&rdquo;</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(order.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      {" · "}{order.pageCount} pages
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 text-sm">{order.amount.toFixed(2).replace(".", ",")} €</p>
                    <span className="inline-block mt-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
