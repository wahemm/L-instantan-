import { NextRequest, NextResponse } from "next/server";
import { currentAdminEmail } from "@/app/lib/auth";
import { createPrintJob } from "@/app/lib/lulu";

/**
 * POST /api/lulu/create-order — ancien circuit Lulu (l'impression passe
 * désormais par Gelato, depuis le webhook Stripe).
 * Crée une impression réelle facturée sur le compte Lulu : réservé à l'admin.
 */
export async function POST(req: NextRequest) {
  if (!(await currentAdminEmail())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
