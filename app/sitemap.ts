import { MetadataRoute } from "next";

const BASE_URL = "https://linstantane.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL,                             lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${BASE_URL}/shop`,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/create`,                 lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/comment-ca-marche`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`,                    lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/qui-sommes-nous`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/mentions-legales`,       lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE_URL}/cgv`,                    lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];
}
