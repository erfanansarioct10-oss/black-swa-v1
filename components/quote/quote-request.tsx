"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ShoppingCart, ArrowLeft, Send, Trash2, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useQuoteCart } from "@/components/providers/quote-cart-provider";

export function QuoteRequest() {
  const { items, itemCount, updateQuantity, removeItem, clearCart, mounted } = useQuoteCart();

  const [rfqForm, setRfqForm] = useState({
    contactName: "",
    companyName: "",
    email: "",
    timelineRequirements: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRfqForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      clearCart();
    }, 1000);
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
        <div className="flex justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-14 w-14" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Quotation Request Submitted Successfully!
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Your RFQ reference has been generated and dispatched to our engineering accounts team. A formal quote document with custom pricing and delivery timelines will be emailed within 1 business day.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Return to Hardware Catalog
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-card rounded-xl border border-border p-8 space-y-6 max-w-2xl mx-auto shadow-sm">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted text-muted-foreground">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Your Quote Cart is Empty</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Select medical technology or broadcast compute hardware from our equipment catalog to generate a custom commercial RFQ.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Browse Hardware Catalog</span>
        </Link>
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
            onClick={clearCart}
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
                    className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-r-lg transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-foreground text-background text-sm font-bold shadow hover:opacity-90 transition-opacity disabled:opacity-50 pt-3"
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
