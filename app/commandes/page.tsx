import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/app/components/Nav";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Mes commandes — L'Instantané",
  robots: { index: false, follow: false },
};

interface Order {
  id: string;
  albumTitle: string;
  pageCount: number;
  amount: number;
  createdAt: number;
  shippingName: string;
  shippingCity: string;
  shippingCountry: string;
}

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

  return allSessions.map((session) => ({
    id: session.id,
    albumTitle: session.metadata?.albumTitle ?? "Mon Album",
    pageCount: Number(session.metadata?.pageCount ?? 24),
    amount: session.amount_total ?? 0,
    createdAt: session.created,
    shippingName:
      session.shipping_details?.name ??
      session.customer_details?.name ??
      "",
    shippingCity: session.shipping_details?.address?.city ?? "",
    shippingCountry:
      session.shipping_details?.address?.country ??
      session.metadata?.shippingCountry ??
      "FR",
  }));
}

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
              Créer mon album →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
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
                      {order.pageCount} pages · Album A4 couverture rigide
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

                {/* Status bar */}
                <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-sm font-medium text-slate-700">
                      Commande confirmée
                    </span>
                    <span className="text-sm text-slate-400">— en cours de fabrication</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Livraison prévue sous 5–7 jours ouvrés
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Footer links */}
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

      <footer className="border-t border-gray-100 bg-white py-10 mt-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-[family-name:var(--font-playfair)] text-slate-900">L&apos;Instantané</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/mentions-legales" className="transition hover:text-slate-700">Mentions légales</Link>
            <Link href="/cgv" className="transition hover:text-slate-700">CGV</Link>
            <Link href="/politique-de-confidentialite" className="transition hover:text-slate-700">Confidentialité</Link>
            <Link href="/faq" className="transition hover:text-slate-700">FAQ</Link>
          </div>
          <span>&copy; 2026 L&apos;Instantané</span>
        </div>
      </footer>
    </main>
  );
}
