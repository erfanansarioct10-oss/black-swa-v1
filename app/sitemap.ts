import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const lastModified = new Date();

  const publicRoutes = [
    "",
    "/about",
    "/services",
    "/products",
    "/contact",
    "/quote",
    "/privacy",
    "/terms",
  ];

  return publicRoutes.map((route) => {
    let priority = 0.5;
    let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/products" || route === "/services") {
      priority = 0.8;
      changeFrequency = "weekly";
    } else if (route === "/about" || route === "/contact" || route === "/quote") {
      priority = 0.7;
      changeFrequency = "monthly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });
}
