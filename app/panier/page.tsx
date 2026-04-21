"use client";

import { useEffect, useState } from "react";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { calculatePrice, formatPrice } from "@/app/lib/pricing";

interface SavedAlbum {
  id: string;
  title: string;
  pageCount: number;
  cover: string | null;
  savedAt: string;
}

export default function PanierPage() {
  const [albums, setAlbums] = useState<SavedAlbum[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("linstantane:saved-albums");
      setAlbums(raw ? JSON.parse(raw) : []);
    } catch { /* nothing */ }
  }, []);

  function removeFromCart(id: string) {
    const updated = albums.filter(a => a.id !== id);
    localStorage.setItem("linstantane:saved-albums", JSON.stringify(updated));
    localStorage.removeItem(`linstantane:album:${id}`);
    setAlbums(updated);
  }

  async function checkout(album: SavedAlbum) {
    setLoading(album.id);
    try {
      // Load full album data into session for result page
      const data = localStorage.getItem(`linstantane:album:${album.id}`);
      if (data) sessionStorage.setItem("linstantane:album", data);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageCount: album.pageCount, albumTitle: album.title }),
      });
      const json = await res.json();
      if (json.url) window.location.href = json.url;
      else alert("Une erreur est survenue.");
    } finally {
      setLoading(null);
    }
  }

  const total = albums.reduce((acc, a) => acc + calculatePrice("physique", a.pageCount), 0);

  return (
    <main className="min-h-screen bg-[#f8f7f4]">
      <Nav />
      <div className="mx-auto max-w-3xl px-6 py-12">

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Panier</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900">
            Mes albums à commander
          </h1>
        </div>

        {albums.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-14 text-center">
            <p className="text-2xl mb-3">🛒</p>
            <p className="text-sm font-semibold text-slate-700 mb-1">Panier vide</p>
            <p className="text-xs text-slate-400 mb-6">Crée un album et sauvegarde-le pour le commander ici.</p>
            <Link href="/create"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition"
            >
              Créer un album →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {albums.map(album => {
              const price = calculatePrice("physique", album.pageCount);
              return (
                <div key={album.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  {/* Mini couverture */}
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {album.cover ? (
                      <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl">📷</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-playfair)] font-semibold text-slate-900 truncate">{album.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{album.pageCount} pages · Album imprimé A4</p>
                    <p className="text-xs text-slate-400">Livraison 5–7 jours ouvrés · Papier brillant 170g/m²</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-slate-900">{formatPrice(price)}</p>
                    <button
                      onClick={() => checkout(album)}
                      disabled={loading === album.id}
                      className="mt-2 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition disabled:opacity-60"
                    >
                      {loading === album.id ? "…" : "Commander"}
                    </button>
                    <button
                      onClick={() => removeFromCart(album.id)}
                      className="mt-1 block w-full text-[10px] text-slate-300 hover:text-red-400 transition"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Total + CTA if multiple albums */}
            {albums.length > 1 && (
              <div className="rounded-2xl border border-slate-900 bg-slate-900 p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{albums.length} albums</p>
                  <p className="text-xs text-slate-400 mt-0.5">Chaque album est commandé séparément</p>
                </div>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white">
                  {formatPrice(total)}
                </p>
              </div>
            )}

            <p className="text-center text-xs text-slate-400 pt-2">
              🔒 Paiement sécurisé Stripe · Satisfait ou remboursé sous 14 jours
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
