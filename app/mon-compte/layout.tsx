import type { Metadata } from "next";

// Espace privé client — hors index.
export const metadata: Metadata = {
  title: "Mon compte",
  description: "Tes commandes, tes albums et les paramètres de ton compte L'Instantané.",
  robots: { index: false, follow: true },
};

export default function MonCompteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
