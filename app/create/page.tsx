"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";
import { calculatePrice, formatPrice } from "@/app/lib/pricing";

// ── Types ─────────────────────────────────────────────────────────────
type Mode = null | "auto" | "manual";
type LayoutId = "cover"|"full"|"two-h"|"two-v"|"three-top"|"three-left"|"grid4"|"photo-text"|"text-only";
type PanelId = "photos"|"layouts"|"colors"|"text";

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
  bgColor: string;
  title: string;
  subtitle: string;
  caption: string;
  texts: TextEl[];
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

const DARK_BG = new Set(["#1e1e1e","#0f172a","#1a1a2e","#4a1942","#0c2340","#7c3aed","#be185d","#0369a1","#15803d","#b45309"]);
const isDark = (c: string) => DARK_BG.has(c);

function getSlotCount(layoutId: LayoutId): number {
  if (layoutId === "cover") return 1;
  return CONTENT_LAYOUTS.find(l => l.id === layoutId)?.slots ?? 0;
}

function makePage(layoutId: LayoutId, overrides: Partial<EditorPage> = {}): EditorPage {
  return {
    layoutId,
    photos: Array(getSlotCount(layoutId)).fill(null),
    bgColor: layoutId === "cover" ? "#0f172a" : "#ffffff",
    title: layoutId === "cover" ? "Mon Album" : "",
    subtitle: "",
    caption: "",
    texts: [],
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

  const fontFamily = el.font === "playfair" ? "var(--font-playfair)" : "var(--font-inter)";

  function startDrag(e: React.MouseEvent) {
    if (editing) return;
    e.preventDefault();
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
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); setLocalText(el.text); }}
    >
      {editing ? (
        <textarea
          autoFocus
          value={localText}
          onChange={e => setLocalText(e.target.value)}
          onBlur={() => { setEditing(false); onUpdate({ text: localText }); }}
          onKeyDown={e => { if (e.key === "Escape") { setEditing(false); onUpdate({ text: localText }); }}}
          onClick={e => e.stopPropagation()}
          style={{ ...textStyle, background: "transparent", border: "none", outline: "none", resize: "none", padding: 0, display: "block" }}
          rows={3}
        />
      ) : (
        <div style={textStyle} className="whitespace-pre-wrap break-words select-none">
          {el.text || <span style={{ opacity: 0.35, fontStyle: "italic", fontSize: Math.max(10, el.size * 0.7) }}>Double-clic pour écrire</span>}
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

// ── Photo Slot ─────────────────────────────────────────────────────────
interface SlotProps {
  photo: string | null;
  isActive: boolean;
  isDragOver: boolean;
  className?: string;
  bgColor: string;
  onClick: () => void;
  onDoubleClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

function Slot({ photo, isActive, isDragOver, className = "", bgColor, onClick, onDoubleClick, onDragOver, onDragLeave, onDrop }: SlotProps) {
  const bg = bgColor === "#ffffff" ? "#f0ede8" : `${bgColor}44`;
  return (
    <div
      className={`relative cursor-pointer overflow-hidden transition-all ${className} ${
        isDragOver ? "ring-4 ring-inset ring-blue-400" : isActive ? "ring-2 ring-inset ring-blue-500" : "hover:brightness-[0.97]"
      }`}
      style={{ backgroundColor: bg }}
      onClick={onClick} onDoubleClick={onDoubleClick}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="h-full w-full object-cover" />
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
    </div>
  );
}

// ── Page Renderer ──────────────────────────────────────────────────────
function PageRenderer({ page, activeSlot, onSlotClick, onSlotDblClick, onSlotDrop }: {
  page: EditorPage; activeSlot: number | null;
  onSlotClick:(i:number)=>void; onSlotDblClick:(i:number)=>void; onSlotDrop:(i:number,s:string)=>void;
}) {
  const [dragOver, setDragOver] = useState<number|null>(null);

  function sp(idx: number, cls = ""): SlotProps {
    return {
      photo: page.photos[idx] ?? null, isActive: activeSlot === idx, isDragOver: dragOver === idx,
      bgColor: page.bgColor, className: cls,
      onClick: () => onSlotClick(idx), onDoubleClick: () => onSlotDblClick(idx),
      onDragOver: e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; setDragOver(idx); },
      onDragLeave: () => setDragOver(null),
      onDrop: e => { e.preventDefault(); const s = e.dataTransfer.getData("application/linstantane-photo"); if (s) onSlotDrop(idx,s); setDragOver(null); },
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
        {has && <img src={page.photos[0]!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35"/>}
        {dragOver===0&&<div className="absolute inset-0 flex items-center justify-center bg-blue-400/20 ring-4 ring-inset ring-blue-400 z-20"><span className="rounded-full bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow">{has?"Remplacer":"Déposer la photo"}</span></div>}
        <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
          {page.subtitle&&<p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${sc}`}>{page.subtitle}</p>}
          <h1 className={`font-[family-name:var(--font-playfair)] text-3xl leading-tight ${tc}`}>{page.title||"Mon Album"}</h1>
          <div className={`h-px w-12 ${dark?"bg-white/25":"bg-slate-300"}`}/>
        </div>
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
function PageThumb({ page, label, isActive, onClick }: { page:EditorPage; label:string; isActive:boolean; onClick:()=>void }) {
  const isCover = page.layoutId === "cover";
  const slots = getSlotCount(page.layoutId);
  const dark = isDark(page.bgColor);
  const gridClass = page.layoutId==="two-v"||page.layoutId==="grid4" ? "grid grid-cols-2" : slots>=2 ? "grid grid-cols-1 grid-rows-2" : "";

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
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
    sessionStorage.setItem("linstantane:album",JSON.stringify({type:"auto",title:autoTitle||"Mon album",subtitle:autoSubtitle,photos:resized}));
    router.push("/result");
  }

  // ── Manual editor state ────────────────────────────────────────────
  const [library, setLibrary] = useState<string[]>([]);
  const [pages, setPages] = useState<EditorPage[]>(DEFAULT_PAGES.map(p=>({...p,texts:[...p.texts]})));
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [activeSlot, setActiveSlot] = useState<number|null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string|null>(null);
  const [openPanel, setOpenPanel] = useState<PanelId|null>("photos");
  const [editingTitle, setEditingTitle] = useState(false);

  const currentPage = pages[currentPageIdx];
  const isCoverPage = currentPage.layoutId === "cover";
  const albumTitle = pages[0].title || "Mon Album";
  const contentPageCount = pages.length - 1;
  const selectedText = selectedTextId ? (currentPage.texts||[]).find(t=>t.id===selectedTextId) ?? null : null;

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
    updateCurrent({photos:currentPage.photos.map((p,i)=>i===slotIdx?src:p)});
    setActiveSlot(null);
  }

  function removeFromSlot(slotIdx: number) {
    updateCurrent({photos:currentPage.photos.map((p,i)=>i===slotIdx?null:p)});
  }

  function addTextElement() {
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
    updateCurrent({texts:(currentPage.texts||[]).filter(t=>t.id!==id)});
    setSelectedTextId(null);
  }

  function changeLayout(layoutId: LayoutId) {
    if (layoutId === "cover") return;
    const n = getSlotCount(layoutId);
    updateCurrent({layoutId,photos:Array.from({length:n},(_,i)=>currentPage.photos[i]??null)});
    setActiveSlot(null);
  }

  function addPage() {
    const idx = pages.length;
    setPages(p=>[...p,makePage("full")]);
    setCurrentPageIdx(idx);
    setActiveSlot(null);
  }

  function duplicatePage(idx: number) {
    const copy = {...pages[idx],photos:[...pages[idx].photos],texts:[...(pages[idx].texts||[])]};
    setPages(p=>[...p.slice(0,idx+1),copy,...p.slice(idx+1)]);
    setCurrentPageIdx(idx+1);
  }

  function removePage(idx: number) {
    if (idx===0||pages.length<=2) return;
    const next = pages.filter((_,i)=>i!==idx);
    setPages(next);
    setCurrentPageIdx(p=>Math.min(p,next.length-1));
    setActiveSlot(null);
  }

  function handleSubmit() {
    sessionStorage.setItem("linstantane:album",JSON.stringify({type:"manual",title:albumTitle,pages}));
    router.push("/result");
  }

  function togglePanel(id: PanelId) { setOpenPanel(p=>p===id?null:id); }

  // ── LANDING ────────────────────────────────────────────────────────
  if (mode === null) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <Nav />
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Étape 1 sur 3</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-slate-900 sm:text-5xl">Comment veux-tu créer<br/>ton album ?</h1>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <button onClick={()=>setMode("auto")} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-left transition hover:border-slate-900 hover:shadow-lg">
              <div className="mb-5 text-4xl">✨</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">Mise en page automatique</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Uploade tes photos, on s&apos;occupe du reste. Mise en page élégante en quelques secondes.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900">Choisir <span className="transition group-hover:translate-x-1">→</span></div>
            </button>
            <button onClick={()=>setMode("manual")} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-left transition hover:border-slate-900 hover:shadow-lg">
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
          <button onClick={()=>setMode(null)} className="mb-8 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-700">← Retour</button>
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
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#e8e5e0] text-slate-900">

      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={()=>setMode(null)} className="text-sm text-slate-400 hover:text-slate-700 transition">← Retour</button>
          <span className="text-gray-200">|</span>
          {editingTitle ? (
            <input autoFocus value={albumTitle} onChange={e=>updatePage(0,{title:e.target.value})} onBlur={()=>setEditingTitle(false)} onKeyDown={e=>e.key==="Enter"&&setEditingTitle(false)} className="border-b border-slate-300 bg-transparent font-[family-name:var(--font-playfair)] text-sm font-bold outline-none"/>
          ) : (
            <button onClick={()=>setEditingTitle(true)} className="font-[family-name:var(--font-playfair)] text-sm font-bold hover:text-slate-500 transition">{albumTitle}</button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-xs text-slate-400">{contentPageCount} page{contentPageCount>1?"s":""}</span>
          <span className="hidden sm:block text-xs text-slate-300">|</span>
          <span className="hidden sm:block text-xs font-semibold text-slate-700">à partir de {formatPrice(calculatePrice("physique",contentPageCount))}</span>
          <button onClick={handleSubmit} className="rounded-full bg-slate-900 px-5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition">Commander →</button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar */}
        <div className="flex border-r border-gray-200 bg-white z-10">
          {/* Icon bar */}
          <div className="flex w-14 flex-col items-center gap-1 border-r border-gray-100 px-1 py-2">
            <SidebarIcon active={openPanel==="photos"}  onClick={()=>togglePanel("photos")}  icon="📸" label="Photos"/>
            <SidebarIcon active={openPanel==="layouts"} onClick={()=>togglePanel("layouts")} label="Mise en page"
              icon={<svg viewBox="0 0 16 16" className="w-5 h-5 fill-current"><rect x="1" y="1" width="6" height="6" rx="0.5"/><rect x="9" y="1" width="6" height="6" rx="0.5"/><rect x="1" y="9" width="6" height="6" rx="0.5"/><rect x="9" y="9" width="6" height="6" rx="0.5"/></svg>}
            />
            <SidebarIcon active={openPanel==="colors"} onClick={()=>togglePanel("colors")} icon="🎨" label="Couleurs"/>
            <SidebarIcon active={openPanel==="text"}   onClick={()=>togglePanel("text")}   icon={<span className="font-bold text-sm">Aa</span>} label="Texte"/>
          </div>

          {/* Panel */}
          {openPanel && (
            <div className="flex w-56 flex-col">
              <div className="flex-1 overflow-y-auto p-3">

                {/* PHOTOS */}
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

                {/* LAYOUTS */}
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

                {/* COLORS */}
                {openPanel==="colors" && (
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Couleur de fond</p>
                    <div className="grid grid-cols-5 gap-2">
                      {BG_COLORS.map(color=>(
                        <button key={color} onClick={()=>updateCurrent({bgColor:color})} title={color} className={`h-8 w-8 rounded-full border-2 transition ${currentPage.bgColor===color?"border-slate-900 scale-110 shadow":"border-gray-200 hover:border-slate-400"}`} style={{backgroundColor:color}}/>
                      ))}
                    </div>
                  </div>
                )}

                {/* TEXT */}
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

                        {/* Font */}
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Police</p>
                        <div className="mb-3 flex gap-1.5">
                          <button onClick={()=>updateCurrentText(selectedText.id,{font:"playfair"})} className={`flex-1 rounded-lg border py-1.5 text-[11px] transition ${selectedText.font==="playfair"?"border-slate-900 bg-slate-50 font-bold":"border-gray-200 hover:border-slate-400"}`} style={{fontFamily:"var(--font-playfair)"}}>Serif</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{font:"inter"})} className={`flex-1 rounded-lg border py-1.5 text-[11px] transition ${selectedText.font==="inter"?"border-slate-900 bg-slate-50 font-bold":"border-gray-200 hover:border-slate-400"}`}>Sans-serif</button>
                        </div>

                        {/* Size */}
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Taille</p>
                        <div className="mb-3 flex flex-wrap gap-1">
                          {FONT_SIZES.map(s=>(
                            <button key={s} onClick={()=>updateCurrentText(selectedText.id,{size:s})} className={`rounded px-2 py-1 text-[10px] transition ${selectedText.size===s?"bg-slate-900 text-white":"bg-gray-100 text-slate-600 hover:bg-slate-200"}`}>{s}</button>
                          ))}
                        </div>

                        {/* Style */}
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Style</p>
                        <div className="mb-3 flex gap-1.5">
                          <button onClick={()=>updateCurrentText(selectedText.id,{bold:!selectedText.bold})} className={`flex-1 rounded-lg border py-1.5 text-sm font-bold transition ${selectedText.bold?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>B</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{italic:!selectedText.italic})} className={`flex-1 rounded-lg border py-1.5 text-sm italic transition ${selectedText.italic?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>I</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{align:"left"})} className={`flex-1 rounded-lg border py-1.5 text-xs transition ${selectedText.align==="left"?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>≡</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{align:"center"})} className={`flex-1 rounded-lg border py-1.5 text-xs transition ${selectedText.align==="center"?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>≡</button>
                          <button onClick={()=>updateCurrentText(selectedText.id,{align:"right"})} className={`flex-1 rounded-lg border py-1.5 text-xs transition ${selectedText.align==="right"?"border-slate-900 bg-slate-50":"border-gray-200 hover:border-slate-400"}`}>≡</button>
                        </div>

                        {/* Color */}
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Couleur</p>
                        <div className="mb-3 grid grid-cols-6 gap-1.5">
                          {TEXT_COLORS.map(c=>(
                            <button key={c} onClick={()=>updateCurrentText(selectedText.id,{color:c})} className={`h-7 w-7 rounded-full border-2 transition ${selectedText.color===c?"border-slate-900 scale-110":"border-gray-200 hover:border-slate-400"}`} style={{backgroundColor:c}}/>
                          ))}
                        </div>

                        {/* Text content */}
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

        {/* Center canvas */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-6">
          <p className="mb-3 text-xs text-slate-500">
            {isCoverPage?"Couverture":`Page ${currentPageIdx}`}
            {" · "}
            <span className="text-slate-400">{contentPageCount} page{contentPageCount>1?"s":""}</span>
          </p>

          <div
            ref={pageRef}
            className="relative overflow-hidden rounded-sm shadow-2xl"
            style={{width:"min(360px, calc(100vw - 340px - 3rem))",aspectRatio:"210/297"}}
            onClick={e=>{if(e.target===pageRef.current||(e.target as HTMLElement).dataset.pagebackdrop){setSelectedTextId(null);setActiveSlot(null);}}}
          >
            <div className="absolute inset-0" data-pagebackdrop="1">
              <PageRenderer
                page={currentPage}
                activeSlot={activeSlot}
                onSlotClick={slotIdx=>{handleSlotClick(slotIdx);}}
                onSlotDblClick={removeFromSlot}
                onSlotDrop={assignToSlot}
              />
            </div>
            {/* Text overlays */}
            {(currentPage.texts||[]).map(el=>(
              <TextElComponent
                key={el.id}
                el={el}
                isSelected={selectedTextId===el.id}
                containerRef={pageRef}
                onSelect={()=>{setSelectedTextId(el.id);setActiveSlot(null);setOpenPanel("text");}}
                onUpdate={u=>updateCurrentText(el.id,u)}
                onDelete={()=>removeCurrentText(el.id)}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3 text-[10px] text-slate-400">
            {library.length===0&&!isCoverPage&&<span>Ajoute des photos à gauche, puis glisse-les sur la page</span>}
            {library.length>0&&activeSlot===null&&getSlotCount(currentPage.layoutId)>0&&!isCoverPage&&<span>Glisse une photo · Double-clic pour supprimer</span>}
            {(currentPage.texts||[]).length===0&&<button onClick={addTextElement} className="flex items-center gap-1 text-blue-400 hover:text-blue-600 transition"><span className="font-bold">Aa</span> Ajouter du texte</button>}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="flex h-24 shrink-0 items-center gap-3 overflow-x-auto border-t border-gray-200 bg-white px-4 pb-1">
        {pages.map((page,idx)=>(
          <PageThumb key={idx} page={page} label={idx===0?"Couverture":`Page ${idx}`} isActive={idx===currentPageIdx} onClick={()=>{setCurrentPageIdx(idx);setActiveSlot(null);setSelectedTextId(null);}}/>
        ))}
        <button onClick={addPage} className="flex shrink-0 flex-col items-center gap-1" title="Ajouter une page">
          <div className="flex items-center justify-center rounded border-2 border-dashed border-gray-200 text-slate-300 hover:border-slate-400 hover:text-slate-500 transition" style={{width:48,height:68}}><span className="text-xl leading-none">+</span></div>
          <span className="text-[9px] text-slate-400">Ajouter</span>
        </button>
      </div>
    </div>
  );
}
