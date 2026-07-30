import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  // Schema.org BreadcrumbList payload
  const jsonLdPayload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `${SITE_CONFIG.url}${item.href}` : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLdPayload} />
      <nav aria-label="Breadcrumb" className="py-2 px-1">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={index} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 flex-shrink-0" />
                )}
                {index === 0 ? (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span className="sr-only">Home</span>
                  </Link>
                ) : isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="font-medium text-foreground truncate max-w-[200px]"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-foreground transition-colors truncate max-w-[150px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
