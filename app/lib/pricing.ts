export const INCLUDED_PAGES = 24;

export const PACKS = [
  {
    id: "digital" as const,
    name: "Digital",
    basePrice: 10,
    extraPerPage: 0.25,
    desc: "Album PDF HD — téléchargement immédiat",
    perks: ["Album haute résolution", "PDF prêt à partager", "Téléchargement immédiat"],
  },
  {
    id: "physique" as const,
    name: "Physique",
    basePrice: 29,
    extraPerPage: 0.5,
    desc: "Livre imprimé livré chez toi",
    perks: ["Livre imprimé finition premium", "Livraison en France", "Pour offrir ou garder"],
    featured: true,
  },
  {
    id: "duo" as const,
    name: "Duo",
    basePrice: 35,
    extraPerPage: 0.6,
    desc: "Digital + Physique — le meilleur des deux",
    perks: ["Pack Digital inclus", "Livre imprimé inclus", "Meilleure valeur"],
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
