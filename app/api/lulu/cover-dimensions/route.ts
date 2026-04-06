import { NextRequest, NextResponse } from "next/server";
import { getCoverDimensions } from "@/app/lib/lulu";

export async function POST(req: NextRequest) {
  try {
    const { pageCount } = await req.json();
    if (!pageCount || typeof pageCount !== "number") {
      return NextResponse.json({ error: "pageCount required" }, { status: 400 });
    }
    const dims = await getCoverDimensions(pageCount);
    return NextResponse.json(dims);
  } catch (err) {
    console.error("Cover dimensions error:", err);
    return NextResponse.json({ error: "Failed to get cover dimensions" }, { status: 500 });
  }
}
