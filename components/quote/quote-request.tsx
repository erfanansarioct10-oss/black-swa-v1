"use client";

import Link from "next/link";
import { FileText, ShoppingCart, ArrowLeft, Send, Trash2, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useQuoteCart } from "@/components/providers/quote-cart-provider";
import { useSimulatedFormSubmit } from "@/hooks/use-simulated-form-submit";

export function QuoteRequest() {
  const { items, itemCount, updateQuantity, removeItem, clearCart, mounted } = useQuoteCart();

  const {
    formData: rfqForm,
    submitting,
    submitted,
    handleChange,
    handleSubmit: handleFormSubmit,
  } = useSimulatedFormSubmit({
    initialValues: {
      contactName: "",
      companyName: "",
      email: "",
      timelineRequirements: "",
    },
    onSubmitSuccess: () => {
      clearCart();
    },
    delayMs: 1000,
  });

  const handleClearCartWithConfirm = () => {
    if (window.confirm("Are you sure you want to clear all items from your quote cart?")) {
      clearCart();
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground bg-card rounded-xl border border-border">
        Loading quotation cart...
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-8 bg-card border border-border rounded-2xl space-y-6 max-w-2xl mx-auto text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-foreground">
            Quotation Request Received
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Thank you, <span className="font-semibold text-foreground">{rfqForm.contactName}</span>. Your RFQ for <span className="font-semibold text-foreground">{rfqForm.companyName}</span> has been dispatched to our sales engineering team.
          </p>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg text-xs text-muted-foreground text-left max-w-md mx-auto space-y-1">
          <p>• Confirmation email sent to: <span className="font-mono text-foreground font-semibold">{rfqForm.email}</span></p>
          <p>• Account Manager Response Time: <span className="font-semibold text-foreground">Under 2 Business Hours</span></p>
        </div>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Equipment Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 bg-card border border-border rounded-2xl text-center max-w-xl mx-auto space-y-5 shadow-sm">
        <div className="w-14 h-14 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            Your Quote Cart is Empty
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse our medical and broadcast hardware catalog to request customized enterprise pricing.
          </p>
        </div>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Products Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Selected Quote Items List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Selected Items ({itemCount})
          </h2>

          <button
            onClick={handleClearCartWithConfirm}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card p-5 rounded-xl border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <h3 className="font-bold text-foreground text-base leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs font-mono text-muted-foreground">
                  SKU: {item.sku}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                {/* Quantity Controls */}
                <div className="flex items-center border border-input rounded-lg bg-background">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${item.name}`}
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-l-lg transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-foreground">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.name}`}
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-r-lg transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name} from quote cart`}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RFQ Submission Form */}
      <div className="lg:col-span-5 bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm space-y-6 h-fit">
        <h2 className="text-xl font-bold text-foreground pb-2 border-b border-border">
          Submit Quote Request
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="contactName" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Contact Name <span className="text-destructive">*</span>
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              required
              value={rfqForm.contactName}
              onChange={handleChange}
              placeholder="e.g. Sarah Jenkins"
              className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="companyName" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Company / Hospital <span className="text-destructive">*</span>
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              value={rfqForm.companyName}
              onChange={handleChange}
              placeholder="e.g. Apex Health Systems"
              className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Corporate Email <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={rfqForm.email}
              onChange={handleChange}
              placeholder="s.jenkins@apexhealth.com"
              className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="timelineRequirements" className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Project Timeline & Specs
            </label>
            <textarea
              id="timelineRequirements"
              name="timelineRequirements"
              rows={3}
              value={rfqForm.timelineRequirements}
              onChange={handleChange}
              placeholder="Specify target delivery date, custom rack requirements, or technical constraints..."
              className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-foreground text-background text-sm font-bold shadow hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? (
              <span>Generating Quotation...</span>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Official RFQ</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
