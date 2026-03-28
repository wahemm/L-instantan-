"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [lieu, setLieu] = useState("");
  const [personnes, setPersonnes] = useState("");
  const [ambiance, setAmbiance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(selected: FileList | null) {
    if (!selected) return;
    setFiles(Array.from(selected));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    for (const file of files) {
      formData.append("photos", file);
    }
    formData.append("lieu", lieu);
    formData.append("personnes", personnes);
    formData.append("ambiance", ambiance);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: formData,
    });

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FFF9EC] px-4 py-12 text-slate-900">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-6"
      >
        <h1 className="text-3xl font-black tracking-tight">
          Crée ta BD ⚡
        </h1>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Lieu (ex: plage, Paris…)"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            className="rounded-xl border-[2px] border-black px-4 py-2 text-sm font-medium shadow-[2px_2px_0_0_#000] outline-none"
          />
          <input
            type="text"
            placeholder="Personnes (ex: mes amis, ma famille…)"
            value={personnes}
            onChange={(e) => setPersonnes(e.target.value)}
            className="rounded-xl border-[2px] border-black px-4 py-2 text-sm font-medium shadow-[2px_2px_0_0_#000] outline-none"
          />
          <input
            type="text"
            placeholder="Ambiance (ex: joyeuse, aventure…)"
            value={ambiance}
            onChange={(e) => setAmbiance(e.target.value)}
            className="rounded-xl border-[2px] border-black px-4 py-2 text-sm font-medium shadow-[2px_2px_0_0_#000] outline-none"
          />
        </div>

        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-[3px] border-dashed border-black bg-white py-10 shadow-[3px_3px_0_0_#000] transition hover:bg-[#FFFBF0]"
          onClick={() => inputRef.current?.click()}
        >
          <span className="text-4xl">📸</span>
          <p className="text-sm font-semibold text-slate-700">
            {files.length > 0
              ? `${files.length} photo${files.length > 1 ? "s" : ""} sélectionnée${files.length > 1 ? "s" : ""}`
              : "Clique pour ajouter tes photos"}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {error && (
          <p className="rounded-xl border-[2px] border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={files.length === 0 || loading}
          className="rounded-full border-[3px] border-black bg-[#FFE55C] px-8 py-3 text-base font-semibold shadow-[4px_4px_0_0_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Génération en cours…" : "Générer ma BD"}
        </button>
      </form>
    </main>
  );
}
