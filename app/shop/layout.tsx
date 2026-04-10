import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album Photo Premium — À partir de 29 €",
  description: "Commande ton album photo imprimé sur papier brillant 170g/m², format A4, couverture rigide. 27 couvertures illustrées. Livré en 5–7 jours en France et Europe.",
  openGraph: {
    title: "Album Photo Premium — L'Instantané",
    description: "Papier brillant 170g/m², couverture rigide, livraison France & Europe. À partir de 29 €.",
    url: "https://linstantane.fr/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
