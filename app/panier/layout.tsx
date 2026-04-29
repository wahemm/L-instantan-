import type { Metadata } from "next";

// Le panier est public (pour ne pas créer de 404 dans Search Console)
// mais reste hors index : c'est une page personnelle, sans valeur SEO.
export const metadata: Metadata = {
  title: "Mon panier",
  description: "Tes albums photo en attente de commande.",
  robots: { index: false, follow: true },
};

export default function PanierLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
