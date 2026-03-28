"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/app/components/Nav";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────
type PageLayout = 1 | 2 | 3 | 4;
type EditorPage = { layout: PageLayout; photos: (string | null)[]; caption: string };
type Album =
  | { type: "auto"; title: string; subtitle: string; photos: string[] }
  | { type: "manual"; title: string; pages: EditorPage[] };

// ── Packs ──────────────────────────────────────────────────────────────
const PACKS = [
  {
    id: "digital" as const,
    name: "Digital",
    price: "10 €",
    desc: "Album PDF HD — téléchargement immédiat",
    perks: ["Album haute résolution", "PDF prêt à partager", "Téléchargement immédiat"],
  },
  {
    id: "physique" as const,
    name: "Physique",
    price: "35 €",
    desc: "Livre imprimé livré chez toi",
    perks: ["Livre imprimé finition premium", "Livraison en France", "Pour offrir ou garder"],
    featured: true,
  },
  {
    id: "duo" as const,
    name: "Duo",
    price: "40 €",
    desc: "Digital + Physique — le meilleur des deux",
    perks: ["Pack Digital inclus", "Livre imprimé inclus", "Meilleure valeur"],
  },
];

// ── Checkout ───────────────────────────────────────────────────────────
async function redirectToCheckout(pack: "digital" | "physique" | "duo") {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pack }),
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Une erreur est survenue. Veuillez réessayer.");
  }
}

// ── Auto layout: group photos 2 per spread ─────────────────────────────
function AutoBookViewer({ album }: { album: Extract<Album, { type: "auto" }> }) {
  const [current, setCurrent] = useState(0);
  const spreads: (string | null)[][] = [];

  // Cover page
  spreads.push([null]);

  // Photos by pairs
  for (let i = 0; i < album.photos.length; i += 2) {
    spreads.push([album.photos[i], album.photos[i + 1] ?? null]);
  }

  const total = spreads.length;
  const spread = spreads[current];
  const isCover = current === 0;

  return (
    <div className="flex flex-col items-center">
      {/* Page */}
      <div
        className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl"
        style={{ aspectRatio: isCover ? "3/4" : "3/4" }}
      >
        {isCover ? (
          <div className="flex h-full flex-col items-center justify-center bg-[#121212] px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-3">
              L&apos;Instantané
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic text-white">
              {album.title}
            </h2>
            {album.subtitle && (
              <p className="mt-2 text-sm text-white/50">{album.subtitle}</p>
            )}
          </div>
        ) : (
          <div
            className={`grid h-full gap-0.5 bg-gray-100 ${
              spread[1] ? "grid-cols-1 grid-rows-2" : "grid-cols-1"
            }`}
          >
            {spread.map((photo, idx) =>
              photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={idx} src={photo} alt="" className="h-full w-full object-cover" />
              ) : null
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30"
        >
          ←
        </button>
        <span className="text-sm text-slate-400">
          {current + 1} / {total}
        </span>
        <button
          onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
          disabled={current === total - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ── Manual layout viewer ────────────────────────────────────────────────
function ManualBookViewer({ album }: { album: Extract<Album, { type: "manual" }> }) {
  const [current, setCurrent] = useState(-1); // -1 = cover
  const total = album.pages.length;

  const isCover = current === -1;
  const page = isCover ? null : album.pages[current];

  function gridClass(layout: PageLayout) {
    if (layout === 1) return "grid-cols-1 grid-rows-1";
    if (layout === 2) return "grid-cols-1 grid-rows-2";
    return "grid-cols-2 grid-rows-2"; // 3 or 4
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl"
        style={{ aspectRatio: "210/297" }}
      >
        {isCover ? (
          <div className="flex h-full flex-col items-center justify-center bg-[#121212] px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-3">
              L&apos;Instantané
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic text-white">
              {album.title}
            </h2>
          </div>
        ) : page ? (
          <div className="flex h-full flex-col bg-white">
            <div className={`grid flex-1 gap-0.5 bg-gray-100 ${gridClass(page.layout)}`}>
              {Array.from({ length: page.layout }).map((_, idx) => {
                const photo = page.photos[idx];
                const spanClass = page.layout === 3 && idx === 0 ? "col-span-2" : "";
                return (
                  <div key={idx} className={`overflow-hidden bg-[#f8f7f4] ${spanClass}`}>
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                );
              })}
            </div>
            {page.caption && (
              <div className="px-4 py-2 text-center text-xs italic text-slate-400">
                {page.caption}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <div className="mt-5 flex items-center gap-4">
        <button
          onClick={() => setCurrent((c) => Math.max(-1, c - 1))}
          disabled={current === -1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30"
        >
          ←
        </button>
        <span className="text-sm text-slate-400">
          {current + 2} / {total + 1}
        </span>
        <button
          onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
          disabled={current === total - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30"
        >
          →
        </button>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCurrent(-1)}
          className={`shrink-0 overflow-hidden rounded border-2 transition ${
            current === -1 ? "border-slate-900" : "border-transparent hover:border-gray-300"
          }`}
          style={{ width: 36, height: 50 }}
        >
          <div className="flex h-full items-center justify-center bg-[#121212]">
            <span className="text-[8px] text-white/40">Cover</span>
          </div>
        </button>
        {album.pages.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`shrink-0 overflow-hidden rounded border-2 transition ${
              current === idx ? "border-slate-900" : "border-transparent hover:border-gray-300"
            }`}
            style={{ width: 36, height: 50 }}
          >
            <div
              className={`grid h-full gap-px bg-gray-100 ${
                p.layout === 1
                  ? "grid-cols-1"
                  : p.layout === 2
                  ? "grid-cols-1 grid-rows-2"
                  : "grid-cols-2 grid-rows-2"
              }`}
            >
              {Array.from({ length: p.layout }).map((_, si) => {
                const photo = p.photos[si];
                const spanClass = p.layout === 3 && si === 0 ? "col-span-2" : "";
                return (
                  <div key={si} className={`overflow-hidden bg-[#f8f7f4] ${spanClass}`}>
                    {photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main result content ────────────────────────────────────────────────
function ResultContent() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("linstantane:album");
      if (raw) setAlbum(JSON.parse(raw) as Album);
    } catch {
      // nothing
    }
  }, []);

  async function onCheckout(pack: "digital" | "physique" | "duo") {
    setLoadingPack(pack);
    try {
      await redirectToCheckout(pack);
    } finally {
      setLoadingPack(null);
    }
  }

  return (
    <>
      {success && (
        <div className="border-b border-green-200 bg-green-50">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-4">
            <span className="text-xl text-green-600">✓</span>
            <p className="text-sm font-medium text-green-800">
              Paiement reçu ! Ton livre est en cours de préparation.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-12">
        {album ? (
          <>
            <div className="mb-10 text-center">
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl italic text-slate-900 sm:text-4xl">
                Aperçu de ton album
              </h1>
              <p className="mt-3 text-slate-500">
                Voici à quoi ressemblera ton livre imprimé.
              </p>
            </div>

            {album.type === "auto" ? (
              <AutoBookViewer album={album} />
            ) : (
              <ManualBookViewer album={album} />
            )}

            <div className="mt-4 flex justify-center">
              <Link
                href="/create"
                className="text-sm text-slate-400 transition hover:text-slate-700"
              >
                ← Modifier mon album
              </Link>
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="mb-6 text-5xl">📖</div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl italic text-slate-900">
              Aucun album à afficher
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-slate-500">
              Commence par créer ton album pour voir l&apos;aperçu ici.
            </p>
            <Link
              href="/create"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Créer mon album
            </Link>
          </div>
        )}

        {/* Pricing */}
        <section className="mt-20">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Commander mon album
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900">
              Garde tes souvenirs pour toujours
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-500">
              Commande ton livre imprimé ou télécharge la version HD. Paiement unique, sans abonnement.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {PACKS.map((pack) => (
              <article
                key={pack.id}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  pack.featured
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-gray-100 bg-white shadow-sm"
                }`}
              >
                {pack.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold text-slate-900 shadow-sm">
                      Populaire
                    </span>
                  </div>
                )}
                <h3
                  className={`font-[family-name:var(--font-playfair)] text-xl ${
                    pack.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {pack.name}
                </h3>
                <p className={`mt-1 text-sm ${pack.featured ? "text-slate-400" : "text-slate-400"}`}>
                  {pack.desc}
                </p>
                <div className="my-4 flex items-end gap-1">
                  <span
                    className={`font-[family-name:var(--font-playfair)] text-3xl ${
                      pack.featured ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {pack.price}
                  </span>
                  <span className={`mb-0.5 text-xs ${pack.featured ? "text-slate-400" : "text-slate-400"}`}>
                    paiement unique
                  </span>
                </div>
                <ul className="mb-6 flex flex-col gap-2">
                  {pack.perks.map((perk) => (
                    <li
                      key={perk}
                      className={`flex items-start gap-2 text-sm ${
                        pack.featured ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      <span className={`mt-0.5 shrink-0 ${pack.featured ? "text-slate-400" : "text-slate-300"}`}>
                        ✓
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onCheckout(pack.id)}
                  disabled={loadingPack !== null}
                  className={`mt-auto inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-medium transition disabled:opacity-60 ${
                    pack.featured
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {loadingPack === pack.id ? "Redirection…" : `Commander — ${pack.price}`}
                </button>
              </article>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Paiement sécurisé via Stripe. Satisfait ou remboursé sous 14 jours.
          </p>
        </section>
      </div>
    </>
  );
}

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <Suspense fallback={<div className="py-20 text-center text-slate-400">Chargement…</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}
