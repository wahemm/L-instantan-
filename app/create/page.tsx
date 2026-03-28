"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/app/components/Nav";

export default function CreatePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [lieu, setLieu] = useState("");
  const [personnes, setPersonnes] = useState("");
  const [ambiance, setAmbiance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const newFiles = Array.from(selected).filter((f) => !existing.has(f.name));
      return [...prev, ...newFiles];
    });
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    for (const file of files) formData.append("photos", file);
    formData.append("lieu", lieu);
    formData.append("personnes", personnes);
    formData.append("ambiance", ambiance);

    const res = await fetch("/api/generate", { method: "POST", body: formData });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    const { images } = await res.json();
    sessionStorage.setItem("linstantane:lastResult", JSON.stringify(images));
    router.push("/result");
  }

  const previews = files.map((f) => URL.createObjectURL(f));

  return (
    <main className="min-h-screen bg-white text-[#121212]">
      <Nav />

      <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-12 items-start min-h-[calc(100vh-65px)]">

        {/* COLONNE GAUCHE — Upload */}
        <div>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-2">
            Crée ton illustration
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Uploade tes photos, notre IA s&apos;occupe du reste.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Boutons d'import */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-4 text-sm font-medium hover:border-black hover:bg-gray-50 transition text-left"
              >
                <span className="text-xl">🖥️</span> Depuis mon ordinateur
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-4 text-sm font-medium hover:border-black hover:bg-gray-50 transition text-left"
              >
                <span className="text-xl">📱</span> Depuis mon téléphone
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Drag & Drop */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              className={`cursor-pointer rounded-xl border-2 border-dashed flex items-center justify-center py-10 text-sm font-medium transition ${dragging ? "border-black bg-gray-50 text-black" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}
            >
              ou glisse & dépose tes photos ici
            </div>

            {/* Previews */}
            {files.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-widest">{files.length} photo{files.length > 1 ? "s" : ""} sélectionnée{files.length > 1 ? "s" : ""}</p>
                <div className="grid grid-cols-4 gap-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img src={previews[idx]} alt="" className="w-full h-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-black text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >×</button>
                    </div>
                  ))}
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400 transition text-gray-300 text-2xl"
                  >+</div>
                </div>
              </div>
            )}

            {/* Contexte */}
            <div className="bg-[#f8f7f4] rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Contexte <span className="font-normal normal-case text-gray-400">— optionnel</span></p>
              <div className="flex flex-col gap-2">
                <input type="text" placeholder="📍 Lieu (ex: Istanbul, Barcelone…)" value={lieu} onChange={(e) => setLieu(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black transition" />
                <input type="text" placeholder="👥 Personnes (ex: mes amis, famille…)" value={personnes} onChange={(e) => setPersonnes(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black transition" />
                <input type="text" placeholder="✨ Ambiance (ex: aventure, détente…)" value={ambiance} onChange={(e) => setAmbiance(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-black transition" />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={files.length === 0 || loading}
              className="w-full rounded-xl bg-black text-white font-semibold py-4 text-sm hover:bg-gray-800 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Génération en cours… (30–60 secondes)
                </span>
              ) : (
                `Générer ${files.length > 0 ? `${files.length} illustration${files.length > 1 ? "s" : ""}` : "mon illustration"} →`
              )}
            </button>

            <p className="text-center text-xs text-gray-400">🔒 Photos supprimées après génération · Paiement après résultat</p>
          </form>
        </div>

        {/* COLONNE DROITE — Aperçu livre */}
        <div className="hidden md:flex flex-col gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-1">
              Aperçu de ton livre
            </h2>
            <p className="text-gray-500 text-sm">Voici à quoi ressemblera ton résultat.</p>
          </div>

          {/* Mockup livre */}
          <div className="rounded-2xl bg-[#f8f7f4] p-6 flex flex-col gap-4">

            {/* Couverture */}
            <div className="rounded-xl bg-black text-white p-6 flex flex-col justify-between aspect-[3/2]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">L&apos;Instantané</span>
                <span className="text-xs text-gray-500">2026</span>
              </div>
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-2xl font-bold italic leading-snug">
                  {lieu || "Mon voyage"}<br />
                  <span className="text-gray-400 text-base font-normal not-italic">{ambiance || "en illustrations cartoon"}</span>
                </p>
              </div>
            </div>

            {/* Pages intérieures */}
            <div className="grid grid-cols-2 gap-3">
              {files.length > 0 ? (
                previews.slice(0, 4).map((src, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-200 relative">
                    <img src={src} alt="" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600 bg-white/80 px-2 py-1 rounded-full">→ cartoon</span>
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    Photo {idx + 1}
                  </div>
                ))
              )}
              {files.length > 4 && (
                <div className="col-span-2 text-center text-xs text-gray-400 mt-1">
                  + {files.length - 4} autre{files.length - 4 > 1 ? "s" : ""} photo{files.length - 4 > 1 ? "s" : ""}
                </div>
              )}
            </div>

            <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-200">
              {files.length === 0 ? "Ajoute tes photos pour voir l'aperçu" : `${files.length} illustration${files.length > 1 ? "s" : ""} cartoon · Format A4 · Papier premium`}
            </div>
          </div>

          {/* Infos packs */}
          <div className="rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Inclus dans chaque pack</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Visages fidèles à tes photos</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Style cartoon professionnel</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Généré en 30–60 secondes</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Satisfait ou remboursé</li>
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}
