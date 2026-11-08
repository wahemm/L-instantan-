import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album Photo Premium — 44 €, livraison offerte",
  description: "Commande ton album photo imprimé sur papier satiné 170g/m², format A4, couverture rigide. 41 couvertures illustrées. Livré en 7–12 jours en France et Europe.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Album Photo Premium — L'Instantané",
    description: "Papier satiné 170g/m², couverture rigide, livraison offerte. 44 € les 32 pages.",
    url: "https://linstantane.fr/shop",
  },
};

const BASE_URL = "https://linstantane.fr";

// Fiche produit lue par Google (résultats enrichis + onglet Shopping).
// Doit rester cohérente avec la page : prix (app/lib/pricing.ts), livraison
// offerte FR/BE/CH/LU (supplément Monaco), pas de retour (produit
// personnalisé) — la garantie se fait par réimpression ou remboursement.
const freeShipping = (country: string) => ({
  "@type": "OfferShippingDetails",
  shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "EUR" },
  shippingDestination: { "@type": "DefinedRegion", addressCountry: country },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 4, unitCode: "DAY" },
    transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 8, unitCode: "DAY" },
  },
});

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Album photo personnalisé A4 — couverture rigide",
  description:
    "Album photo personnalisé de 32 pages (jusqu'à 200), format 21×28 cm, couverture rigide illustrée, papier photo satiné 170 g/m². Tu choisis ta couverture et tes mises en page en ligne. Livraison suivie offerte.",
  sku: "ALBUM-A4-RIGIDE",
  brand: { "@type": "Brand", name: "L'Instantané" },
  image: [`${BASE_URL}/covers/Montenegro.png`, `${BASE_URL}/covers/england.png`, `${BASE_URL}/covers/Italie.png`],
  offers: {
    "@type": "Offer",
    url: `${BASE_URL}/shop`,
    priceCurrency: "EUR",
    price: "44.00",
    itemCondition: "https://schema.org/NewCondition",
    availability: "https://schema.org/InStock",
    shippingDetails: ["FR", "BE", "CH", "LU"].map(freeShipping),
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: ["FR", "BE", "CH", "LU", "MC"],
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    },
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      {children}
    </>
  );
}
