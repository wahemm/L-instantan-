import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Doublon page de confidentialité — canonique = /politique-de-confidentialite (cohérent avec le sitemap)
      {
        source: "/politique-confidentialite",
        destination: "/politique-de-confidentialite",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Empêche l'intégration dans un iframe (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Empêche le MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Force HTTPS pour 2 ans (preload)
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Limite les infos d'origine envoyées aux sites tiers
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Désactive caméra / micro / géoloc non demandés
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
