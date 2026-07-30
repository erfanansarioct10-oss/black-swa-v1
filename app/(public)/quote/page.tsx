import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { QuoteRequest } from "@/components/quote/quote-request";

export const metadata = generatePageMetadata({
  title: "Request a Custom Quotation | Commercial B2B RFQ",
  description:
    "Review selected medical imaging and broadcast hardware equipment, specify custom integration requirements, and submit a formal quotation request.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <Breadcrumbs items={[{ label: "Request Quote", href: "/quote" }]} />

      <div className="space-y-4 text-center sm:text-left border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          B2B Quotation Portal
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Request a Custom Quotation
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Review items in your Quote Cart, specify required quantities, and submit your official RFQ to our Managing Directors.
        </p>
      </div>

      <QuoteRequest />
    </div>
  );
}
