import { NextRequest, NextResponse } from "next/server";
import { calculateCost } from "@/app/lib/lulu";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPageCount = typeof body.pageCount === "number" ? body.pageCount : 24;
    // Lulu requires minimum 24 pages, and even count
    const pageCount = Math.max(24, rawPageCount % 2 === 0 ? rawPageCount : rawPageCount + 1);
    const countryCode = (body.countryCode as string) || "FR";

    const result = await calculateCost(pageCount, countryCode);

    const shippingCost = parseFloat(result.shipping_cost?.total_cost_incl_tax ?? "0");
    const printCost = parseFloat(result.fulfillment_cost?.total_cost_incl_tax ?? "0");

    return NextResponse.json({
      shippingCost,
      printCost,
      totalLuluCost: shippingCost + printCost,
      currency: "EUR",
    });
  } catch (err) {
    console.error("Lulu shipping cost error:", err);
    return NextResponse.json({ error: "Failed to calculate shipping" }, { status: 500 });
  }
}
