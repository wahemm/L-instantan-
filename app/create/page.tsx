"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";

// ── Types ─────────────────────────────────────────────────────────────
type Mode = null | "auto" | "manual";
type PageLayout = 1 | 2 | 3 | 4;
type EditorPage = { layout: PageLayout; photos: (string | null)[]; caption: string };

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

function newPage(layout: PageLayout = 1): EditorPage {
  return { layout, photos: Array(layout).fill(null), caption: "" };
}

// ── Page view (center editor panel) ───────────────────────────────────
function PageView({
  page,
  activeSlot,
  onSlotClick,
}: {
  page: EditorPage;
  activeSlot: number | null;
  onSlotClick: (idx: number) => void;
}) {
  const slotCount = page.layout;

  const gridClass =
    slotCount === 1
      ? "grid-cols-1 grid-rows-1"
      : slotCount === 2
      ? "grid-cols-1 grid-rows-2"
      : slotCount === 4
      ? "grid-cols-2 grid-rows-2"
      : "grid-cols-2 grid-rows-2"; // 3 photos: top slot spans 2 cols

  return (
    <div className="flex h-full flex-col bg-white">
      <div className={`grid flex-1 gap-0.5 bg-gray-100 ${gridClass}`}>
        {Array.from({ length: slotCount }).map((_, idx) => {
          const isActive = activeSlot === idx;
          const photo = page.photos[idx];
          const spanClass = slotCount === 3 && idx === 0 ? "col-span-2" : "";
          return (
            <div
              key={idx}
              onClick={() => onSlotClick(idx)}
              className={`relative cursor-pointer overflow-hidden bg-[#f8f7f4] transition ${spanClass} ${
                isActive ? "ring-2 ring-inset ring-blue-500" : "hover:brightness-95"
              }`}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photo} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="select-none text-3xl text-gray-300">+</span>
                </div>
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
  );
}

// ── Page thumbnail ─────────────────────────────────────────────────────
function PageThumb({
  page,
  index,
  isActive,
  onClick,
  onRemove,
  canRemove,
}: {
  page: EditorPage;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const gridClass =
    page.layout === 1
      ? "grid-cols-1"
      : page.layout === 2
      ? "grid-cols-1 grid-rows-2"
      : "grid-cols-2 grid-rows-2";

  return (
    <button
      onClick={onClick}
      className={`group relative shrink-0 overflow-hidden rounded border-2 transition ${
        isActive ? "border-slate-900" : "border-transparent hover:border-gray-300"
      }`}
      style={{ width: 50, height: 70 }}
    >
      <div className={`grid h-full gap-px bg-gray-100 ${gridClass}`}>
        {Array.from({ length: page.layout }).map((_, si) => {
          const photo = page.photos[si];
          const spanClass = page.layout === 3 && si === 0 ? "col-span-2" : "";
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
      {canRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/70 text-white text-[10px] opacity-0 transition group-hover:opacity-100"
        >
          ×
        </button>
      )}
      <span className="absolute bottom-0.5 left-0 right-0 text-center text-[9px] text-slate-400">
        {index + 1}
      </span>
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
      JSON.stringify({
        type: "auto",
        title: autoTitle || "Mon album",
        subtitle: autoSubtitle,
        photos: resized,
      })
    );
    router.push("/result");
  }

  // ── Manual editor ──────────────────────────────────────────────────
  const [library, setLibrary] = useState<string[]>([]);
  const [pages, setPages] = useState<EditorPage[]>([newPage(1)]);
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [albumTitle, setAlbumTitle] = useState("Mon album");
  const [editingTitle, setEditingTitle] = useState(false);

  async function addLibraryFiles(selected: FileList | null) {
    if (!selected) return;
    const resized = await Promise.all(Array.from(selected).map((f) => resizeImage(f)));
    setLibrary((prev) => [...prev, ...resized]);
  }

  function handleSlotClick(slotIdx: number) {
    setActiveSlot((prev) => (prev === slotIdx ? null : slotIdx));
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

  function changeLayout(layout: PageLayout) {
    setPages((prev) =>
      prev.map((p, i) => {
        if (i !== currentPageIdx) return p;
        const photos: (string | null)[] = Array.from(
          { length: layout },
          (_, idx) => p.photos[idx] ?? null
        );
        return { ...p, layout, photos };
      })
    );
    setActiveSlot(null);
  }

  function updateCaption(caption: string) {
    setPages((prev) =>
      prev.map((p, i) => (i === currentPageIdx ? { ...p, caption } : p))
    );
  }

  function addPage() {
    const next = pages.length;
    setPages((prev) => [...prev, newPage(1)]);
    setCurrentPageIdx(next);
    setActiveSlot(null);
  }

  function removePage(idx: number) {
    if (pages.length === 1) return;
    const newPages = pages.filter((_, i) => i !== idx);
    setPages(newPages);
    setCurrentPageIdx((prev) => Math.min(prev, newPages.length - 1));
    setActiveSlot(null);
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
                Choisir{" "}
                <span className="transition group-hover:translate-x-1">→</span>
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
                Choisir{" "}
                <span className="transition group-hover:translate-x-1">→</span>
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
          <button
            onClick={() => setMode(null)}
            className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-700"
          >
            ← Retour
          </button>

          <div className="mb-10 text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900 sm:text-4xl">
              Mise en page automatique
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Uploade tes photos et on s&apos;occupe du reste.
            </p>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setAutoDragging(true);
            }}
            onDragLeave={() => setAutoDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setAutoDragging(false);
              addAutoFiles(e.dataTransfer.files);
            }}
            onClick={() => !autoLoading && autoInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed py-14 transition ${
              autoDragging
                ? "border-slate-400 bg-slate-50"
                : "border-gray-200 bg-[#f8f7f4] hover:border-slate-300"
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-3xl">
              📸
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-700">
                Glisse tes photos ici ou clique pour sélectionner
              </p>
              <p className="mt-1 text-xs text-slate-400">JPG, PNG &bull; Illimité</p>
            </div>
            <input
              ref={autoInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => addAutoFiles(e.target.files)}
            />
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
                <button
                  onClick={() => autoInputRef.current?.click()}
                  className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-slate-300 transition hover:border-slate-300"
                >
                  <span className="text-2xl">+</span>
                </button>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Titre de l'album"
              value={autoTitle}
              onChange={(e) => setAutoTitle(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
            <input
              type="text"
              placeholder="Sous-titre (optionnel)"
              value={autoSubtitle}
              onChange={(e) => setAutoSubtitle(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <button
            onClick={handleAutoSubmit}
            disabled={autoFiles.length === 0 || autoLoading}
            className="mt-8 w-full rounded-full bg-slate-900 py-4 text-base font-medium text-white transition hover:bg-slate-700 disabled:opacity-40"
          >
            {autoLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Préparation…
              </span>
            ) : (
              "Voir l'aperçu →"
            )}
          </button>
        </div>
      </main>
    );
  }

  // ────────────────────────────────────────────────────────────────────
  // MANUAL EDITOR
  // ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f0ede8] text-slate-900">
      {/* Top bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMode(null)}
            className="text-sm text-slate-400 transition hover:text-slate-700"
          >
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
              className="border-b border-slate-300 bg-transparent font-[family-name:var(--font-playfair)] text-base font-bold outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingTitle(true)}
              className="font-[family-name:var(--font-playfair)] text-base font-bold transition hover:text-slate-500"
              title="Cliquer pour modifier le titre"
            >
              {albumTitle}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-slate-400 sm:block">
            {pages.length} page{pages.length > 1 ? "s" : ""}
          </span>
          <button
            onClick={handleManualSubmit}
            className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Voir l&apos;aperçu →
          </button>
        </div>
      </div>

      {/* Main three-column area */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar: photo library ── */}
        <aside className="flex w-52 shrink-0 flex-col border-r border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tes photos
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <button
              onClick={() => editorInputRef.current?.click()}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-2.5 text-xs text-slate-400 transition hover:border-slate-400 hover:text-slate-600"
            >
              + Ajouter des photos
            </button>
            <input
              ref={editorInputRef}
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="hidden"
              onChange={(e) => addLibraryFiles(e.target.files)}
            />

            {library.length === 0 ? (
              <p className="mt-6 text-center text-xs leading-relaxed text-slate-300">
                Aucune photo.
                <br />
                Commence par en ajouter.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {library.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => activeSlot !== null && assignPhotoToSlot(src)}
                    className={`aspect-square overflow-hidden rounded-lg transition ${
                      activeSlot !== null
                        ? "cursor-pointer ring-2 ring-transparent hover:ring-blue-400"
                        : "cursor-default"
                    }`}
                    title={
                      activeSlot !== null
                        ? "Cliquer pour placer dans le slot"
                        : undefined
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeSlot !== null && (
            <div className="border-t border-blue-100 bg-blue-50 px-3 py-2">
              <p className="text-xs font-medium text-blue-600">
                Clique sur une photo pour la placer
              </p>
              <button
                onClick={() => setActiveSlot(null)}
                className="mt-1 text-xs text-blue-400 transition hover:text-blue-600"
              >
                Annuler
              </button>
            </div>
          )}
        </aside>

        {/* ── Center: page view ── */}
        <div className="flex flex-1 flex-col items-center justify-start overflow-y-auto p-6 pt-4">
          {/* Layout selector */}
          <div className="mb-5 flex items-center gap-2">
            <span className="text-xs text-slate-400">Layout :</span>
            {([1, 2, 3, 4] as PageLayout[]).map((n) => (
              <button
                key={n}
                onClick={() => changeLayout(n)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold transition ${
                  currentPage.layout === n
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-gray-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
                title={`${n} photo${n > 1 ? "s" : ""} par page`}
              >
                {n}
              </button>
            ))}
            <span className="text-xs text-slate-400">photo{currentPage.layout > 1 ? "s" : ""}</span>
          </div>

          {/* Page — A4 ratio */}
          <div
            className="w-full max-w-xs shadow-2xl"
            style={{ aspectRatio: "210/297" }}
          >
            <PageView
              page={currentPage}
              activeSlot={activeSlot}
              onSlotClick={handleSlotClick}
            />
          </div>

          {/* Caption */}
          <div className="mt-4 w-full max-w-xs">
            <input
              type="text"
              placeholder="Légende de la page (optionnel)"
              value={currentPage.caption}
              onChange={(e) => updateCaption(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {library.length === 0 && (
            <p className="mt-6 text-center text-xs text-slate-400">
              Commence par ajouter des photos dans le panneau de gauche,
              <br />
              puis clique sur un slot pour les placer.
            </p>
          )}

          {library.length > 0 && activeSlot === null && (
            <p className="mt-4 text-center text-xs text-slate-400">
              Clique sur un slot de la page pour le sélectionner,
              <br />
              puis choisis une photo dans le panneau de gauche.
            </p>
          )}
        </div>
      </div>

      {/* Bottom: page thumbnails strip */}
      <div className="flex h-24 shrink-0 items-center gap-2 overflow-x-auto border-t border-gray-200 bg-white px-4">
        {pages.map((page, idx) => (
          <PageThumb
            key={idx}
            page={page}
            index={idx}
            isActive={idx === currentPageIdx}
            onClick={() => {
              setCurrentPageIdx(idx);
              setActiveSlot(null);
            }}
            onRemove={() => removePage(idx)}
            canRemove={pages.length > 1}
          />
        ))}
        <button
          onClick={addPage}
          className="flex shrink-0 flex-col items-center justify-center rounded border-2 border-dashed border-gray-200 text-slate-300 transition hover:border-slate-400 hover:text-slate-500"
          style={{ width: 50, height: 70 }}
          title="Ajouter une page"
        >
          <span className="text-xl leading-none">+</span>
        </button>
      </div>
    </div>
  );
}
