"use client";

/**
 * Cookie consent banner (CNIL / GDPR compliant).
 *
 * Provides equal-weight "Accepter" and "Refuser" buttons as required by
 * the CNIL since 2021. Stores the choice in localStorage so we don't
 * re-prompt on every visit. The choice is read by analytics gating
 * components (AnalyticsGate) to decide whether to load tracking.
 *
 * Possible values for COOKIE_CONSENT_KEY:
 *   "accepted"  → load analytics + speed-insights
 *   "refused"   → essential only, no tracking
 *   (missing)   → show banner
 */

import { useSyncExternalStore } from "react";
import Link from "next/link";

export const COOKIE_CONSENT_KEY = "cookie-consent";

// Le choix vit dans localStorage : on s'y abonne (changement sur cette page
// via « cookie-consent-changed », ou dans un autre onglet via « storage »).
function subscribe(onChange: () => void) {
  window.addEventListener("cookie-consent-changed", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("cookie-consent-changed", onChange);
    window.removeEventListener("storage", onChange);
  };
}
// Repli si localStorage refuse l'écriture : le choix vaut au moins pour la visite.
let consentInMemory: string | null = null;

function readConsent(): string | null {
  if (consentInMemory) return consentInMemory;
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY);
  } catch {
    // localStorage blocked (e.g. private browsing in some browsers) — just hide
    return "blocked";
  }
}
// Côté serveur, on ne sait pas encore : bandeau masqué jusqu'à l'hydratation.
const readConsentOnServer = () => "unknown";

export default function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, readConsent, readConsentOnServer);
  const visible = consent === null;

  function setConsent(value: "accepted" | "refused") {
    consentInMemory = value;
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    // Masque le bandeau (via subscribe) et prévient les composants d'analytics
    window.dispatchEvent(new Event("cookie-consent-changed"));
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-xl flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/95 px-5 py-4 text-sm text-slate-300 shadow-2xl backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4">
        <p className="flex-1 leading-relaxed">
          On utilise des cookies pour les fonctions du site et des outils de mesure d&apos;audience anonymes (Vercel).{" "}
          <Link
            href="/politique-de-confidentialite"
            className="underline underline-offset-2 transition-colors hover:text-white"
          >
            En savoir plus
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setConsent("refused")}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5"
          >
            Refuser
          </button>
          <button
            onClick={() => setConsent("accepted")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
