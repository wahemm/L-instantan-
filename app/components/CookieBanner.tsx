"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("linstantane:cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("linstantane:cookie-consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-4 shadow-lg sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-600 text-center sm:text-left">
          Ce site utilise des cookies essentiels au fonctionnement (authentification, panier). Aucun cookie publicitaire n&apos;est utilisé.{" "}
          <Link href="/politique-confidentialite" className="underline text-slate-900 hover:text-slate-600">
            En savoir plus
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
