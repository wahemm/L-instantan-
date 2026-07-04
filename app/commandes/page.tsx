import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import Stripe from "stripe";
import { batchGelatoStatuses } from "@/app/lib/gelato";

export const metadata: Metadata = {
  title: "Mes commandes — L'Instantané",
  robots: { index: false, follow: false },
};

// ── Types ───────────────────────────────────────────────────────────────

interface Order {
  id: string;
  albumTitle: string;
  pageCount: number;
  amount: number;
  createdAt: number;
  shippingName: string;
  shippingCity: string;
  shippingCountry: string;
  gelatoStatus?: string;
  trackingCode?: string;
  trackingUrl?: string;
}

// ── Status helpers (Gelato statuses are lowercase) ─────────────────────

const STATUS_CONFIG: Record<string, { label: string; sub: string; color: string; dot: string }> = {
  // Gelato statuses
  created:          { label: "Commande reçue",         sub: "En attente de traitement",                           color: "text-blue-700",    dot: "bg-blue-400" },
  draft:            { label: "Brouillon",               sub: "Commande en cours de préparation",                  color: "text-slate-500",   dot: "bg-slate-400" },
  pending_approval: { label: "En attente",              sub: "Vérification en cours",                             color: "text-amber-700",   dot: "bg-amber-400 animate-pulse" },
  passed:           { label: "Acceptée",                sub: "Ton album va être envoyé en impression",            color: "text-indigo-700",  dot: "bg-indigo-400" },
  in_production:    { label: "En cours d'impression",  sub: "Ton album est entre les mains de nos imprimeurs",   color: "text-indigo-700",  dot: "bg-indigo-400 animate-pulse" },
  shipped:          { label: "Expédié",                 sub: "Ton album est en route !",                          color: "text-emerald-700", dot: "bg-emerald-400" },
  delivered:        { label: "Livré",                   sub: "Profite bien de ton album !",                       color: "text-emerald-700", dot: "bg-emerald-500" },
  failed:           { label: "Erreur",                  sub: "Un problème est survenu — contacte-nous",          color: "text-red-700",     dot: "bg-red-400" },
  canceled:         { label: "Annulé",                  sub: "Cette commande a été annulée",                     color: "text-slate-500",   dot: "bg-slate-400" },
};

const PROGRESS_STEPS = ["created", "passed", "in_production", "shipped", "delivered"];

function getStepIndex(status: string): number {
  const idx = PROGRESS_STEPS.indexOf(status);
  return idx >= 0 ? idx : 0;
}

// ── Data fetching ───────────────────────────────────────────────────────

async function fetchOrders(email: string): Promise<Order[]> {
  const stripeKey = (process.env.STRIPE_SECRET_KEY ?? "").trim();
  if (!stripeKey) return [];

  const stripe = new Stripe(stripeKey, {
    timeout: 15000,
    maxNetworkRetries: 1,
    httpClient: Stripe.createNodeHttpClient(),
  });

  const customers = await stripe.customers.list({ email, limit: 10 });
  if (customers.data.length === 0) return [];

  const allSessions: Stripe.Checkout.Session[] = [];
  for (const customer of customers.data) {
    const sessions = await stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 50,
    });
    allSessions.push(
      ...sessions.data.filter((s) => s.payment_status === "paid")
    );
  }

  allSessions.sort((a, b) => b.created - a.created);

  // Fetch Gelato statuses for all sessions
  const sessionIds = allSessions.map((s) => s.id);
  let gelatoStatuses = new Map<string, { status: string; gelatoOrderId?: string; trackingCode?: string; trackingUrl?: string }>();
  try {
    gelatoStatuses = await batchGelatoStatuses(sessionIds);
  } catch {
    // If Gelato API is down, still show orders without status
  }

  // Stripe Dahlia API (2026-03-25+) moved shipping_details into
  // collected_information.shipping_details.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return allSessions.map((session: any) => {
    const shipping = session.collected_information?.shipping_details
      ?? session.customer_details?.shipping_details
      ?? session.shipping_details;
    const gelato = gelatoStatuses.get(session.id);

    return {
      id: session.id,
      albumTitle: session.metadata?.albumTitle ?? "Mon Album",
      pageCount: Number(session.metadata?.pageCount ?? 32),
      amount: session.amount_total ?? 0,
      createdAt: session.created,
      shippingName: shipping?.name ?? session.customer_details?.name ?? "",
      shippingCity: shipping?.address?.city ?? "",
      shippingCountry: shipping?.address?.country ?? session.metadata?.shippingCountry ?? "FR",
      gelatoStatus: gelato?.status ?? "created",
      trackingCode: gelato?.trackingCode,
      trackingUrl: gelato?.trackingUrl,
    };
  });
}

// ── Formatters ──────────────────────────────────────────────────────────

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAmount(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}

// ── Page ─────────────────────────────────────────────────────────────────

export default async function CommandesPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/connexion");
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const firstName = user?.firstName ?? "";

  const orders = email ? await fetchOrders(email) : [];

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-slate-900">
      <Nav />

      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-2">
            Mon compte
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl text-slate-900">
            {firstName ? `Bonjour, ${firstName}` : "Mes commandes"}
          </h1>
          {email && (
            <p className="text-sm text-slate-400 mt-1">{email}</p>
          )}
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <div className="text-5xl mb-5">📭</div>
            <h2 className="font-[family-name:var(--font-playfair)] text-xl text-slate-900 mb-3">
              Aucune commande pour l&apos;instant
            </h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto">
              Tu n&apos;as pas encore passé de commande. Crée ton premier album photo maintenant !
            </p>
            <Link
              href="/create"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Créer mon album
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => {
              const statusKey = order.gelatoStatus ?? "created";
              const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.created;
              const stepIdx = getStepIndex(statusKey);
              const isFailure = ["failed", "canceled"].includes(statusKey);

              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Left: order info */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📖</span>
                        <h2 className="font-[family-name:var(--font-playfair)] text-lg text-slate-900">
                          {order.albumTitle}
                        </h2>
                      </div>
                      <p className="text-sm text-slate-500 pl-9">
                        {order.pageCount} pages · Album 21×28 cm couverture rigide
                      </p>
                      {order.shippingCity && (
                        <p className="text-sm text-slate-400 pl-9">
                          Livré à {order.shippingName && `${order.shippingName}, `}{order.shippingCity}
                        </p>
                      )}
                    </div>

                    {/* Right: amount + date */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="font-semibold text-slate-900 text-lg">
                        {formatAmount(order.amount)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status section */}
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    {/* Status label */}
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex h-2.5 w-2.5 rounded-full ${config.dot}`} />
                        <span className={`text-sm font-semibold ${config.color}`}>
                          {config.label}
                        </span>
                        <span className="text-sm text-slate-400">— {config.sub}</span>
                      </div>
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition underline underline-offset-2"
                        >
                          Suivre le colis
                        </a>
                      )}
                    </div>

                    {/* Progress bar (only for non-failure statuses) */}
                    {!isFailure && (
                      <div className="flex items-center gap-1">
                        {PROGRESS_STEPS.map((step, i) => (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              i <= stepIdx ? "bg-emerald-400" : "bg-slate-100"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Delivery estimate */}
                    {!isFailure && statusKey !== "DELIVERED" && statusKey !== "SHIPPED" && (
                      <p className="text-xs text-slate-400 mt-3">
                        Livraison estimée sous 7–12 jours ouvrés
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Help links */}
        <div className="mt-10 flex flex-wrap gap-4 text-sm text-slate-500">
          <Link href="/faq" className="hover:text-slate-900 transition underline underline-offset-2">
            Questions fréquentes
          </Link>
          <span>·</span>
          <a href="mailto:linstantane.officiel@gmail.com" className="hover:text-slate-900 transition underline underline-offset-2">
            Contacter le support
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
