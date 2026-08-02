import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  FileText,
  Globe,
  Hash,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  User,
} from "lucide-react";

import { getCustomerByIdAction } from "@/actions/customer";
import { CustomerFormModal } from "@/components/admin/customers/customer-form-modal";
import { CustomerNotesEditor } from "@/components/admin/customers/customer-notes-editor";
import { Button } from "@/components/ui/button";
import {
  CUSTOMER_STATUSES,
  LEAD_SOURCES,
  ORGANIZATION_TYPES,
} from "@/schemas/customer";

export const metadata = {
  title: "Customer Account Profile | Black Swan Admin",
  description: "Detailed B2B account overview, transaction history, and organizational notes.",
};

interface CustomerDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  const res = await getCustomerByIdAction(id);

  if (!res.success || !res.data || !res.data.customer) {
    notFound();
  }

  const { customer, linkedQuotes, linkedInquiries } = res.data;

  const getStatusBadge = (statusValue: string) => {
    const matched = CUSTOMER_STATUSES.find((s) => s.value === statusValue);
    const label = matched?.label || statusValue;
    const colorClass = matched?.color || "bg-muted text-muted-foreground border-border";

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const getOrgTypeLabel = (typeValue: string) => {
    const matched = ORGANIZATION_TYPES.find((t) => t.value === typeValue);
    return matched?.label || typeValue;
  };

  const getLeadSourceLabel = (sourceValue?: string | null) => {
    if (!sourceValue) return "Direct";
    const matched = LEAD_SOURCES.find((l) => l.value === sourceValue);
    return matched?.label || sourceValue;
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Nav & Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <Link
            href="/admin/customers"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Customer Directory
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              {customer.organizationName}
            </h1>
            {getStatusBadge(customer.status)}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
            <span className="font-semibold text-foreground">
              {getOrgTypeLabel(customer.organizationType)}
            </span>
            <span>•</span>
            <span>Registered {new Date(customer.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CustomerFormModal
            customer={{
              id: customer.id,
              organizationName: customer.organizationName,
              organizationType: customer.organizationType,
              primaryContactName: customer.primaryContactName,
              primaryContactEmail: customer.primaryContactEmail,
              primaryContactPhone: customer.primaryContactPhone,
              city: customer.city,
              country: customer.country,
              status: customer.status,
              leadSource: customer.leadSource,
              taxRegistrationId: customer.taxRegistrationId,
              createdAt: customer.createdAt.toISOString(),
              updatedAt: customer.updatedAt.toISOString(),
            }}
            trigger={
              <Button variant="outline" className="font-medium">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Account
              </Button>
            }
          />
        </div>
      </div>

      {/* Main Account Details & History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Overview & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization & Primary Contact Card */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <h2 className="text-base font-semibold text-foreground border-b border-border pb-3">
              Account Metadata & Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  Primary Contact Person
                </div>
                <div className="font-medium text-foreground">{customer.primaryContactName}</div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Primary Email
                </div>
                <a
                  href={`mailto:${customer.primaryContactEmail}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {customer.primaryContactEmail}
                </a>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  Phone Number
                </div>
                <div className="font-medium text-foreground">
                  {customer.primaryContactPhone ? (
                    <a href={`tel:${customer.primaryContactPhone}`} className="hover:underline">
                      {customer.primaryContactPhone}
                    </a>
                  ) : (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  PAN / Tax Reg ID
                </div>
                <div className="font-medium text-foreground font-mono">
                  {customer.taxRegistrationId || <span className="text-muted-foreground italic font-sans">Not set</span>}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Location / Address
                </div>
                <div className="font-medium text-foreground">
                  {[customer.address, customer.city, customer.state, customer.postalCode, customer.country]
                    .filter(Boolean)
                    .join(", ") || "Nepal"}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  Acquisition / Lead Source
                </div>
                <div className="font-medium text-foreground">
                  {getLeadSourceLabel(customer.leadSource)}
                </div>
              </div>
            </div>
          </div>

          {/* Linked RFQ Transaction History Table */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                Linked Quotation Requests ({linkedQuotes.length})
              </h2>
            </div>

            {linkedQuotes.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-2">
                No RFQ quotation requests associated with this account email or company name.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3">Reference ID</th>
                      <th className="py-2.5 px-3">Scope / Budget</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Submitted</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {linkedQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-foreground font-mono">
                          {q.referenceId}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="truncate max-w-[200px] text-foreground">
                            {q.projectScope || "Hardware Quotation"}
                          </div>
                          {q.budgetRange && (
                            <div className="text-[11px] text-muted-foreground">{q.budgetRange}</div>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-muted text-foreground">
                            {q.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {new Date(q.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                            <Link href={`/admin/quotes?ref=${encodeURIComponent(q.referenceId)}`}>
                              View RFQ
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Linked Contact Inquiries Table */}
          <div className="p-5 rounded-xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Submitted Inquiries ({linkedInquiries.length})
              </h2>
            </div>

            {linkedInquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-2">
                No direct contact or service inquiries associated with this email or organization.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <tr>
                      <th className="py-2.5 px-3">Contact Person</th>
                      <th className="py-2.5 px-3">Message Snippet</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {linkedInquiries.map((i) => (
                      <tr key={i.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          {i.fullName}
                          {i.serviceSlug && (
                            <div className="text-[10px] text-muted-foreground">
                              Service: {i.serviceSlug}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          <div className="truncate max-w-[250px]">{i.message}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-muted text-foreground">
                            {i.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {new Date(i.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                            <Link href={`/admin/inquiries?id=${encodeURIComponent(i.id)}`}>
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Notes & Quick Communications */}
        <div className="space-y-6">
          {/* Interactive Notes Editor */}
          <CustomerNotesEditor customerId={customer.id} initialNotes={customer.notes} />

          {/* Communication Quick Actions */}
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Quick Communications</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start text-xs font-medium">
                <a href={`mailto:${customer.primaryContactEmail}`}>
                  <Mail className="mr-2 h-3.5 w-3.5 text-blue-500" />
                  Email {customer.primaryContactName}
                </a>
              </Button>
              {customer.primaryContactPhone && (
                <Button asChild variant="outline" className="w-full justify-start text-xs font-medium">
                  <a href={`tel:${customer.primaryContactPhone}`}>
                    <Phone className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                    Call {customer.primaryContactPhone}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
