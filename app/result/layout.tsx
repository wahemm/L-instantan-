import type { Metadata } from "next";

// Page d'aperçu / confirmation de commande — purement transactionnelle, hors index.
export const metadata: Metadata = {
  title: "Aperçu de mon album",
  description: "Visualise ton album avant de commander.",
  robots: { index: false, follow: true },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
