"use client";

import Link from "next/link";
import { CheckCircle2, ArrowLeft, Search, Clock, Mail, Building2, ShieldCheck, FileCheck2 } from "lucide-react";

export interface RFQConfirmationProps {
  referenceId: string;
  contactName: string;
  email: string;
  companyName?: string;
  itemCount: number;
  onReset?: () => void;
}

export function RFQConfirmation({
  referenceId,
  contactName,
  email,
  companyName,
  itemCount,
  onReset,
}: RFQConfirmationProps) {
  return (
    <div className="p-6 sm:p-10 bg-card border border-border rounded-2xl space-y-8 max-w-2xl mx-auto shadow-sm">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20 shadow-sm">
          <CheckCircle2 className="h-9 w-9 text-emerald-500 stroke-[2.2]" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Submission Confirmed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Quotation Request Dispatched
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Thank you, <span className="font-semibold text-foreground">{contactName}</span>. Your RFQ has been logged and assigned to our Managing Directors.
          </p>
        </div>
      </div>

      {/* Reference Card */}
      <div className="p-5 bg-muted/40 rounded-xl border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Official Reference ID
            </span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-foreground tracking-wider">
              {referenceId}
            </div>
          </div>
          <span className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified Request
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              Receipt sent to: <span className="font-mono font-semibold text-foreground">{email}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              Organization: <span className="font-semibold text-foreground">{companyName || "N/A"}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCheck2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              Equipment Items: <span className="font-semibold text-foreground">{itemCount} requested</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              Response SLA: <span className="font-semibold text-foreground">Under 2 Business Hours</span>
            </span>
          </div>
        </div>
      </div>

      {/* SLA Expectation Banner */}
      <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 text-xs text-muted-foreground leading-relaxed flex items-start gap-3">
        <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-foreground mb-0.5">What Happens Next?</p>
          <p>
            An assigned Sales Director will review your equipment specifications and issue an official B2B quotation PDF with tailored pricing, lead times, and shipping terms. You will receive an automated email alert once the quote is ready.
          </p>
        </div>
      </div>

      {/* Navigation CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href={`/quote/track?referenceId=${encodeURIComponent(referenceId)}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow hover:opacity-90 transition-opacity"
        >
          <Search className="h-4 w-4" />
          Track Quotation Status
        </Link>
        <Link
          href="/products"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-bold hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Hardware Catalog
        </Link>
      </div>
    </div>
  );
}
