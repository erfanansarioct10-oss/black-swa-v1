"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  FileText,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Send,
  Building2,
  Mail,
  Phone,
  User,
  Clock,
  DollarSign,
  AlertCircle,
  FileCode2,
  CheckSquare,
  ShoppingCart,
} from "lucide-react";

import { useQuoteCart, type QuoteCartItem } from "@/components/providers/quote-cart-provider";
import type { CreateQuoteSchemaType } from "@/schemas/quote";

/* -------------------------------------------------------------------------- */
/* STEP 1: Equipment & Cart Review with Custom Item Specs                    */
/* -------------------------------------------------------------------------- */

interface RFQStepEquipmentProps {
  onNext: () => void;
}

export function RFQStepEquipment({ onNext }: RFQStepEquipmentProps) {
  const { items, itemCount, updateQuantity, updateNotes, removeItem, clearCart } = useQuoteCart();
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);

  const handleClearCartWithConfirm = () => {
    if (window.confirm("Are you sure you want to clear all items from your quotation cart?")) {
      clearCart();
    }
  };

  if (items.length === 0) {
    return (
      <div className="p-8 sm:p-12 bg-card border border-border rounded-2xl text-center max-w-xl mx-auto space-y-5 shadow-sm">
        <div className="w-14 h-14 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-foreground">
            Your Quote Cart is Empty
          </h2>
          <p className="text-sm text-muted-foreground">
            Browse our medical imaging and broadcasting computer hardware catalog to add items for quotation.
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
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Selected Equipment Items ({itemCount})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review quantities and specify custom technical requirements per line item.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCartWithConfirm}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item: QuoteCartItem) => {
          const hasNotes = Boolean(item.notes && item.notes.trim().length > 0);
          const isNotesExpanded = activeNotesId === item.id || hasNotes;

          return (
            <div
              key={item.id}
              className="bg-card p-4 sm:p-5 rounded-xl border border-border shadow-sm space-y-3 transition-all hover:border-border/80"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-foreground text-base leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground">
                    SKU: {item.sku}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-input rounded-lg bg-background shadow-xs">
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

              {/* Technical Specifications per Line Item */}
              <div className="pt-2 border-t border-border/50 space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveNotesId((prev) => (prev === item.id ? null : item.id))
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <FileCode2 className="h-3.5 w-3.5" />
                  {hasNotes ? "Edit Technical Specs / Requirements" : "+ Add Custom Technical Specs / Notes"}
                </button>

                {isNotesExpanded && (
                  <div className="space-y-1.5 pt-1">
                    <label
                      htmlFor={`item-notes-${item.id}`}
                      className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block"
                    >
                      Custom Specs for {item.name}:
                    </label>
                    <textarea
                      id={`item-notes-${item.id}`}
                      rows={2}
                      value={item.notes || ""}
                      onChange={(e) => updateNotes(item.id, e.target.value)}
                      placeholder="e.g. DICOM 3.0 display calibration, redundant dual 750W PSU, 19-inch rackmount kit..."
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 1 Navigation CTA */}
      <div className="flex justify-end pt-4 border-t border-border">
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow hover:opacity-90 transition-opacity"
        >
          <span>Continue to Project Details</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* STEP 2: Enterprise Contact & Project Details Form                          */
/* -------------------------------------------------------------------------- */

interface RFQStepDetailsProps {
  formData: Partial<CreateQuoteSchemaType>;
  onChange: (field: keyof CreateQuoteSchemaType, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function RFQStepDetails({ formData, onChange, onNext, onBack }: RFQStepDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = "Contact name must be at least 2 characters.";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please provide a valid corporate email address.";
    }

    if (!formData.phone || formData.phone.trim().length < 7) {
      newErrors.phone = "Phone number must be at least 7 digits.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={validateAndProceed} className="space-y-6">
      <div className="pb-3 border-b border-border">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Contact & Enterprise Project Details
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Provide your organizational details to help our sales engineering team tailor the quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Contact Name <span className="text-destructive">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={formData.fullName || ""}
            onChange={(e) => {
              onChange("fullName", e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
            }}
            placeholder="e.g. Dr. Alexander Vance"
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.fullName && (
            <p className="text-xs font-medium text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Corporate Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Corporate Email <span className="text-destructive">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email || ""}
            onChange={(e) => {
              onChange("email", e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
            placeholder="a.vance@stjude-health.org"
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            Direct Phone Number <span className="text-destructive">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={formData.phone || ""}
            onChange={(e) => {
              onChange("phone", e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            placeholder="+1 (555) 019-2834"
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {errors.phone && (
            <p className="text-xs font-medium text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Company / Hospital Name */}
        <div className="space-y-1.5">
          <label htmlFor="companyName" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
            Hospital / Company Name
          </label>
          <input
            id="companyName"
            type="text"
            value={formData.companyName || ""}
            onChange={(e) => onChange("companyName", e.target.value)}
            placeholder="e.g. St. Jude Medical Center / Apex Broadcast"
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Budget Range Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="budgetRange" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
            Estimated Project Budget Range (NPR)
          </label>
          <select
            id="budgetRange"
            value={formData.budgetRange || ""}
            onChange={(e) => onChange("budgetRange", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select estimated budget...</option>
            <option value="Under NPR 500,000">Under NPR 500,000</option>
            <option value="NPR 500,000 - NPR 2,500,000">NPR 500,000 - NPR 2,500,000</option>
            <option value="NPR 2,500,000 - NPR 10,000,000">NPR 2,500,000 - NPR 10,000,000</option>
            <option value="NPR 10,000,000 - NPR 25,000,000">NPR 10,000,000 - NPR 25,000,000</option>
            <option value="NPR 25,000,000+">NPR 25,000,000+</option>
          </select>
        </div>


        {/* Targeted Timeline Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="timeline" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            Target Implementation Timeline
          </label>
          <select
            id="timeline"
            value={formData.timeline || ""}
            onChange={(e) => onChange("timeline", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select target timeline...</option>
            <option value="Immediate (< 1 month)">Immediate (&lt; 1 month)</option>
            <option value="1 - 3 months">1 - 3 months</option>
            <option value="3 - 6 months">3 - 6 months</option>
            <option value="Flexible / Budget Planning">Flexible / Budget Planning</option>
          </select>
        </div>
      </div>

      {/* Project Scope & Integration Requirements */}
      <div className="space-y-1.5">
        <label htmlFor="projectScope" className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          Overall Project Scope & Technical Requirements
        </label>
        <textarea
          id="projectScope"
          rows={3}
          value={formData.projectScope || ""}
          onChange={(e) => onChange("projectScope", e.target.value)}
          placeholder="Describe your installation environment, integration constraints, compliance requirements, or custom SLAs..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      {/* Step 2 Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Equipment
        </button>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow hover:opacity-90 transition-opacity"
        >
          <span>Continue to Verification</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/* STEP 3: Anti-Bot Verification & Final Review Summary                     */
/* -------------------------------------------------------------------------- */

interface RFQStepReviewProps {
  formData: Partial<CreateQuoteSchemaType>;
  onTurnstileSuccess: (token: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
  submitError?: string | null;
}

export function RFQStepReview({
  formData,
  onTurnstileSuccess,
  onSubmit,
  onBack,
  submitting,
  submitError,
}: RFQStepReviewProps) {
  const { items } = useQuoteCart();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-primary" />
          Final Review & Verification
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Review your RFQ summary and complete anti-bot verification before submitting to our Managing Directors.
        </p>
      </div>

      {submitError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Submission Error</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Summary */}
        <div className="bg-card p-4 sm:p-5 rounded-xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Requested Equipment ({items.length})
            </h3>
          </div>
          <ul className="divide-y divide-border/60 text-xs space-y-2 pt-1">
            {items.map((item) => (
              <li key={item.id} className="pt-2 first:pt-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-foreground">{item.name}</span>
                  <span className="font-mono font-bold bg-muted px-1.5 py-0.5 rounded text-[11px] shrink-0">
                    Qty: {item.quantity}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-muted-foreground">SKU: {item.sku}</p>
                {item.notes && (
                  <p className="text-[11px] italic text-muted-foreground bg-muted/30 p-1.5 rounded border border-border/40">
                    Specs: {item.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Project Summary */}
        <div className="bg-card p-4 sm:p-5 rounded-xl border border-border shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              Project & Contact Information
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Contact Name</span>
              <span className="font-semibold text-foreground">{formData.fullName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Corporate Email</span>
              <span className="font-mono font-semibold text-foreground">{formData.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase font-bold">Phone Number</span>
              <span className="font-semibold text-foreground">{formData.phone}</span>
            </div>
            {formData.companyName && (
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-bold">Hospital / Company</span>
                <span className="font-semibold text-foreground">{formData.companyName}</span>
              </div>
            )}
            {(formData.budgetRange || formData.timeline) && (
              <div className="pt-1 border-t border-border/60 grid grid-cols-2 gap-2">
                {formData.budgetRange && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Budget</span>
                    <span className="font-semibold text-foreground">{formData.budgetRange}</span>
                  </div>
                )}
                {formData.timeline && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">Timeline</span>
                    <span className="font-semibold text-foreground">{formData.timeline}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cloudflare Turnstile Anti-Bot Verification */}
      <div className="p-5 bg-card border border-border rounded-xl shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
          Security & Anti-Bot Verification
        </h3>

        {turnstileSiteKey ? (
          <div className="flex justify-center py-2">
            <Turnstile
              siteKey={turnstileSiteKey}
              onSuccess={(token) => onTurnstileSuccess(token)}
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic bg-muted/40 p-2.5 rounded-lg border border-border/60">
            • Security verification active (Development environment bypass)
          </p>
        )}

        {/* Consent Checkbox */}
        <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 rounded border-input text-primary focus:ring-ring"
          />
          <span>
            I confirm that the contact details provided are accurate and authorize Black Swan International to send an official B2B quotation.
          </span>
        </label>
      </div>

      {/* Step 3 Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </button>

        <button
          type="button"
          disabled={!agreedToTerms || submitting}
          onClick={onSubmit}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-foreground text-background text-sm font-bold shadow hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}
