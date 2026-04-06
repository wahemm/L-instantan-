"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <p className="font-[family-name:var(--font-playfair)] text-6xl font-bold text-slate-100">Oups</p>
      <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-2xl italic text-slate-900">
        Une erreur est survenue
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm text-slate-500">
        Pas de panique, tes données sont en sécurité. Réessaie ou retourne à l&apos;accueil.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Réessayer
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
