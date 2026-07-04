import { NextRequest, NextResponse } from "next/server";
import { getGelatoShippingQuote } from "@/app/lib/gelato";

/**
 * POST /api/gelato/shipping-cost
 * Body: { pageCount: number, countryCode: string }
 * Returns: { shippingCost: number, minDeliveryDays?, maxDeliveryDays?, currency }
 *
 * Estimates shipping via Gelato's read-only order-quote endpoint. Falls back
 * to 8.60 € (≈ Gelato's tracked-standard France rate) so the summary UI never
 * blocks on a transient quote failure.
 */
export async function POST(req: NextRequest) {
  try {
    const { pageCount, countryCode } = await req.json();
    const pc = typeof pageCount === "number" ? pageCount : 32;
    const cc = (typeof countryCode === "string" && countryCode) || "FR";

    const quote = await getGelatoShippingQuote(pc, cc);

    return NextResponse.json({
      shippingCost: quote?.price ?? 8.6,
      minDeliveryDays: quote?.minDeliveryDays,
      maxDeliveryDays: quote?.maxDeliveryDays,
      currency: "EUR",
    });
  } catch (err) {
    console.error("Gelato shipping cost error:", err);
    return NextResponse.json({ error: "Failed to calculate shipping" }, { status: 500 });
  }
}
