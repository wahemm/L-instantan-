import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

// Soft cap on album payload size — prevents a tampered client from POSTing
// 100+ MB of junk and DOSing the Vercel function / filling Blob storage.
// Albums with ~50 pages of base64 photos rarely exceed 10 MB.
const MAX_ALBUM_BYTES = 15 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check Content-Length first to fail fast on oversized payloads
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_ALBUM_BYTES) {
    return NextResponse.json(
      { error: `Album trop volumineux (${(parseInt(contentLength, 10) / 1024 / 1024).toFixed(1)} MB > 15 MB max)` },
      { status: 413 }
    );
  }

  try {
    const body = await req.text();
    if (body.length > MAX_ALBUM_BYTES) {
      return NextResponse.json({ error: "Album trop volumineux" }, { status: 413 });
    }

    // Validate JSON shape — must be an object, not an array or scalar
    let parsed: unknown;
    try {
      parsed = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Invalid album shape" }, { status: 400 });
    }

    const blob = await put(`albums/${userId}.json`, body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[Album Save] Error:", err);
    return NextResponse.json({ error: "Failed to save album" }, { status: 500 });
  }
}
