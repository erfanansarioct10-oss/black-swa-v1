"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Calendar,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Printer,
  Copy,
  Check,
  Package,
  Headphones,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

import { MessageSquare, Send, X, CheckCircle2, AlertCircle } from "lucide-react";
import { submitNegotiationRequestAction } from "@/actions/proposal";

import type { QuoteWithItems } from "@/types/quote";
import { QuoteTrackingTimeline } from "./quote-tracking-timeline";

interface QuoteTrackingDetailsProps {
  quote: QuoteWithItems;
}

export function QuoteTrackingDetails({ quote }: QuoteTrackingDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");
  const [submittedNotes, setSubmittedNotes] = useState("");
  const [isSubmittingNegotiation, setIsSubmittingNegotiation] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [negotiationFeedback, setNegotiationFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmitNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerNotes.trim() || customerNotes.trim().length < 10) {
      setNegotiationFeedback({ type: "error", message: "Please enter at least 10 characters describing your request." });
      return;
    }

    try {
      setIsSubmittingNegotiation(true);
      setNegotiationFeedback(null);
      const res = await submitNegotiationRequestAction({
        referenceId: quote.referenceId,
        customerNotes: customerNotes.trim(),
      });

      if (res.success) {
        setSubmittedNotes(customerNotes.trim());
        setIsSubmittedSuccessfully(true);
        setCustomerNotes("");
      } else {
        setNegotiationFeedback({ type: "error", message: res.error || "Failed to submit negotiation request" });
      }
    } catch {
      setNegotiationFeedback({ type: "error", message: "An unexpected error occurred while submitting your request." });
    } finally {
      setIsSubmittingNegotiation(false);
    }
  };



  const handleCopyRef = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(quote.referenceId)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        /* clipboard write failed or denied */
      });
  };

  const handlePrint = () => {
    window.print();
  };

  const createdDateFormatted = new Date(quote.createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const canPrintQuotation = quote.status === "quoted" || quote.status === "completed";

  const hasFinancials = Boolean(quote.grandTotal && quote.grandTotal > 0);

  return (
    <div className="space-y-8 w-full print:space-y-4">
      {/* Back Button & Header Bar (Hidden during print) */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/quote/track"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Look Up Another Quote
        </Link>
        {canPrintQuotation && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-semibold rounded-lg transition-colors cursor-pointer border border-border"
          >
            <Printer className="w-4 h-4" />
            Print / Download Quotation (PDF)
          </button>
        )}
      </div>

      {/* Top Banner Card */}
      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-4 shadow-sm print:border-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Official Quotation Record
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              {quote.referenceId}
              <button
                onClick={handleCopyRef}
                title="Copy Reference ID"
                className="text-muted-foreground hover:text-foreground transition-colors p-1 print:hidden"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-muted-foreground block">Submitted On</span>
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5 justify-start sm:justify-end">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              {createdDateFormatted}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block font-medium">Contact Person</span>
            <span className="text-sm font-bold text-foreground truncate block">{quote.fullName}</span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block font-medium">Company / Hospital</span>
            <span className="text-sm font-bold text-foreground truncate block">
              {quote.companyName || "Individual / Not Specified"}
            </span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block font-medium">Email Address</span>
            <span className="text-sm font-bold text-foreground truncate block">{quote.email}</span>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block font-medium">Contact Phone</span>
            <span className="text-sm font-bold text-foreground truncate block">{quote.phone}</span>
          </div>
        </div>
      </div>

      {/* Stepper Progress Timeline (Hidden during print) */}
      <div className="print:hidden">
        <QuoteTrackingTimeline status={quote.status} />
      </div>

      {/* Two Column Grid: Account Manager Card & Project Scope */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Manager Card */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Headphones className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Assigned Account Manager</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                MD
              </div>
              <div>
                <h4 className="font-bold text-foreground">Engineering Support Desk</h4>
                <p className="text-xs text-muted-foreground">Senior Medical & Broadcast Specialist</p>
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:support@blackswan.com.np" className="hover:underline text-foreground">
                  support@blackswan.com.np
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+97714528990" className="hover:underline text-foreground">
                  +977 1-4528990
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>SLA Response: Under 2 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Parameters Card */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Enterprise Project Specifications</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <DollarSign className="w-3.5 h-3.5" /> Budget Allocation Range
              </span>
              <p className="font-semibold text-foreground">{quote.budgetRange || "Not Specified"}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" /> Target Deployment Timeline
              </span>
              <p className="font-semibold text-foreground">{quote.timeline || "Immediate / Not Specified"}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground block font-medium mb-1">
              Custom Project Scope & Notes
            </span>
            <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg border border-border/50 leading-relaxed whitespace-pre-line">
              {quote.projectScope || "No custom scope notes specified during submission."}
            </p>
          </div>
        </div>
      </div>

      {/* Equipment Line Items Breakdown Table */}
      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Equipment Line Items ({quote.items.length})</h3>
          </div>
          <span className="text-xs text-muted-foreground">Commercial Equipment Breakdown</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider bg-muted/40">
                <th className="py-3 px-4 font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">Equipment / Hardware Title</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-center">Quantity</th>
                {hasFinancials && <th className="py-3 px-4 font-semibold text-right">Unit Price</th>}
                {hasFinancials && <th className="py-3 px-4 font-semibold text-right">Line Total</th>}
                <th className="py-3 px-4 font-semibold">Technical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quote.items.map((item, idx) => (
                <tr key={item.id || idx} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-muted-foreground">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-foreground">{item.productTitle}</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-foreground">{item.quantity}</td>
                  {hasFinancials && (
                    <td className="py-3.5 px-4 text-right font-medium">
                      Rs. {(item.unitPrice || 0).toLocaleString("en-NP")}
                    </td>
                  )}
                  {hasFinancials && (
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">
                      Rs. {(item.totalPrice || 0).toLocaleString("en-NP")}
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-xs text-muted-foreground italic">
                    {item.notes || "Standard B2B hardware specification"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hasFinancials && (
          <div className="flex justify-end pt-4 border-t border-border">
            <div className="w-64 space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-semibold text-foreground">Rs. {(quote.subtotal || 0).toLocaleString("en-NP")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>13% VAT Tax:</span>
                <span className="font-semibold text-foreground">Rs. {(quote.vatAmount || 0).toLocaleString("en-NP")}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping & Delivery:</span>
                <span className="font-semibold text-foreground">Rs. {(quote.shippingCost || 0).toLocaleString("en-NP")}</span>
              </div>
              <div className="flex justify-between border-t border-foreground pt-2 font-bold text-base text-foreground">
                <span>Grand Total (NPR):</span>
                <span className="text-emerald-600">Rs. {(quote.grandTotal || 0).toLocaleString("en-NP")}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Official Proposal / Download Action Box */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="space-y-1">
          <h4 className="font-bold text-foreground text-base">Need Changes or Have Questions?</h4>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Connect directly with your assigned Managing Director to update equipment quantities or integration scope.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <button
            onClick={() => {
              setShowNegotiationModal(true);
              setNegotiationFeedback(null);
            }}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm transition-colors hover:bg-primary/90 inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Request Revision & Negotiation
          </button>

          <Link
            href="/products"
            className="px-4 py-2.5 bg-card border border-border hover:bg-accent text-foreground font-semibold rounded-lg text-sm transition-colors inline-flex items-center gap-2"
          >
            Browse Products
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Commercial Negotiation & Revision Request Modal */}
      {showNegotiationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground text-lg">Request Revision & Negotiation</h3>
              </div>
              <button
                onClick={() => setShowNegotiationModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSubmittedSuccessfully ? (
              <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-50 dark:ring-emerald-950/20 mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-foreground">Revision Request Submitted Successfully!</h4>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Your commercial negotiation notes for reference{" "}
                    <strong className="text-foreground">{quote.referenceId}</strong> have been sent directly to your assigned Managing Director.
                  </p>
                </div>

                <div className="p-4 bg-muted/40 rounded-xl border border-border text-left space-y-2 text-xs">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider block">Submitted Request Summary</span>
                  <p className="text-foreground italic leading-relaxed whitespace-pre-line bg-background/60 p-3 rounded-lg border border-border/50">
                    &quot;{submittedNotes}&quot;
                  </p>
                  <div className="text-muted-foreground pt-1 flex items-center justify-between">
                    <span>Assigned Desk: Managing Director Desk</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Status: Under Review
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowNegotiationModal(false);
                      setIsSubmittedSuccessfully(false);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    Done / Return to Quote Details
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Submit custom pricing feedback, discount requests, or hardware specification changes for reference{" "}
                  <strong className="text-foreground">{quote.referenceId}</strong>. Your assigned Managing Director will review your notes and issue an updated revision snapshot.
                </p>

                {negotiationFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      negotiationFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {negotiationFeedback.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    )}
                    {negotiationFeedback.message}
                  </div>
                )}

                <form onSubmit={handleSubmitNegotiation} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Reference & Contact Info
                    </label>
                    <div className="p-3 bg-muted/40 rounded-lg border border-border/50 text-xs space-y-1 text-foreground">
                      <div>
                        <span className="font-semibold text-muted-foreground">Quote Reference:</span>{" "}
                        {quote.referenceId}
                      </div>
                      <div>
                        <span className="font-semibold text-muted-foreground">Contact:</span> {quote.fullName} (
                        {quote.email})
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="customerNotes" className="text-xs font-semibold text-foreground">
                      Your Revision Request / Negotiation Notes <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="customerNotes"
                      rows={4}
                      required
                      placeholder="e.g., Please apply a 10% volume discount for bulk PACS workstation order, or change quantity of encoders from 1 to 2..."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowNegotiationModal(false)}
                      className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingNegotiation}
                      className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-sm transition-colors hover:bg-primary/90 disabled:opacity-50 inline-flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      {isSubmittingNegotiation ? (
                        "Submitting..."
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Request
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


