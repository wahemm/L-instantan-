import { NextRequest, NextResponse } from "next/server";
import { getGelatoShippingQuote } from "@/app/lib/gelato";
import { shippingCharge } from "@/app/lib/pricing";

/**
 * POST /api/gelato/shipping-cost
 * Body: { pageCount: number, countryCode: string }
 * Returns: { shippingCost (payé par le client, après livraison offerte), gelatoShipping, … }
 *
 * Estimates shipping via Gelato's read-only order-quote endpoint. Falls back
 * to the usual Gelato rate (France / Monaco) so the summary UI never
 * blocks on a transient quote failure.
 */
export async function POST(req: NextRequest) {
  try {
    const { pageCount, countryCode } = await req.json();
    const pc = typeof pageCount === "number" ? pageCount : 32;
    const cc = (typeof countryCode === "string" && countryCode) || "FR";

    const quote = await getGelatoShippingQuote(pc, cc);

    return NextResponse.json({
      // Ce que paie le client (livraison offerte jusqu'à FREE_SHIPPING_ALLOWANCE)
      shippingCost: shippingCharge(quote?.price ?? (cc === "MC" ? 25.12 : 9.27)),
      gelatoShipping: quote?.price,
      minDeliveryDays: quote?.minDeliveryDays,
      maxDeliveryDays: quote?.maxDeliveryDays,
      productCost: quote?.productPrice,
      currency: "EUR",
    });
  } catch (err) {
    console.error("Gelato shipping cost error:", err);
    return NextResponse.json({ error: "Failed to calculate shipping" }, { status: 500 });
  }
}
