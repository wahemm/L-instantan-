import Stripe from "stripe";

/**
 * Sessions Stripe payées pour un email, la plus récente d'abord.
 *
 * Le checkout crée un profil client Stripe à CHAQUE achat
 * (`customer_creation: "always"`) : un client qui recommande a donc plusieurs
 * profils avec le même email. On les parcourt tous, sinon seule la dernière
 * commande s'afficherait.
 */
export async function listPaidSessionsByEmail(
  stripe: Stripe,
  email: string
): Promise<Stripe.Checkout.Session[]> {
  const customers = await stripe.customers.list({ email, limit: 20 });
  const lists = await Promise.all(
    customers.data.map((c) => stripe.checkout.sessions.list({ customer: c.id, limit: 50 }))
  );
  return lists
    .flatMap((l) => l.data)
    .filter((s) => s.payment_status === "paid")
    .sort((a, b) => b.created - a.created);
}
