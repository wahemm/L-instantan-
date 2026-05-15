"use client";

/**
 * Admin rescue page: re-submit a paid Stripe order to Lulu when the
 * automatic flow failed (typically PDF generation/upload silently errored).
 *
 * Workflow:
 *  1. Read album from IndexedDB (current draft or cart item)
 *  2. Generate cover + interior PDFs locally
 *  3. Upload to /api/upload-pdf → get Blob URLs
 *  4. POST to /api/admin/rescue-lulu with Stripe session ID + URLs
 *
 * Auth is enforced server-side on /api/admin/rescue-lulu via Clerk email.
 */

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Nav from "@/app/components/Nav";
import Link from "next/link";

interface CartItem {
  id: string;
  title: string;
  pageCount: number;
}

type LogLine = { level: "info" | "ok" | "err"; msg: string };

export default function RescuePage() {
  const { user, isLoaded } = useUser();
  const [sessionId, setSessionId] = useState("");
  const [albumSource, setAlbumSource] = useState<"current" | string>("current");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasCurrent, setHasCurrent] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [printJobId, setPrintJobId] = useState<string | null>(null);

  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  const isAdmin = email === "hbbhugo.thomas@gmail.com" || email === "linstantane.officiel@gmail.com";

  useEffect(() => {
    (async () => {
      try {
        const { loadAlbum } = await import("@/app/lib/albumStore");
        const current = await loadAlbum();
        setHasCurrent(!!current);
      } catch { /* ignore */ }
      try {
        const { listCart } = await import("@/app/lib/cartStore");
        const list = await listCart();
        setCartItems(list.map((c) => ({ id: c.id, title: c.title, pageCount: c.pageCount })));
      } catch { /* ignore */ }
    })();
  }, []);

  function log(level: LogLine["level"], msg: string) {
    setLogs((prev) => [...prev, { level, msg }]);
  }

  async function loadAlbumPayload(): Promise<unknown> {
    if (albumSource === "current") {
      const { loadAlbum } = await import("@/app/lib/albumStore");
      const a = await loadAlbum();
      if (!a) throw new Error("Aucun album courant en IndexedDB");
      return a;
    }
    const { getCartItem } = await import("@/app/lib/cartStore");
    const entry = await getCartItem(albumSource);
    if (!entry) throw new Error(`Cart item ${albumSource} introuvable`);
    return entry.album;
  }

  async function onRun() {
    if (!sessionId.trim()) {
      log("err", "Renseigne le Stripe session ID (cs_live_…)");
      return;
    }
    setRunning(true);
    setLogs([]);
    setPrintJobId(null);

    try {
      log("info", "Lecture de l'album depuis IndexedDB…");
      const album = (await loadAlbumPayload()) as {
        type: "manual" | "auto";
        title: string;
        pages?: unknown[];
      };
      if (album.type !== "manual" || !album.pages) {
        throw new Error("Seuls les albums type=manual peuvent être rescués");
      }
      log("ok", `Album chargé: "${album.title}" (${album.pages.length} pages dont couverture)`);

      // Cover dimensions
      const interiorPageCount = album.pages.length - 1;
      const evenPageCount = interiorPageCount % 2 === 0 ? interiorPageCount : interiorPageCount + 1;
      log("info", `Calcul dimensions couverture pour ${evenPageCount} pages intérieures…`);

      let coverWidthPt = 1368;
      let coverHeightPt = 918;
      try {
        const dimsRes = await fetch("/api/lulu/cover-dimensions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pageCount: evenPageCount }),
        });
        if (dimsRes.ok) {
          const d = await dimsRes.json();
          const w = parseFloat(d.width);
          const h = parseFloat(d.height);
          if (w > 0 && h > 0) { coverWidthPt = w; coverHeightPt = h; }
        }
      } catch { /* fallback defaults */ }
      log("ok", `Cover: ${coverWidthPt}×${coverHeightPt} pt`);

      log("info", "Génération PDF couverture…");
      const { generateLuluCoverPDF, generateLuluInteriorPDF } = await import("@/app/lib/generatePDF");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pages = album.pages as any[];
      const coverBlob = await generateLuluCoverPDF(pages[0], album.title || "Mon Album", coverWidthPt, coverHeightPt);
      log("ok", `Cover PDF généré (${(coverBlob.size / 1024).toFixed(0)} KB)`);

      log("info", "Génération PDF intérieur…");
      const interiorBlob = await generateLuluInteriorPDF(
        pages,
        album.title || "Mon Album",
        (current, total) => log("info", `  page ${current}/${total}…`)
      );
      log("ok", `Interior PDF généré (${(interiorBlob.size / 1024).toFixed(0)} KB)`);

      log("info", "Upload PDFs vers Vercel Blob (client-direct)…");
      const orderId = `rescue-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const { upload } = await import("@vercel/blob/client");
      const coverFile = new File([coverBlob], "cover.pdf", { type: "application/pdf" });
      const interiorFile = new File([interiorBlob], "interior.pdf", { type: "application/pdf" });
      const [coverUp, interiorUp] = await Promise.all([
        upload(`albums/${orderId}/cover.pdf`, coverFile, { access: "public", handleUploadUrl: "/api/upload-pdf" }),
        upload(`albums/${orderId}/interior.pdf`, interiorFile, { access: "public", handleUploadUrl: "/api/upload-pdf" }),
      ]);
      const interiorUrl = interiorUp.url;
      const coverUrl = coverUp.url;
      log("ok", "PDFs uploadés ✓");
      log("info", `  interior: ${interiorUrl}`);
      log("info", `  cover:    ${coverUrl}`);

      log("info", `Envoi à Lulu (session ${sessionId.trim()})…`);
      const luluRes = await fetch("/api/admin/rescue-lulu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionId.trim(), interiorUrl, coverUrl }),
      });
      const luluData = await luluRes.json();
      if (!luluRes.ok) throw new Error(luluData.error || "Lulu rescue failed");
      log("ok", `🎉 Print job Lulu créé : ${luluData.printJobId} (${luluData.status})`);
      log("ok", `→ Livraison: ${luluData.shippingTo} · Client: ${luluData.customerEmail}`);
      setPrintJobId(String(luluData.printJobId));
    } catch (err) {
      log("err", err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  if (!isLoaded) {
    return <main className="min-h-screen bg-white"><Nav /><div className="p-12 text-center text-slate-500">Chargement…</div></main>;
  }
  if (!user) {
    return (
      <main className="min-h-screen bg-white text-slate-900"><Nav />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl mb-4">Connecte-toi</h1>
          <Link href="/connexion" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white">Connexion</Link>
        </div>
      </main>
    );
  }
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-white text-slate-900"><Nav />
        <div className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl mb-2">Accès refusé</h1>
          <p className="text-sm text-slate-500">Cette page est réservée à l&apos;admin.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Nav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl mb-2">🆘 Rescue order</h1>
        <p className="text-sm text-slate-500 mb-8">Re-soumettre une commande payée à Lulu quand le flow auto a échoué.</p>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-[#faf8f4] p-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Stripe session ID</label>
            <input
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="cs_live_…"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Source de l&apos;album</label>
            <select
              value={albumSource}
              onChange={(e) => setAlbumSource(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="current" disabled={!hasCurrent}>
                Album courant {hasCurrent ? "(IndexedDB)" : "(aucun)"}
              </option>
              {cartItems.map((c) => (
                <option key={c.id} value={c.id}>Cart: {c.title} · {c.pageCount}p</option>
              ))}
            </select>
          </div>

          <button
            onClick={onRun}
            disabled={running}
            className="w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {running ? "En cours…" : "Générer + Envoyer à Lulu"}
          </button>
        </div>

        {logs.length > 0 && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-relaxed">
            {logs.map((l, i) => (
              <div
                key={i}
                className={
                  l.level === "ok" ? "text-emerald-300" :
                  l.level === "err" ? "text-red-300" :
                  "text-slate-300"
                }
              >
                {l.level === "ok" ? "✓ " : l.level === "err" ? "✗ " : "  "}{l.msg}
              </div>
            ))}
          </div>
        )}

        {printJobId && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="text-sm text-emerald-900 mb-2">Print job Lulu créé avec succès !</p>
            <p className="font-mono text-lg text-emerald-700">{printJobId}</p>
          </div>
        )}
      </div>
    </main>
  );
}
