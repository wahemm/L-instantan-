import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Doublon page de confidentialité
      {
        source: "/politique-de-confidentialite",
        destination: "/politique-confidentialite",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
