"use client";

import React, { useState } from "react";
import { History, Clock, Eye, Send, Plus, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";

import { createProposalVersionAction } from "@/actions/proposal";
import type { ProposalVersionItem } from "@/actions/proposal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProposalVersionHistoryProps {
  quoteId: string;
  versions: ProposalVersionItem[];
  onVersionCreated?: (newVersion: ProposalVersionItem) => void;
}

export function ProposalVersionHistory({
  quoteId,
  versions,
  onVersionCreated,
}: ProposalVersionHistoryProps) {
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [validityDays, setValidityDays] = useState(30);
  const [customMessage, setCustomMessage] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleCreateVersion = async () => {
    try {
      setIsCreating(true);
      setFeedback(null);

      const res = await createProposalVersionAction({
        quoteId,
        validityDays,
        customMessage: customMessage.trim() || undefined,
        termsAndConditions: termsAndConditions.trim() || undefined,
      });

      if (res.success) {
        setFeedback({
          type: "success",
          message: `Official Proposal Revision v${res.data.versionNumber} generated successfully!`,
        });
        setShowNewVersionModal(false);
        setCustomMessage("");
        setTermsAndConditions("");
        if (onVersionCreated) onVersionCreated(res.data);
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to create proposal version" });
      }

    } catch {
      setFeedback({ type: "error", message: "An error occurred while creating proposal version" });
    } finally {
      setIsCreating(false);
    }
  };

  const getExpirationStatus = (version: ProposalVersionItem) => {
    if (!version.expiresAt) return { status: "Active", variant: "secondary" as const };
    const expiresDate = new Date(version.expiresAt);
    const now = new Date();
    const diffMs = expiresDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { status: "Expired", variant: "destructive" as const, text: "Expired" };
    } else if (diffDays <= 5) {
      return { status: "Expiring Soon", variant: "outline" as const, text: `${diffDays} days left` };
    }
    return { status: "Active", variant: "default" as const, text: `Valid (${diffDays}d left)` };
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-base">
            Proposal Revision History ({versions.length})
          </h3>
        </div>
        <Button
          size="sm"
          onClick={() => setShowNewVersionModal(true)}
          className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Create Revision
        </Button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-md text-xs font-semibold flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          )}
          {feedback.message}
        </div>
      )}

      {versions.length === 0 ? (
        <div className="py-8 text-center text-slate-500">
          <Clock className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium">No proposal revisions generated yet.</p>
          <p className="text-xs text-slate-400 mt-1">
            Click &quot;Create Revision&quot; to snapshot current pricing and issue a versioned proposal.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((ver) => {
            const expInfo = getExpirationStatus(ver);
            return (
              <div
                key={ver.id}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      Revision v{ver.versionNumber}
                    </span>
                    <Badge variant={expInfo.variant} className="text-[11px] font-semibold">
                      {expInfo.text || expInfo.status}
                    </Badge>
                  </div>
                  <span className="font-bold text-slate-900 text-sm">
                    Rs. {ver.grandTotal.toLocaleString("en-NP")} {ver.currency}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/80">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Issued: {new Date(ver.createdAt).toLocaleDateString("en-NP")}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {ver.dispatchedAt
                        ? `Dispatched ${new Date(ver.dispatchedAt).toLocaleDateString("en-NP")}`
                        : "Not Dispatched"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-sky-600" />
                    <span className="font-medium text-slate-700">
                      Customer Views: <strong className="text-sky-700">{ver.viewCount}</strong>
                    </span>
                  </div>
                </div>

                {ver.customMessage && (
                  <p className="mt-2.5 text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 italic">
                    &quot;{ver.customMessage}&quot;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Revision Modal */}
      {showNewVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:hidden">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">
                Generate Proposal Revision v{versions.length + 1}
              </h3>
              <button
                onClick={() => setShowNewVersionModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Create an immutable snapshot of current line items, subtotal, 13% Nepalese VAT, and total pricing with a custom validity period.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Validity Period (Days)
              </label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="w-full rounded-md border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-none bg-white font-medium"
              >
                <option value={15}>15 Days</option>
                <option value={30}>30 Days (Standard)</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days (Enterprise)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Executive Note (Optional)
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={2}
                placeholder="Specific message for the client..."
                className="w-full rounded-md border border-slate-300 p-2 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewVersionModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateVersion}
                disabled={isCreating}
                className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold"
              >
                {isCreating ? "Snapshotting..." : "Generate Revision"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
