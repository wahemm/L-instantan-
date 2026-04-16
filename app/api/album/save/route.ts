import { auth } from "@clerk/nextjs/server";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const album = await req.json();
  const blob = await put(`albums/${userId}.json`, JSON.stringify(album), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
  });

  return NextResponse.json({ url: blob.url });
}
