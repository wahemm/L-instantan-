"use client";

import { useEffect, useState } from "react";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calculatePrice, formatPrice } from "@/app/lib/pricing";
import {
  listCart,
  removeFromCart,
  loadCartItemAsCurrent,
  type CartItemSummary,
} from "@/app/lib/cartStore";

export default function PanierPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemSummary[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function refresh() {
    try {
      const list = await listCart();
      setItems(list);
    } catch (err) {
      console.error("listCart failed:", err);
      setItems([]);
    }
  }

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("linstantane:cart-changed", onChange);
    return () => window.removeEventListener("linstantane:cart-changed", onChange);
  }, []);

  async function handleRemove(id: string) {
    setBusy(id);
    try { await removeFromCart(id); } finally { setBusy(null); }
  }

  async function handleEdit(id: string) {
    setBusy(id);
    try {
      const ok = await loadCartItemAsCurrent(id);
      if (ok) router.push("/create?restore=true");
    } finally {
      setBusy(null);
    }
  }

  async function handleOrder(id: string) {
    setBusy(id);
    try {
      const ok = await loadCartItemAsCurrent(id);
      if (ok) router.push("/result");
    } finally {
      setBusy(null);
    }
  }

  const subtotal = (items ?? []).reduce(
    (acc, it) => acc + calculatePrice("physique", it.pageCount), 0
  );

  return (
    <main className="min-h-screen bg-[#f8f7f4]">
      <Nav />

      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Panier
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-playfair)] text-4xl text-slate-900 sm:text-5xl">
            Tes albums prêts à imprimer
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-500">
            Vérifie tes albums, modifie-les si besoin, puis passe à la commande.
            Chaque album est imprimé à la main avec soin et expédié sous 7–10 jours.
          </p>
        </div>

        {items === null ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="space-y-4">
              {items.map(item => (
                <CartCard
                  key={item.id}
                  item={item}
                  busy={busy === item.id}
                  onRemove={() => handleRemove(item.id)}
                  onEdit={() => handleEdit(item.id)}
                  onOrder={() => handleOrder(item.id)}
                />
              ))}

              <Link
                href="/create"
                className="group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-5 text-sm font-medium text-slate-500 transition hover:border-slate-900 hover:text-slate-900"
              >
                <span className="text-lg leading-none transition group-hover:scale-110">+</span>
                Créer un nouvel album
              </Link>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl">
                <h2 className="font-[family-name:var(--font-playfair)] text-xl">
                  Récapitulatif
                </h2>
                <div className="mt-5 space-y-3 text-sm">
                  <Row label={`${items.length} album${items.length > 1 ? "s" : ""}`} value={formatPrice(subtotal)} />
                  <Row label="Livraison" value="Calculée à l’étape suivante" muted />
                </div>
                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-white/70">Sous-total</span>
                    <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-white/50">
                  Pour le moment chaque album passe par sa propre commande.
                  Choisis l’album à commander ci-contre.
                </p>
              </div>

              <ul className="mt-5 space-y-2 text-xs text-slate-500">
                <li className="flex items-start gap-2">
                  <Check />
                  <span>Paiement 100 % sécurisé via Stripe</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check />
                  <span>Imprimé en France et en Europe</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check />
                  <span>Satisfait ou remboursé sous 14 jours</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check />
                  <span>Service client : <a href="mailto:linstantane.officiel@gmail.com" className="underline hover:text-slate-900">linstantane.officiel@gmail.com</a></span>
                </li>
              </ul>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function CartCard({
  item,
  busy,
  onRemove,
  onEdit,
  onOrder,
}: {
  item: CartItemSummary;
  busy: boolean;
  onRemove: () => void;
  onEdit: () => void;
  onOrder: () => void;
}) {
  const price = calculatePrice("physique", item.pageCount);
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-lg sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
        {/* Cover preview */}
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-32 sm:w-24">
          {item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.cover}
              alt={item.title}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-3xl">
              📷
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/15 to-transparent"/>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 truncate">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {item.pageCount} page{item.pageCount > 1 ? "s" : ""} · Hardcover 21×28 cm · Papier glacé 170 g/m²
              </p>
            </div>
            <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-slate-900 whitespace-nowrap">
              {formatPrice(price)}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={onOrder}
              disabled={busy}
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
            >
              {busy ? "…" : "Commander"}
            </button>
            <button
              onClick={onEdit}
              disabled={busy}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-400 disabled:opacity-60"
            >
              Modifier
            </button>
            <button
              onClick={onRemove}
              disabled={busy}
              className="ml-auto text-[11px] text-slate-400 transition hover:text-red-500 disabled:opacity-60"
              aria-label={`Retirer ${item.title} du panier`}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <svg viewBox="0 0 24 24" className="h-7 w-7 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 7h12l-1.2 9.5a2 2 0 0 1-2 1.7H9.2a2 2 0 0 1-2-1.7L6 7Z"/>
          <path d="M9 7V5.5a3 3 0 0 1 6 0V7"/>
        </svg>
      </div>
      <h2 className="mt-5 font-[family-name:var(--font-playfair)] text-2xl text-slate-900">
        Ton panier est vide
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
        Crée ton premier album photo. Glisse tes plus belles images, choisis ta couverture, et imprime un livre dont tu seras fier.
      </p>
      <Link
        href="/create"
        className="mt-7 inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Créer mon album →
      </Link>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="rounded-3xl border border-gray-200 bg-white p-6 animate-pulse">
          <div className="flex gap-5">
            <div className="h-32 w-24 rounded-2xl bg-slate-100"/>
            <div className="flex-1 space-y-3">
              <div className="h-5 w-1/2 rounded bg-slate-100"/>
              <div className="h-3 w-3/4 rounded bg-slate-100"/>
              <div className="h-9 w-32 rounded-full bg-slate-100 mt-4"/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-white/50" : "text-white/70"}>{label}</span>
      <span className={muted ? "text-white/60 text-xs" : "font-medium"}>{value}</span>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7"/>
    </svg>
  );
}
