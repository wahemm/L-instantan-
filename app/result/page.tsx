"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/app/components/Nav";
import Link from "next/link";
import { INCLUDED_PAGES } from "@/app/lib/pricing";

// ── Types ──────────────────────────────────────────────────────────────
type LayoutId = string;
interface TextEl { id: string; x: number; y: number; w: number; text: string; size: number; color: string; bold: boolean; italic: boolean; align: "left"|"center"|"right"; font: "playfair"|"inter"; }
interface StickerEl { id: string; emoji: string; x: number; y: number; size: number; }
type EditorPage = { layoutId: LayoutId; photos: (string | null)[]; photoPositions?: {x:number;y:number}[]; caption: string; bgColor: string; title?: string; subtitle?: string; texts?: TextEl[]; stickers?: StickerEl[]; coverHue?: number; };
type Album =
  | { type: "auto"; title: string; subtitle: string; photos: string[] }
  | { type: "manual"; title: string; pages: EditorPage[] };

// ── Price calculation (single product) ────────────────────────────────
const BASE_PRICE = 29;
const EXTRA_PER_PAGE = 0.5;

function calculatePrice(pageCount: number): number {
  const extra = Math.max(0, pageCount - INCLUDED_PAGES);
  return Math.round((BASE_PRICE + extra * EXTRA_PER_PAGE) * 100) / 100;
}

function formatPrice(price: number): string {
  return price % 1 === 0 ? `${price} €` : `${price.toFixed(2).replace(".", ",")} €`;
}

// ── Auto layout: group photos 2 per spread ─────────────────────────────
function AutoBookViewer({ album }: { album: Extract<Album, { type: "auto" }> }) {
  const [current, setCurrent] = useState(0);
  const spreads: (string | null)[][] = [];

  spreads.push([null]); // Cover
  for (let i = 0; i < album.photos.length; i += 2) {
    spreads.push([album.photos[i], album.photos[i + 1] ?? null]);
  }

  const total = spreads.length;
  const spread = spreads[current];
  const isCover = current === 0;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl" style={{ aspectRatio: "3/4" }}>
        {isCover ? (
          <div className="flex h-full flex-col items-center justify-center bg-[#121212] px-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30 mb-3">L&apos;Instantané</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl italic text-white">{album.title}</h2>
            {album.subtitle && <p className="mt-2 text-sm text-white/50">{album.subtitle}</p>}
          </div>
        ) : (
          <div className={`grid h-full gap-0.5 bg-gray-100 ${spread[1] ? "grid-cols-1 grid-rows-2" : "grid-cols-1"}`}>
            {spread.map((photo, idx) =>
              photo ? <img key={idx} src={photo} alt="" className="h-full w-full object-cover" /> : null
            )}
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30">←</button>
        <span className="text-sm text-slate-400">{current + 1} / {total}</span>
        <button onClick={() => setCurrent(c => Math.min(total - 1, c + 1))} disabled={current === total - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-600 transition hover:border-slate-400 disabled:opacity-30">→</button>
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
          <img src={p.photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover" style={{objectPosition:"right center", filter: p.coverHue ? `hue-rotate(${p.coverHue}deg)` : undefined}}/>
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
      <div className={`grid flex-1 min-h-0 gap-0.5 ${getGridClass(p.layoutId)}`}>
        {p.photos.map((photo,idx)=>(
          <div key={idx} className={`overflow-hidden min-h-0 bg-[#f0ede8] ${getSpanClass(p.layoutId,idx)}`}>
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
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <button onClick={()=>setIdx(p=>Math.max(0,p-1))} disabled={!canPrev}
          className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-xl text-slate-600 hover:bg-gray-50 disabled:opacity-20 transition">‹</button>

        <div className="flex flex-col items-center">
          {cur.isCover && pages[0].photos[0] ? (
            <div className="overflow-hidden rounded shadow-2xl border border-black/10"
              style={{height:"calc(100vh - 340px)",maxWidth:"calc(100vw - 120px)",aspectRatio:"2000/1389"}}>
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

// ── Shipping countries ────────────────────────────────────────────────
const SHIPPING_COUNTRIES: { code: string; label: string }[] = [
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "CH", label: "Suisse" },
  { code: "LU", label: "Luxembourg" },
  { code: "MC", label: "Monaco" },
];

// ── Checkout flow with PDF generation & upload ────────────────────────
type CheckoutStep = "idle" | "summary" | "generating-interior" | "generating-cover" | "uploading" | "redirecting";

const STEP_LABELS: Record<CheckoutStep, string> = {
  idle: "",
  summary: "",
  "generating-interior": "Génération des pages intérieures…",
  "generating-cover": "Génération de la couverture…",
  uploading: "Envoi des fichiers…",
  redirecting: "Redirection vers le paiement…",
};

// ── Main result content ────────────────────────────────────────────────
function ResultContent() {
  const [album, setAlbum] = useState<Album | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("idle");
  const [progress, setProgress] = useState<string>("");
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [shippingCountry, setShippingCountry] = useState("FR");
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("linstantane:album");
      if (raw) setAlbum(JSON.parse(raw) as Album);
    } catch { /* nothing */ }
  }, []);

  const pageCount = album
    ? album.type === "manual"
      ? album.pages.filter(p => p.layoutId !== "cover").length
      : Math.ceil((album.photos?.length ?? 0) / 2)
    : INCLUDED_PAGES;

  const price = formatPrice(calculatePrice(pageCount));

  async function onDownloadPDF() {
    if (!album || album.type !== "manual") return;
    const { generateAlbumPDF } = await import("@/app/lib/generatePDF");
    setPdfProgress({ current: 0, total: album.pages.length });
    try {
      const blob = await generateAlbumPDF(
        album.pages, album.title || "Mon Album",
        (current, total) => setPdfProgress({ current, total })
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${album.title || "mon-album"}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally { setPdfProgress(null); }
  }

  async function fetchShippingCost(country: string) {
    setShippingLoading(true);
    try {
      const res = await fetch("/api/lulu/shipping-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageCount: pageCount + (pageCount % 2 !== 0 ? 1 : 0), countryCode: country }),
      });
      if (res.ok) {
        const data = await res.json();
        setShippingCost(data.shippingCost);
      } else {
        setShippingCost(null);
      }
    } catch {
      setShippingCost(null);
    } finally {
      setShippingLoading(false);
    }
  }

  function showSummary() {
    if (!album || album.type !== "manual") return;
    setCheckoutStep("summary");
    fetchShippingCost(shippingCountry);
  }

  async function onCheckout() {
    if (!album || album.type !== "manual") return;

    setCheckoutStep("generating-cover");
    setProgress("Préparation…");

    let interiorUrl = "";
    let coverUrl = "";

    // Try to generate and upload PDFs for Lulu printing
    try {
      const interiorPageCount = album.pages.length - 1;
      const evenPageCount = interiorPageCount % 2 === 0 ? interiorPageCount : interiorPageCount + 1;

      // Cover dimensions (fallback to 24-page defaults)
      let coverWidthPt = 1368;
      let coverHeightPt = 918;
      try {
        const dimsRes = await fetch("/api/lulu/cover-dimensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageCount: evenPageCount }),
        });
        if (dimsRes.ok) {
          const dims = await dimsRes.json();
          const w = parseFloat(dims.width);
          const h = parseFloat(dims.height);
          if (w > 0 && h > 0) { coverWidthPt = w; coverHeightPt = h; }
        }
      } catch { /* use defaults */ }

      setProgress("Génération de la couverture…");
      const { generateLuluCoverPDF, generateLuluInteriorPDF } = await import("@/app/lib/generatePDF");
      const coverBlob = await generateLuluCoverPDF(
        album.pages[0], album.title || "Mon Album",
        coverWidthPt, coverHeightPt
      );

      setCheckoutStep("generating-interior");
      setProgress("Génération des pages…");
      const interiorBlob = await generateLuluInteriorPDF(
        album.pages, album.title || "Mon Album",
        (current, total) => setProgress(`Page ${current}/${total}…`)
      );

      setCheckoutStep("uploading");
      setProgress("Envoi des fichiers…");
      const orderId = `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const formData = new FormData();
      formData.append("interior", new File([interiorBlob], "interior.pdf", { type: "application/pdf" }));
      formData.append("cover", new File([coverBlob], "cover.pdf", { type: "application/pdf" }));
      formData.append("orderId", orderId);

      const uploadRes = await fetch("/api/upload-pdf", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      interiorUrl = uploadData.interiorUrl || "";
      coverUrl = uploadData.coverUrl || "";
    } catch (pdfErr) {
      console.error("PDF generation/upload failed (proceeding to checkout anyway):", pdfErr);
      // Continue to Stripe without PDFs — order will need manual PDF handling
    }

    // Always redirect to Stripe checkout, even without PDFs
    try {
      setCheckoutStep("redirecting");
      setProgress("Redirection vers le paiement…");

      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageCount,
          albumTitle: album.title || "Mon Album",
          interiorUrl,
          coverUrl,
          shippingCents: shippingCost ? Math.round(shippingCost * 100) : 0,
          shippingCountry,
        }),
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error("Pas de lien de paiement");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Impossible de créer la session de paiement. Veuillez réessayer.");
      setCheckoutStep("idle");
      setProgress("");
    }
  }

  const isProcessing = checkoutStep !== "idle" && checkoutStep !== "summary";

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
              Ton paiement a bien été reçu. Ton album est en cours de fabrication et sera livré sous 7 à 10 jours ouvrés.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
              {[
                { icon: "📦", title: "Fabrication", desc: "Ton album est envoyé en production sous 24h." },
                { icon: "🚚", title: "Livraison", desc: "Reçois ton livre sous 7 à 10 jours ouvrés." },
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
              <Link href="/create" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700">
                Créer un nouvel album
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400">
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-100 bg-[#f8f7f4] py-8">
            <p className="text-center text-xs text-slate-400">
              Une question ? Contacte-nous à <a href="mailto:linstantane.officiel@gmail.com" className="underline hover:text-slate-700">linstantane.officiel@gmail.com</a>
            </p>
          </div>
        </div>
      )}

      {/* Order summary modal */}
      {checkoutStep === "summary" && album && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="bg-slate-900 px-6 py-5 text-center">
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-white italic">Récapitulatif</h2>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Album</span>
                  <span className="font-semibold text-slate-900">&ldquo;{album.type === "manual" ? (album.title || "Mon Album") : album.title}&rdquo;</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Format</span>
                  <span className="font-semibold text-slate-900">Hardcover 21×28 cm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Papier</span>
                  <span className="font-semibold text-slate-900">Glacé premium 170 g/m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Pages</span>
                  <span className="font-semibold text-slate-900">{pageCount} pages</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Livraison vers</span>
                    <select
                      value={shippingCountry}
                      onChange={(e) => { setShippingCountry(e.target.value); fetchShippingCost(e.target.value); }}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-semibold text-slate-900 bg-white"
                    >
                      {SHIPPING_COUNTRIES.map(c => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Frais de livraison</span>
                    {shippingLoading ? (
                      <span className="text-slate-400 text-xs">Calcul…</span>
                    ) : shippingCost !== null ? (
                      <span className="font-semibold text-slate-900">{formatPrice(shippingCost)}</span>
                    ) : (
                      <span className="text-red-400 text-xs">Indisponible</span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">Livraison standard 7-10 jours ouvrés</p>
                </div>
                <hr className="border-gray-100" />
                {pageCount > INCLUDED_PAGES && (
                  <div className="space-y-1 text-xs text-slate-400">
                    <div className="flex justify-between">
                      <span>Album {INCLUDED_PAGES} pages incluses</span>
                      <span>29 €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{pageCount - INCLUDED_PAGES} page{pageCount - INCLUDED_PAGES > 1 ? "s" : ""} supplémentaire{pageCount - INCLUDED_PAGES > 1 ? "s" : ""}</span>
                      <span>{formatPrice((pageCount - INCLUDED_PAGES) * 0.5)}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {shippingCost !== null ? formatPrice(calculatePrice(pageCount) + shippingCost) : price}
                  </span>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <button
                  onClick={onCheckout}
                  disabled={shippingLoading || shippingCost === null}
                  className="w-full rounded-full bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
                >
                  {shippingLoading ? "Calcul des frais…" : shippingCost !== null ? `Payer ${formatPrice(calculatePrice(pageCount) + shippingCost)}` : "Frais indisponibles"}
                </button>
                <button
                  onClick={() => setCheckoutStep("idle")}
                  className="w-full rounded-full border border-gray-200 py-3 text-sm font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
                >
                  Annuler
                </button>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-400">
                <span>🔒 Paiement sécurisé Stripe</span>
                <span>·</span>
                <span>Satisfait ou remboursé</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
            <p className="text-sm font-semibold text-slate-900">{STEP_LABELS[checkoutStep]}</p>
            <p className="mt-1 text-xs text-slate-500">{progress}</p>
            <p className="mt-4 text-[10px] text-slate-400">Ne ferme pas cette page</p>
          </div>
        </div>
      )}

      {/* Sticky order bar */}
      {album && !success && (
        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-3">
            <div className="flex items-center gap-3">
              <Link href="/create?restore=true" className="text-xs text-slate-400 hover:text-slate-700">← Modifier</Link>
              {album?.type === "manual" && (
                <button onClick={onDownloadPDF} disabled={pdfProgress !== null}
                  className="hidden items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-400 disabled:opacity-60 sm:flex">
                  {pdfProgress ? `PDF… ${pdfProgress.current}/${pdfProgress.total}` : "⬇ PDF"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{pageCount} pages</span>
              <button onClick={showSummary} disabled={isProcessing}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60">
                Commander — {price}
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

      {/* Viewer */}
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
          <Link href="/create?restore=true" className="text-sm text-slate-400 transition hover:text-slate-700">← Modifier mon album</Link>
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

      {/* Bottom order section */}
      {album && !success && (
        <div className="mx-auto max-w-4xl px-6 pb-20">
          <section className="mt-16 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-6 text-center">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-slate-900">
                Commander mon album
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Hardcover 21×28 cm · Papier glacé premium
              </p>
            </div>
            <div className="mx-auto max-w-sm">
              <div className="rounded-xl border border-gray-100 bg-[#f8f7f4] p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-900">Album Photo Premium</span>
                  <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-slate-900">{price}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Couverture rigide premium</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Papier glacé 170 g/m²</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> {pageCount} pages intérieures</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Livraison en France et Europe</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Livraison sous 7–10 jours ouvrés</li>
                </ul>
              </div>
              <button onClick={showSummary} disabled={isProcessing}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60">
                {isProcessing ? "Préparation…" : `Commander — ${price}`}
              </button>
              <p className="mt-4 text-center text-xs text-slate-400">
                🔒 Paiement sécurisé Stripe · Satisfait ou remboursé sous 14 jours
              </p>
            </div>
          </section>
        </div>
      )}
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
