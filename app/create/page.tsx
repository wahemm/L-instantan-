"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";

// ── Types ─────────────────────────────────────────────────────────────
type Mode = null | "auto" | "manual";
type LayoutId = "full" | "two-h" | "two-v" | "three-top" | "three-left" | "grid4" | "text-only" | "photo-text";
type EditorPage = {
  layoutId: LayoutId;
  photos: (string | null)[];
  caption: string;
  bgColor: string;
};

const LAYOUTS: { id: LayoutId; label: string; slots: number; icon: React.ReactNode }[] = [
  { id: "full", label: "1 photo pleine page", slots: 1, icon: <LayoutIcon type="full" /> },
  { id: "two-h", label: "2 photos horizontales", slots: 2, icon: <LayoutIcon type="two-h" /> },
  { id: "two-v", label: "2 photos verticales", slots: 2, icon: <LayoutIcon type="two-v" /> },
  { id: "three-top", label: "1 grande + 2 petites", slots: 3, icon: <LayoutIcon type="three-top" /> },
  { id: "three-left", label: "1 grande + 2 droite", slots: 3, icon: <LayoutIcon type="three-left" /> },
  { id: "grid4", label: "Grille 4 photos", slots: 4, icon: <LayoutIcon type="grid4" /> },
  { id: "photo-text", label: "Photo + texte", slots: 1, icon: <LayoutIcon type="photo-text" /> },
  { id: "text-only", label: "Texte seul", slots: 0, icon: <LayoutIcon type="text-only" /> },
];

const BG_COLORS = [
  "#ffffff", "#f8f7f4", "#fef3c7", "#fce7f3", "#dbeafe",
  "#d1fae5", "#f3e8ff", "#1e1e1e", "#0f172a", "#7c3aed",
];

// ── Layout icon mini-preview ──────────────────────────────────────────
function LayoutIcon({ type }: { type: LayoutId }) {
  const base = "w-full h-full rounded-sm";
  const bg = "bg-slate-300";
  switch (type) {
    case "full":
      return <div className="grid grid-cols-1 h-full gap-0.5"><div className={`${base} ${bg}`} /></div>;
    case "two-h":
      return <div className="grid grid-cols-1 grid-rows-2 h-full gap-0.5"><div className={`${base} ${bg}`} /><div className={`${base} ${bg}`} /></div>;
    case "two-v":
      return <div className="grid grid-cols-2 grid-rows-1 h-full gap-0.5"><div className={`${base} ${bg}`} /><div className={`${base} ${bg}`} /></div>;
    case "three-top":
      return <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5"><div className={`${base} ${bg} col-span-2`} /><div className={`${base} ${bg}`} /><div className={`${base} ${bg}`} /></div>;
    case "three-left":
      return <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5"><div className={`${base} ${bg} row-span-2`} /><div className={`${base} ${bg}`} /><div className={`${base} ${bg}`} /></div>;
    case "grid4":
      return <div className="grid grid-cols-2 grid-rows-2 h-full gap-0.5"><div className={`${base} ${bg}`} /><div className={`${base} ${bg}`} /><div className={`${base} ${bg}`} /><div className={`${base} ${bg}`} /></div>;
    case "photo-text":
      return <div className="grid grid-cols-1 grid-rows-2 h-full gap-0.5"><div className={`${base} ${bg}`} /><div className={`${base} bg-slate-200 flex items-center justify-center`}><span className="text-[5px] text-slate-400">Aa</span></div></div>;
    case "text-only":
      return <div className="flex items-center justify-center h-full bg-slate-100 rounded-sm"><span className="text-[6px] font-bold text-slate-400">Aa</span></div>;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────
async function resizeImage(file: File, maxSize = 1200): Promise<string> {
  return new Promise((resolve) => {
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

function newPage(layoutId: LayoutId = "full"): EditorPage {
  const layout = LAYOUTS.find((l) => l.id === layoutId)!;
  return { layoutId, photos: Array(layout.slots).fill(null), caption: "", bgColor: "#ffffff" };
}

function getSlotCount(layoutId: LayoutId): number {
  return LAYOUTS.find((l) => l.id === layoutId)!.slots;
}

// ── Page Renderer (center panel) ──────────────────────────────────────
function PageRenderer({
  page,
  activeSlot,
  onSlotClick,
}: {
  page: EditorPage;
  activeSlot: number | null;
  onSlotClick: (idx: number) => void;
}) {
  const slots = getSlotCount(page.layoutId);

  function renderSlot(idx: number, className = "") {
    const photo = page.photos[idx];
    const isActive = activeSlot === idx;
    return (
      <div
        key={idx}
        onClick={() => onSlotClick(idx)}
        className={`relative cursor-pointer overflow-hidden transition ${className} ${
          isActive ? "ring-2 ring-inset ring-blue-500" : "hover:brightness-[0.97]"
        }`}
        style={{ backgroundColor: page.bgColor === "#ffffff" ? "#f0ede8" : `${page.bgColor}33` }}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-slate-400 text-sm">+</div>
            <span className="text-[10px] text-slate-400">Photo</span>
          </div>
        )}
      </div>
    );
  }

  const isDark = page.bgColor === "#1e1e1e" || page.bgColor === "#0f172a";
  const textColor = isDark ? "text-white/70" : "text-slate-600";

  return (
    <div className="flex h-full flex-col" style={{ backgroundColor: page.bgColor }}>
      {page.layoutId === "text-only" ? (
        <div className={`flex flex-1 items-center justify-center p-8 ${textColor}`}>
          <p className="text-center text-sm italic leading-relaxed">
            {page.caption || "Clique pour ajouter du texte..."}
          </p>
        </div>
      ) : page.layoutId === "photo-text" ? (
        <>
          <div className="flex-1 min-h-0">{renderSlot(0, "h-full")}</div>
          <div className={`px-4 py-3 text-center text-xs italic leading-relaxed ${textColor}`}>
            {page.caption || "Ajoute une légende..."}
          </div>
        </>
      ) : page.layoutId === "full" ? (
        <div className="flex-1">{renderSlot(0, "h-full")}</div>
      ) : page.layoutId === "two-h" ? (
        <div className="grid grid-cols-1 grid-rows-2 flex-1 gap-0.5">{[0, 1].map((i) => renderSlot(i))}</div>
      ) : page.layoutId === "two-v" ? (
        <div className="grid grid-cols-2 grid-rows-1 flex-1 gap-0.5">{[0, 1].map((i) => renderSlot(i))}</div>
      ) : page.layoutId === "three-top" ? (
        <div className="grid grid-cols-2 grid-rows-[2fr_1fr] flex-1 gap-0.5">
          {renderSlot(0, "col-span-2")}
          {renderSlot(1)}
          {renderSlot(2)}
        </div>
      ) : page.layoutId === "three-left" ? (
        <div className="grid grid-cols-2 grid-rows-2 flex-1 gap-0.5">
          {renderSlot(0, "row-span-2")}
          {renderSlot(1)}
          {renderSlot(2)}
        </div>
      ) : page.layoutId === "grid4" ? (
        <div className="grid grid-cols-2 grid-rows-2 flex-1 gap-0.5">
          {[0, 1, 2, 3].map((i) => renderSlot(i))}
        </div>
      ) : null}

      {page.layoutId !== "text-only" && page.layoutId !== "photo-text" && page.caption && (
        <div className={`shrink-0 px-3 py-2 text-center text-[10px] italic ${textColor}`}>
          {page.caption}
        </div>
      )}
    </div>
  );
}

// ── Sidebar Tab Button ─────────────────────────────────────────────────
function SidebarTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-xs font-semibold transition ${
        active ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────
export default function CreatePage() {
  const router = useRouter();
  const autoInputRef = useRef<HTMLInputElement>(null);
  const editorInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<Mode>(null);

  // ── Auto mode ──────────────────────────────────────────────────────
  const [autoFiles, setAutoFiles] = useState<File[]>([]);
  const [autoPreviews, setAutoPreviews] = useState<string[]>([]);
  const [autoTitle, setAutoTitle] = useState("");
  const [autoSubtitle, setAutoSubtitle] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoDragging, setAutoDragging] = useState(false);

  function addAutoFiles(selected: FileList | null) {
    if (!selected) return;
    const newFiles = Array.from(selected);
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) =>
        setAutoPreviews((prev) => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
    setAutoFiles((prev) => [...prev, ...newFiles]);
  }

  async function handleAutoSubmit() {
    if (autoFiles.length === 0) return;
    setAutoLoading(true);
    const resized = await Promise.all(autoFiles.map((f) => resizeImage(f)));
    sessionStorage.setItem(
      "linstantane:album",
      JSON.stringify({ type: "auto", title: autoTitle || "Mon album", subtitle: autoSubtitle, photos: resized })
    );
    router.push("/result");
  }

  // ── Manual editor ──────────────────────────────────────────────────
  const [library, setLibrary] = useState<string[]>([]);
  const [pages, setPages] = useState<EditorPage[]>([newPage("grid4")]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [albumTitle, setAlbumTitle] = useState("Mon album");
  const [editingTitle, setEditingTitle] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"photos" | "layouts" | "style">("photos");
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

  const addLibraryFiles = useCallback(async (selected: FileList | null) => {
    if (!selected) return;
    const resized = await Promise.all(Array.from(selected).map((f) => resizeImage(f)));
    setLibrary((prev) => [...prev, ...resized]);
  }, []);

  function handleSlotClick(slotIdx: number) {
    setActiveSlot((prev) => (prev === slotIdx ? null : slotIdx));
    setSidebarTab("photos");
  }

  function assignPhotoToSlot(photoB64: string) {
    if (activeSlot === null) return;
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== currentPageIdx) return p;
        const newPhotos = [...p.photos];
        newPhotos[activeSlot] = photoB64;
        return { ...p, photos: newPhotos };
      })
    );
    setActiveSlot(null);
  }

  function removePhotoFromSlot(slotIdx: number) {
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== currentPageIdx) return p;
        const newPhotos = [...p.photos];
        newPhotos[slotIdx] = null;
        return { ...p, photos: newPhotos };
      })
    );
  }

  function changeLayout(layoutId: LayoutId) {
    const newSlots = getSlotCount(layoutId);
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== currentPageIdx) return p;
        const photos: (string | null)[] = Array.from({ length: newSlots }, (_, idx) => p.photos[idx] ?? null);
        return { ...p, layoutId, photos };
      })
    );
    setActiveSlot(null);
  }

  function changeBgColor(color: string) {
    setPages((prev) =>
      prev.map((p, i) => (i === currentPageIdx ? { ...p, bgColor: color } : p))
    );
  }

  function updateCaption(caption: string) {
    setPages((prev) =>
      prev.map((p, i) => (i === currentPageIdx ? { ...p, caption } : p))
    );
  }

  function addPage() {
    const next = pages.length;
    setPages((prev) => [...prev, newPage("full")]);
    setCurrentPageIdx(next);
    setActiveSlot(null);
  }

  function duplicatePage(idx: number) {
    const page = pages[idx];
    const copy = { ...page, photos: [...page.photos] };
    setPages((prev) => [...prev.slice(0, idx + 1), copy, ...prev.slice(idx + 1)]);
    setCurrentPageIdx(idx + 1);
  }

  function removePage(idx: number) {
    if (pages.length === 1) return;
    const newPages = pages.filter((_, i) => i !== idx);
    setPages(newPages);
    setCurrentPageIdx((prev) => Math.min(prev, newPages.length - 1));
    setActiveSlot(null);
  }

  function removeLibraryPhoto(idx: number) {
    setLibrary((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleManualSubmit() {
    sessionStorage.setItem(
      "linstantane:album",
      JSON.stringify({ type: "manual", title: albumTitle, pages })
    );
    router.push("/result");
  }

  const currentPage = pages[currentPageIdx];

  // ────────────────────────────────────────────────────────────────────
  // LANDING
  // ────────────────────────────────────────────────────────────────────
  if (mode === null) {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <Nav />
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Étape 1 sur 3
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-slate-900 sm:text-5xl">
              Comment veux-tu créer
              <br />
              ton album ?
            </h1>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <button
              onClick={() => setMode("auto")}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-left transition hover:border-slate-900 hover:shadow-lg"
            >
              <div className="mb-5 text-4xl">✨</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                Mise en page automatique
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Uploade tes photos, on s&apos;occupe du reste. Mise en page élégante générée
                automatiquement en quelques secondes.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                Choisir <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </button>
            <button
              onClick={() => setMode("manual")}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-left transition hover:border-slate-900 hover:shadow-lg"
            >
              <div className="mb-5 text-4xl">🎨</div>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900">
                Je personnalise moi-même
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Choisis le layout de chaque page, place tes photos où tu veux et ajoute des
                légendes. Contrôle total sur ton album.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900">
                Choisir <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ────────────────────────────────────────────────────────────────────
  // AUTO MODE
  // ────────────────────────────────────────────────────────────────────
  if (mode === "auto") {
    return (
      <main className="min-h-screen bg-white text-slate-900">
        <Nav />
        <div className="mx-auto max-w-2xl px-6 py-12">
          <button onClick={() => setMode(null)} className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-700">
            ← Retour
          </button>
          <div className="mb-10 text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Mise en page automatique
            </h1>
            <p className="mt-3 text-sm text-slate-500">Uploade tes photos et on s&apos;occupe du reste.</p>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setAutoDragging(true); }}
            onDragLeave={() => setAutoDragging(false)}
            onDrop={(e) => { e.preventDefault(); setAutoDragging(false); addAutoFiles(e.dataTransfer.files); }}
            onClick={() => !autoLoading && autoInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-14 transition ${
              autoDragging ? "border-slate-400 bg-slate-50" : "border-gray-200 bg-[#f8f7f4] hover:border-slate-300"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-3xl">📸</div>
            <div className="text-center">
              <p className="font-medium text-slate-700">Glisse tes photos ici ou clique pour sélectionner</p>
              <p className="mt-1 text-xs text-slate-400">JPG, PNG</p>
            </div>
            <input ref={autoInputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={(e) => addAutoFiles(e.target.files)} />
          </div>
          {autoPreviews.length > 0 && (
            <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {autoPreviews.map((src, idx) => (
                <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {!autoLoading && (
                <button onClick={() => autoInputRef.current?.click()} className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-slate-300 transition hover:border-slate-300">
                  <span className="text-2xl">+</span>
                </button>
              )}
            </div>
          )}
          <div className="mt-8 flex flex-col gap-3">
            <input type="text" placeholder="Titre de l'album" value={autoTitle} onChange={(e) => setAutoTitle(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
            <input type="text" placeholder="Sous-titre (optionnel)" value={autoSubtitle} onChange={(e) => setAutoSubtitle(e.target.value)} className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-slate-400" />
          </div>
          <button onClick={handleAutoSubmit} disabled={autoFiles.length === 0 || autoLoading} className="mt-8 w-full rounded-full bg-slate-900 py-4 text-base font-medium text-white transition hover:bg-slate-700 disabled:opacity-40">
            {autoLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Préparation…
              </span>
            ) : "Voir l'aperçu →"}
          </button>
        </div>
      </main>
    );
  }

  // ────────────────────────────────────────────────────────────────────
  // MANUAL EDITOR (Souvence-style)
  // ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#e8e5e0] text-slate-900">
      {/* Top bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode(null)} className="text-sm text-slate-400 transition hover:text-slate-700">
            ← Retour
          </button>
          <span className="text-gray-200">|</span>
          {editingTitle ? (
            <input
              autoFocus
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              className="border-b border-slate-300 bg-transparent font-[family-name:var(--font-playfair)] text-sm font-bold outline-none"
            />
          ) : (
            <button onClick={() => setEditingTitle(true)} className="font-[family-name:var(--font-playfair)] text-sm font-bold transition hover:text-slate-500" title="Modifier le titre">
              {albumTitle}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-slate-400 sm:block">{pages.length} page{pages.length > 1 ? "s" : ""}</span>
          <button onClick={handleManualSubmit} className="rounded-full bg-slate-900 px-5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700">
            Voir l&apos;aperçu →
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar ── */}
        <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <SidebarTab active={sidebarTab === "photos"} onClick={() => setSidebarTab("photos")}>Photos</SidebarTab>
            <SidebarTab active={sidebarTab === "layouts"} onClick={() => setSidebarTab("layouts")}>Layouts</SidebarTab>
            <SidebarTab active={sidebarTab === "style"} onClick={() => setSidebarTab("style")}>Style</SidebarTab>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* PHOTOS TAB */}
            {sidebarTab === "photos" && (
              <div className="p-3">
                <button
                  onClick={() => editorInputRef.current?.click()}
                  className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                  + Ajouter des photos
                </button>
                <input ref={editorInputRef} type="file" accept="image/jpeg,image/png" multiple className="hidden" onChange={(e) => addLibraryFiles(e.target.files)} />

                {library.length === 0 ? (
                  <div className="mt-6 text-center">
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ajoute tes photos pour<br />commencer la mise en page
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{library.length} photo{library.length > 1 ? "s" : ""}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {library.map((src, idx) => (
                        <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt=""
                            className={`h-full w-full object-cover transition ${activeSlot !== null ? "cursor-pointer hover:brightness-75" : ""}`}
                            onClick={() => activeSlot !== null && assignPhotoToSlot(src)}
                            draggable
                          />
                          <button
                            onClick={() => removeLibraryPhoto(idx)}
                            className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-[9px] text-white opacity-0 transition group-hover:opacity-100"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* LAYOUTS TAB */}
            {sidebarTab === "layouts" && (
              <div className="p-3">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mise en page</p>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUTS.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => changeLayout(layout.id)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 transition ${
                        currentPage.layoutId === layout.id
                          ? "border-slate-900 bg-slate-50 shadow-sm"
                          : "border-gray-200 hover:border-slate-400"
                      }`}
                    >
                      <div className="h-10 w-10">{layout.icon}</div>
                      <span className="text-[9px] text-slate-500 leading-tight text-center">{layout.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STYLE TAB */}
            {sidebarTab === "style" && (
              <div className="p-3">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Couleur de fond</p>
                <div className="grid grid-cols-5 gap-2">
                  {BG_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => changeBgColor(color)}
                      className={`h-8 w-8 rounded-full border-2 transition ${
                        currentPage.bgColor === color ? "border-slate-900 scale-110" : "border-gray-200 hover:border-slate-400"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                <p className="mt-6 mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Légende de la page</p>
                <textarea
                  placeholder="Ajouter une légende..."
                  value={currentPage.caption}
                  onChange={(e) => updateCaption(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400 resize-none"
                />

                <p className="mt-6 mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Actions</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => duplicatePage(currentPageIdx)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-slate-600 transition hover:bg-slate-50"
                  >
                    Dupliquer cette page
                  </button>
                  {pages.length > 1 && (
                    <button
                      onClick={() => removePage(currentPageIdx)}
                      className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs text-red-500 transition hover:bg-red-50"
                    >
                      Supprimer cette page
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Slot selection hint */}
          {activeSlot !== null && sidebarTab === "photos" && (
            <div className="border-t border-blue-100 bg-blue-50 px-3 py-2">
              <p className="text-[10px] font-semibold text-blue-600">
                Clique une photo pour la placer
              </p>
              <button onClick={() => setActiveSlot(null)} className="mt-0.5 text-[10px] text-blue-400 hover:text-blue-600">
                Annuler
              </button>
            </div>
          )}
        </aside>

        {/* ── Center: page view ── */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-4">
          {/* Page number */}
          <p className="mb-3 text-xs text-slate-400">
            Page {currentPageIdx + 1} / {pages.length}
          </p>

          {/* Page container */}
          <div className="w-full max-w-xs shadow-2xl rounded-sm overflow-hidden" style={{ aspectRatio: "210/297" }}>
            <PageRenderer
              page={currentPage}
              activeSlot={activeSlot}
              onSlotClick={handleSlotClick}
            />
          </div>

          {/* Quick instructions */}
          {library.length === 0 && (
            <p className="mt-5 text-center text-xs text-slate-400 leading-relaxed">
              Ajoute des photos dans le panneau de gauche,<br />
              puis clique sur un slot pour les placer.
            </p>
          )}
          {library.length > 0 && activeSlot === null && getSlotCount(currentPage.layoutId) > 0 && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Clique sur un emplacement de la page pour y placer une photo
            </p>
          )}
        </div>
      </div>

      {/* Bottom: page strip */}
      <div className="flex h-20 shrink-0 items-center gap-2 overflow-x-auto border-t border-gray-200 bg-white px-4">
        {pages.map((page, idx) => {
          const slots = getSlotCount(page.layoutId);
          const gridClass =
            slots === 0 ? "" :
            slots === 1 ? "grid-cols-1" :
            slots === 2 ? (page.layoutId === "two-v" ? "grid-cols-2" : "grid-cols-1 grid-rows-2") :
            "grid-cols-2 grid-rows-2";

          return (
            <button
              key={idx}
              onClick={() => { setCurrentPageIdx(idx); setActiveSlot(null); }}
              className={`group relative shrink-0 overflow-hidden rounded border-2 transition ${
                idx === currentPageIdx ? "border-slate-900" : "border-transparent hover:border-gray-300"
              }`}
              style={{ width: 42, height: 60, backgroundColor: page.bgColor }}
            >
              {slots === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <span className="text-[6px] font-bold text-slate-400">Aa</span>
                </div>
              ) : (
                <div className={`grid h-full gap-px ${gridClass}`}>
                  {Array.from({ length: Math.min(slots, 4) }).map((_, si) => {
                    const photo = page.photos[si];
                    return (
                      <div key={si} className="overflow-hidden" style={{ backgroundColor: page.bgColor === "#ffffff" ? "#f0ede8" : `${page.bgColor}33` }}>
                        {photo && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photo} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <span className="absolute bottom-0 left-0 right-0 bg-white/80 text-center text-[8px] text-slate-500">
                {idx + 1}
              </span>
            </button>
          );
        })}
        <button
          onClick={addPage}
          className="flex shrink-0 flex-col items-center justify-center rounded border-2 border-dashed border-gray-200 text-slate-300 transition hover:border-slate-400 hover:text-slate-500"
          style={{ width: 42, height: 60 }}
          title="Ajouter une page"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>
    </div>
  );
}
