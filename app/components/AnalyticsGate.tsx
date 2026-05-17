"use client";

/**
 * Mounts @vercel/analytics and @vercel/speed-insights ONLY after the
 * user has explicitly accepted cookies. This makes the cookie banner
 * meaningful — refusing actually disables tracking instead of being a
 * cosmetic checkbox.
 *
 * Reacts to the "cookie-consent-changed" event so accepting/refusing
 * takes effect immediately without a page reload.
 */

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { COOKIE_CONSENT_KEY } from "./CookieBanner";

export default function AnalyticsGate() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function read() {
      try {
        setAllowed(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
      } catch {
        setAllowed(false);
      }
    }
    read();
    window.addEventListener("cookie-consent-changed", read);
    return () => window.removeEventListener("cookie-consent-changed", read);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
