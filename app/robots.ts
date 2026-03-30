import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/connexion/", "/inscription/", "/result"],
    },
    sitemap: "https://linstantane.vercel.app/sitemap.xml",
  };
}
