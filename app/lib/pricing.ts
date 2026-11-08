// Gelato hardcover minimum is 32 pages — base price covers this count
export const INCLUDED_PAGES = 32;

export const PACKS = [
  {
    id: "physique" as const,
    name: "Album imprimé",
    basePrice: 44,
    extraPerPage: 0.5,
    desc: "Livre imprimé livré chez toi",
    perks: ["Livre imprimé finition premium", "Livraison offerte", "Pour offrir ou garder"],
    featured: true,
  },
];

export function calculatePrice(packId: string, pageCount: number): number {
  const pack = PACKS.find((p) => p.id === packId);
  if (!pack) return 0;
  const extraPages = Math.max(0, pageCount - INCLUDED_PAGES);
  return Math.round((pack.basePrice + extraPages * pack.extraPerPage) * 100) / 100;
}

/**
 * Livraison offerte : on prend à notre charge jusqu'à FREE_SHIPPING_ALLOWANCE €
 * du tarif Gelato (couvre France, Belgique, Luxembourg, Suisse). Au-delà
 * (Monaco ≈ 25 €), le client paie la différence.
 */
export const FREE_SHIPPING_ALLOWANCE = 11;

/** Ce que paie le client pour la livraison, à partir du tarif Gelato (€). */
export function shippingCharge(gelatoShipping: number): number {
  return Math.max(0, Math.round((gelatoShipping - FREE_SHIPPING_ALLOWANCE) * 100) / 100);
}

export function formatPrice(price: number): string {
  return price % 1 === 0 ? `${price} €` : `${price.toFixed(2).replace(".", ",")} €`;
}
