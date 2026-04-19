import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieBanner from "@/app/components/CookieBanner";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], style: ["normal", "italic"] });

const BASE_URL = "https://linstantane.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "L'Instantané — Album photo premium, livré chez toi", template: "%s | L'Instantané" },
  description: "Crée ton album photo premium en quelques minutes. Choisis ta couverture, place tes photos, personnalise chaque page. Imprimé sur papier brillant 170g/m² et livré chez toi en 5–7 jours.",
  keywords: ["album photo", "livre photo", "photobook", "album premium", "cadeau photo", "souvenirs", "album personnalisé", "impression photo"],
  authors: [{ name: "L'Instantané" }],
  openGraph: {
    type: "website", locale: "fr_FR", url: BASE_URL, siteName: "L'Instantané",
    title: "L'Instantané — Album photo premium, livré chez toi",
    description: "Crée ton album photo premium en quelques minutes. Imprimé sur papier brillant 170g/m² et livré en 5–7 jours.",
  },
  twitter: { card: "summary_large_image", title: "L'Instantané — Album photo premium", description: "Tes souvenirs méritent un beau livre." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "L'Instantané",
                url: BASE_URL,
                logo: `${BASE_URL}/icon.svg`,
                description: "L'Instantané — album photo premium imprimé et livré chez toi. Format A4, papier brillant, couverture rigide.",
                email: "linstantane.officiel@gmail.com",
                sameAs: [
                  "https://instagram.com/linstantane_souvenir",
                  "https://tiktok.com/@linstantane_souvenir",
                ],
                areaServed: ["FR", "BE", "CH", "LU", "MC"],
              }),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: "Album Photo Premium — L'Instantané",
                description: "Album photo personnalisé imprimé sur papier brillant 170g/m², format A4, couverture rigide. Livré en 5–7 jours.",
                image: [`${BASE_URL}/covers/Espagne.png`, `${BASE_URL}/covers/paris.png`, `${BASE_URL}/covers/Italie.png`],
                brand: { "@type": "Brand", name: "L'Instantané" },
                offers: {
                  "@type": "Offer",
                  url: `${BASE_URL}/create`,
                  priceCurrency: "EUR",
                  price: "29.00",
                  availability: "https://schema.org/InStock",
                  hasMerchantReturnPolicy: {
                    "@type": "MerchantReturnPolicy",
                    applicableCountry: ["FR", "BE", "CH", "LU", "MC"],
                    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                    merchantReturnDays: 14,
                    returnMethod: "https://schema.org/ReturnByMail",
                    returnFees: "https://schema.org/FreeReturn",
                  },
                  shippingDetails: {
                    "@type": "OfferShippingDetails",
                    shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "EUR" },
                    deliveryTime: {
                      "@type": "ShippingDeliveryTime",
                      handlingTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 7, unitCode: "DAY" },
                    },
                    shippingDestination: { "@type": "DefinedRegion", addressCountry: ["FR", "BE", "CH", "LU", "MC"] },
                  },
                },
              }),
            }}
          />
          {children}
          <Analytics />
          <SpeedInsights />
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
