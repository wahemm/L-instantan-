import Link from "next/link";
import Nav from "@/app/components/Nav";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <div className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <p className="font-[family-name:var(--font-playfair)] text-8xl font-bold text-slate-100">404</p>
        <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl italic text-slate-900">
          Cette page n&apos;existe pas
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-slate-500">
          La page que tu cherches a peut-être été déplacée ou supprimée.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-400"
          >
            Créer mon album
          </Link>
        </div>
      </div>
    </main>
  );
}
