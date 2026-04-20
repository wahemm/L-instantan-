import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer mon album photo",
  description: "Crée ton album photo personnalisé en quelques minutes. Choisis ta couverture, importe tes photos, personnalise chaque page. Impression premium 170g/m².",
  alternates: { canonical: "/create" },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
