"use client";

import Link from "next/link";
import Nav from "@/app/components/Nav";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-8xl font-bold text-slate-100">Oups</p>
        <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl italic text-slate-900">
          Une erreur est survenue
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-slate-500">
          Quelque chose ne s&apos;est pas pass&eacute; comme pr&eacute;vu. Tu peux r&eacute;essayer ou revenir &agrave; l&apos;accueil.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            R&eacute;essayer
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400"
          >
            Retour &agrave; l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
