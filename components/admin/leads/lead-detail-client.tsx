"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  MessageSquare,
  Pencil,
  Save,
  ShieldCheck,
  Target,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { updateLeadAction, type LeadDetailResponseData } from "@/actions/lead";
import { LeadFormModal } from "@/components/admin/leads/lead-form-modal";
import { ConvertLeadModal } from "@/components/admin/leads/convert-lead-modal";
import type { LeadPriority, LeadStatus } from "@/schemas/lead";

interface LeadDetailClientProps {
  data: LeadDetailResponseData;
}

export function LeadDetailClient({ data }: LeadDetailClientProps) {
  const router = useRouter();
  const { lead, linkedCustomer, linkedQuote, linkedInquiry } = data;

  const [status, setStatus] = useState<string>(lead.status);
  const [priority, setPriority] = useState<string>(lead.priority);
  const [notes, setNotes] = useState<string>(lead.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    const previous = status;
    setStatus(newStatus);
    setUpdatingStatus(true);
    setErrorMsg(null);
    try {
      const res = await updateLeadAction(lead.id, { id: lead.id, status: newStatus as LeadStatus });
      if (!res.success) {
        setStatus(previous);
        setErrorMsg(res.error ?? "Failed to update lead status");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("[LeadDetailClient] Status update error:", err);
      setStatus(previous);
      setErrorMsg("Failed to update lead status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    const previous = priority;
    setPriority(newPriority);
    setUpdatingStatus(true);
    setErrorMsg(null);
    try {
      const res = await updateLeadAction(lead.id, { id: lead.id, priority: newPriority as LeadPriority });
      if (!res.success) {
        setPriority(previous);
        setErrorMsg(res.error ?? "Failed to update lead priority");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("[LeadDetailClient] Priority update error:", err);
      setPriority(previous);
      setErrorMsg("Failed to update lead priority");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setErrorMsg(null);
    try {
      const res = await updateLeadAction(lead.id, { id: lead.id, notes });
      if (!res.success) {
        setErrorMsg(res.error ?? "Failed to save lead notes");
        return;
      }
      router.refresh();
    } catch (err) {
      console.error("[LeadDetailClient] Notes save error:", err);
      setErrorMsg("Failed to save lead notes");
    } finally {
      setSavingNotes(false);
    }
  };



  const formattedLeadListItem = {
    id: lead.id,
    title: lead.title,
    contactName: lead.contactName,
    email: lead.email,
    phone: lead.phone,
    companyName: lead.companyName,
    leadSource: lead.leadSource,
    status: lead.status,
    priority: lead.priority,
    estimatedValue: lead.estimatedValue ?? 0,
    assignedManagerId: lead.assignedManagerId,
    notes: lead.notes,
    customerId: lead.customerId,
    quoteId: lead.quoteId,
    inquiryId: lead.inquiryId,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md text-xs text-red-700 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      {/* Header & Back Navigation */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/leads"
            className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Lead Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{lead.title}</h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Registered on {new Date(lead.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Attributes
          </Button>

          {lead.status !== "converted" ? (
            <Button
              size="sm"
              onClick={() => setConvertModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs gap-1.5"
            >
              <UserCheck className="w-4 h-4" />
              Convert to Customer Account
            </Button>
          ) : (
            linkedCustomer && (
              <Button size="sm" variant="secondary" asChild className="text-xs gap-1.5">
                <Link href={`/admin/customers/${linkedCustomer.id}`}>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  View Customer Profile
                </Link>
              </Button>
            )
          )}
        </div>
      </div>

      {/* Main Details & Workflow Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2-Column Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact & Organization Overview Card */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <Building2 className="w-4 h-4 text-primary" />
              Lead & Contact Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block">Primary Contact Name:</span>
                <span className="font-semibold text-foreground text-sm">{lead.contactName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Company / Organization:</span>
                <span className="font-medium text-foreground text-sm">
                  {lead.companyName || "Individual Prospect"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Email Address:</span>
                <a href={`mailto:${lead.email}`} className="font-mono text-primary hover:underline">
                  {lead.email}
                </a>
              </div>
              <div>
                <span className="text-muted-foreground block">Phone Number:</span>
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="font-mono text-foreground hover:underline">
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          {/* Linked RFQ Transaction Context */}
          {linkedQuote && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Linked RFQ Quotation Request
                </h2>
                <Link
                  href={`/admin/quotes`}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  View in RFQ Portal
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-lg bg-muted/40 border border-border text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference ID:</span>
                  <span className="font-mono font-bold text-foreground">{linkedQuote.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project Scope:</span>
                  <span className="font-medium text-foreground">{linkedQuote.projectScope || "Hardware Purchase"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget Range:</span>
                  <span className="font-mono font-semibold text-foreground">{linkedQuote.budgetRange || "Unspecified"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Linked Contact Inquiry Context */}
          {linkedInquiry && (
            <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Linked Contact Message
                </h2>
                <Link
                  href={`/admin/inquiries`}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                >
                  View Inquiries
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3.5 rounded-lg bg-muted/40 border border-border text-xs space-y-2">
                <p className="text-muted-foreground italic">&quot;{linkedInquiry.message}&quot;</p>
              </div>
            </div>
          )}

          {/* Activity Log & Qualification Notes */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <MessageSquare className="w-4 h-4 text-primary" />
              Internal Team Qualification Notes
            </h2>

            <div className="space-y-2">
              <textarea
                rows={5}
                placeholder="Add sales qualification notes, client feedback, or technical specifications..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  size="sm"
                  className="text-xs gap-1.5"
                >
                  {savingNotes ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Activity Notes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1-Column Control Sidebar */}
        <div className="space-y-6">
          {/* Pipeline Controls Card */}
          <div className="bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Pipeline & Priority Controls
            </h2>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified Prospect</option>
                <option value="unqualified">Unqualified</option>
                <option value="converted">Converted Customer</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                disabled={updatingStatus}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent Priority</option>
              </select>
            </div>

            {/* Estimated Value Card */}
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-1">
              <span className="text-[11px] text-muted-foreground block">Estimated Deal Valuation:</span>
              <span className="text-xl font-bold font-mono text-foreground">
                ${(lead.estimatedValue ?? 0).toLocaleString()}
              </span>
            </div>

            {/* Lead Source */}
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border space-y-1 text-xs">
              <span className="text-muted-foreground block">Source Attribution:</span>
              <span className="font-semibold text-foreground capitalize">
                {lead.leadSource.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LeadFormModal
        key={`${lead.id}-${lead.updatedAt.toISOString()}`}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        initialData={formattedLeadListItem}
        onSuccess={() => router.refresh()}
      />


      <ConvertLeadModal
        open={convertModalOpen}
        onOpenChange={setConvertModalOpen}
        lead={formattedLeadListItem}
        onSuccess={(custKey) => {
          router.push(`/admin/customers/${custKey}`);
        }}
      />
    </div>
  );
}
