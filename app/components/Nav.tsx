import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/shop" className="text-sm text-gray-600 hover:text-black transition">Illustrations</Link>
          <Link href="/comment-ca-marche" className="text-sm text-gray-600 hover:text-black transition">Comment ça marche</Link>
          <Link href="/qui-sommes-nous" className="text-sm text-gray-600 hover:text-black transition">À propos</Link>
          <Link href="/faq" className="text-sm text-gray-600 hover:text-black transition">FAQ</Link>
        </nav>

        <Link href="/" className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
          L&apos;Instantané
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/create" className="rounded-full bg-black text-white text-sm px-5 py-2 hover:bg-gray-800 transition">
            Commencer
          </Link>
        </div>
      </div>
    </header>
  );
}
