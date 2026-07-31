import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
  className?: string;
}

export function Breadcrumbs({ items, variant = "light", className }: BreadcrumbsProps) {
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

  const isDark = variant === "dark";

  return (
    <>
      <JsonLd data={jsonLdPayload} />
      <nav aria-label="Breadcrumb" className={cn("py-2 px-1", className)}>
        <ol
          className={cn(
            "flex items-center flex-wrap gap-1.5 text-xs font-medium",
            isDark ? "text-slate-400" : "text-slate-500"
          )}
        >
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={index} className="inline-flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 flex-shrink-0",
                      isDark ? "text-slate-500" : "text-slate-400"
                    )}
                  />
                )}
                {index === 0 ? (
                  <Link
                    href="/"
                    className={cn(
                      "inline-flex items-center gap-1 transition-colors",
                      isDark
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span className="sr-only">Home</span>
                  </Link>
                ) : isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(
                      "font-semibold truncate max-w-[200px]",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "transition-colors truncate max-w-[150px]",
                      isDark
                        ? "text-slate-300 hover:text-white"
                        : "text-slate-600 hover:text-slate-900"
                    )}
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
