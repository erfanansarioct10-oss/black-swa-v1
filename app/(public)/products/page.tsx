import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ProductCatalog } from "@/components/products/product-catalog";
import { SAMPLE_PRODUCTS } from "@/constants/products";
import { SITE_CONFIG } from "@/constants/site";

export const metadata = generatePageMetadata({
  title: "Enterprise Medical & Broadcast Hardware Catalog",
  description:
    "Browse DICOM-compliant medical imaging processors, telehealth gateways, 8K broadcast encoding servers, and video wall computing hardware.",
  path: "/products",
});

export default function ProductsPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Black Swan Hardware Catalog",
    description: "Medical Technology & Broadcast Computer Hardware Solutions",
    itemListElement: SAMPLE_PRODUCTS.map((prod, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: prod.name,
        description: prod.desc,
        sku: prod.sku,
        brand: {
          "@type": "Brand",
          name: SITE_CONFIG.name,
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          price: "Request Quote",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <JsonLd data={itemListSchema} />
      <Breadcrumbs items={[{ label: "Hardware Catalog", href: "/products" }]} />

      <div className="space-y-4 text-center sm:text-left border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Equipment Catalog
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Medical & Broadcast Hardware
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Select certified hardware components for custom quotation, system configuration, or immediate enterprise procurement.
        </p>
      </div>

      <ProductCatalog />
    </div>
  );
}
