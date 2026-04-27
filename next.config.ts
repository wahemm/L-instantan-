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
};

export default nextConfig;
