import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
