"use client";

import { type CustomerListItem } from "@/actions/customer";
import { CustomerFormModal } from "@/components/admin/customers/customer-form-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CUSTOMER_STATUSES,
  ORGANIZATION_TYPES,
} from "@/schemas/customer";
import {
  Building2,
  ChevronRight,
  Eye,
  FileText,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Tag,
} from "lucide-react";
import Link from "next/link";

interface CustomerTableProps {
  customers: CustomerListItem[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  if (!customers || customers.length === 0) {
    return (
      <div className="p-8 text-center bg-card rounded-xl border border-border shadow-xs">
        <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-semibold text-foreground">No Customer Accounts Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          No accounts matched your query or filters. Create your first client account or reset your filter criteria.
        </p>
      </div>
    );
  }

  const getStatusBadge = (statusValue: string) => {
    const matched = CUSTOMER_STATUSES.find((s) => s.value === statusValue);
    const label = matched?.label || statusValue;
    const colorClass = matched?.color || "bg-muted text-muted-foreground border-border";

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  const getOrgTypeLabel = (typeValue: string) => {
    const matched = ORGANIZATION_TYPES.find((t) => t.value === typeValue);
    return matched?.label || typeValue;
  };

  return (
    <div className="space-y-4">
      {/* 📱 MOBILE CARD VIEW (Visible strictly on mobile viewports < 768px) */}
      <div className="space-y-3 block md:hidden">
        {customers.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2.5">
              <div className="flex items-start gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {c.organizationName}
                  </Link>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Tag className="h-3 w-3 shrink-0" />
                    {getOrgTypeLabel(c.organizationType)}
                  </div>
                </div>
              </div>
              <div className="shrink-0">{getStatusBadge(c.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground text-[11px]">Primary Contact</span>
                <p className="font-semibold text-foreground truncate">{c.primaryContactName}</p>
                <a href={`mailto:${c.primaryContactEmail}`} className="text-muted-foreground hover:underline flex items-center gap-1 text-[11px] truncate mt-0.5">
                  <Mail className="w-3 h-3 shrink-0" />
                  {c.primaryContactEmail}
                </a>
              </div>

              <div className="text-right">
                <span className="text-muted-foreground text-[11px]">Location</span>
                <p className="font-medium text-foreground truncate">{c.city ? `${c.city}, ${c.country || "Nepal"}` : c.country || "Nepal"}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span>{c.linkedQuotesCount || 0} Quotes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/40">
              <Link href={`/admin/customers/${c.id}`}>
                <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Profile
                </Button>
              </Link>
              <CustomerFormModal
                customer={c}
                trigger={
                  <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* 💻 DESKTOP TABLE VIEW (Visible on medium viewports >= 768px) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              <th className="py-3.5 px-4">Organization & Type</th>
              <th className="py-3.5 px-4">Primary Contact</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Location & Tax ID</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center hidden md:table-cell">Linked RFQs</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3.5 px-4 font-medium">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                      >
                        {c.organizationName}
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Tag className="h-3 w-3 shrink-0" />
                        {getOrgTypeLabel(c.organizationType)}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-sm font-medium text-foreground">{c.primaryContactName}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Mail className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <a href={`mailto:${c.primaryContactEmail}`} className="hover:underline">
                      {c.primaryContactEmail}
                    </a>
                  </div>
                  {c.primaryContactPhone && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <a href={`tel:${c.primaryContactPhone}`} className="hover:underline">
                        {c.primaryContactPhone}
                      </a>
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-4 hidden sm:table-cell">
                  <div className="text-sm text-foreground">
                    {c.city ? `${c.city}, ${c.country || "Nepal"}` : c.country || "Nepal"}
                  </div>
                  {c.taxRegistrationId && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      PAN/VAT: <span className="font-mono">{c.taxRegistrationId}</span>
                    </div>
                  )}
                </td>

                <td className="py-3.5 px-4">{getStatusBadge(c.status)}</td>

                <td className="py-3.5 px-4 text-center hidden md:table-cell">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-muted text-foreground">
                    <FileText className="h-3 w-3" />
                    {c.linkedQuotesCount || 0}
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/customers/${c.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Account Profile
                        </Link>
                      </DropdownMenuItem>

                      <CustomerFormModal
                        customer={c}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Account Details
                          </DropdownMenuItem>
                        }
                      />

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <a href={`mailto:${c.primaryContactEmail}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </a>
                      </DropdownMenuItem>
                      {c.primaryContactPhone && (
                        <DropdownMenuItem asChild>
                          <a href={`tel:${c.primaryContactPhone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Call Phone
                          </a>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
