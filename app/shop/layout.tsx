import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album Photo Premium — 44 €, livraison offerte",
  description: "Commande ton album photo imprimé sur papier satiné 170g/m², format A4, couverture rigide. 27 couvertures illustrées. Livré en 7–12 jours en France et Europe.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Album Photo Premium — L'Instantané",
    description: "Papier satiné 170g/m², couverture rigide, livraison offerte. 44 € les 32 pages.",
    url: "https://linstantane.fr/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
