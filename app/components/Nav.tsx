import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/shop"
            className="text-sm text-slate-600 transition hover:text-slate-900"
          >
            Illustrations
          </Link>
          <Link
            href="/comment-ca-marche"
            className="text-sm text-slate-600 transition hover:text-slate-900"
          >
            Comment ça marche
          </Link>
          <Link
            href="/qui-sommes-nous"
            className="text-sm text-slate-600 transition hover:text-slate-900"
          >
            À propos
          </Link>
          <Link
            href="/faq"
            className="text-sm text-slate-600 transition hover:text-slate-900"
          >
            FAQ
          </Link>
        </nav>

        {/* Centered logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-xl font-[family-name:var(--font-playfair)] text-slate-900"
        >
          L&apos;Instantané
        </Link>

        {/* Right CTA */}
        <div className="ml-auto">
          <Link
            href="/create"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Commencer
          </Link>
        </div>
      </div>
    </header>
  );
}
