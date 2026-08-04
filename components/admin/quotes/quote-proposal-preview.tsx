"use client";

import React, { useState } from "react";
import { Mail, Printer, CheckCircle, Send, FileText, AlertCircle, History } from "lucide-react";

import { dispatchProposalEmailAction } from "@/actions/proposal";
import type { ProposalVersionItem } from "@/actions/proposal";
import type { QuoteDetailData } from "@/actions/quote-admin";
import { ProposalVersionHistory } from "@/components/admin/quotes/proposal-version-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuoteProposalPreviewProps {
  data: QuoteDetailData;
  initialVersions?: ProposalVersionItem[];
}

export function QuoteProposalPreview({ data, initialVersions = [] }: QuoteProposalPreviewProps) {
  const { quote, items } = data;
  const [isSending, setIsSending] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState<ProposalVersionItem[]>(initialVersions);

  const handleVersionCreated = (newVersion: ProposalVersionItem) => {
    setVersions((prev) => [newVersion, ...prev]);
  };


  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    try {
      setIsSending(true);
      setFeedback(null);

      const res = await dispatchProposalEmailAction({
        quoteId: quote.id,
        customMessage: customMessage.trim() || undefined,
      });

      if (res.success) {
        setFeedback({
          type: "success",
          message: `Official proposal dispatched to ${quote.email} (Dispatched at ${new Date(res.data.dispatchedAt).toLocaleTimeString()})`,
        });
        setShowEmailModal(false);
        setCustomMessage("");
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to send proposal email" });
      }
    } catch {
      setFeedback({ type: "error", message: "An error occurred while dispatching proposal email" });
    } finally {
      setIsSending(false);
    }
  };

  const latestVersion = versions.length > 0 ? versions[0] : null;

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Print Isolated) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-slate-900 p-4 text-white print:hidden shadow-md">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-sky-400" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm sm:text-base">
                Quotation Proposal #{quote.referenceId}
              </span>
              {latestVersion && (
                <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30 text-[10px] uppercase tracking-wider font-semibold">
                  Rev v{latestVersion.versionNumber}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Customer: {quote.fullName} ({quote.email})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs"
          >
            <History className="mr-1.5 h-3.5 w-3.5" />
            {showVersionHistory ? "Hide History" : `Revisions (${versions.length})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white text-xs"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Print / Save PDF
          </Button>

          <Button
            size="sm"
            onClick={() => setShowEmailModal(true)}
            className="bg-sky-600 text-white hover:bg-sky-500 text-xs font-semibold"
          >
            <Mail className="mr-1.5 h-3.5 w-3.5" />
            Dispatch Email
          </Button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-md text-xs font-semibold flex items-center gap-2 print:hidden ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Version History Drawer (Print Isolated) */}
      {showVersionHistory && (
        <div className="print:hidden">
          <ProposalVersionHistory
            quoteId={quote.id}
            versions={versions}
            onVersionCreated={handleVersionCreated}

          />
        </div>
      )}

      {/* Printable Official Proposal Document */}
      <div
        id="printable-proposal"
        className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm print:m-0 print:max-w-none print:border-none print:p-0 print:shadow-none"
      >
        {/* Document Header / Corporate Letterhead */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-slate-900">
              Black Swan International
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Medical Technology & Broadcast Systems Infrastructure
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Kathmandu, Nepal | Contact: +977 1-4000000 | info@blackswan.com.np | VAT: 600123456
            </p>
          </div>
          <div className="text-right">
            <div className="inline-block rounded bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Official Quotation
            </div>
            <p className="mt-2 text-sm font-bold text-slate-900">
              #{quote.referenceId}
            </p>
            {latestVersion && (
              <p className="text-xs font-semibold text-sky-700">
                Revision: v{latestVersion.versionNumber}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-0.5">
              Issue Date: {new Date(quote.createdAt).toLocaleDateString("en-NP")}
            </p>
            <p className="text-xs text-amber-700 font-medium mt-0.5">
              Validity: 30 Days from Issuance
            </p>
          </div>
        </div>

        {/* Client & Project Details */}
        <div className="grid grid-cols-2 gap-6 border-b border-slate-200 py-6 text-sm">
          <div>
            <h3 className="font-bold text-slate-400 uppercase text-[11px] tracking-wider mb-1">
              Prepared For
            </h3>
            <p className="font-bold text-slate-900 text-base">{quote.fullName}</p>
            {quote.companyName && (
              <p className="text-slate-800 font-semibold">{quote.companyName}</p>
            )}
            <p className="text-slate-600">{quote.email}</p>
            <p className="text-slate-600">{quote.phone}</p>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-slate-400 uppercase text-[11px] tracking-wider mb-1">
              Project Specifications
            </h3>
            <p className="text-slate-700">
              Scope: {quote.projectScope || "Standard Equipment Procurement"}
            </p>
            <p className="text-slate-700">
              Timeline: {quote.timeline || "As Per Agreement"}
            </p>
            <div className="mt-1 flex justify-end gap-1.5 items-center">
              <span className="text-slate-500 text-xs">Status:</span>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-bold uppercase text-[10px]">
                {quote.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Itemized Equipment Breakdown Table */}
        <div className="py-6">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50 text-slate-700">
                <th className="py-3 px-2 font-semibold">Item & Specifications</th>
                <th className="py-3 px-2 font-semibold">Category</th>
                <th className="py-3 px-2 font-semibold text-center">Qty</th>
                <th className="py-3 px-2 font-semibold text-right">Unit Price</th>
                <th className="py-3 px-2 font-semibold text-right">Disc %</th>
                <th className="py-3 px-2 font-semibold text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 px-2">
                    <p className="font-semibold text-slate-900">{item.productTitle}</p>
                    {item.notes && (
                      <p className="text-xs text-slate-500 mt-0.5 italic">{item.notes}</p>
                    )}
                  </td>
                  <td className="py-3 px-2 text-slate-600 capitalize text-xs">{item.category}</td>
                  <td className="py-3 px-2 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 px-2 text-right">
                    Rs. {item.unitPrice.toLocaleString("en-NP")}
                  </td>
                  <td className="py-3 px-2 text-right text-slate-600">
                    {item.discountPercentage}%
                  </td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">
                    Rs. {item.totalPrice.toLocaleString("en-NP")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary Calculation Breakdown */}
        <div className="flex justify-end border-t border-slate-300 pt-4 text-sm">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Equipment Subtotal:</span>
              <span className="font-semibold text-slate-900">
                Rs. {quote.subtotal.toLocaleString("en-NP")}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>13% Nepalese VAT Tax:</span>
              <span className="font-semibold text-slate-900">
                Rs. {quote.vatAmount.toLocaleString("en-NP")}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping & Logistics:</span>
              <span className="font-semibold text-slate-900">
                Rs. {quote.shippingCost.toLocaleString("en-NP")}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-extrabold text-slate-900">
              <span>Grand Total ({quote.currency}):</span>
              <span>Rs. {quote.grandTotal.toLocaleString("en-NP")}</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions & Payment Instructions */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-xs text-slate-600 space-y-1.5">
          <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
            Terms & Commercial Conditions:
          </p>
          <p>1. Prices are quoted in Nepalese Rupees (NPR) inclusive of 13% Nepalese Value Added Tax (VAT) unless explicitly specified.</p>
          <p>2. Quotation validity is 30 calendar days from the date of issuance.</p>
          <p>3. Equipment delivery timeline is subject to site readiness, technical inspection, and customs clearance.</p>
          <p>4. Payment terms: 50% advance upon purchase order sign-off, remaining 50% upon successful delivery and technical installation.</p>
        </div>
      </div>

      {/* Email Dispatch Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:hidden">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">
                Dispatch Proposal Email
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Send official quotation proposal link to <strong>{quote.email}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Executive Message (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                placeholder="Include custom note for the client..."
                className="w-full rounded-md border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmailModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSendEmail}
                disabled={isSending}
                className="bg-sky-600 text-white hover:bg-sky-500 text-xs font-semibold"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {isSending ? "Dispatching..." : "Dispatch Email"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
