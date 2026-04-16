import { auth } from "@clerk/nextjs/server";
import { list, download } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { blobs } = await list({ prefix: `albums/${userId}.json`, limit: 1 });
    if (!blobs.length) return NextResponse.json(null);

    const res = await download(blobs[0].url);
    const album = await res.json();
    return NextResponse.json(album);
  } catch {
    return NextResponse.json(null);
  }
}
