import type { Metadata } from "next";
import { SITE_CONFIG } from "@/constants/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogType?: "website" | "article";
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  ogType = "website",
}: PageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = path === "" ? SITE_CONFIG.url : `${SITE_CONFIG.url}${normalizedPath}`;
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;

  return {
    title,
    description,
    keywords: [...SITE_CONFIG.keywords, ...keywords],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: ogType,
      images: [
        {
          url: `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} Hardware Solutions`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`],
      creator: "@BlackSwanInt",
    },
  };
}
