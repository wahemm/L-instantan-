import { NextRequest, NextResponse } from "next/server";
import { getGelatoShippingCost } from "@/app/lib/gelato";

/**
 * POST /api/gelato/shipping-cost
 * Body: { pageCount: number, countryCode: string }
 * Returns: { shippingCost: number, currency: "EUR" }
 *
 * Estimates shipping via Gelato's read-only order-quote endpoint. Falls back
 * to 5.90 € (≈ Gelato's cheapest France rate) so the summary UI never blocks
 * on a transient quote failure.
 */
export async function POST(req: NextRequest) {
  try {
    const { pageCount, countryCode } = await req.json();
    const pc = typeof pageCount === "number" ? pageCount : 32;
    const cc = (typeof countryCode === "string" && countryCode) || "FR";

    const quoted = await getGelatoShippingCost(pc, cc);

    return NextResponse.json({
      shippingCost: quoted ?? 5.9,
      currency: "EUR",
    });
  } catch (err) {
    console.error("Gelato shipping cost error:", err);
    return NextResponse.json({ error: "Failed to calculate shipping" }, { status: 500 });
  }
}
