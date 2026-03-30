"use client";

import Link from "next/link";
import { useUser, UserButton, SignOutButton } from "@clerk/nextjs";

export default function Nav() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Left nav links */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link href="/shop" className="text-sm text-slate-600 transition hover:text-slate-900">
            Albums
          </Link>
          <Link href="/comment-ca-marche" className="text-sm text-slate-600 transition hover:text-slate-900">
            Comment ça marche
          </Link>
          <Link href="/faq" className="text-sm text-slate-600 transition hover:text-slate-900">
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

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          {isLoaded && !isSignedIn && (
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Créer mon album
            </Link>
          )}
          {isLoaded && isSignedIn && (
            <>
              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Mon album
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
