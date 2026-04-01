"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/shop",              label: "Albums"           },
  { href: "/comment-ca-marche", label: "Comment ça marche" },
  { href: "/faq",               label: "FAQ"              },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Left nav links — desktop */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className={`text-sm transition ${pathname === l.href ? "font-medium text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Logo — centered */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--font-playfair)] text-xl text-slate-900"
        >
          L&apos;Instantané
        </Link>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/create"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Créer mon album
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 md:hidden"
            onClick={() => setOpen(o => !o)}
            aria-label="Menu"
          >
            {open ? (
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-slate-700"><path d="M2.5 2.5l11 11M13.5 2.5l-11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-slate-700" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h12M2 8h12M2 12h12"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-gray-100 bg-white px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1 mb-4">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm transition ${pathname === l.href ? "bg-slate-50 font-medium text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/create" onClick={() => setOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Créer mon album →
          </Link>
        </div>
      )}
    </header>
  );
}
