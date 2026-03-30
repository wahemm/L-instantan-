"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { PACKS, calculatePrice, formatPrice, INCLUDED_PAGES } from "@/app/lib/pricing";

// ── Types ──────────────────────────────────────────────────────────────
type LayoutId = string;
interface TextEl { id: string; x: number; y: number; w: number; text: string; size: number; color: string; bold: boolean; italic: boolean; align: "left"|"center"|"right"; font: "playfair"|"inter"; }
interface StickerEl { id: string; emoji: string; x: number; y: number; size: number; }
type EditorPage = { layoutId: LayoutId; photos: (string | null)[]; photoPositions?: {x:number;y:number}[]; caption: string; bgColor: string; title?: string; subtitle?: string; texts?: TextEl[]; stickers?: StickerEl[]; };
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

function renderPage(p: EditorPage, albumTitle: string) {
  const dark = ["#1e1e1e","#0f172a","#1a1a2e","#4a1942","#0c2340","#7c3aed","#be185d","#0369a1","#15803d","#b45309"].includes(p.bgColor||"");

  function textOverlays() {
    return (p.texts||[]).map(el => (
      <div key={el.id} className="absolute pointer-events-none z-10" style={{
        left:`${el.x}%`,top:`${el.y}%`,width:`${el.w}%`,
        fontSize:el.size,color:el.color,
        fontWeight:el.bold?"bold":"normal",fontStyle:el.italic?"italic":"normal",
        textAlign:el.align,fontFamily:el.font==="playfair"?"var(--font-playfair)":"var(--font-inter)",
        lineHeight:1.3,whiteSpace:"pre-wrap",wordBreak:"break-word",
      }}>{el.text}</div>
    ));
  }
  function stickerOverlays() {
    return (p.stickers||[]).map(el => (
      <div key={el.id} className="absolute pointer-events-none z-10 leading-none select-none"
        style={{left:`${el.x}%`,top:`${el.y}%`,fontSize:el.size}}>{el.emoji}</div>
    ));
  }

  if (p.layoutId === "cover") {
    if (p.photos[0]) {
      return (
        <div className="relative h-full w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover" style={{objectPosition:"right center"}}/>
          {textOverlays()}{stickerOverlays()}
        </div>
      );
    }
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden" style={{backgroundColor:p.bgColor||"#0f172a"}}>
        <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
          {p.subtitle&&<p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${dark?"text-white/50":"text-slate-400"}`}>{p.subtitle}</p>}
          <h2 className={`font-[family-name:var(--font-playfair)] text-3xl leading-tight ${dark?"text-white":"text-slate-800"}`}>{p.title||albumTitle}</h2>
          <div className={`h-px w-12 ${dark?"bg-white/25":"bg-slate-300"}`}/>
        </div>
        {textOverlays()}{stickerOverlays()}
      </div>
    );
  }
  if (p.layoutId==="text-only") return (
    <div className="relative flex h-full items-center justify-center p-8" style={{backgroundColor:p.bgColor||"#fff"}}>
      <p className="text-center text-sm italic leading-relaxed text-slate-600">{p.caption}</p>
      {textOverlays()}{stickerOverlays()}
    </div>
  );
  if (p.layoutId==="photo-text") return (
    <div className="relative flex h-full flex-col" style={{backgroundColor:p.bgColor||"#fff"}}>
      <div className="flex-1 min-h-0 overflow-hidden">
        {p.photos[0]&&<img src={p.photos[0]} alt="" className="h-full w-full object-cover" style={{objectPosition:`${p.photoPositions?.[0]?.x??50}% ${p.photoPositions?.[0]?.y??50}%`}}/>}
      </div>
      {p.caption&&<div className="px-4 py-3 text-center text-xs italic text-slate-500">{p.caption}</div>}
      {textOverlays()}{stickerOverlays()}
    </div>
  );
  return (
    <div className="relative flex h-full flex-col" style={{backgroundColor:p.bgColor||"#fff"}}>
      <div className={`grid flex-1 gap-0.5 ${getGridClass(p.layoutId)}`}>
        {p.photos.map((photo,idx)=>(
          <div key={idx} className={`overflow-hidden bg-[#f0ede8] ${getSpanClass(p.layoutId,idx)}`}>
            {photo&&<img src={photo} alt="" className="h-full w-full object-cover" style={{objectPosition:`${p.photoPositions?.[idx]?.x??50}% ${p.photoPositions?.[idx]?.y??50}%`}}/>}
          </div>
        ))}
      </div>
      {p.caption&&<div className="px-3 py-2 text-center text-[10px] italic text-slate-400">{p.caption}</div>}
      {textOverlays()}{stickerOverlays()}
    </div>
  );
}

function ManualBookViewer({ album }: { album: Extract<Album, { type: "manual" }> }) {
  const pages = album.pages;

  type Spread = { label: string; left: EditorPage|null; right: EditorPage|null; leftLabel: string; rightLabel: string; isCover?: boolean };
  const spreads: Spread[] = [];
  spreads.push({ label:"Couverture", left:null, right:pages[0], leftLabel:"Couverture arrière", rightLabel:"Couverture avant", isCover:true });
  for (let i=0; i<Math.ceil((pages.length-1)/2); i++) {
    const leftIdx = i===0 ? null : i*2;
    const rightIdx = i*2+1;
    spreads.push({
      label: i===0 ? "Page 1" : `Pages ${leftIdx}–${rightIdx}`,
      left: leftIdx!==null && leftIdx<pages.length ? pages[leftIdx] : null,
      right: rightIdx<pages.length ? pages[rightIdx] : null,
      leftLabel: i===0 ? "Contre-garde" : leftIdx!==null ? `Page ${leftIdx}` : "",
      rightLabel: rightIdx<pages.length ? `Page ${rightIdx}` : "",
    });
  }

  const [idx, setIdx] = useState(0);
  const cur = spreads[idx]??spreads[0];
  const canPrev = idx>0, canNext = idx<spreads.length-1;

  return (
    <div className="flex h-full flex-col">
      {/* Canvas zone — flex-1 comme dans la modale */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <button onClick={()=>setIdx(p=>Math.max(0,p-1))} disabled={!canPrev}
          className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-xl text-slate-600 hover:bg-gray-50 disabled:opacity-20 transition">‹</button>

        <div className="flex flex-col items-center">
          {cur.isCover && pages[0].photos[0] ? (
            <div className="overflow-hidden rounded shadow-2xl border border-black/10"
              style={{height:"calc(100vh - 340px)",maxWidth:"calc(100vw - 120px)",aspectRatio:"2000/1389"}}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pages[0].photos[0]} alt="" className="h-full w-full object-cover"/>
            </div>
          ) : (
            <div className="flex overflow-hidden rounded shadow-2xl border border-black/10"
              style={{height:"calc(100vh - 340px)",maxWidth:"calc(100vw - 120px)",aspectRatio:"2/1.41"}}>
              <div className="flex-1 overflow-hidden relative" style={{background:cur.isCover?"#1e293b":idx===1?"#2a2a2a":cur.left?.bgColor||"#fff"}}>
                {cur.isCover ? <div className="flex h-full items-center justify-center"><p className="text-[10px] text-white/30">Couverture arrière</p></div>
                : idx===1 ? <div className="flex h-full items-center justify-center"><p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 text-center px-4">Papier de garde</p></div>
                : cur.left ? <div className="relative h-full w-full">{renderPage(cur.left, album.title)}</div>
                : <div className="flex h-full items-center justify-center bg-gray-50"/>}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/15 to-transparent"/>
              </div>
              <div className="w-px shrink-0 bg-black/15"/>
              <div className="flex-1 overflow-hidden relative" style={{background:cur.right?.bgColor||"#fff"}}>
                {cur.right ? <div className="relative h-full w-full">{renderPage(cur.right, album.title)}</div>
                : <div className="flex h-full items-center justify-center bg-gray-50"/>}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/15 to-transparent"/>
              </div>
            </div>
          )}
          <div className="mt-2 flex w-full justify-between px-1 text-[10px] text-slate-400">
            <span>{cur.leftLabel}</span><span>{cur.rightLabel}</span>
          </div>
        </div>

        <button onClick={()=>setIdx(p=>Math.min(spreads.length-1,p+1))} disabled={!canNext}
          className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-xl text-slate-600 hover:bg-gray-50 disabled:opacity-20 transition">›</button>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-center px-4 py-1.5">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <button onClick={()=>setIdx(p=>Math.max(0,p-1))} disabled={!canPrev} className="disabled:opacity-30">‹ Page précédente</button>
            <span className="font-medium text-slate-700">{cur.label}</span>
            <button onClick={()=>setIdx(p=>Math.min(spreads.length-1,p+1))} disabled={!canNext} className="disabled:opacity-30">Page suivante ›</button>
          </div>
        </div>
        <div className="flex items-end gap-2 overflow-x-auto px-4 pb-3">
          {spreads.map((s,i)=>{
            const pg = s.right??s.left;
            return (
              <button key={i} onClick={()=>setIdx(i)} className="flex shrink-0 flex-col items-center gap-1">
                <div className={`overflow-hidden rounded border-2 transition ${idx===i?"border-slate-900 shadow-md":"border-transparent hover:border-gray-300"}`}
                  style={{width:90,height:63,display:"flex",backgroundColor:pg?.bgColor||"#fff"}}>
                  {s.isCover&&pg?.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pg.photos[0]} alt="" className="h-full w-full object-cover"/>
                  ) : (
                    <>
                      <div className="flex-1 overflow-hidden" style={{background:s.isCover?"#1e293b":i===1?"#2a2a2a":s.left?.bgColor||"#f0ede8"}}>
                        {s.left?.photos[0]&&<img src={s.left.photos[0]} alt="" className="h-full w-full object-cover"/>}
                      </div>
                      <div className="w-px bg-black/10 shrink-0"/>
                      <div className="flex-1 overflow-hidden" style={{background:pg?.bgColor||"#f0ede8"}}>
                        {pg?.photos[0]&&<img src={pg.photos[0]} alt="" className="h-full w-full object-cover"/>}
                      </div>
                    </>
                  )}
                </div>
                <span className="text-[8px] text-slate-400 max-w-[94px] truncate text-center">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main result content ────────────────────────────────────────────────
function ResultContent() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<"digital"|"physique"|"duo">("physique");
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("linstantane:album");
      if (raw) setAlbum(JSON.parse(raw) as Album);
      const savedPack = sessionStorage.getItem("linstantane:pack") as "digital"|"physique"|"duo"|null;
      if (savedPack) setSelectedPack(savedPack);
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

  const selectedPackData = PACKS.find(p => p.id === selectedPack)!;
  const selectedPrice = formatPrice(calculatePrice(selectedPack, pageCount));

  return (
    <>
      {success && (
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-6 py-16 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Commande confirmée !
            </h1>
            <p className="mx-auto mt-4 max-w-md text-slate-500">
              Ton paiement a bien été reçu. Ton album est maintenant en cours de fabrication.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
              {[
                { icon: "📦", title: "Fabrication", desc: "Ton album est envoyé en production sous 24h." },
                { icon: "🚚", title: "Livraison", desc: "Reçois ton livre sous 5 à 7 jours ouvrés." },
                { icon: "📧", title: "Confirmation", desc: "Un email de confirmation va t'être envoyé." },
              ].map(step => (
                <div key={step.title} className="flex gap-3 rounded-xl border border-gray-100 p-4">
                  <span className="text-xl">{step.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/shop" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
                Créer un nouvel album
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400">
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-[#f8f7f4] py-8">
            <p className="text-center text-xs text-slate-400">
              Une question ? Contacte-nous à <a href="mailto:contact@linstantane.fr" className="underline hover:text-slate-700">contact@linstantane.fr</a>
            </p>
          </div>
        </div>
      )}

      {/* Sticky order bar */}
      {album && !success && (
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              {PACKS.map(p => {
                const pr = formatPrice(calculatePrice(p.id, pageCount));
                return (
                  <button key={p.id} onClick={() => setSelectedPack(p.id as "digital"|"physique"|"duo")}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${selectedPack===p.id ? "border-slate-900 bg-slate-900 text-white" : "border-gray-200 text-slate-600 hover:border-slate-400"}`}
                  >
                    {p.name} <span className={selectedPack===p.id ? "text-slate-300" : "text-slate-400"}>{pr}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Link href="/create" className="hidden text-xs text-slate-400 hover:text-slate-700 sm:block">← Modifier</Link>
              <button
                onClick={() => onCheckout(selectedPack)}
                disabled={loadingPack !== null}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {loadingPack ? "…" : `Commander — ${selectedPrice}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {!success && <div className="mx-auto max-w-4xl px-6 pt-8">
        {album ? (
          <div className="mb-8 text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl italic text-slate-900 sm:text-4xl">
              Aperçu de ton album
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              {album.type === "manual" ? `${pageCount} page${pageCount > 1 ? "s" : ""}` : ""} · Voici à quoi ressemblera ton livre imprimé.
            </p>
          </div>
        ) : null}
      </div>}

      {/* Viewer pleine largeur */}
      {album && !success && (
        <div className="w-full bg-[#f0eeeb]" style={{height:"calc(100vh - 200px)"}}>
          {album.type === "auto" ? (
            <div className="flex h-full flex-col items-center justify-center py-8 px-6">
              <AutoBookViewer album={album} />
            </div>
          ) : (
            <ManualBookViewer album={album} />
          )}
        </div>
      )}
      {album && (
        <div className="flex justify-center py-4 bg-white border-t border-gray-100">
          <Link href="/create" className="text-sm text-slate-400 transition hover:text-slate-700">← Modifier mon album</Link>
        </div>
      )}

      {!album && (
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mb-6 text-5xl">📖</div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl italic text-slate-900">Aucun album à afficher</h1>
          <p className="mx-auto mt-4 max-w-sm text-slate-500">Commence par créer ton album pour voir l&apos;aperçu ici.</p>
          <Link href="/create" className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700">Créer mon album</Link>
        </div>
      )}

      {!success && <div className="mx-auto max-w-4xl px-6 pb-20">
        {/* Compact pricing section */}
        <section className="mt-16 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-slate-900">
              Commander mon album
            </h2>
            {pageCount > INCLUDED_PAGES && (
              <p className="mt-2 text-sm text-slate-500">
                {pageCount} pages · {pageCount - INCLUDED_PAGES} pages supplémentaires incluses
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PACKS.map((pack) => {
              const price = calculatePrice(pack.id, pageCount);
              const priceLabel = formatPrice(price);
              const isSelected = selectedPack === pack.id;
              return (
                <button
                  key={pack.id}
                  onClick={() => setSelectedPack(pack.id as "digital"|"physique"|"duo")}
                  className={`relative flex flex-col items-center gap-1.5 rounded-xl border py-5 text-center transition ${
                    isSelected ? "border-slate-900 bg-slate-900 text-white shadow-md" : "border-gray-200 text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {pack.featured && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">Populaire</span>
                  )}
                  <span className="text-sm font-semibold">{pack.name}</span>
                  <span className={`text-xs ${isSelected ? "text-slate-300" : "text-slate-400"}`}>{pack.desc}</span>
                  <span className={`font-[family-name:var(--font-playfair)] text-2xl font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>{priceLabel}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => onCheckout(selectedPack)}
            disabled={loadingPack !== null}
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {loadingPack ? "Redirection…" : `Commander — ${selectedPrice}`}
          </button>
          <p className="mt-4 text-center text-xs text-slate-400">
            🔒 Paiement sécurisé Stripe · Satisfait ou remboursé sous 14 jours
          </p>
        </section>
      </div>}
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
