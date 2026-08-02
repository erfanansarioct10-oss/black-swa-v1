"use client";

import { useState } from "react";
import { Loader2, Plus, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createLeadAction, updateLeadAction, type LeadListItem } from "@/actions/lead";
import type { LeadPriority, LeadSource, LeadStatus } from "@/schemas/lead";

interface LeadFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: LeadListItem | null;
  onSuccess?: () => void;
}

export function LeadFormModal({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}: LeadFormModalProps) {
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [contactName, setContactName] = useState(initialData?.contactName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [leadSource, setLeadSource] = useState<string>(initialData?.leadSource || "website_rfq");
  const [status, setStatus] = useState<string>(initialData?.status || "new");
  const [priority, setPriority] = useState<string>(initialData?.priority || "medium");
  const [estimatedValue, setEstimatedValue] = useState<number>(initialData?.estimatedValue || 0);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isEditing && initialData) {
        const res = await updateLeadAction(initialData.id, {
          title,
          contactName,
          email,
          phone: phone || null,
          companyName: companyName || null,
          leadSource: leadSource as LeadSource,
          status: status as LeadStatus,
          priority: priority as LeadPriority,
          estimatedValue,
          notes: notes || null,
        });

        if (!res.success) {
          setErrorMsg(res.error || "Failed to update lead record");
          setLoading(false);
          return;
        }
      } else {
        const res = await createLeadAction({
          title,
          contactName,
          email,
          phone: phone || null,
          companyName: companyName || null,
          leadSource: leadSource as LeadSource,
          status: status as LeadStatus,
          priority: priority as LeadPriority,
          estimatedValue,
          notes: notes || null,
        });

        if (!res.success) {
          setErrorMsg(res.error || "Failed to create lead record");
          setLoading(false);
          return;
        }
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error("[LeadFormModal] Submit error:", err);
      setErrorMsg("An unexpected error occurred. Please check input values.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {isEditing ? "Edit Sales Lead Attributes" : "Manually Register New Lead"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {isEditing
                  ? "Update priority, status, valuation, and sales notes."
                  : "Add prospective buyer details and source attribution."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-sm">
          <div className="space-y-1.5">
            <label htmlFor="lead-title" className="text-xs font-semibold">
              Lead Subject / Requirement Title <span className="text-destructive">*</span>
            </label>
            <input
              id="lead-title"
              type="text"
              placeholder="e.g. 4K Telehealth Gateway System Procurement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="text-xs font-semibold">
                Contact Name <span className="text-destructive">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="e.g. Dr. Rajesh Sharma"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="text-xs font-semibold">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="e.g. r.sharma@hospital.np"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="company-name" className="text-xs font-semibold">
                Company / Organization Name
              </label>
              <input
                id="company-name"
                type="text"
                placeholder="e.g. Kathmandu Medical Center"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="contact-phone" className="text-xs font-semibold">
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="text"
                placeholder="e.g. +977 9801234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Lead Source</label>
              <select
                value={leadSource}
                onChange={(e) => setLeadSource(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >
                <option value="website_rfq">Website RFQ</option>
                <option value="direct_inquiry">Direct Inquiry</option>
                <option value="referral">Referral</option>
                <option value="trade_show">Trade Show</option>
                <option value="outreach">Sales Outreach</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Pipeline Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified Prospect</option>
                <option value="unqualified">Unqualified</option>
                <option value="converted">Converted Customer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="est-value" className="text-xs font-semibold">
              Estimated Deal Valuation ($ USD)
            </label>
            <input
              id="est-value"
              type="number"
              min={0}
              placeholder="0"
              value={estimatedValue}
              onChange={(e) => setEstimatedValue(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lead-notes" className="text-xs font-semibold">
              Internal Qualification Notes
            </label>
            <textarea
              id="lead-notes"
              rows={3}
              placeholder="Record initial client discussions, technical constraints, or budget specs..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Register Lead
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
