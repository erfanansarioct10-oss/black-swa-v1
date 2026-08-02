"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { convertLeadToCustomerAction, type LeadListItem } from "@/actions/lead";
import type { OrganizationType } from "@/schemas/customer";

interface ConvertLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: LeadListItem | null;
  onSuccess?: (customerId: string) => void;
}

export function ConvertLeadModal({
  open,
  onOpenChange,
  lead,
  onSuccess,
}: ConvertLeadModalProps) {
  const router = useRouter();

  const [orgName, setOrgName] = useState(lead?.companyName || lead?.contactName || "");
  const [orgType, setOrgType] = useState<OrganizationType>("enterprise");
  const [taxId, setTaxId] = useState("");
  const [notes, setNotes] = useState(lead?.notes || "");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!lead) return null;

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await convertLeadToCustomerAction({
        leadId: lead.id,
        organizationName: orgName.trim(),
        organizationType: orgType,
        taxRegistrationId: taxId.trim() || null,
        notes: notes.trim() || null,
      });

      if (!res.success || !res.data) {
        setErrorMsg(res.error || "Failed to convert lead to customer account");
        setLoading(false);
        return;
      }

      onOpenChange(false);
      if (onSuccess) {
        onSuccess(res.data.customerId);
      } else {
        router.push(`/admin/customers/${res.data.customerId}`);
      }
    } catch (err: unknown) {
      console.error("[ConvertLeadModal] Conversion error:", err);
      setErrorMsg("An unexpected error occurred during lead conversion.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Convert Lead to B2B Customer
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Formalize <strong className="text-foreground">{lead.contactName}</strong> into a permanent client account record.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleConvert} className="space-y-4 py-2 text-sm">
          <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lead Title:</span>
              <span className="font-semibold text-foreground">{lead.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Primary Contact Email:</span>
              <span className="font-mono font-medium text-foreground">{lead.email}</span>
            </div>
            {lead.estimatedValue > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Deal Valuation:</span>
                <span className="font-mono font-semibold text-foreground">
                  ${lead.estimatedValue.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="org-name" className="text-xs font-semibold">
              Organization Name <span className="text-destructive">*</span>
            </label>
            <input
              id="org-name"
              type="text"
              placeholder="e.g. Bir Hospital Infrastructure Dept"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Organization Type</label>
              <select
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as OrganizationType)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >

                <option value="hospital">Hospital Facility</option>
                <option value="clinic">Medical Clinic</option>
                <option value="broadcast_studio">Broadcast Studio</option>
                <option value="media_network">Media Network</option>
                <option value="enterprise">General Enterprise</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="tax-id" className="text-xs font-semibold">
                Tax Registration ID / PAN
              </label>
              <input
                id="tax-id"
                type="text"
                placeholder="e.g. PAN-60912384"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="convert-notes" className="text-xs font-semibold">
              Account Transfer Notes
            </label>
            <textarea
              id="convert-notes"
              rows={3}
              placeholder="Add key contract details or onboarding instructions..."
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
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-1.5" />
                  Execute Conversion
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
