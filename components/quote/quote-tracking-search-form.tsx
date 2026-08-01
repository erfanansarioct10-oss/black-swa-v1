"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, FileText, Mail, AlertCircle } from "lucide-react";

import { quoteTrackingLookupSchema } from "@/schemas/quote";

interface QuoteTrackingSearchFormProps {
  initialReferenceId?: string;
  initialEmail?: string;
}

export function QuoteTrackingSearchForm({
  initialReferenceId = "",
  initialEmail = "",
}: QuoteTrackingSearchFormProps) {
  const router = useRouter();
  const [referenceId, setReferenceId] = useState(initialReferenceId);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ referenceId?: string; email?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    const validation = quoteTrackingLookupSchema.safeParse({
      referenceId: referenceId.trim().toUpperCase(),
      email: email.trim(),
    });

    if (!validation.success) {
      const formattedErrors: { referenceId?: string; email?: string } = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path.includes("referenceId")) {
          formattedErrors.referenceId = issue.message;
        }
        if (issue.path.includes("email")) {
          formattedErrors.email = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setLoading(true);
    const targetRef = validation.data.referenceId;
    const targetEmail = validation.data.email;

    router.push(
      `/quote/track/${encodeURIComponent(targetRef)}?email=${encodeURIComponent(targetEmail)}`
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6 space-y-2 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
          <Search className="w-5 h-5 text-primary" />
          Look Up Quotation Request
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your official Quotation Reference ID (e.g., <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs font-mono">RFQ-20260801-9F2C</code>) and the email address used during RFQ submission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="referenceId" className="block text-sm font-medium text-foreground">
            Quotation Reference ID <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="referenceId"
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
              placeholder="RFQ-20260801-9F2C"
              className={`w-full pl-10 pr-4 py-2.5 bg-background border ${
                errors?.referenceId ? "border-destructive" : "border-input"
              } rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase transition-colors`}
              required
            />
          </div>
          {errors?.referenceId && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.referenceId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Verification Email Address <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="procurement@hospital.org"
              className={`w-full pl-10 pr-4 py-2.5 bg-background border ${
                errors?.email ? "border-destructive" : "border-input"
              } rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
              required
            />
          </div>
          {errors?.email && (
            <p className="text-xs text-destructive flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying & Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Track Quotation Status
            </>
          )}
        </button>
      </form>
    </div>
  );
}
