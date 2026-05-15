import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

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
 */
export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") || "";

  // ── New flow: client-direct upload to Vercel Blob ──
  if (contentType.includes("application/json")) {
    try {
      const body = (await req.json()) as HandleUploadBody;
      const json = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async (pathname) => {
          if (!pathname.startsWith("albums/") || !pathname.endsWith(".pdf")) {
            throw new Error("Invalid pathname");
          }
          return {
            allowedContentTypes: ["application/pdf"],
            maximumSizeInBytes: 200 * 1024 * 1024, // 200 MB
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
