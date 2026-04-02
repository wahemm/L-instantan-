import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], style: ["normal", "italic"] });

const BASE_URL = "https://linstantane.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "L'Instantané — Album photo premium, livré chez toi", template: "%s | L'Instantané" },
  description: "Crée ton album photo premium en quelques minutes. Choisis ta couverture, place tes photos, personnalise chaque page. Imprimé sur papier brillant 170g/m² et livré chez toi en 5 jours.",
  keywords: ["album photo", "livre photo", "photobook", "album premium", "cadeau photo", "souvenirs"],
  authors: [{ name: "L'Instantané" }],
  openGraph: {
    type: "website", locale: "fr_FR", url: BASE_URL, siteName: "L'Instantané",
    title: "L'Instantané — Album photo premium, livré chez toi",
    description: "Crée ton album photo premium en quelques minutes. Imprimé sur papier brillant 170g/m² et livré en 5 jours.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "L'Instantané — Album photo premium" }],
  },
  twitter: { card: "summary_large_image", title: "L'Instantané — Album photo premium", description: "Tes souvenirs méritent un beau livre.", images: ["/og-image.png"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">{children}</body>
      </html>
    </ClerkProvider>
  );
}
