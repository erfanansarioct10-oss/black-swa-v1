"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  DollarSign,
  Save,
  User,
  UserCheck,
  Zap,
  AlertCircle,
} from "lucide-react";

import {
  assignQuoteManagerAction,
  updateQuoteFinancialsAction,
  updateQuoteStatusAction,
} from "@/actions/quote-admin";
import type { QuoteDetailData } from "@/actions/quote-admin";
import { Button } from "@/components/ui/button";
import { QuoteActivitySidebar } from "./quote-activity-sidebar";
import { QuoteProposalPreview } from "./quote-proposal-preview";

import type { ProposalVersionItem } from "@/actions/proposal";

interface QuoteWorkbenchProps {
  data: QuoteDetailData;
  initialVersions?: ProposalVersionItem[];
}

import { useRouter, useSearchParams } from "next/navigation";

export function QuoteWorkbench({ data, initialVersions = [] }: QuoteWorkbenchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { quote, items: initialItems, customer, linkedLead, activityLogs } = data;

  const tabParam = searchParams.get("tab");
  const activeTab: "workbench" | "proposal" | "customer" =
    tabParam === "proposal" || tabParam === "customer" ? tabParam : "workbench";

  const handleTabChange = (tab: "workbench" | "proposal" | "customer") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/admin/quotes/${quote.id}?${params.toString()}`, { scroll: false });
  };

  const [status, setStatus] = useState(quote.status);
  const [adminNotes, setAdminNotes] = useState(quote.adminNotes || "");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [managerId, setManagerId] = useState(quote.assignedManagerId || "");
  const [isAssigningManager, setIsAssigningManager] = useState(false);

  // Financial Workbench state
  const [shippingCost, setShippingCost] = useState(quote.shippingCost || 0);
  const [itemFinancials, setItemFinancials] = useState(
    initialItems.map((item) => ({
      id: item.id,
      productTitle: item.productTitle,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice || 0,
      discountPercentage: item.discountPercentage || 0,
      notes: item.notes || "",
    }))
  );
  const [isSavingFinancials, setIsSavingFinancials] = useState(false);

  // Calculations
  const calculatedItems = itemFinancials.map((item) => {
    const discountFraction = item.discountPercentage / 100;
    const lineTotal = Math.round(item.unitPrice * item.quantity * (1 - discountFraction));
    return { ...item, lineTotal };
  });

  const calculatedSubtotal = calculatedItems.reduce((acc, item) => acc + item.lineTotal, 0);
  const calculatedVat = Math.round(calculatedSubtotal * 0.13); // 13% VAT
  const calculatedGrandTotal = calculatedSubtotal + calculatedVat + Number(shippingCost || 0);

  const handleSaveFinancials = async () => {
    try {
      setIsSavingFinancials(true);
      setFeedback(null);
      const res = await updateQuoteFinancialsAction({
        quoteId: quote.id,
        shippingCost: Number(shippingCost || 0),
        currency: "NPR",
        items: itemFinancials.map((item) => ({
          id: item.id,
          unitPrice: Number(item.unitPrice || 0),
          discountPercentage: Number(item.discountPercentage || 0),
          notes: item.notes,
        })),
      });

      if (res.success) {
        setFeedback({ type: "success", message: "Quotation financials saved & recalculated successfully!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save financials" });
      }
    } catch {
      setFeedback({ type: "error", message: "An error occurred while saving financials" });
    } finally {
      setIsSavingFinancials(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setIsUpdatingStatus(true);
      setFeedback(null);
      const res = await updateQuoteStatusAction({
        quoteId: quote.id,
        status: status as "pending" | "under_review" | "manager_assigned" | "quoted" | "completed" | "rejected",
        adminNotes: adminNotes.trim() || undefined,
      });

      if (res.success) {
        setFeedback({ type: "success", message: `Quote status updated to '${status.replace("_", " ")}'` });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to update status" });
      }
    } catch {
      setFeedback({ type: "error", message: "An error occurred" });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAssignManager = async () => {
    if (!managerId.trim()) return;
    try {
      setIsAssigningManager(true);
      setFeedback(null);
      const res = await assignQuoteManagerAction({
        quoteId: quote.id,
        managerId: managerId.trim(),
        managerName: managerId.trim(),
      });

      if (res.success) {
        setFeedback({ type: "success", message: `Account Manager '${managerId}' assigned!` });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to assign manager" });
      }
    } catch {
      setFeedback({ type: "error", message: "An error occurred" });
    } finally {
      setIsAssigningManager(false);
    }
  };

  const stages = [
    { key: "pending", label: "Submitted" },
    { key: "under_review", label: "Under Review" },
    { key: "manager_assigned", label: "Manager Assigned" },
    { key: "quoted", label: "Proposal Issued" },
    { key: "completed", label: "Completed / Won" },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === status);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotes"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                RFQ #{quote.referenceId}
              </h1>
              <span className="rounded bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800 uppercase">
                {quote.status.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Submitted by {quote.fullName} ({quote.email}) on{" "}
              {new Date(quote.createdAt).toLocaleDateString("en-NP")}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => handleTabChange("workbench")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "workbench"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pricing Workbench
          </button>
          <button
            onClick={() => handleTabChange("proposal")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "proposal"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Proposal PDF
          </button>
          <button
            onClick={() => handleTabChange("customer")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "customer"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Client & CRM Lead
          </button>

        </div>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600" />
          )}
          {feedback.message}
        </div>
      )}

      {/* Lifecycle Progress Stepper */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-5 gap-2">
          {stages.map((stage, idx) => {
            const isDone = idx <= currentStageIndex;
            return (
              <div key={stage.key} className="flex flex-col items-center text-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isDone
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-400 border border-slate-200"
                  }`}
                >
                  {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium ${
                    isDone ? "text-slate-900 font-semibold" : "text-slate-400"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "workbench" && (
            <div className="space-y-6">
              {/* Financial Line Items Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    Line Item Pricing & Custom Discounts
                  </h3>
                  <Button
                    size="sm"
                    onClick={handleSaveFinancials}
                    disabled={isSavingFinancials}
                    className="bg-emerald-600 text-white hover:bg-emerald-500"
                  >
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    {isSavingFinancials ? "Saving..." : "Save Financials"}
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 bg-slate-50">
                        <th className="py-2.5 px-3">Equipment</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Unit Price (NPR)</th>
                        <th className="py-2.5 px-3 text-right">Discount %</th>
                        <th className="py-2.5 px-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calculatedItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="py-3 px-3">
                            <p className="font-medium text-slate-900">{item.productTitle}</p>
                            <span className="text-xs text-slate-400 capitalize">{item.category}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-semibold text-slate-800">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              value={item.unitPrice}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setItemFinancials((prev) =>
                                  prev.map((it, i) => (i === idx ? { ...it, unitPrice: val } : it))
                                );
                              }}
                              className="w-28 rounded border border-slate-300 p-1 text-right text-sm font-medium focus:border-sky-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-right">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={item.discountPercentage}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setItemFinancials((prev) =>
                                  prev.map((it, i) => (i === idx ? { ...it, discountPercentage: val } : it))
                                );
                              }}
                              className="w-16 rounded border border-slate-300 p-1 text-right text-sm font-medium focus:border-sky-500 focus:outline-none"
                            />
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            Rs. {item.lineTotal.toLocaleString("en-NP")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal, Shipping, Tax Calculation Card */}
                <div className="border-t border-slate-200 pt-4 flex flex-col items-end gap-2 text-sm">
                  <div className="flex w-64 justify-between text-slate-600">
                    <span>Calculated Subtotal:</span>
                    <span className="font-semibold text-slate-900">
                      Rs. {calculatedSubtotal.toLocaleString("en-NP")}
                    </span>
                  </div>
                  <div className="flex w-64 justify-between text-slate-600">
                    <span>13% Nepalese VAT:</span>
                    <span className="font-semibold text-slate-900">
                      Rs. {calculatedVat.toLocaleString("en-NP")}
                    </span>
                  </div>
                  <div className="flex w-64 justify-between items-center text-slate-600">
                    <span>Shipping & Freight:</span>
                    <input
                      type="number"
                      min={0}
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Number(e.target.value))}
                      className="w-24 rounded border border-slate-300 p-1 text-right text-sm font-medium focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex w-64 justify-between border-t border-slate-900 pt-2 text-base font-bold text-slate-900">
                    <span>Grand Total (NPR):</span>
                    <span className="text-emerald-600">
                      Rs. {calculatedGrandTotal.toLocaleString("en-NP")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Lifecycle & Admin Notes Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Status Transition & Administrative Directives
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Update Quotation Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as typeof status)}
                      className="w-full rounded-md border border-slate-300 p-2 text-sm bg-white font-medium focus:border-sky-500 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="manager_assigned">Manager Assigned</option>
                      <option value="quoted">Quoted / Proposal Sent</option>
                      <option value="completed">Completed / Won</option>
                      <option value="rejected">Rejected / Lost</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Admin Notes / Directives
                    </label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add administrative notes..."
                      className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    onClick={handleUpdateStatus}
                    disabled={isUpdatingStatus}
                    className="bg-slate-900 text-white hover:bg-slate-800"
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    {isUpdatingStatus ? "Updating..." : "Update Status & Sync CRM"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "proposal" && <QuoteProposalPreview data={data} initialVersions={initialVersions} />}


          {activeTab === "customer" && (
            <div className="space-y-6">
              {/* Customer Profile Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-sky-600" />
                  Client & Enterprise Information
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 font-medium uppercase block">Contact Name</span>
                    <span className="font-semibold text-slate-900">{quote.fullName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium uppercase block">Company / Hospital</span>
                    <span className="font-semibold text-slate-900">{quote.companyName || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium uppercase block">Email Address</span>
                    <span className="text-slate-800">{quote.email}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium uppercase block">Phone Number</span>
                    <span className="text-slate-800">{quote.phone}</span>
                  </div>
                </div>

                {customer && (
                  <div className="mt-4 rounded-lg bg-sky-50 p-3 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
                    <span>Associated Customer Record: <strong>{customer.organizationName}</strong></span>
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="font-bold underline hover:text-sky-700"
                    >
                      View Account Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Linked CRM Lead Card */}
              {linkedLead && (
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    Linked CRM Pipeline Lead
                  </h3>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">{linkedLead.title}</p>
                      <p className="text-xs text-slate-500">
                        Priority: <span className="uppercase font-bold text-amber-600">{linkedLead.priority}</span> | Status: <span className="uppercase font-bold text-sky-600">{linkedLead.status}</span>
                      </p>
                    </div>
                    <Link
                      href={`/admin/leads/${linkedLead.id}`}
                      className="text-xs font-bold text-sky-600 hover:underline"
                    >
                      Open Lead Portal →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Controls (1 col) */}
        <div className="space-y-6">
          {/* Account Manager Assignment Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2 text-sm">
              <UserCheck className="h-4 w-4 text-purple-600" />
              Assigned Account Manager
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Manager ID / Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  placeholder="e.g. Director Sharma"
                  className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-sky-500 focus:outline-none"
                />
                <Button
                  size="sm"
                  onClick={handleAssignManager}
                  disabled={isAssigningManager || !managerId.trim()}
                  className="bg-purple-600 text-white hover:bg-purple-500"
                >
                  Assign
                </Button>
              </div>
            </div>

            {quote.assignedManagerId && (
              <p className="text-xs text-slate-500">
                Assigned on {quote.assignedAt ? new Date(quote.assignedAt).toLocaleDateString("en-NP") : "Recently"}
              </p>
            )}
          </div>

          {/* Activity Log Sidebar */}
          <QuoteActivitySidebar quoteId={quote.id} logs={activityLogs} />
        </div>
      </div>
    </div>
  );
}
