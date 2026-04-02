export const INCLUDED_PAGES = 24;

export const PACKS = [
  {
    id: "physique" as const,
    name: "Album imprimé",
    basePrice: 29,
    extraPerPage: 0.5,
    desc: "Livre imprimé livré chez toi",
    perks: ["Livre imprimé finition premium", "Livraison en France", "Pour offrir ou garder"],
    featured: true,
  },
];

export function calculatePrice(packId: string, pageCount: number): number {
  const pack = PACKS.find((p) => p.id === packId);
  if (!pack) return 0;
  const extraPages = Math.max(0, pageCount - INCLUDED_PAGES);
  return Math.round((pack.basePrice + extraPages * pack.extraPerPage) * 100) / 100;
}

export function formatPrice(price: number): string {
  return price % 1 === 0 ? `${price} €` : `${price.toFixed(2).replace(".", ",")} €`;
}
