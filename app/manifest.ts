import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "L'Instantané — Album photo premium",
    short_name: "L'Instantané",
    description: "Crée ton album photo premium en quelques minutes. Imprimé et livré chez toi en 5–7 jours.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0c1220",
    lang: "fr-FR",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    categories: ["photo", "lifestyle", "shopping"],
  };
}
