import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/constants/site";
import { ALL_SERVICES } from "@/constants/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/products",
    "/contact",
    "/quote",
    "/privacy",
    "/terms",
  ];

  const staticSitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => {
    let priority = 0.5;
    let changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/products" || route === "/services") {
      priority = 0.9;
      changeFrequency = "weekly";
    } else if (route === "/about" || route === "/contact" || route === "/quote") {
      priority = 0.8;
      changeFrequency = "monthly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });

  const serviceSitemapEntries: MetadataRoute.Sitemap = ALL_SERVICES.map((serv) => ({
    url: `${baseUrl}/services/${serv.slug}`,
    lastModified: new Date(serv.blogContent.publishedDate),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticSitemapEntries, ...serviceSitemapEntries];
}
