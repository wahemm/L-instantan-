import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/upload-pdf
 *
 * Two modes (auto-detected by Content-Type):
 *
 *  1. application/json — @vercel/blob/client direct-upload handshake.
 *     The client calls `upload(...)` which POSTs JSON here to obtain a
 *     signed token, then uploads the bytes DIRECTLY to Vercel Blob.
 *     Bypasses Vercel's ~4.5 MB request body limit. Required for full
 *     albums (PDFs can hit 50+ MB).
 *
 *  2. multipart/form-data — legacy server-side put(). Kept for tiny albums
 *     and back-compat. Will 413 on large payloads.
 *
 * Paiement sans compte : le mode 1 est ouvert aux invités (forcer la connexion
 * au moment de commander faisait abandonner). Le jeton reste verrouillé :
 * chemin exact généré par /result ou l'outil admin, PDF uniquement, 100 Mo max,
 * origine du site. Le callback « upload-completed » de Vercel Blob n'a pas
 * d'Origin (serveur à serveur) : handleUpload vérifie sa signature.
 */

// albums/order-<timestamp>-<rand>/cover.pdf (checkout) ou rescue-… (outil admin)
const ALBUM_PDF_PATH = /^albums\/(order|rescue)-[a-z0-9-]{8,48}\/(cover|interior)\.pdf$/;

function isAllowedOrigin(origin: string | null): boolean {
  // Les navigateurs envoient toujours Origin sur un POST ; seul le callback
  // signé de Vercel Blob arrive sans.
  if (!origin) return true;
  try {
    const { protocol, hostname } = new URL(origin);
    if (hostname === "linstantane.fr" || hostname === "www.linstantane.fr") return protocol === "https:";
    if (hostname.endsWith(".vercel.app")) return protocol === "https:"; // previews
    return hostname === "localhost" || hostname === "127.0.0.1"; // dev
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  // ── New flow: client-direct upload to Vercel Blob (invités acceptés) ──
  if (contentType.includes("application/json")) {
    if (!isAllowedOrigin(req.headers.get("origin"))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    try {
      const body = (await req.json()) as HandleUploadBody;
      const json = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname) => {
          if (!ALBUM_PDF_PATH.test(pathname)) {
            throw new Error("Invalid pathname");
          }
          return {
            allowedContentTypes: ["application/pdf"],
            // 100 MB is well above the largest legit PDF we generate (~60 MB
            // for a 50-page album) but prevents using our endpoint to upload
            // 200+ MB junk.
            maximumSizeInBytes: 100 * 1024 * 1024,
          };
        },
        onUploadCompleted: async ({ blob }) => {
          console.log(`[Blob] Direct upload completed: ${blob.url}`);
        },
      });
      return NextResponse.json(json);
    } catch (err) {
      console.error("Client-upload handshake error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  }

  // ── Legacy flow: server-side upload via multipart/form-data ──
  // Plus utilisé par le checkout ; reste réservé aux comptes connectés.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { put } = await import("@vercel/blob");
    const formData = await req.formData();
    const interior = formData.get("interior") as File | null;
    const cover = formData.get("cover") as File | null;
    const orderId = formData.get("orderId") as string | null;

    if (!interior || !cover || !orderId) {
      return NextResponse.json(
        { error: "Missing interior, cover, or orderId" },
        { status: 400 }
      );
    }

    const [interiorBlob, coverBlob] = await Promise.all([
      put(`albums/${orderId}/interior.pdf`, interior, {
        access: "public",
        contentType: "application/pdf",
      }),
      put(`albums/${orderId}/cover.pdf`, cover, {
        access: "public",
        contentType: "application/pdf",
      }),
    ]);

    return NextResponse.json({
      interiorUrl: interiorBlob.url,
      coverUrl: coverBlob.url,
    });
  } catch (err) {
    console.error("Upload PDF error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
