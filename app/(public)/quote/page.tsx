import Link from "next/link";
import { FileText, ShoppingCart, ArrowLeft, Send } from "lucide-react";

export default function QuotePage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
      <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List Area */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span>Selected Products (0 items)</span>
            </h2>

            <div className="py-12 text-center space-y-3 bg-muted/20 border border-dashed border-border rounded-xl">
              <p className="text-sm text-muted-foreground">
                Your Quote Cart is currently empty.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-md shadow-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Browse Products to Add</span>
              </Link>
            </div>
          </div>
        </div>

        {/* RFQ Form Submission */}
        <div className="lg:col-span-5 bg-card border border-border p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>RFQ Submission Info</span>
          </h2>

          <form className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Contact Name *</label>
              <input
                type="text"
                placeholder="Jane Smith"
                className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Company Name *</label>
              <input
                type="text"
                placeholder="Global Refining Inc"
                className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Corporate Email *</label>
              <input
                type="email"
                placeholder="jsmith@globalrefining.com"
                className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Project Timeline / Requirements</label>
              <textarea
                rows={3}
                placeholder="Target delivery date, special alloy requirements, or customs needs..."
                className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              disabled
              className="w-full py-3 bg-muted text-muted-foreground font-bold text-xs rounded-md cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit Quotation Request (Add Items First)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
