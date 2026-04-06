import { NextRequest, NextResponse } from "next/server";
import { createPrintJob } from "@/app/lib/lulu";

/**
 * POST /api/lulu/create-order
 * Called by the Stripe webhook after successful payment.
 * Creates a print job on Lulu with the uploaded PDFs.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId,
      albumTitle,
      interiorUrl,
      coverUrl,
      shippingAddress,
      contactEmail,
    } = body;

    if (!orderId || !interiorUrl || !coverUrl || !shippingAddress || !contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const printJob = await createPrintJob({
      externalId: orderId,
      title: albumTitle || "Album Photo — L'Instantané",
      interiorUrl,
      coverUrl,
      shippingAddress,
      contactEmail,
    });

    console.log(`Lulu print job created: ${printJob.id} for order ${orderId}`);

    return NextResponse.json({
      printJobId: printJob.id,
      status: printJob.status?.name,
    });
  } catch (err) {
    console.error("Lulu create-order error:", err);
    return NextResponse.json(
      { error: "Failed to create print job" },
      { status: 500 }
    );
  }
}
