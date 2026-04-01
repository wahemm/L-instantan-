"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";
import { calculatePrice, formatPrice } from "@/app/lib/pricing";
import { COVER_TEMPLATES as COLOR_TEMPLATES } from "@/app/lib/templates";

// ── Types ─────────────────────────────────────────────────────────────
type Mode = null | "mode-select" | "auto" | "manual";

interface CoverTemplate {
  id: string;
  name: string;
  category: string;
  src: string;
}

const COVER_CATEGORIES = ["Tous", "Voyage", "Couple", "Amis", "Famille", "Mariage", "Bébé"];

const COVER_TEMPLATES: CoverTemplate[] = [
  { id: "espagne",   name: "Espagne",   category: "Voyage", src: "/covers/Espagne.png" },
  { id: "italie",    name: "Italie",    category: "Voyage", src: "/covers/Italie.png" },
  { id: "provence",  name: "Provence",  category: "Voyage", src: "/covers/Provence.png" },
  { id: "bali-1",    name: "Bali",      category: "Voyage", src: "/covers/bali 1.png" },
  { id: "bali-2",    name: "Bali 2",    category: "Voyage", src: "/covers/bali 2.png" },
  { id: "brazil",    name: "Brésil",    category: "Voyage", src: "/covers/brazil.png" },
  { id: "bresil-2",  name: "Brésil 2",  category: "Voyage", src: "/covers/bresil 2.png" },
  { id: "paris",     name: "Paris",     category: "Voyage", src: "/covers/paris.png" },
  { id: "canada",    name: "Canada",    category: "Voyage", src: "/covers/canada.png" },
  { id: "canada-2",  name: "Canada 2",  category: "Voyage", src: "/covers/canada 2.png" },
  { id: "marrakech", name: "Marrakech", category: "Voyage", src: "/covers/Marrakech.png" },
  { id: "mexique",   name: "Mexique",   category: "Voyage", src: "/covers/mexique.png" },
  { id: "miami",     name: "Miami",     category: "Voyage", src: "/covers/Miami.png" },
  { id: "mykonos",   name: "Mykonos",   category: "Voyage", src: "/covers/mykonos.png" },
  { id: "perou",     name: "Pérou",     category: "Voyage", src: "/covers/Perou.png" },
  { id: "amor",      name: "Amor",      category: "Couple", src: "/covers/amor.png" },
];
type LayoutId = "cover"|"full"|"two-h"|"two-v"|"three-top"|"three-left"|"grid4"|"photo-text"|"text-only";
type PanelId = "photos"|"layouts"|"colors"|"text"|"stickers";

interface StickerEl {
  id: string;
  emoji: string;
  x: number;
  y: number;
  size: number;
}

interface TextEl {
  id: string;
  x: number;   // % from left
  y: number;   // % from top
  w: number;   // % width
  text: string;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  align: "left"|"center"|"right";
  font: "playfair"|"inter";
}

interface EditorPage {
  layoutId: LayoutId;
  photos: (string | null)[];
  photoPositions: { x: number; y: number }[];
  bgColor: string;
  title: string;
  subtitle: string;
  caption: string;
  texts: TextEl[];
  stickers: StickerEl[];
}

// ── Constants ──────────────────────────────────────────────────────────
const CONTENT_LAYOUTS: { id: LayoutId; label: string; slots: number }[] = [
  { id:"full",       label:"Pleine page",    slots:1 },
  { id:"two-h",      label:"2 horizontal",   slots:2 },
  { id:"two-v",      label:"2 vertical",     slots:2 },
  { id:"three-top",  label:"Grande + 2 bas", slots:3 },
  { id:"three-left", label:"Grande + 2",     slots:3 },
  { id:"grid4",      label:"Grille 4",       slots:4 },
  { id:"photo-text", label:"Photo + texte",  slots:1 },
  { id:"text-only",  label:"Texte seul",     slots:0 },
];

const BG_COLORS = [
  "#ffffff","#f8f7f4","#fef9f0","#fef3c7","#fde8d8",
  "#fce7f3","#dbeafe","#d1fae5","#f3e8ff","#e0f2fe",
  "#1e1e1e","#0f172a","#1a1a2e","#4a1942","#0c2340",
  "#7c3aed","#be185d","#0369a1","#15803d","#b45309",
];

const TEXT_COLORS = [
  "#1e1e1e","#4a4a4a","#ffffff","#f8f7f4",
  "#7c3aed","#be185d","#0369a1","#15803d",
  "#b45309","#dc2626","#0891b2","#ca8a04",
];

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

const STICKER_CATS: { label: string; items: string[] }[] = [
  { label: "Plage",   items: ["🌊","🏖️","🐚","🦀","🐠","🐬","🌴","☀️","🍹","⛵","🏄","🦞"] },
  { label: "Voyage",  items: ["✈️","🗺️","🧭","🏔️","🎒","📸","🗼","🏝️","🚂","🚢","🌍","🛫"] },
  { label: "Nature",  items: ["🌸","🌺","🌻","🍃","🌿","🦋","🐝","🌈","⛅","🌙","⭐","🍄"] },
  { label: "Fête",    items: ["🎉","🎊","🥂","🎂","🎁","🎈","✨","🎆","🥳","🍾","🎀","🎵"] },
  { label: "Amour",   items: ["❤️","💕","💝","🌹","💏","💌","🫶","🥰","💫","🌷","💑","🎀"] },
  { label: "Animaux", items: ["🐶","🐱","🦊","🐻","🦁","🐯","🦋","🦜","🐬","🦒","🐘","🦓"] },
];

const DARK_BG = new Set(["#1e1e1e","#0f172a","#1a1a2e","#4a1942","#0c2340","#7c3aed","#be185d","#0369a1","#15803d","#b45309"]);
const isDark = (c: string) => DARK_BG.has(c);

function getSlotCount(layoutId: LayoutId): number {
  if (layoutId === "cover") return 1;
  return CONTENT_LAYOUTS.find(l => l.id === layoutId)?.slots ?? 0;
}

function makePage(layoutId: LayoutId, overrides: Partial<EditorPage> = {}): EditorPage {
  const n = getSlotCount(layoutId);
  return {
    layoutId,
    photos: Array(n).fill(null),
    photoPositions: Array(n).fill({ x: 50, y: 50 }),
    bgColor: layoutId === "cover" ? "#0f172a" : "#ffffff",
    title: layoutId === "cover" ? "Mon Album" : "",
    subtitle: "",
    caption: "",
    texts: [],
    stickers: [],
    ...overrides,
  };
}

function makeTextEl(x = 15, y = 35, color = "#1e1e1e"): TextEl {
  return {
    id: `t${Date.now()}${Math.floor(Math.random() * 9999)}`,
    x, y, w: 70,
    text: "",
    size: 22,
    color,
    bold: false, italic: false, align: "center", font: "playfair",
  };
}

const DEFAULT_PAGES: EditorPage[] = [
  makePage("cover", { title: "Mon Album", bgColor: "#0f172a" }),
  makePage("full"),
  makePage("two-h"),
  makePage("grid4"),
  makePage("three-top"),
  makePage("two-v"),
  makePage("photo-text"),
  makePage("full"),
  makePage("text-only"),
];

// ── Image resize ───────────────────────────────────────────────────────
async function resizeImage(file: File, maxSize = 1200): Promise<string> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };
    img.src = url;
  });
}

// ── Layout SVG previews ────────────────────────────────────────────────
function LayoutPreviewIcon({ id }: { id: LayoutId }) {
  const f = "fill-slate-300", g = "fill-slate-200";
  switch (id) {
    case "full":       return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="38" height="54" rx="1" className={f}/></svg>;
    case "two-h":      return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="38" height="26" rx="1" className={f}/><rect x="1" y="29" width="38" height="26" rx="1" className={f}/></svg>;
    case "two-v":      return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="18" height="54" rx="1" className={f}/><rect x="21" y="1" width="18" height="54" rx="1" className={f}/></svg>;
    case "three-top":  return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="38" height="32" rx="1" className={f}/><rect x="1" y="35" width="18" height="20" rx="1" className={f}/><rect x="21" y="35" width="18" height="20" rx="1" className={f}/></svg>;
    case "three-left": return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="20" height="54" rx="1" className={f}/><rect x="23" y="1" width="16" height="26" rx="1" className={f}/><rect x="23" y="29" width="16" height="26" rx="1" className={f}/></svg>;
    case "grid4":      return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="18" height="26" rx="1" className={f}/><rect x="21" y="1" width="18" height="26" rx="1" className={f}/><rect x="1" y="29" width="18" height="26" rx="1" className={f}/><rect x="21" y="29" width="18" height="26" rx="1" className={f}/></svg>;
    case "photo-text": return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="38" height="36" rx="1" className={f}/><rect x="5" y="41" width="30" height="3" rx="1" className={g}/><rect x="8" y="47" width="24" height="2" rx="1" className={g}/></svg>;
    case "text-only":  return <svg viewBox="0 0 40 56" className="w-full h-full"><rect x="1" y="1" width="38" height="54" rx="1" className="fill-slate-100"/><rect x="6" y="22" width="28" height="3" rx="1" className={f}/><rect x="10" y="28" width="20" height="2" rx="1" className={g}/><rect x="13" y="33" width="14" height="2" rx="1" className={g}/></svg>;
    default: return null;
  }
}

// ── Text Element (draggable + resizable) ───────────────────────────────
interface TextElProps {
  el: TextEl;
  isSelected: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onUpdate: (u: Partial<TextEl>) => void;
  onDelete: () => void;
}

function TextElComponent({ el, isSelected, containerRef, onSelect, onUpdate, onDelete }: TextElProps) {
  const [editing, setEditing] = useState(false);
  const [localText, setLocalText] = useState(el.text);
  const elRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastClickRef = useRef<number>(0);

  const fontFamily = el.font === "playfair" ? "var(--font-playfair)" : "var(--font-inter)";

  function startDrag(e: React.MouseEvent) {
    if (editing) return;
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const ox = el.x, oy = el.y;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    function onMove(me: MouseEvent) {
      if (!elRef.current) return;
      const nx = Math.max(0, Math.min(85, ox + ((me.clientX - startX) / rect.width) * 100));
      const ny = Math.max(0, Math.min(90, oy + ((me.clientY - startY) / rect.height) * 100));
      elRef.current.style.left = `${nx}%`;
      elRef.current.style.top = `${ny}%`;
    }
    function onUp(me: MouseEvent) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const nx = Math.max(0, Math.min(85, ox + ((me.clientX - startX) / rect.width) * 100));
      const ny = Math.max(0, Math.min(90, oy + ((me.clientY - startY) / rect.height) * 100));
      onUpdate({ x: nx, y: ny });
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    onSelect();
  }

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const ow = el.w;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    function onMove(me: MouseEvent) {
      if (!elRef.current) return;
      const nw = Math.max(15, Math.min(95, ow + ((me.clientX - startX) / rect.width) * 100));
      elRef.current.style.width = `${nw}%`;
    }
    function onUp(me: MouseEvent) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const nw = Math.max(15, Math.min(95, ow + ((me.clientX - startX) / rect.width) * 100));
      onUpdate({ w: nw });
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  const textStyle: React.CSSProperties = {
    fontSize: el.size,
    color: el.color,
    fontWeight: el.bold ? "bold" : "normal",
    fontStyle: el.italic ? "italic" : "normal",
    textAlign: el.align,
    fontFamily,
    lineHeight: 1.3,
    width: "100%",
  };

  return (
    <div
      ref={elRef}
      className={`absolute z-20 ${editing ? "cursor-text" : "cursor-move"} ${isSelected ? "outline outline-2 outline-offset-1 outline-blue-400" : ""}`}
      style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.w}%` }}
      onMouseDown={startDrag}
      onClick={(e) => {
        e.stopPropagation();
        if (isSelected) { setEditing(true); setLocalText(el.text); textareaRef.current?.focus(); }
        else { onSelect(); }
      }}
      onTouchEnd={(e) => {
        e.preventDefault(); // prevent synthesized mouse events
        e.stopPropagation();
        onSelect();
        setLocalText(el.text);
        setEditing(true);
        textareaRef.current?.focus(); // synchronous focus → keyboard appears on iOS
      }}
    >
      {/* Textarea always in DOM so we can focus() synchronously on iOS */}
      <textarea
        ref={textareaRef}
        value={localText}
        onChange={e => setLocalText(e.target.value)}
        onBlur={() => { setEditing(false); onUpdate({ text: localText }); }}
        onKeyDown={e => { if (e.key === "Escape") { setEditing(false); onUpdate({ text: localText }); }}}
        onClick={e => e.stopPropagation()}
        style={{ ...textStyle, background: "transparent", border: "none", outline: "none", resize: "none", padding: 0, display: editing ? "block" : "none" }}
        rows={3}
      />
      {!editing && (
        <div style={textStyle} className="whitespace-pre-wrap break-words select-none">
          {el.text || <span style={{ opacity: 0.35, fontStyle: "italic", fontSize: Math.max(10, el.size * 0.7) }}>Toucher pour écrire</span>}
        </div>
      )}

      {isSelected && !editing && (
        <>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-2.5 -right-2.5 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow hover:bg-red-600"
          >×</button>
          <div
            className="absolute -bottom-2 -right-2 z-30 h-4 w-4 cursor-se-resize rounded-sm bg-blue-500 shadow"
            onMouseDown={startResize}
          />
        </>
      )}
    </div>
  );
}

// ── Sticker Element (draggable + resizable) ────────────────────────────
function StickerElComponent({ el, isSelected, containerRef, onSelect, onUpdate, onDelete }: {
  el: StickerEl;
  isSelected: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSelect: () => void;
  onUpdate: (u: Partial<StickerEl>) => void;
  onDelete: () => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);

  function startDrag(e: React.MouseEvent) {
    e.stopPropagation();
    const startX = e.clientX, startY = e.clientY;
    const ox = el.x, oy = el.y;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    function onMove(me: MouseEvent) {
      if (!elRef.current) return;
      const nx = Math.max(0, Math.min(90, ox + ((me.clientX - startX) / rect.width) * 100));
      const ny = Math.max(0, Math.min(90, oy + ((me.clientY - startY) / rect.height) * 100));
      elRef.current.style.left = `${nx}%`;
      elRef.current.style.top = `${ny}%`;
    }
    function onUp(me: MouseEvent) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const nx = Math.max(0, Math.min(90, ox + ((me.clientX - startX) / rect.width) * 100));
      const ny = Math.max(0, Math.min(90, oy + ((me.clientY - startY) / rect.height) * 100));
      onUpdate({ x: nx, y: ny });
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    onSelect();
  }

  function startResize(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const os = el.size;
    function onMove(me: MouseEvent) {
      if (!elRef.current) return;
      const ns = Math.max(16, Math.min(180, os + (me.clientX - startX)));
      elRef.current.style.fontSize = `${ns}px`;
    }
    function onUp(me: MouseEvent) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const ns = Math.max(16, Math.min(180, os + (me.clientX - startX)));
      onUpdate({ size: ns });
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  return (
    <div
      ref={elRef}
      className={`absolute z-20 cursor-move select-none leading-none ${isSelected ? "outline outline-2 outline-offset-2 outline-blue-400 rounded-lg" : ""}`}
      style={{ left: `${el.x}%`, top: `${el.y}%`, fontSize: el.size }}
      onMouseDown={startDrag}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {el.emoji}
      {isSelected && (
        <>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDelete(); }}
            className="absolute -top-2.5 -right-2.5 z-30 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow hover:bg-red-600"
          >×</button>
          <div
            className="absolute -bottom-2 -right-2 z-30 h-4 w-4 cursor-se-resize rounded-sm bg-blue-500 shadow"
            onMouseDown={startResize}
          />
        </>
      )}
    </div>
  );
}

// ── Photo Slot ─────────────────────────────────────────────────────────
interface SlotProps {
  photo: string | null;
  isActive: boolean;
  isDragOver: boolean;
  className?: string;
  bgColor: string;
  objectPosition?: { x: number; y: number };
  onClick: () => void;
  onDoubleClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onReposition?: (pos: { x: number; y: number }) => void;
}

function Slot({ photo, isActive, isDragOver, className = "", bgColor, objectPosition, onClick, onDoubleClick, onDragOver, onDragLeave, onDrop, onReposition }: SlotProps) {
  const bg = bgColor === "#ffffff" ? "#f0ede8" : `${bgColor}44`;
  const imgRef = useRef<HTMLImageElement>(null);
  const didReposition = useRef(false);
  const pos = objectPosition ?? { x: 50, y: 50 };

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!photo || !isActive || !onReposition) return;
    didReposition.current = false;
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX, startY = e.clientY;

    function onMove(me: MouseEvent) {
      const dx = me.clientX - startX, dy = me.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didReposition.current = true;
      if (!didReposition.current) return;
      const x = Math.max(0, Math.min(100, ((me.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((me.clientY - rect.top) / rect.height) * 100));
      if (imgRef.current) imgRef.current.style.objectPosition = `${x}% ${y}%`;
    }
    function onUp(me: MouseEvent) {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      if (!didReposition.current) return;
      const x = Math.max(0, Math.min(100, ((me.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((me.clientY - rect.top) / rect.height) * 100));
      onReposition?.({ x, y });
    }
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function handleClick() {
    if (didReposition.current) { didReposition.current = false; return; }
    onClick();
  }

  return (
    <div
      className={`relative overflow-hidden transition-all ${className} ${
        isDragOver ? "ring-4 ring-inset ring-blue-400" : isActive ? "ring-2 ring-inset ring-blue-500" : "hover:brightness-[0.97]"
      } ${isActive && photo ? "cursor-move" : "cursor-pointer"}`}
      style={{ backgroundColor: bg }}
      onClick={handleClick} onDoubleClick={onDoubleClick}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      onMouseDown={handleMouseDown}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={imgRef} src={photo} alt="" className="h-full w-full object-cover" draggable={false}
          style={{ objectPosition: `${pos.x}% ${pos.y}%` }} />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1.5">
          {isDragOver ? <div className="text-3xl text-blue-400">↓</div> : (
            <>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-slate-400 text-sm shadow-sm">+</div>
              <span className="text-[9px] text-slate-400">Glisser ou cliquer</span>
            </>
          )}
        </div>
      )}
      {photo && isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-400/30">
          <span className="rounded-full bg-blue-500 px-2 py-1 text-[10px] font-semibold text-white shadow">Remplacer</span>
        </div>
      )}
      {photo && isActive && !isDragOver && (
        <div className="pointer-events-none absolute bottom-1.5 left-0 right-0 flex justify-center">
          <span className="rounded-full bg-black/50 px-2 py-0.5 text-[9px] text-white">↕ Glisser pour recadrer</span>
        </div>
      )}
    </div>
  );
}

// ── Page Renderer ──────────────────────────────────────────────────────
function PageRenderer({ page, activeSlot, onSlotClick, onSlotDblClick, onSlotDrop, onSlotReposition }: {
  page: EditorPage; activeSlot: number | null;
  onSlotClick:(i:number)=>void; onSlotDblClick:(i:number)=>void; onSlotDrop:(i:number,s:string)=>void;
  onSlotReposition?: (i:number, pos:{x:number,y:number})=>void;
}) {
  const [dragOver, setDragOver] = useState<number|null>(null);

  function sp(idx: number, cls = ""): SlotProps {
    return {
      photo: page.photos[idx] ?? null, isActive: activeSlot === idx, isDragOver: dragOver === idx,
      bgColor: page.bgColor, className: cls,
      objectPosition: page.photoPositions?.[idx] ?? { x: 50, y: 50 },
      onClick: () => onSlotClick(idx), onDoubleClick: () => onSlotDblClick(idx),
      onDragOver: e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; setDragOver(idx); },
      onDragLeave: () => setDragOver(null),
      onDrop: e => { e.preventDefault(); const s = e.dataTransfer.getData("application/linstantane-photo"); if (s) onSlotDrop(idx,s); setDragOver(null); },
      onReposition: onSlotReposition ? (pos) => onSlotReposition(idx, pos) : undefined,
    };
  }

  const dark = isDark(page.bgColor);
  const tc = dark ? "text-white" : "text-slate-800";
  const sc = dark ? "text-white/50" : "text-slate-400";

  if (page.layoutId === "cover") {
    const has = !!page.photos[0];
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden" style={{backgroundColor:page.bgColor}}
        onDragOver={e=>{e.preventDefault();setDragOver(0);}} onDragLeave={()=>setDragOver(null)}
        onDrop={e=>{e.preventDefault();const s=e.dataTransfer.getData("application/linstantane-photo");if(s)onSlotDrop(0,s);setDragOver(null);}}>
        {/* Template Canva : pleine page, moitié droite = couverture avant */}
        {has && <img src={page.photos[0]!} alt="" className="absolute inset-0 h-full w-full object-cover" style={{objectPosition:"right center"}}/>}
        {dragOver===0&&<div className="absolute inset-0 flex items-center justify-center bg-blue-400/20 ring-4 ring-inset ring-blue-400 z-20"><span className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow">{has?"Remplacer":"Déposer la photo"}</span></div>}
        {/* Titre uniquement si pas de template */}
        {!has && (
          <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
            {page.subtitle&&<p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${sc}`}>{page.subtitle}</p>}
            <h1 className={`font-[family-name:var(--font-playfair)] text-3xl leading-tight ${tc}`}>{page.title||"Mon Album"}</h1>
            <div className={`h-px w-12 ${dark?"bg-white/25":"bg-slate-300"}`}/>
          </div>
        )}
        {!has&&dragOver!==0&&<button onClick={()=>onSlotClick(0)} className={`absolute bottom-4 right-4 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition ${dark?"border-white/25 text-white/50 hover:border-white/60":"border-slate-300 text-slate-400 hover:border-slate-500"}`}>+ Photo de fond</button>}
        {has&&<button onClick={()=>onSlotDblClick(0)} className="absolute right-2 top-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] text-white opacity-60 hover:opacity-100 transition">×</button>}
      </div>
    );
  }

  if (page.layoutId === "text-only") return <div className={`flex h-full flex-col items-center justify-center p-10 ${tc}`} style={{backgroundColor:page.bgColor}}><p className="text-center text-sm italic leading-relaxed">{page.caption||"Ajoute un bloc texte via le panneau Texte…"}</p></div>;
  if (page.layoutId === "photo-text") return <div className="flex h-full flex-col" style={{backgroundColor:page.bgColor}}><div className="flex-1 min-h-0"><Slot {...sp(0,"h-full")}/></div><div className={`shrink-0 px-4 py-3 text-center text-xs italic leading-relaxed ${sc}`}>{page.caption||"Légende…"}</div></div>;
  if (page.layoutId === "full") return <div className="flex h-full flex-col" style={{backgroundColor:page.bgColor}}><div className="flex-1"><Slot {...sp(0,"h-full")}/></div>{page.caption&&<div className={`shrink-0 px-3 py-2 text-center text-[10px] italic ${sc}`}>{page.caption}</div>}</div>;
  if (page.layoutId === "two-h") return <div className="grid grid-cols-1 grid-rows-2 h-full gap-0.5" style={{backgroundColor:page.bgColor}}><Slot {...sp(0,"h-full")}/><Slot {...sp(1,"h-full")}/></div>;
  if (page.layoutId === "two-v") return <div className="grid grid-cols-2 h-full gap-0.5" style={{backgroundColor:page.bgColor}}><Slot {...sp(0,"h-full")}/><Slot {...sp(1,"h-full")}/></div>;
  if (page.layoutId === "three-top") return <div className="grid grid-cols-2 grid-rows-[2fr_1fr] h-full gap-0.5" style={{backgroundColor:page.bgColor}}><Slot {...sp(0,"col-span-2 h-full")}/><Slot {...sp(1,"h-full")}/><Slot {...sp(2,"h-full")}/></div>;
  if (page.layoutId === "three-left") return <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5" style={{backgroundColor:page.bgColor}}><Slot {...sp(0,"row-span-2 h-full")}/><Slot {...sp(1,"h-full")}/><Slot {...sp(2,"h-full")}/></div>;
  if (page.layoutId === "grid4") return <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5" style={{backgroundColor:page.bgColor}}>{[0,1,2,3].map(i=><Slot key={i} {...sp(i,"h-full")}/>)}</div>;
  return null;
}

// ── Page Thumbnail ─────────────────────────────────────────────────────
function PageThumb({ page, label, isActive, onClick, onDuplicate, onDelete }: {
  page:EditorPage; label:string; isActive:boolean; onClick:()=>void;
  onDuplicate?:()=>void; onDelete?:()=>void;
}) {
  const isCover = page.layoutId === "cover";
  const slots = getSlotCount(page.layoutId);
  const dark = isDark(page.bgColor);
  const gridClass = page.layoutId==="two-v"||page.layoutId==="grid4" ? "grid grid-cols-2" : slots>=2 ? "grid grid-cols-1 grid-rows-2" : "";

  return (
    <div className="group flex flex-col items-center gap-1 shrink-0">
      <div className="relative">
        <button onClick={onClick} className={`relative overflow-hidden rounded border-2 transition ${isActive?"border-slate-900 shadow-md":"border-transparent hover:border-gray-300"}`} style={{width:48,height:68,backgroundColor:page.bgColor}}>
          {isCover ? (
            <>
              {page.photos[0]&&<img src={page.photos[0]} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30"/>}
              <div className="relative flex h-full items-center justify-center px-1">
                <span className={`text-[6px] font-bold text-center leading-tight ${dark?"text-white/80":"text-slate-600"}`}>{page.title||"Album"}</span>
              </div>
            </>
          ) : slots===0 ? (
            <div className="flex h-full items-center justify-center"><span className={`text-[6px] font-bold ${dark?"text-white/40":"text-slate-300"}`}>Aa</span></div>
          ) : (
            <div className={`${gridClass} h-full gap-px`}>
              {Array.from({length:Math.min(slots,4)}).map((_,si)=>(
                <div key={si} className="overflow-hidden" style={{backgroundColor:page.bgColor==="#ffffff"?"#f0ede8":`${page.bgColor}44`}}>
                  {page.photos[si]&&<img src={page.photos[si]!} alt="" className="h-full w-full object-cover"/>}
                </div>
              ))}
            </div>
          )}
          {/* Text indicator */}
          {(page.texts||[]).length>0&&<div className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-blue-400 shadow"/>}
        </button>
        {/* Hover action buttons */}
        {(onDuplicate||onDelete) && (
          <div className="absolute -top-1.5 -right-1.5 hidden flex-col gap-0.5 group-hover:flex z-10">
            {onDuplicate && (
              <button onClick={e=>{e.stopPropagation();onDuplicate();}} title="Dupliquer"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white shadow text-[8px] text-slate-600 hover:bg-slate-100 border border-gray-200">⧉</button>
            )}
            {onDelete && (
              <button onClick={e=>{e.stopPropagation();onDelete();}} title="Supprimer"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-white shadow text-[8px] text-red-400 hover:bg-red-50 border border-gray-200">×</button>
            )}
          </div>
        )}
      </div>
      <span className="text-[9px] text-slate-400 truncate max-w-[60px] text-center">{label}</span>
    </div>
  );
}

// ── Sidebar icon button ────────────────────────────────────────────────
function SidebarIcon({ active, onClick, icon, label }: { active:boolean; onClick:()=>void; icon:React.ReactNode; label:string }) {
  return (
    <button onClick={onClick} title={label} className={`flex flex-col items-center justify-center gap-0.5 rounded-xl p-2 w-full transition ${active?"bg-slate-100 text-slate-900":"text-slate-400 hover:text-slate-700 hover:bg-slate-50"}`}>
      <span className="text-lg leading-none">{icon}</span>
      <span className="text-[8px] font-medium leading-none mt-0.5">{label}</span>
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────
export default function CreatePage() {
  const router = useRouter();
  const autoInputRef = useRef<HTMLInputElement>(null);
  const editorInputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [coverSearch, setCoverSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [coverTitleInput, setCoverTitleInput] = useState("");

  // ── Auto mode ──────────────────────────────────────────────────────
  const [autoFiles, setAutoFiles] = useState<File[]>([]);
  const [autoPreviews, setAutoPreviews] = useState<string[]>([]);
  const [autoTitle, setAutoTitle] = useState("");
  const [autoSubtitle, setAutoSubtitle] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoDragging, setAutoDragging] = useState(false);

  function addAutoFiles(files: FileList|null) {
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => setAutoPreviews(p=>[...p, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
    setAutoFiles(p=>[...p,...Array.from(files)]);
  }

  async function handleAutoSubmit() {
    if (!autoFiles.length) return;
    setAutoLoading(true);
    const resized = await Promise.all(autoFiles.map(f=>resizeImage(f)));

    // Génère des pages éditables à partir des photos
    const autoPages: EditorPage[] = [
      makePage("cover", {
        title: autoTitle || "Mon Album",
        subtitle: autoSubtitle,
        photos: selectedCover ? [selectedCover] : [],
        bgColor: "#0f172a",
      }),
    ];

    let i = 0;
    while (i < resized.length) {
      const remaining = resized.length - i;
      let layoutId: LayoutId;
      let count: number;

      if (remaining === 1) {
        layoutId = "full"; count = 1;
      } else if (remaining === 2) {
        layoutId = Math.random() > 0.5 ? "two-h" : "two-v"; count = 2;
      } else if (remaining === 3) {
        layoutId = Math.random() > 0.5 ? "three-top" : "three-left"; count = 3;
      } else {
        const r = Math.random();
        if (r < 0.25) { layoutId = "grid4"; count = 4; }
        else if (r < 0.55) { layoutId = Math.random() > 0.5 ? "three-top" : "three-left"; count = 3; }
        else { layoutId = Math.random() > 0.5 ? "two-h" : "two-v"; count = 2; }
      }

      autoPages.push(makePage(layoutId, { photos: resized.slice(i, i + count) }));
      i += count;
    }

    setPages(autoPages);
    setAutoTitle("");
    setAutoSubtitle("");
    setAutoFiles([]);
    setAutoPreviews([]);
    setAutoLoading(false);
    setMode("manual");
  }

  // ── Manual editor state ────────────────────────────────────────────
  const [library, setLibrary] = useState<string[]>([]);
  const [pages, setPages] = useState<EditorPage[]>(DEFAULT_PAGES.map(p=>({...p,texts:[...p.texts]})));

  function enterManualMode(title?: string) {
    setPages(DEFAULT_PAGES.map((p, i) => ({
      ...p,
      texts: [...p.texts],
      ...(i === 0 ? {
        ...(selectedCover ? { photos: [selectedCover], bgColor: "#0f172a" } : {}),
        ...(title ? { title } : {}),
      } : {}),
    })));
    setMode("manual");
  }
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [activeSlot, setActiveSlot] = useState<number|null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string|null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string|null>(null);
  const [activeStickerCat, setActiveStickerCat] = useState("Plage");
  const [showPreview, setShowPreview] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{current:number;total:number}|null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [previewMode, setPreviewMode] = useState<"single"|"all">("single");
  const [openPanel, setOpenPanel] = useState<PanelId|null>("photos");
  const [editingTitle, setEditingTitle] = useState(false);
  const undoStackRef = useRef<EditorPage[][]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Read ?mode=manual and selected template from sessionStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "manual") {
      const templateId = sessionStorage.getItem("linstantane:template");
      sessionStorage.removeItem("linstantane:template");
      const tpl = templateId ? COLOR_TEMPLATES.find(t => t.id === templateId) : null;
      setPages(DEFAULT_PAGES.map((p, i) => ({
        ...p,
        texts: [...p.texts],
        ...(i === 0 && tpl ? { bgColor: tpl.bgColor } : {}),
      })));
      setMode("manual");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (mode !== "manual") return;
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const currentPage = pages[currentPageIdx];
  const isCoverPage = currentPage.layoutId === "cover";
  const albumTitle = pages[0].title || "Mon Album";
  const contentPageCount = pages.length - 1;
  const selectedText = selectedTextId ? (currentPage.texts||[]).find(t=>t.id===selectedTextId) ?? null : null;

  function snapshot() {
    undoStackRef.current = [...undoStackRef.current.slice(-19), pages.map(p=>({...p,photos:[...p.photos],texts:[...(p.texts||[])],stickers:[...(p.stickers||[])]}))];
    setCanUndo(true);
  }
  function undo() {
    const stack = undoStackRef.current;
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    undoStackRef.current = stack.slice(0, -1);
    setCanUndo(undoStackRef.current.length > 0);
    setPages(prev);
  }

  const addLibraryFiles = useCallback(async (files: FileList|null) => {
    if (!files) return;
    const resized = await Promise.all(Array.from(files).map(f=>resizeImage(f)));
    setLibrary(p=>[...p,...resized]);
  }, []);

  function updatePage(idx: number, u: Partial<EditorPage>) { setPages(p=>p.map((pg,i)=>i===idx?{...pg,...u}:pg)); }
  function updateCurrent(u: Partial<EditorPage>) { updatePage(currentPageIdx,u); }

  function handleSlotClick(slotIdx: number) {
    setActiveSlot(p=>p===slotIdx?null:slotIdx);
    setSelectedTextId(null);
    setOpenPanel("photos");
  }

  function assignToSlot(slotIdx: number, src: string) {
    snapshot();
    const positions = [...(currentPage.photoPositions || currentPage.photos.map(()=>({x:50,y:50})))];
    positions[slotIdx] = { x: 50, y: 50 };
    updateCurrent({photos:currentPage.photos.map((p,i)=>i===slotIdx?src:p), photoPositions: positions});
    setActiveSlot(null);
  }

  function handleSlotReposition(slotIdx: number, pos: { x: number; y: number }) {
    const positions = [...(currentPage.photoPositions || currentPage.photos.map(()=>({x:50,y:50})))];
    positions[slotIdx] = pos;
    updateCurrent({ photoPositions: positions });
  }

  function removeFromSlot(slotIdx: number) {
    updateCurrent({photos:currentPage.photos.map((p,i)=>i===slotIdx?null:p)});
  }

  function addTextElement() {
    snapshot();
    const color = isDark(currentPage.bgColor) ? "#ffffff" : "#1e1e1e";
    const el = makeTextEl(15, 35, color);
    updateCurrent({texts:[...(currentPage.texts||[]), el]});
    setSelectedTextId(el.id);
    setActiveSlot(null);
  }

  function updateCurrentText(id: string, u: Partial<TextEl>) {
    updateCurrent({texts:(currentPage.texts||[]).map(t=>t.id===id?{...t,...u}:t)});
  }

  function removeCurrentText(id: string) {
    snapshot();
    updateCurrent({texts:(currentPage.texts||[]).filter(t=>t.id!==id)});
    setSelectedTextId(null);
  }

  function addSticker(emoji: string) {
    snapshot();
    const el: StickerEl = { id: `s${Date.now()}${Math.floor(Math.random()*9999)}`, emoji, x: 30, y: 30, size: 48 };
    updateCurrent({stickers:[...(currentPage.stickers||[]), el]});
    setSelectedStickerId(el.id);
    setSelectedTextId(null);
  }

  function updateCurrentSticker(id: string, u: Partial<StickerEl>) {
    updateCurrent({stickers:(currentPage.stickers||[]).map(s=>s.id===id?{...s,...u}:s)});
  }

  function removeCurrentSticker(id: string) {
    snapshot();
    updateCurrent({stickers:(currentPage.stickers||[]).filter(s=>s.id!==id)});
    setSelectedStickerId(null);
  }

  function changeLayout(layoutId: LayoutId) {
    if (layoutId === "cover") return;
    snapshot();
    const n = getSlotCount(layoutId);
    updateCurrent({layoutId,photos:Array.from({length:n},(_,i)=>currentPage.photos[i]??null)});
    setActiveSlot(null);
  }

  function addPage() {
    snapshot();
    const idx = pages.length;
    setPages(p=>[...p,makePage("full")]);
    setCurrentPageIdx(idx);
    setActiveSlot(null);
  }

  function duplicatePage(idx: number) {
    snapshot();
    const copy = {...pages[idx],photos:[...pages[idx].photos],photoPositions:[...(pages[idx].photoPositions||[])],texts:[...(pages[idx].texts||[])],stickers:[...(pages[idx].stickers||[])]};
    setPages(p=>[...p.slice(0,idx+1),copy,...p.slice(idx+1)]);
    setCurrentPageIdx(idx+1);
  }

  function removePage(idx: number) {
    if (idx===0||pages.length<=2) return;
    snapshot();
    const next = pages.filter((_,i)=>i!==idx);
    setPages(next);
    setCurrentPageIdx(p=>Math.min(p,next.length-1));
    setActiveSlot(null);
  }

  function handleSubmit() {
    sessionStorage.setItem("linstantane:album",JSON.stringify({type:"manual",title:albumTitle,pages}));
    router.push("/result");
  }

  async function handleDownloadPDF() {
    const { generateAlbumPDF } = await import("@/app/lib/generatePDF");
    setPdfProgress({current:0,total:pages.length});
    try {
      const blob = await generateAlbumPDF(
        pages, albumTitle,
        (current,total) => setPdfProgress({current,total})
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${albumTitle||"mon-album"}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } finally {
      setPdfProgress(null);
    }
  }

  function togglePanel(id: PanelId) { setOpenPanel(p=>p===id?null:id); }

  // ── COVER PICKER ──────────────────────────────────────────────────
  if (mode === null) {
    const filtered = COVER_TEMPLATES.filter(t =>
      (activeCategory === "Tous" || t.category === activeCategory) &&
      (coverSearch === "" || t.name.toLowerCase().includes(coverSearch.toLowerCase()))
    );
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <Nav />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Étape 1 sur 3</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Choisis ta couverture</h1>
            <p className="mt-2 text-sm text-slate-500">Sélectionne un design ou continue sans template.</p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un template…"
              value={coverSearch}
              onChange={e => setCoverSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-[#f8f7f4] py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Categories */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {COVER_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  activeCategory === cat
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-gray-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="mb-3 text-4xl">🎨</span>
              <p className="text-sm font-semibold text-slate-700">Bientôt disponible</p>
              <p className="mt-1 text-xs text-slate-400">Ces templates arrivent prochainement.</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map(tpl => {
              const selected = selectedCover === tpl.src;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => { setSelectedCover(p => p === tpl.src ? p : tpl.src); }}
                  className={`group relative overflow-hidden rounded-2xl border-2 bg-white text-left transition-all ${
                    selected
                      ? "border-slate-900 ring-2 ring-slate-900 ring-offset-2 shadow-xl"
                      : "border-gray-200 hover:border-slate-400 hover:shadow-md"
                  }`}
                >
                  {/* Couverture avant = moitié droite de l'export Canva */}
                  <div className="aspect-[3/4] w-full overflow-hidden relative bg-gray-100">
                    <img
                      src={tpl.src}
                      alt={tpl.name}
                      className="absolute top-0 right-0 h-full w-auto max-w-none transition group-hover:scale-105"
                    />
                  </div>
                  {selected && (
                    <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-sm shadow">✓</div>
                  )}
                  <p className="px-2 py-2 text-center text-xs font-medium text-slate-700">{tpl.name}</p>
                </button>
              );
            })}
          </div>

          {/* Title input */}
          <div className="mt-8 mb-4">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">Titre de l&apos;album</label>
            <input
              type="text"
              placeholder="Ex : Italie 2025, Notre Mariage, Été à Marseille…"
              value={coverTitleInput}
              onChange={e => setCoverTitleInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && enterManualMode(coverTitleInput || undefined)}
              className="w-full rounded-2xl border border-gray-200 bg-[#f8f7f4] px-5 py-3.5 text-sm font-[family-name:var(--font-playfair)] outline-none focus:border-slate-400 focus:bg-white transition"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => enterManualMode(coverTitleInput || undefined)}
              className="text-xs text-slate-400 hover:text-slate-600 transition"
            >
              Passer cette étape →
            </button>
            <button
              onClick={() => enterManualMode(coverTitleInput || undefined)}
              className="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {selectedCover ? "Créer mon album →" : "Continuer sans template →"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── MODE SELECTION ─────────────────────────────────────────────────
  if (mode === "mode-select") {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <Nav />
        <div className="mx-auto max-w-4xl px-6 py-16">
          <button onClick={()=>setMode(null)} className="mb-10 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700">← Retour</button>
          {selectedCover && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-gray-200 bg-[#f8f7f4] px-4 py-3">
              <img src={selectedCover} alt="Couverture choisie" className="h-12 w-9 rounded object-cover border border-gray-200"/>
              <div>
                <p className="text-xs font-semibold text-slate-700">Couverture sélectionnée</p>
                <button onClick={()=>setSelectedCover(null)} className="text-xs text-slate-400 hover:text-slate-600">Changer</button>
              </div>
            </div>
          )}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Étape 2 sur 3</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-slate-900 sm:text-5xl">Comment veux-tu créer<br/>ton album ?</h1>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <button onClick={()=>setMode("auto")} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-left transition hover:border-slate-900 hover:shadow-lg">
              <div className="mb-5 text-4xl">✨</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">Mise en page automatique</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Uploade tes photos, on s&apos;occupe du reste. Mise en page élégante en quelques secondes.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900">Choisir <span className="transition group-hover:translate-x-1">→</span></div>
            </button>
            <button onClick={()=>enterManualMode()} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-left transition hover:border-slate-900 hover:shadow-lg">
              <div className="mb-5 text-4xl">🎨</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">Je personnalise moi-même</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Choisis le layout, place tes photos, ajoute du texte où tu veux. Contrôle total.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900">Choisir <span className="transition group-hover:translate-x-1">→</span></div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── AUTO MODE ─────────────────────────────────────────────────────
  if (mode === "auto") {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <Nav />
        <div className="mx-auto max-w-2xl px-6 py-12">
          <button onClick={()=>setMode("mode-select")} className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700">← Retour</button>
          <div className="mb-10 text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">Mise en page automatique</h1>
            <p className="mt-3 text-sm text-slate-500">Uploade tes photos et on s&apos;occupe du reste.</p>
          </div>
          <div onDragOver={e=>{e.preventDefault();setAutoDragging(true);}} onDragLeave={()=>setAutoDragging(false)} onDrop={e=>{e.preventDefault();setAutoDragging(false);addAutoFiles(e.dataTransfer.files);}} onClick={()=>!autoLoading&&autoInputRef.current?.click()} className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-14 transition ${autoDragging?"border-slate-400 bg-slate-50":"border-gray-200 bg-[#f8f7f4] hover:border-slate-300"}`}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-3xl">📸</div>
            <div className="text-center"><p className="font-medium text-slate-700">Glisse tes photos ici ou clique pour sélectionner</p><p className="mt-1 text-xs text-slate-400">JPG, PNG</p></div>
            <input ref={autoInputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={e=>addAutoFiles(e.target.files)}/>
          </div>
          {autoPreviews.length>0&&<div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">{autoPreviews.map((src,idx)=><div key={idx} className="aspect-square overflow-hidden rounded-lg"><img src={src} alt="" className="h-full w-full object-cover"/></div>)}{!autoLoading&&<button onClick={()=>autoInputRef.current?.click()} className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-slate-300 hover:border-slate-300"><span className="text-2xl">+</span></button>}</div>}
          <div className="mt-8 flex flex-col gap-3">
            <input type="text" placeholder="Titre de l'album" value={autoTitle} onChange={e=>setAutoTitle(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-slate-400"/>
            <input type="text" placeholder="Sous-titre (optionnel)" value={autoSubtitle} onChange={e=>setAutoSubtitle(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-slate-400"/>
          </div>
          <button onClick={handleAutoSubmit} disabled={autoFiles.length===0||autoLoading} className="mt-8 w-full rounded-full bg-slate-900 py-4 text-base font-medium text-white transition hover:bg-slate-700 disabled:opacity-40">
            {autoLoading?<span className="flex items-center justify-center gap-3"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>Préparation…</span>:"Voir l'aperçu →"}
          </button>
        </div>
      </main>
    );
  }

  // ── MANUAL EDITOR ─────────────────────────────────────────────────

  // Spread logic (livre standard) :
  //   idx=0 (couverture) → droite  |  idx impair → droite (recto)  |  idx pair >0 → gauche (verso)
  const isActiveRight = currentPageIdx === 0 || currentPageIdx % 2 === 1;
  // Page 1 spéciale : contre-garde à gauche (pas de page[0])
  const isContraGarde = currentPageIdx === 1;
  const spreadLeftIdx: number | null = isActiveRight
    ? (currentPageIdx === 0 || currentPageIdx === 1 ? null : currentPageIdx - 1)
    : currentPageIdx;
  const spreadRightIdx: number | null = isActiveRight
    ? currentPageIdx
    : (currentPageIdx + 1 < pages.length ? currentPageIdx + 1 : null);
  const spreadLeftPage  = spreadLeftIdx  !== null ? pages[spreadLeftIdx]  : null;
  const spreadRightPage = spreadRightIdx !== null ? pages[spreadRightIdx] : null;
  const leftLabel  = currentPageIdx === 0 ? "Couverture arrière" : isContraGarde ? "Contre-garde" : spreadLeftIdx !== null ? `Page ${spreadLeftIdx}` : "";
  const rightLabel = currentPageIdx === 0 ? "Couverture avant"   : spreadRightIdx !== null ? `Page ${spreadRightIdx}` : "";
  const pageW = "min(520px, calc((100vw - 180px) / 2))";

  const ToolIcons = () => <>
    <SidebarIcon active={openPanel==="photos"}   onClick={()=>togglePanel("photos")}   icon="📸" label="Photos"/>
    <SidebarIcon active={openPanel==="layouts"}  onClick={()=>togglePanel("layouts")}  label="Mise en page"
      icon={<svg viewBox="0 0 16 16" className="w-5 h-5 fill-current"><rect x="1" y="1" width="6" height="6" rx="0.5"/><rect x="9" y="1" width="6" height="6" rx="0.5"/><rect x="1" y="9" width="6" height="6" rx="0.5"/><rect x="9" y="9" width="6" height="6" rx="0.5"/></svg>}
    />
    <SidebarIcon active={openPanel==="colors"}   onClick={()=>togglePanel("colors")}   icon="🎨" label="Couleurs"/>
    <SidebarIcon active={openPanel==="text"}     onClick={()=>togglePanel("text")}     icon={<span className="font-bold text-sm">Aa</span>} label="Texte"/>
    <SidebarIcon active={openPanel==="stickers"} onClick={()=>togglePanel("stickers")} icon="✨" label="Stickers"/>
  </>;

  // ── MOBILE EDITOR ──────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-[#e8e5e0] text-slate-900">

        {/* Top bar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 z-10">
          <button onClick={()=>setMode(null)} className="text-sm text-slate-400">← Retour</button>
          {editingTitle
            ? <input autoFocus value={albumTitle} onChange={e=>updatePage(0,{title:e.target.value})} onBlur={()=>setEditingTitle(false)} onKeyDown={e=>e.key==="Enter"&&setEditingTitle(false)} className="border-b border-slate-300 bg-transparent font-[family-name:var(--font-playfair)] text-sm font-bold outline-none max-w-[140px]"/>
            : <button onClick={()=>setEditingTitle(true)} className="font-[family-name:var(--font-playfair)] text-sm font-bold truncate max-w-[140px]">{albumTitle}</button>
          }
          <button onClick={handleSubmit} className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white">Commander</button>
        </div>

        {/* Canvas pleine largeur */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-3">
          <button
            onClick={()=>{setCurrentPageIdx(p=>Math.max(0,p-1));setActiveSlot(null);setSelectedTextId(null);}}
            disabled={currentPageIdx===0}
            className="absolute left-1 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xl text-slate-600 shadow-md disabled:opacity-20 transition">‹</button>

          <div
            ref={pageRef}
            className="relative overflow-hidden shadow-2xl"
            style={{
              width: "100%",
              maxWidth: isCoverPage && currentPage.photos[0] ? "100%" : "calc(100vw - 88px)",
              aspectRatio: isCoverPage && currentPage.photos[0] ? "2000/1389" : "210/297",
            }}
            onClick={e=>{if(e.target===pageRef.current||(e.target as HTMLElement).dataset.pagebackdrop){setSelectedTextId(null);setActiveSlot(null);}}}
          >
            <div className="absolute inset-0" data-pagebackdrop="1">
              <PageRenderer page={currentPage} activeSlot={activeSlot}
                onSlotClick={handleSlotClick} onSlotDblClick={removeFromSlot}
                onSlotDrop={assignToSlot} onSlotReposition={handleSlotReposition}/>
            </div>
            {(currentPage.texts||[]).map(el=>(
              <TextElComponent key={el.id} el={el} isSelected={selectedTextId===el.id} containerRef={pageRef}
                onSelect={()=>{setSelectedTextId(el.id);setSelectedStickerId(null);setActiveSlot(null);setOpenPanel("text");}}
                onUpdate={u=>updateCurrentText(el.id,u)} onDelete={()=>removeCurrentText(el.id)}/>
            ))}
            {(currentPage.stickers||[]).map(el=>(
              <StickerElComponent key={el.id} el={el} isSelected={selectedStickerId===el.id} containerRef={pageRef}
                onSelect={()=>{setSelectedStickerId(el.id);setSelectedTextId(null);setActiveSlot(null);setOpenPanel("stickers");}}
                onUpdate={u=>updateCurrentSticker(el.id,u)} onDelete={()=>removeCurrentSticker(el.id)}/>
            ))}
          </div>

          <button
            onClick={()=>{setCurrentPageIdx(p=>Math.min(pages.length-1,p+1));setActiveSlot(null);setSelectedTextId(null);}}
            disabled={currentPageIdx>=pages.length-1}
            className="absolute right-1 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-xl text-slate-600 shadow-md disabled:opacity-20 transition">›</button>

          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 text-[10px] text-white pointer-events-none">
            {currentPageIdx===0 ? "Couverture" : `Page ${currentPageIdx} / ${pages.length-1}`}
          </span>
        </div>

        {/* Toolbar + panel mobile */}
        <div className="shrink-0 bg-white border-t border-gray-200 z-10">

          {/* Panel dépliable */}
          {openPanel && (
            <div className="max-h-56 overflow-y-auto border-b border-gray-100 p-3">

              {openPanel==="photos" && (
                <div>
                  <button onClick={()=>editorInputRef.current?.click()} className="mb-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white">+ Ajouter des photos</button>
                  <input ref={editorInputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={e=>addLibraryFiles(e.target.files)}/>
                  {library.length===0 ? (
                    <p className="py-2 text-center text-xs text-slate-400">Ajoute tes photos — clique sur un emplacement puis tape une photo pour la placer</p>
                  ) : (
                    <div className="grid grid-cols-5 gap-1.5">
                      {library.map((src,idx)=>(
                        <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg" onClick={()=>activeSlot!==null&&assignToSlot(activeSlot,src)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt="" className={`h-full w-full object-cover ${activeSlot!==null?"brightness-75":""}`}/>
                          <button onClick={e=>{e.stopPropagation();setLibrary(p=>p.filter((_,i)=>i!==idx));}} className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[9px] text-white">×</button>
                        </div>
                      ))}
                      <button onClick={()=>editorInputRef.current?.click()} className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-slate-300"><span className="text-xl">+</span></button>
                    </div>
                  )}
                  {activeSlot!==null&&<p className="mt-2 rounded-xl bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-600">Emplacement {activeSlot+1} actif — tape une photo</p>}
                </div>
              )}

              {openPanel==="layouts" && (
                isCoverPage
                  ? <p className="py-2 text-center text-xs text-slate-400">La couverture a sa propre mise en page.</p>
                  : <div className="grid grid-cols-4 gap-2">
                      {CONTENT_LAYOUTS.map(layout=>(
                        <button key={layout.id} onClick={()=>changeLayout(layout.id)} className={`flex flex-col items-center gap-1 rounded-xl border p-2 transition ${currentPage.layoutId===layout.id?"border-slate-900 bg-slate-50":"border-gray-200"}`}>
                          <div className="h-10 w-7"><LayoutPreviewIcon id={layout.id}/></div>
                          <span className="text-[8px] text-center text-slate-500 leading-tight">{layout.label}</span>
                        </button>
                      ))}
                    </div>
              )}

              {openPanel==="colors" && (
                <div className="grid grid-cols-8 gap-2">
                  {BG_COLORS.map(color=>(
                    <button key={color} onClick={()=>{snapshot();updateCurrent({bgColor:color});}} className={`h-8 w-8 rounded-full border-2 transition ${currentPage.bgColor===color?"border-slate-900 scale-110":"border-gray-200"}`} style={{backgroundColor:color}}/>
                  ))}
                </div>
              )}

              {openPanel==="text" && (
                <div>
                  <button onClick={addTextElement} className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white">+ Ajouter un texte</button>
                  {selectedText && (
                    <div className="space-y-2">
                      <div className="flex gap-1.5">
                        <button onClick={()=>updateCurrentText(selectedText.id,{font:"playfair"})} className={`flex-1 rounded-lg border py-1.5 text-[11px] ${selectedText.font==="playfair"?"border-slate-900 bg-slate-50 font-bold":"border-gray-200"}`} style={{fontFamily:"var(--font-playfair)"}}>Serif</button>
                        <button onClick={()=>updateCurrentText(selectedText.id,{font:"inter"})} className={`flex-1 rounded-lg border py-1.5 text-[11px] ${selectedText.font==="inter"?"border-slate-900 bg-slate-50":"border-gray-200"}`}>Sans</button>
                        <button onClick={()=>updateCurrentText(selectedText.id,{bold:!selectedText.bold})} className={`w-10 rounded-lg border py-1.5 text-sm font-bold ${selectedText.bold?"border-slate-900 bg-slate-50":"border-gray-200"}`}>B</button>
                        <button onClick={()=>updateCurrentText(selectedText.id,{italic:!selectedText.italic})} className={`w-10 rounded-lg border py-1.5 text-sm italic ${selectedText.italic?"border-slate-900 bg-slate-50":"border-gray-200"}`}>I</button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {FONT_SIZES.filter(s=>s>=12&&s<=48).map(s=>(
                          <button key={s} onClick={()=>updateCurrentText(selectedText.id,{size:s})} className={`rounded px-2 py-1 text-[10px] ${selectedText.size===s?"bg-slate-900 text-white":"bg-gray-100 text-slate-600"}`}>{s}</button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {TEXT_COLORS.map(c=>(
                          <button key={c} onClick={()=>updateCurrentText(selectedText.id,{color:c})} className={`h-7 w-7 rounded-full border-2 transition ${selectedText.color===c?"border-slate-900 scale-110":"border-gray-200"}`} style={{backgroundColor:c}}/>
                        ))}
                      </div>
                      <button onClick={()=>removeCurrentText(selectedText.id)} className="text-xs text-red-400 hover:text-red-600">Supprimer ce texte</button>
                    </div>
                  )}
                </div>
              )}

              {openPanel==="stickers" && (
                <div>
                  <div className="mb-2 flex gap-1 overflow-x-auto pb-1">
                    {STICKER_CATS.map(c=>(
                      <button key={c.label} onClick={()=>setActiveStickerCat(c.label)} className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${activeStickerCat===c.label?"border-slate-900 bg-slate-900 text-white":"border-gray-200 text-slate-500"}`}>{c.label}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {(STICKER_CATS.find(c=>c.label===activeStickerCat)?.items||[]).map(emoji=>(
                      <button key={emoji} onClick={()=>addSticker(emoji)} className="flex aspect-square items-center justify-center rounded-lg text-2xl active:scale-90 transition">{emoji}</button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Icônes outils */}
          <div className="flex items-center justify-around px-1 py-1.5 pb-safe">
            <SidebarIcon active={openPanel==="photos"}   onClick={()=>togglePanel("photos")}   icon="📸" label="Photos"/>
            <SidebarIcon active={openPanel==="layouts"}  onClick={()=>togglePanel("layouts")}  label="Layout"
              icon={<svg viewBox="0 0 16 16" className="w-5 h-5 fill-current"><rect x="1" y="1" width="6" height="6" rx="0.5"/><rect x="9" y="1" width="6" height="6" rx="0.5"/><rect x="1" y="9" width="6" height="6" rx="0.5"/><rect x="9" y="9" width="6" height="6" rx="0.5"/></svg>}/>
            <SidebarIcon active={openPanel==="colors"}   onClick={()=>togglePanel("colors")}   icon="🎨" label="Couleurs"/>
            <SidebarIcon active={openPanel==="text"}     onClick={()=>togglePanel("text")}     icon={<span className="font-bold text-sm">Aa</span>} label="Texte"/>
            <SidebarIcon active={openPanel==="stickers"} onClick={()=>togglePanel("stickers")} icon="✨" label="Stickers"/>
            <button onClick={addPage} className="flex flex-col items-center justify-center gap-0.5 rounded-xl p-2 w-full text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition">
              <span className="text-lg leading-none">+</span>
              <span className="text-[8px] font-medium leading-none mt-0.5">Page</span>
            </button>
          </div>
        </div>

      </div>
    );
  }

  // ── DESKTOP EDITOR ─────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#e8e5e0] text-slate-900">

      {/* ── Modale Aperçu ── */}
      {showPreview && (() => {
        // Calcul des spreads : couverture + spreads intérieurs
        type Spread = { label: string; left: EditorPage | null; right: EditorPage | null; leftLabel: string; rightLabel: string; isCover?: boolean };
        const spreads: Spread[] = [];
        // Spread 0 : couverture
        spreads.push({ label: "Couverture", left: null, right: pages[0], leftLabel: "Couverture arrière", rightLabel: "Couverture avant", isCover: true });
        // Spreads intérieurs
        for (let i = 0; i < Math.ceil((pages.length - 1) / 2); i++) {
          const leftIdx = i === 0 ? null : i * 2;
          const rightIdx = i * 2 + 1;
          const leftPg = leftIdx !== null && leftIdx < pages.length ? pages[leftIdx] : null;
          const rightPg = rightIdx < pages.length ? pages[rightIdx] : null;
          spreads.push({
            label: i === 0 ? "Page 1" : `Pages ${leftIdx}–${rightIdx}`,
            left: leftPg, right: rightPg,
            leftLabel: i === 0 ? "Contre-garde" : leftIdx !== null ? `Page ${leftIdx}` : "",
            rightLabel: rightIdx < pages.length ? `Page ${rightIdx}` : "",
          });
        }
        const cur = spreads[previewIdx] ?? spreads[0];
        const canPrev = previewIdx > 0;
        const canNext = previewIdx < spreads.length - 1;

        return (
          <div className="fixed inset-0 z-50 flex flex-col bg-[#f0eeeb]">
            {/* Header */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
              <div className="flex items-center gap-4">
                <span className="font-[family-name:var(--font-playfair)] text-sm font-bold text-slate-900">{albumTitle}</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={()=>setShowPreview(false)} className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 transition">✏️ Modifier</button>
                <button onClick={handleSubmit} className="rounded-full bg-slate-900 px-5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition">Commander →</button>
              </div>
            </div>

            {/* Canvas zone */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              {/* Flèche gauche */}
              <button
                onClick={()=>setPreviewIdx(p=>Math.max(0,p-1))}
                disabled={!canPrev}
                className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-xl text-slate-600 hover:bg-gray-50 disabled:opacity-20 transition"
              >‹</button>

              {/* Spread */}
              <div className="flex flex-col items-center">
                {cur.isCover && pages[0].photos[0] ? (
                  <div className="overflow-hidden rounded shadow-2xl border border-black/10" style={{height:"calc(100vh - 240px)",maxWidth:"calc(100vw - 120px)",aspectRatio:"2000/1389"}}>
                    <img src={pages[0].photos[0]!} alt="" className="h-full w-full object-cover"/>
                  </div>
                ) : (
                  <div className="flex overflow-hidden rounded shadow-2xl border border-black/10" style={{height:"calc(100vh - 240px)",maxWidth:"calc(100vw - 120px)",aspectRatio:"2/1.41"}}>
                    {/* Gauche */}
                    <div className="flex-1 overflow-hidden" style={{background: cur.isCover ? "#1e293b" : (previewIdx===1 ? "#2a2a2a" : cur.left?.bgColor||"#fff")}}>
                      {cur.isCover ? (
                        <div className="flex h-full items-center justify-center"><p className="text-[10px] text-white/30">Couverture arrière</p></div>
                      ) : previewIdx===1 ? (
                        <div className="flex h-full items-center justify-center"><p className="text-[9px] font-semibold uppercase tracking-widest text-white/25 text-center px-4">Papier de garde</p></div>
                      ) : cur.left ? (
                        <div className="relative h-full w-full"><PageRenderer page={cur.left} activeSlot={null} onSlotClick={()=>{}} onSlotDblClick={()=>{}} onSlotDrop={()=>{}}/></div>
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-50"/>
                      )}
                    </div>
                    {/* Spine */}
                    <div className="w-px shrink-0 bg-black/15"/>
                    {/* Droite */}
                    <div className="flex-1 overflow-hidden" style={{background: cur.right?.bgColor||"#fff"}}>
                      {cur.right ? (
                        <div className="relative h-full w-full"><PageRenderer page={cur.right} activeSlot={null} onSlotClick={()=>{}} onSlotDblClick={()=>{}} onSlotDrop={()=>{}}/></div>
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-50"/>
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-2 flex w-full justify-between px-1 text-[10px] text-slate-400">
                  <span>{cur.leftLabel}</span><span>{cur.rightLabel}</span>
                </div>
              </div>

              {/* Flèche droite */}
              <button
                onClick={()=>setPreviewIdx(p=>Math.min(spreads.length-1,p+1))}
                disabled={!canNext}
                className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-xl text-slate-600 hover:bg-gray-50 disabled:opacity-20 transition"
              >›</button>
            </div>

            {/* Bottom bar */}
            <div className="shrink-0 border-t border-gray-200 bg-white">
              <div className="flex items-center justify-between px-4 py-1.5">
                <div className="flex gap-1">
                  <button onClick={()=>setPreviewMode("single")} className={`rounded px-3 py-1 text-[11px] font-medium transition ${previewMode==="single"?"bg-slate-100 text-slate-900":"text-slate-400 hover:text-slate-600"}`}>☰ Une page</button>
                  <button onClick={()=>setPreviewMode("all")} className={`rounded px-3 py-1 text-[11px] font-medium transition ${previewMode==="all"?"bg-slate-100 text-slate-900":"text-slate-400 hover:text-slate-600"}`}>⊞ Toutes les pages</button>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <button onClick={()=>setPreviewIdx(p=>Math.max(0,p-1))} disabled={!canPrev} className="disabled:opacity-30">‹ Page précédente</button>
                  <span className="font-medium text-slate-700">{cur.label}</span>
                  <button onClick={()=>setPreviewIdx(p=>Math.min(spreads.length-1,p+1))} disabled={!canNext} className="disabled:opacity-30">Page suivante ›</button>
                </div>
                <div className="w-32"/>
              </div>
              {/* Thumbnails */}
              <div className="flex items-end gap-2 overflow-x-auto px-4 pb-3">
                {spreads.map((s,i)=>{
                  const pg = s.right ?? s.left;
                  return (
                    <button key={i} onClick={()=>setPreviewIdx(i)} className="flex shrink-0 flex-col items-center gap-1">
                      <div className={`overflow-hidden rounded border-2 transition ${previewIdx===i?"border-slate-900 shadow-md":"border-transparent hover:border-gray-300"}`}
                        style={{width:90,height:63,backgroundColor:pg?.bgColor||"#fff",display:"flex"}}>
                        {s.isCover && pg?.photos[0] ? (
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
                      <span className="text-[8px] text-slate-400 max-w-[64px] truncate text-center">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={()=>setMode("mode-select")} className="text-sm text-slate-400 hover:text-slate-700 transition">← Retour</button>
          <span className="text-gray-200">|</span>
          {editingTitle ? (
            <input autoFocus value={albumTitle} onChange={e=>updatePage(0,{title:e.target.value})} onBlur={()=>setEditingTitle(false)} onKeyDown={e=>e.key==="Enter"&&setEditingTitle(false)} className="border-b border-slate-300 bg-transparent font-[family-name:var(--font-playfair)] text-sm font-bold outline-none"/>
          ) : (
            <button onClick={()=>setEditingTitle(true)} className="font-[family-name:var(--font-playfair)] text-sm font-bold hover:text-slate-500 transition">{albumTitle}</button>
          )}
          {canUndo&&<button onClick={undo} title="Annuler (⌘Z)" className="rounded px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">↩</button>}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs text-slate-400">{contentPageCount} page{contentPageCount>1?"s":""}</span>
          <span className="hidden sm:block text-xs text-slate-300">|</span>
          <span className="hidden sm:block text-xs font-semibold text-slate-700">à partir de {formatPrice(calculatePrice("physique",contentPageCount))}</span>
          <button onClick={handleDownloadPDF} disabled={pdfProgress!==null} title="Télécharger le PDF" className="hidden sm:flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-slate-600 hover:border-slate-400 transition disabled:opacity-50">
            {pdfProgress ? `${pdfProgress.current}/${pdfProgress.total}` : "⬇ PDF"}
          </button>
          <button onClick={()=>{setPreviewIdx(0);setShowPreview(true);}} className="rounded-full border border-gray-200 px-5 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400 transition">👁 Aperçu</button>
          <button onClick={handleSubmit} className="rounded-full bg-slate-900 px-5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition">Commander →</button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar */}
        <div className="flex border-r border-gray-200 bg-white z-10">
          <div className="flex w-14 flex-col items-center gap-1 border-r border-gray-100 px-1 py-2">
            <ToolIcons/>
          </div>
          {openPanel && (
            <div className="flex w-56 flex-col">
              <div className="flex-1 overflow-y-auto p-3">

                {openPanel==="photos" && (
                  <div>
                    <button onClick={()=>editorInputRef.current?.click()} className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition">+ Ajouter des photos</button>
                    <input ref={editorInputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={e=>addLibraryFiles(e.target.files)}/>
                    {library.length===0 ? (
                      <div className="mt-6 text-center"><div className="text-3xl mb-2">📸</div><p className="text-xs text-slate-400 leading-relaxed">Ajoute tes photos puis<br/>glisse-les sur la page</p></div>
                    ) : (
                      <>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{library.length} photo{library.length>1?"s":""}</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {library.map((src,idx)=>(
                            <div key={idx} className="group relative aspect-square cursor-grab overflow-hidden rounded-lg active:cursor-grabbing" draggable onDragStart={e=>{e.dataTransfer.setData("application/linstantane-photo",src);e.dataTransfer.effectAllowed="copy";}}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt="" className={`h-full w-full object-cover transition ${activeSlot!==null?"hover:brightness-75":""}`} onClick={()=>activeSlot!==null&&assignToSlot(activeSlot,src)}/>
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><span className="rounded bg-black/40 px-1 py-0.5 text-[9px] text-white">{activeSlot!==null?"Placer ici":"Glisser"}</span></div>
                              <button onClick={e=>{e.stopPropagation();setLibrary(p=>p.filter((_,i)=>i!==idx));}} className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[9px] text-white opacity-0 group-hover:opacity-100 transition">×</button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {activeSlot!==null&&<div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2"><p className="text-[10px] font-semibold text-blue-600">Emplacement {activeSlot+1} actif</p><p className="text-[10px] text-blue-400">Clique ou glisse une photo</p><button onClick={()=>setActiveSlot(null)} className="mt-1 text-[10px] text-blue-300 hover:text-blue-500">Annuler</button></div>}
                  </div>
                )}

                {openPanel==="layouts" && (
                  <div>
                    {isCoverPage ? <p className="mt-4 text-center text-xs text-slate-400">La couverture a sa propre mise en page.</p> : (
                      <>
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mise en page</p>
                        <div className="grid grid-cols-2 gap-2">
                          {CONTENT_LAYOUTS.map(layout=>(
                            <button key={layout.id} onClick={()=>changeLayout(layout.id)} className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition ${currentPage.layoutId===layout.id?"border-slate-900 bg-slate-50 shadow-sm":"border-gray-200 hover:border-slate-400"}`}>
                              <div className="h-12 w-9"><LayoutPreviewIcon id={layout.id}/></div>
                              <span className="text-[9px] leading-tight text-center text-slate-500">{layout.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {openPanel==="colors" && (
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Couleur de fond</p>
                    <div className="grid grid-cols-5 gap-2">
                      {BG_COLORS.map(color=>(
                        <button key={color} onClick={()=>{snapshot();updateCurrent({bgColor:color});}} title={color} className={`h-8 w-8 rounded-full border-2 transition ${currentPage.bgColor===color?"border-slate-900 scale-110 shadow":"border-gray-200 hover:border-slate-400"}`} style={{backgroundColor:color}}/>
                      ))}
                    </div>
                  </div>
                )}

                {openPanel==="text" && (
                  <div>
                    {isCoverPage ? (
                      <>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Titre de l&apos;album</p>
                        <input value={currentPage.title||""} onChange={e=>updateCurrent({title:e.target.value})} placeholder="Mon Album" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 font-[family-name:var(--font-playfair)]"/>
                        <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sous-titre / date</p>
                        <input value={currentPage.subtitle||""} onChange={e=>updateCurrent({subtitle:e.target.value})} placeholder="Été 2025 · Paris" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-slate-400"/>
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <button onClick={addTextElement} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-xs font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700 transition">
                            + Bloc texte libre
                          </button>
                        </div>
                      </>
                    ) : selectedText ? (
                      <>
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Texte sélectionné</p>
                          <button onClick={()=>{removeCurrentText(selectedText.id);}} className="text-[10px] text-red-400 hover:text-red-600">Supprimer</button>
                        </div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Police</p>
                        <div className="mb-3 flex gap-1.5">
                          <button onClick={()=>updateCurrentText(selectedText.id,{font:"playfair"})} className={`flex-1 rounded-lg border py-1.5 text-[11px] transition ${selectedText.font==="playfair"?"border-slate-900 bg-slate-50 font-bold":"border-gray-200 hover:border-slate-400"}`} style={{fontFamily:"var(--font-playfair)"}}>Serif</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{font:"inter"})} className={`flex-1 rounded-lg border py-1.5 text-[11px] transition ${selectedText.font==="inter"?"border-slate-900 bg-slate-50 font-bold":"border-gray-200 hover:border-slate-400"}`}>Sans-serif</button>
                        </div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Taille</p>
                        <div className="mb-3 flex flex-wrap gap-1">
                          {FONT_SIZES.map(s=>(
                            <button key={s} onClick={()=>updateCurrentText(selectedText.id,{size:s})} className={`rounded px-2 py-1 text-[10px] transition ${selectedText.size===s?"bg-slate-900 text-white":"bg-gray-100 text-slate-600 hover:bg-slate-200"}`}>{s}</button>
                          ))}
                        </div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Style</p>
                        <div className="mb-3 flex gap-1.5">
                          <button onClick={()=>updateCurrentText(selectedText.id,{bold:!selectedText.bold})} className={`flex-1 rounded-lg border py-1.5 text-sm font-bold transition ${selectedText.bold?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>B</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{italic:!selectedText.italic})} className={`flex-1 rounded-lg border py-1.5 text-sm italic transition ${selectedText.italic?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>I</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{align:"left"})} className={`flex-1 rounded-lg border py-1.5 text-xs transition ${selectedText.align==="left"?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>≡</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{align:"center"})} className={`flex-1 rounded-lg border py-1.5 text-xs transition ${selectedText.align==="center"?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>≡</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{align:"right"})} className={`flex-1 rounded-lg border py-1.5 text-xs transition ${selectedText.align==="right"?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>≡</button>
                        </div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Couleur</p>
                        <div className="mb-3 grid grid-cols-6 gap-1.5">
                          {TEXT_COLORS.map(c=>(
                            <button key={c} onClick={()=>updateCurrentText(selectedText.id,{color:c})} className={`h-7 w-7 rounded-full border-2 transition ${selectedText.color===c?"border-slate-900 scale-110":"border-gray-200 hover:border-slate-400"}`} style={{backgroundColor:c}}/>
                          ))}
                        </div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Contenu</p>
                        <textarea value={selectedText.text} onChange={e=>updateCurrentText(selectedText.id,{text:e.target.value})} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-slate-400 resize-none" placeholder="Ton texte ici…"/>
                        <p className="mt-2 text-[10px] text-slate-400">Ou double-clique sur le texte dans la page</p>
                      </>
                    ) : (
                      <>
                        <button onClick={addTextElement} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition">
                          + Ajouter un bloc texte
                        </button>
                        <p className="text-center text-xs text-slate-400 leading-relaxed">Place du texte où tu veux sur la page — titre, légende, date…</p>
                        {(currentPage.texts||[]).length>0 && (
                          <div className="mt-4">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{currentPage.texts.length} bloc{currentPage.texts.length>1?"s":""}</p>
                            {currentPage.texts.map(t=>(
                              <button key={t.id} onClick={()=>{setSelectedTextId(t.id);}} className="mb-1 flex w-full items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 text-left text-[11px] text-slate-600 hover:border-slate-400 transition">
                                <span className="shrink-0 text-slate-300">Aa</span>
                                <span className="truncate">{t.text||"(vide)"}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {!isCoverPage && (
                          <div className="mt-4 border-t border-gray-100 pt-3">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Légende de page</p>
                            <textarea value={currentPage.caption||""} onChange={e=>updateCurrent({caption:e.target.value})} rows={3} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-slate-400 resize-none" placeholder="Légende globale de la page…"/>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                {openPanel==="stickers" && (
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Stickers</p>
                    <div className="mb-3 flex flex-wrap gap-1">
                      {STICKER_CATS.map(c=>(
                        <button key={c.label} onClick={()=>setActiveStickerCat(c.label)} className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${activeStickerCat===c.label?"border-slate-900 bg-slate-900 text-white":"border-gray-200 text-slate-500 hover:border-slate-400"}`}>{c.label}</button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {(STICKER_CATS.find(c=>c.label===activeStickerCat)?.items||[]).map(emoji=>(
                        <button key={emoji} onClick={()=>addSticker(emoji)} title={`Ajouter ${emoji}`}
                          className="flex aspect-square items-center justify-center rounded-xl text-2xl hover:bg-slate-100 active:scale-90 transition">
                          {emoji}
                        </button>
                      ))}
                    </div>
                    <p className="mt-3 text-center text-[10px] text-slate-400">Clique pour ajouter · Glisse pour déplacer</p>
                    {(currentPage.stickers||[]).length>0&&(
                      <div className="mt-3 border-t border-gray-100 pt-3">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{currentPage.stickers.length} sticker{currentPage.stickers.length>1?"s":""} sur cette page</p>
                        {currentPage.stickers.map(s=>(
                          <button key={s.id} onClick={()=>setSelectedStickerId(s.id)} className={`mb-1 flex w-full items-center gap-2 rounded-lg border px-2 py-1.5 text-left transition ${selectedStickerId===s.id?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>
                            <span className="text-lg">{s.emoji}</span>
                            <button onClick={e=>{e.stopPropagation();removeCurrentSticker(s.id);}} className="ml-auto text-[10px] text-red-400 hover:text-red-600">Suppr.</button>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Page actions */}
              <div className="shrink-0 border-t border-gray-100 p-3">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cette page</p>
                <div className="flex gap-2">
                  <button onClick={()=>duplicatePage(currentPageIdx)} className="flex-1 rounded-lg border border-gray-200 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50 transition">Dupliquer</button>
                  {currentPageIdx>0&&pages.length>2&&<button onClick={()=>removePage(currentPageIdx)} className="flex-1 rounded-lg border border-red-200 py-1.5 text-[10px] text-red-500 hover:bg-red-50 transition">Supprimer</button>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Center canvas — Spread view ── */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-4">

          {/* Page navigation */}
          <div className="mb-4 flex items-center gap-5 text-xs">
            <button
              onClick={()=>{
                const prev = currentPageIdx === 0 ? 0 : Math.max(0, isActiveRight ? currentPageIdx - 2 : currentPageIdx - 1);
                setCurrentPageIdx(prev); setActiveSlot(null); setSelectedTextId(null);
              }}
              disabled={currentPageIdx === 0}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition"
            >← Page précédente</button>
            <span className="font-semibold text-slate-700 min-w-[80px] text-center">
              {currentPageIdx === 0 ? "Couverture" : `Page ${currentPageIdx}`}
            </span>
            <button
              onClick={()=>{
                const next = currentPageIdx === 0 ? 1 : isActiveRight ? currentPageIdx + 1 : Math.min(pages.length - 1, currentPageIdx + 2);
                if (next < pages.length) { setCurrentPageIdx(next); setActiveSlot(null); setSelectedTextId(null); }
              }}
              disabled={currentPageIdx >= pages.length - 1 && (isActiveRight || currentPageIdx + 2 >= pages.length)}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 transition"
            >Page suivante →</button>
          </div>

          {/* Spread */}
          {isCoverPage && currentPage.photos[0] ? (
            /* ── Couverture avec template Canva : image complète ── */
            <div className="flex flex-col items-center drop-shadow-2xl">
              <div
                ref={pageRef}
                className="relative overflow-hidden rounded-sm shadow-2xl"
                style={{width:"min(1040px, calc(100vw - 160px))", aspectRatio:"2000/1389"}}
                onClick={e=>{if(e.target===pageRef.current||(e.target as HTMLElement).dataset.pagebackdrop){setSelectedTextId(null);setActiveSlot(null);}}}
              >
                <img src={currentPage.photos[0]!} alt="" className="absolute inset-0 h-full w-full object-cover" data-pagebackdrop="1"/>
                <div className="pointer-events-none absolute" style={{top:"7%",bottom:"7%",left:"3%",right:"53%",border:"1px dashed rgba(100,100,100,0.3)"}}/>
                <div className="pointer-events-none absolute" style={{top:"7%",bottom:"7%",left:"53%",right:"3%",border:"1px dashed rgba(100,100,100,0.3)"}}/>
                {(currentPage.texts||[]).map(el=>(
                  <TextElComponent key={el.id} el={el} isSelected={selectedTextId===el.id} containerRef={pageRef}
                    onSelect={()=>{setSelectedTextId(el.id);setSelectedStickerId(null);setActiveSlot(null);setOpenPanel("text");}}
                    onUpdate={u=>updateCurrentText(el.id,u)} onDelete={()=>removeCurrentText(el.id)}/>
                ))}
                {(currentPage.stickers||[]).map(el=>(
                  <StickerElComponent key={el.id} el={el} isSelected={selectedStickerId===el.id} containerRef={pageRef}
                    onSelect={()=>{setSelectedStickerId(el.id);setSelectedTextId(null);setActiveSlot(null);setOpenPanel("stickers");}}
                    onUpdate={u=>updateCurrentSticker(el.id,u)} onDelete={()=>removeCurrentSticker(el.id)}/>
                ))}
                <button onClick={()=>updateCurrent({photos:[null]})} className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-xs text-white opacity-60 hover:opacity-100 transition">×</button>
                <button onClick={()=>{addTextElement();setOpenPanel("text");}} className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-medium text-white opacity-70 hover:opacity-100 transition backdrop-blur-sm">
                  <span>Aa</span><span>Ajouter du texte</span>
                </button>
              </div>
              <div className="mt-2 flex w-full justify-between px-2 text-[10px] text-slate-400">
                <span>Couverture arrière</span>
                <span>Couverture avant</span>
              </div>
            </div>
          ) : (
            /* ── Spread deux pages ── */
            <div className="flex items-stretch drop-shadow-2xl">

              {/* Left page */}
              <div className="flex flex-col items-center">
                <div
                  ref={!isActiveRight ? pageRef : undefined}
                  className="relative overflow-hidden"
                  style={{width: pageW, aspectRatio:"210/297", cursor: isActiveRight && spreadLeftPage ? "pointer" : "default"}}
                  onClick={e=>{
                    if (isActiveRight && spreadLeftIdx !== null) {
                      setCurrentPageIdx(spreadLeftIdx); setActiveSlot(null); setSelectedTextId(null);
                    } else if (!isActiveRight && (e.target===pageRef.current||(e.target as HTMLElement).dataset.pagebackdrop)) {
                      setSelectedTextId(null); setActiveSlot(null);
                    }
                  }}
                >
                  {spreadLeftPage ? (
                    <>
                      <div className="absolute inset-0" data-pagebackdrop="1">
                        <PageRenderer page={spreadLeftPage} activeSlot={!isActiveRight ? activeSlot : null}
                          onSlotClick={!isActiveRight ? handleSlotClick : ()=>{}}
                          onSlotDblClick={!isActiveRight ? removeFromSlot : ()=>{}}
                          onSlotDrop={!isActiveRight ? assignToSlot : ()=>{}}
                          onSlotReposition={!isActiveRight ? handleSlotReposition : undefined}/>
                      </div>
                      <div className="pointer-events-none absolute" style={{inset:"7%",border:"1px dashed rgba(100,100,100,0.25)"}}/>
                      {!isActiveRight && (currentPage.texts||[]).map(el=>(
                        <TextElComponent key={el.id} el={el} isSelected={selectedTextId===el.id} containerRef={pageRef}
                          onSelect={()=>{setSelectedTextId(el.id);setSelectedStickerId(null);setActiveSlot(null);setOpenPanel("text");}}
                          onUpdate={u=>updateCurrentText(el.id,u)} onDelete={()=>removeCurrentText(el.id)}/>
                      ))}
                      {!isActiveRight && (currentPage.stickers||[]).map(el=>(
                        <StickerElComponent key={el.id} el={el} isSelected={selectedStickerId===el.id} containerRef={pageRef}
                          onSelect={()=>{setSelectedStickerId(el.id);setSelectedTextId(null);setActiveSlot(null);setOpenPanel("stickers");}}
                          onUpdate={u=>updateCurrentSticker(el.id,u)} onDelete={()=>removeCurrentSticker(el.id)}/>
                      ))}
                      {isActiveRight && <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition bg-black/5"><span className="rounded-full bg-black/50 px-3 py-1 text-[10px] text-white">Cliquer pour éditer</span></div>}
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/20 to-transparent"/>
                    </>
                  ) : isContraGarde ? (
                    /* Contre-garde — page derrière la couverture, non modifiable */
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-[#2a2a2a]">
                      <p className="text-[9px] font-semibold uppercase tracking-widest text-white/30 text-center px-6 leading-loose">Cette page ne peut<br/>pas être modifiée</p>
                      <p className="text-[8px] text-white/20 text-center px-6">Papier de garde</p>
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/40 to-transparent"/>
                    </div>
                  ) : (
                    /* Couverture arrière */
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-gray-100">
                      <span className="text-3xl opacity-20">📖</span>
                      <p className="text-[10px] text-gray-400 text-center px-6 leading-relaxed">Couverture arrière</p>
                      <div className="pointer-events-none absolute" style={{inset:"7%",border:"1px dashed rgba(100,100,100,0.2)"}}/>
                      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-black/25 to-transparent"/>
                    </div>
                  )}
                </div>
                {leftLabel && <p className="mt-2 text-[10px] text-slate-400">{leftLabel}</p>}
              </div>

              {/* Spine */}
              <div className="relative shrink-0 overflow-hidden" style={{width:22,background:"linear-gradient(to right,#c8c3bb,#e2ddd7,#f0ede8,#e2ddd7,#c8c3bb)"}}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rotate-90 whitespace-nowrap text-[8px] font-semibold tracking-[0.35em] uppercase text-gray-500">{albumTitle}</span>
                </div>
                <div className="absolute inset-y-0 left-0 w-px bg-black/10"/>
                <div className="absolute inset-y-0 right-0 w-px bg-black/10"/>
              </div>

              {/* Right page */}
              <div className="flex flex-col items-center">
                <div
                  ref={isActiveRight ? pageRef : undefined}
                  className="relative overflow-hidden"
                  style={{width: pageW, aspectRatio:"210/297", cursor: !isActiveRight && spreadRightPage ? "pointer" : "default"}}
                  onClick={e=>{
                    if (!isActiveRight && spreadRightIdx !== null) {
                      setCurrentPageIdx(spreadRightIdx); setActiveSlot(null); setSelectedTextId(null);
                    } else if (isActiveRight && (e.target===pageRef.current||(e.target as HTMLElement).dataset.pagebackdrop)) {
                      setSelectedTextId(null); setActiveSlot(null);
                    }
                  }}
                >
                  {spreadRightPage ? (
                    <>
                      <div className="absolute inset-0" data-pagebackdrop="1">
                        <PageRenderer page={spreadRightPage} activeSlot={isActiveRight ? activeSlot : null}
                          onSlotClick={isActiveRight ? handleSlotClick : ()=>{}}
                          onSlotDblClick={isActiveRight ? removeFromSlot : ()=>{}}
                          onSlotDrop={isActiveRight ? assignToSlot : ()=>{}}
                          onSlotReposition={isActiveRight ? handleSlotReposition : undefined}/>
                      </div>
                      <div className="pointer-events-none absolute" style={{inset:"7%",border:"1px dashed rgba(100,100,100,0.25)"}}/>
                      {isActiveRight && (currentPage.texts||[]).map(el=>(
                        <TextElComponent key={el.id} el={el} isSelected={selectedTextId===el.id} containerRef={pageRef}
                          onSelect={()=>{setSelectedTextId(el.id);setSelectedStickerId(null);setActiveSlot(null);setOpenPanel("text");}}
                          onUpdate={u=>updateCurrentText(el.id,u)} onDelete={()=>removeCurrentText(el.id)}/>
                      ))}
                      {isActiveRight && (currentPage.stickers||[]).map(el=>(
                        <StickerElComponent key={el.id} el={el} isSelected={selectedStickerId===el.id} containerRef={pageRef}
                          onSelect={()=>{setSelectedStickerId(el.id);setSelectedTextId(null);setActiveSlot(null);setOpenPanel("stickers");}}
                          onUpdate={u=>updateCurrentSticker(el.id,u)} onDelete={()=>removeCurrentSticker(el.id)}/>
                      ))}
                      {!isActiveRight && <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition bg-black/5"><span className="rounded-full bg-black/50 px-3 py-1 text-[10px] text-white">Cliquer pour éditer</span></div>}
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent"/>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-50">
                      <p className="text-[10px] text-gray-300">Page vide</p>
                      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/20 to-transparent"/>
                    </div>
                  )}
                </div>
                {rightLabel && <p className="mt-2 text-[10px] text-slate-400">{rightLabel}</p>}
              </div>

            </div>
          )}


          {/* Hint */}
          <div className="mt-4 flex items-center gap-3 text-[10px] text-slate-400">
            {library.length===0&&!isCoverPage&&<span>Ajoute des photos à gauche puis glisse-les sur la page active</span>}
            {(currentPage.texts||[]).length===0&&<button onClick={addTextElement} className="flex items-center gap-1 text-blue-400 hover:text-blue-600 transition"><span className="font-bold">Aa</span> Ajouter du texte</button>}
          </div>
        </div>

        {/* Right icon toolbar */}
        <div className="flex w-14 shrink-0 flex-col items-center gap-1 border-l border-gray-200 bg-white px-1 py-2">
          <ToolIcons/>
        </div>

      </div>

      {/* Bottom strip */}
      <div className="flex h-24 shrink-0 items-center gap-2 overflow-x-auto border-t border-gray-200 bg-white px-4 pb-1">
        {pages.map((page,idx)=>(
          <PageThumb
            key={idx}
            page={page}
            label={idx===0?"Couverture":`Page ${idx}`}
            isActive={idx===currentPageIdx || idx===spreadLeftIdx || idx===spreadRightIdx}
            onClick={()=>{setCurrentPageIdx(idx);setActiveSlot(null);setSelectedTextId(null);}}
            onDuplicate={idx>0?()=>duplicatePage(idx):undefined}
            onDelete={idx>0&&pages.length>2?()=>removePage(idx):undefined}
          />
        ))}
        <button onClick={addPage} className="flex shrink-0 flex-col items-center gap-1" title="Ajouter une page">
          <div className="flex items-center justify-center rounded border-2 border-dashed border-gray-200 text-slate-300 hover:border-slate-400 hover:text-slate-500 transition" style={{width:48,height:68}}><span className="text-xl leading-none">+</span></div>
          <span className="text-[9px] text-slate-400">Ajouter</span>
        </button>
      </div>

    </div>
  );
}
