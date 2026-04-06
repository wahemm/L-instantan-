import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/lulu/webhook
 * Receives status updates from Lulu when a print job changes state.
 * Statuses: CREATED → UNPAID → PAYMENT_IN_PROGRESS → PRODUCTION_READY
 *           → IN_PRODUCTION → SHIPPED → DELIVERED
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const topic = body.topic;
    const printJob = body.data;

    if (!printJob) {
      return NextResponse.json({ error: "No data" }, { status: 400 });
    }

    const status = printJob.status?.name;
    const externalId = printJob.external_id;
    const printJobId = printJob.id;

    console.log(`[Lulu Webhook] Job ${printJobId} (order: ${externalId}) → ${status}`);

    if (status === "SHIPPED") {
      const lineItems = printJob.line_items || [];
      const trackingId = lineItems[0]?.tracking_id;
      const trackingUrls = lineItems[0]?.tracking_urls;
      const carrier = lineItems[0]?.carrier_name;

      console.log(`[Lulu] Order ${externalId} shipped! Carrier: ${carrier}, Tracking: ${trackingId}`);
      console.log(`[Lulu] Tracking URLs:`, trackingUrls);

      // TODO: Send shipping notification email to customer via Resend
      // TODO: Update order status in database when we add one
    }

    if (status === "REJECTED" || status === "ERROR" || status === "CANCELED") {
      console.error(`[Lulu] Order ${externalId} failed with status: ${status}`);
      // TODO: Alert admin, potentially refund via Stripe
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Lulu webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
