"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, ShoppingCart, ArrowLeft, Send, Trash2, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useQuoteCart } from "@/context/quote-cart-context";

export default function QuotePage() {
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

      {submitted ? (
        <div className="p-8 bg-primary/10 border border-primary/20 rounded-2xl space-y-4 max-w-2xl mx-auto text-center">
          <div className="flex justify-center text-primary">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Quotation Request Submitted Successfully!
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Thank you <span className="font-semibold text-foreground">{rfqForm.contactName}</span> ({rfqForm.companyName}). Your official RFQ reference has been generated and dispatched to our engineering team. A Managing Director will review your specifications and contact you shortly.
          </p>
          <div className="pt-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-lg shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Product Catalog</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List Area */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-card border border-border rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span>Selected Products ({mounted ? itemCount : 0} items)</span>
                </h2>
                {mounted && items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {!mounted || items.length === 0 ? (
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
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-muted/30 border border-border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-accent text-foreground px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-sm text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-xs font-mono text-muted-foreground">
                          SKU: {item.sku}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                        <div className="flex items-center border border-border rounded-md bg-background">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label="Remove item from quote cart"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RFQ Form Submission */}
          <div className="lg:col-span-5 bg-card border border-border p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>RFQ Submission Info</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label htmlFor="contactName" className="font-semibold text-foreground">
                  Contact Name *
                </label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  required
                  value={rfqForm.contactName}
                  onChange={handleChange}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="companyName" className="font-semibold text-foreground">
                  Company Name *
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={rfqForm.companyName}
                  onChange={handleChange}
                  placeholder="Global Refining Inc"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="font-semibold text-foreground">
                  Corporate Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={rfqForm.email}
                  onChange={handleChange}
                  placeholder="jsmith@globalrefining.com"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="timelineRequirements" className="font-semibold text-foreground">
                  Project Timeline / Requirements
                </label>
                <textarea
                  id="timelineRequirements"
                  name="timelineRequirements"
                  rows={3}
                  value={rfqForm.timelineRequirements}
                  onChange={handleChange}
                  placeholder="Target delivery date, special alloy requirements, or customs needs..."
                  className="w-full px-3 py-2 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <button
                type="submit"
                disabled={!mounted || items.length === 0 || submitting}
                className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-md shadow-xs hover:opacity-90 transition-opacity disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {submitting
                    ? "Submitting RFQ..."
                    : items.length > 0
                    ? `Submit Quotation Request (${itemCount} items)`
                    : "Submit Quotation Request (Add Items First)"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
