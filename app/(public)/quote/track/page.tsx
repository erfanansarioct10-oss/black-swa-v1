import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { QuoteTrackingSearchForm } from "@/components/quote/quote-tracking-search-form";

export const metadata = generatePageMetadata({
  title: "Track Quotation Status | Commercial B2B RFQ Portal",
  description:
    "Look up real-time processing status, assigned account manager details, and equipment proposals for your commercial medical & broadcast quotation requests.",
  path: "/quote/track",
});

export default function QuoteTrackPage() {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <Breadcrumbs
        items={[
          { label: "Request Quote", href: "/quote" },
          { label: "Track Quote", href: "/quote/track" },
        ]}
      />

      <div className="space-y-4 text-center sm:text-left border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Public RFQ Tracking Portal
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Track Your Quotation Status
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Enter your Reference ID (e.g. <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs font-mono">RFQ-20260801-9F2C</code>) and email address to view real-time fulfillment progress, assigned account manager details, and official quotation documentation.
        </p>
      </div>

      <QuoteTrackingSearchForm />
    </div>
  );
}
