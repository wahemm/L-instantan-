import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Lightweight liveness probe — returns 200 with basic uptime info.
 * Use with UptimeRobot / BetterUptime / Cron-Job.org to monitor that
 * the deployment is responsive. No auth, no side effects, no DB calls.
 *
 * Returns 200 even if downstream APIs (Stripe, Lulu, Resend) are down,
 * because this probe is meant to answer "is Next.js serving requests?".
 * For deep checks of downstream services, add a separate /api/ready.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "linstantane",
      timestamp: new Date().toISOString(),
      uptime: typeof process !== "undefined" && process.uptime ? process.uptime() : null,
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
