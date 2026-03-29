"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { PACKS, calculatePrice, formatPrice, INCLUDED_PAGES } from "@/app/lib/pricing";

// ── Types ──────────────────────────────────────────────────────────────
type LayoutId = string;
interface TextEl { id: string; x: number; y: number; w: number; text: string; size: number; color: string; bold: boolean; italic: boolean; align: "left"|"center"|"right"; font: "playfair"|"inter"; }
type EditorPage = { layoutId: LayoutId; photos: (string | null)[]; caption: string; bgColor: string; title?: string; subtitle?: string; texts?: TextEl[]; };
type Album =
  | { type: "auto"; title: string; subtitle: string; photos: string[] }
  | { type: "manual"; title: string; pages: EditorPage[] };

// ── Checkout ───────────────────────────────────────────────────────────
async function redirectToCheckout(pack: "digital" | "physique" | "duo", pageCount: number) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pack, pageCount }),
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
function getGridClass(layoutId: string): string {
  switch (layoutId) {
    case "full": return "grid-cols-1";
    case "two-h": return "grid-cols-1 grid-rows-2";
    case "two-v": return "grid-cols-2";
    case "three-top": return "grid-cols-2 grid-rows-[2fr_1fr]";
    case "three-left": return "grid-cols-2 grid-rows-2";
    case "grid4": return "grid-cols-2 grid-rows-2";
    default: return "grid-cols-1";
  }
}

function getSpanClass(layoutId: string, idx: number): string {
  if (layoutId === "three-top" && idx === 0) return "col-span-2";
  if (layoutId === "three-left" && idx === 0) return "row-span-2";
  return "";
}

function ManualBookViewer({ album }: { album: Extract<Album, { type: "manual" }> }) {
  const [current, setCurrent] = useState(0);
  const total = album.pages.length;
  const page = album.pages[current];

  function renderTextOverlays(p: EditorPage) {
    return (p.texts || []).map(el => (
      <div key={el.id} className="absolute pointer-events-none z-10" style={{
        left: `${el.x}%`, top: `${el.y}%`, width: `${el.w}%`,
        fontSize: el.size, color: el.color,
        fontWeight: el.bold ? "bold" : "normal",
        fontStyle: el.italic ? "italic" : "normal",
        textAlign: el.align,
        fontFamily: el.font === "playfair" ? "var(--font-playfair)" : "var(--font-inter)",
        lineHeight: 1.3, whiteSpace: "pre-wrap", wordBreak: "break-word",
      }}>{el.text}</div>
    ));
  }

  function renderPage(p: EditorPage) {
    // Cover page
    if (p.layoutId === "cover") {
      const dark = ["#1e1e1e","#0f172a","#1a1a2e","#4a1942","#0c2340","#7c3aed","#be185d","#0369a1","#15803d","#b45309"].includes(p.bgColor);
      return (
        <div className="relative flex h-full flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: p.bgColor || "#0f172a" }}>
          {p.photos[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          )}
          <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
            {p.subtitle && (
              <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${dark ? "text-white/50" : "text-slate-400"}`}>{p.subtitle}</p>
            )}
            <h2 className={`font-[family-name:var(--font-playfair)] text-3xl leading-tight ${dark ? "text-white" : "text-slate-800"}`}>
              {p.title || album.title}
            </h2>
            <div className={`h-px w-12 ${dark ? "bg-white/25" : "bg-slate-300"}`} />
          </div>
          {renderTextOverlays(p)}
        </div>
      );
    }
    return (
      <div className="relative flex h-full flex-col" style={{ backgroundColor: p.bgColor || "#ffffff" }}>
        {p.layoutId === "text-only" ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-center text-sm italic leading-relaxed text-slate-600">{p.caption}</p>
          </div>
        ) : p.layoutId === "photo-text" ? (
          <>
            <div className="flex-1 min-h-0 overflow-hidden">
              {p.photos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photos[0]} alt="" className="h-full w-full object-cover" />
                )}
            </div>
            {p.caption && <div className="px-4 py-3 text-center text-xs italic text-slate-500">{p.caption}</div>}
          </>
        ) : (
          <>
            <div className={`grid flex-1 gap-0.5 ${getGridClass(p.layoutId)}`}>
              {p.photos.map((photo, idx) => (
                <div key={idx} className={`overflow-hidden bg-[#f0ede8] ${getSpanClass(p.layoutId, idx)}`}>
                  {photo && <img src={photo} alt="" className="h-full w-full object-cover" />}
                </div>
              ))}
            </div>
            {p.caption && <div className="px-3 py-2 text-center text-[10px] italic text-slate-400">{p.caption}</div>}
          </>
        )}
        {renderTextOverlays(p)}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl" style={{ aspectRatio: "210/297" }}>
        {page && renderPage(page)}
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30">←</button>
        <span className="text-sm text-slate-400">{current + 1} / {total}</span>
        <button onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))} disabled={current === total - 1} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30">→</button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {album.pages.map((p, idx) => (
          <button key={idx} onClick={() => setCurrent(idx)} className={`shrink-0 overflow-hidden rounded border-2 transition ${current === idx ? "border-slate-900" : "border-transparent hover:border-gray-300"}`} style={{ width: 36, height: 50, backgroundColor: p.bgColor || "#fff" }}>
            {p.layoutId === "cover" ? (
              <div className="relative flex h-full items-center justify-center" style={{ backgroundColor: p.bgColor || "#0f172a" }}>
                {p.photos[0] && <img src={p.photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
                <span className="relative text-[6px] text-white/60 font-bold">Couv</span>
              </div>
            ) : p.layoutId === "text-only" ? (
              <div className="flex h-full items-center justify-center"><span className="text-[6px] text-slate-400">Aa</span></div>
            ) : (
              <div className={`grid h-full gap-px ${getGridClass(p.layoutId)}`}>
                {p.photos.map((photo, si) => (
                  <div key={si} className={`overflow-hidden bg-[#f0ede8] ${getSpanClass(p.layoutId, si)}`}>
                    {photo && <img src={photo} alt="" className="h-full w-full object-cover" />}
                  </div>
                ))}
              </div>
            )}
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

  const pageCount = album
    ? album.type === "manual"
      ? album.pages.filter((p) => p.layoutId !== "cover").length
      : Math.ceil((album.photos?.length ?? 0) / 2)
    : INCLUDED_PAGES;

  async function onCheckout(pack: "digital" | "physique" | "duo") {
    setLoadingPack(pack);
    try {
      await redirectToCheckout(pack, pageCount);
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

          {pageCount > INCLUDED_PAGES && (
            <p className="mb-6 text-center text-sm text-slate-500">
              Ton album fait <strong>{pageCount} pages</strong> — {pageCount - INCLUDED_PAGES} pages supplémentaires au-delà des {INCLUDED_PAGES} incluses.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-3">
            {PACKS.map((pack) => {
              const price = calculatePrice(pack.id, pageCount);
              const priceLabel = formatPrice(price);
              return (
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
                  <h3 className={`font-[family-name:var(--font-playfair)] text-xl ${pack.featured ? "text-white" : "text-slate-900"}`}>
                    {pack.name}
                  </h3>
                  <p className={`mt-1 text-sm ${pack.featured ? "text-slate-400" : "text-slate-400"}`}>
                    {pack.desc}
                  </p>
                  <div className="my-4 flex items-end gap-1">
                    <span className={`font-[family-name:var(--font-playfair)] text-3xl ${pack.featured ? "text-white" : "text-slate-900"}`}>
                      {priceLabel}
                    </span>
                    <span className={`mb-0.5 text-xs ${pack.featured ? "text-slate-400" : "text-slate-400"}`}>
                      {pageCount > INCLUDED_PAGES ? `${pageCount} pages` : "paiement unique"}
                    </span>
                  </div>
                  <ul className="mb-6 flex flex-col gap-2">
                    {pack.perks.map((perk) => (
                      <li key={perk} className={`flex items-start gap-2 text-sm ${pack.featured ? "text-slate-300" : "text-slate-600"}`}>
                        <span className={`mt-0.5 shrink-0 ${pack.featured ? "text-slate-400" : "text-slate-300"}`}>✓</span>
                        {perk}
                      </li>
                    ))}
                    <li className={`flex items-start gap-2 text-sm ${pack.featured ? "text-slate-300" : "text-slate-600"}`}>
                      <span className={`mt-0.5 shrink-0 ${pack.featured ? "text-slate-400" : "text-slate-300"}`}>✓</span>
                      {INCLUDED_PAGES} pages incluses{pageCount > INCLUDED_PAGES ? ` + ${pageCount - INCLUDED_PAGES} suppl.` : ""}
                    </li>
                  </ul>
                  <button
                    onClick={() => onCheckout(pack.id)}
                    disabled={loadingPack !== null}
                    className={`mt-auto inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-medium transition disabled:opacity-60 ${
                      pack.featured ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-slate-900 text-white hover:bg-slate-700"
                    }`}
                  >
                    {loadingPack === pack.id ? "Redirection…" : `Commander — ${priceLabel}`}
                  </button>
                </article>
              );
            })}
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
