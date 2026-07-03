import { NextRequest, NextResponse } from "next/server";
import { getGelatoCoverDimensions, GELATO_MIN_PAGES } from "@/app/lib/gelato";

export async function POST(req: NextRequest) {
  try {
    const { pageCount } = await req.json();
    if (!pageCount || typeof pageCount !== "number") {
      return NextResponse.json({ error: "pageCount required" }, { status: 400 });
    }
    // Enforce Gelato minimum and even page count
    const safeCount = Math.max(
      GELATO_MIN_PAGES,
      pageCount % 2 === 0 ? pageCount : pageCount + 1
    );
    const dims = await getGelatoCoverDimensions(safeCount);
    return NextResponse.json({
      widthMm: dims.widthMm,
      heightMm: dims.heightMm,
      spineWidthMm: dims.spineWidthMm,
      pageCount: safeCount,
    });
  } catch (err) {
    console.error("Gelato cover-dimensions error:", err);
    // Return fallback dimensions rather than a hard error so checkout still works
    return NextResponse.json({
      widthMm: 478,
      heightMm: 326,
      spineWidthMm: 6,
      pageCount: GELATO_MIN_PAGES,
      fallback: true,
    });
  }
}
