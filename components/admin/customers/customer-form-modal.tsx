"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, Loader2, Mail, Phone, Plus, User } from "lucide-react";

import { createCustomerAction, updateCustomerAction } from "@/actions/customer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type CustomerListItem } from "@/actions/customer";
import {
  CUSTOMER_STATUSES,
  LEAD_SOURCES,
  ORGANIZATION_TYPES,
  type CreateCustomerInput,
  type CustomerStatus,
  type LeadSource,
  type OrganizationType,
} from "@/schemas/customer";

interface CustomerFormModalProps {
  customer?: CustomerListItem | null;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function CustomerFormModal({ customer, trigger, onSuccess }: CustomerFormModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isEdit = Boolean(customer?.id);

  const [formData, setFormData] = useState<CreateCustomerInput>({
    organizationName: customer?.organizationName || "",
    organizationType: (customer?.organizationType as OrganizationType) || "enterprise",
    primaryContactName: customer?.primaryContactName || "",
    primaryContactEmail: customer?.primaryContactEmail || "",
    primaryContactPhone: customer?.primaryContactPhone || "",
    city: customer?.city || "",
    country: customer?.country || "Nepal",
    taxRegistrationId: customer?.taxRegistrationId || "",
    leadSource: (customer?.leadSource as LeadSource) || "website_rfq",
    status: (customer?.status as CustomerStatus) || "lead",
    notes: "",
  });

  const handleChange = (field: keyof CreateCustomerInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      try {
        if (isEdit && customer?.id) {
          const res = await updateCustomerAction({
            id: customer.id,
            ...formData,
          });
          if (!res.success) {
            setErrorMsg(res.error || "Failed to update customer account.");
            return;
          }
        } else {
          const res = await createCustomerAction(formData);
          if (!res.success) {
            setErrorMsg(res.error || "Failed to create customer account.");
            return;
          }
        }

        setOpen(false);
        if (onSuccess) onSuccess();
        router.refresh();
      } catch {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            {isEdit ? "Edit Customer Account" : "Register New B2B Account"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update organizational details and primary contact information."
              : "Create a new medical facility or broadcast media network account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {errorMsg && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Organization Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Bir Hospital, Kantipur TV Network"
                  value={formData.organizationName}
                  onChange={(e) => handleChange("organizationName", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Industry / Organization Type *
              </label>
              <select
                value={formData.organizationType}
                onChange={(e) => handleChange("organizationType", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ORGANIZATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Primary Contact Person *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.primaryContactName}
                  onChange={(e) => handleChange("primaryContactName", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Primary Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="contact@org.com"
                  value={formData.primaryContactEmail}
                  onChange={(e) => handleChange("primaryContactEmail", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+977 1 4XXXXXX"
                  value={formData.primaryContactPhone || ""}
                  onChange={(e) => handleChange("primaryContactPhone", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                City / Location
              </label>
              <input
                type="text"
                placeholder="Kathmandu"
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                PAN / Tax Reg ID
              </label>
              <input
                type="text"
                placeholder="e.g. PAN-60098212"
                value={formData.taxRegistrationId || ""}
                onChange={(e) => handleChange("taxRegistrationId", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {CUSTOMER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Lead Source
              </label>
              <select
                value={formData.leadSource}
                onChange={(e) => handleChange("leadSource", e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {LEAD_SOURCES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Internal Account Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add key account requirements, procurement history, or specialized preferences..."
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-foreground text-background hover:bg-foreground/90 font-medium"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Customer Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
