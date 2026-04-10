import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes",
  description: "Toutes les réponses sur l'album photo L'Instantané : tarifs, délais de livraison, personnalisation, format, qualité papier et paiement sécurisé.",
  openGraph: {
    title: "FAQ — L'Instantané",
    description: "Toutes vos questions sur la création et la livraison de votre album photo premium.",
    url: "https://linstantane.fr/faq",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
