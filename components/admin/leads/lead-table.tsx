"use client";

import Link from "next/link";
import {
  Building2,
  Eye,
  Mail,
  MoreHorizontal,
  Pencil,
  Phone,
  Target,
  UserCheck,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LeadListItem } from "@/actions/lead";

interface LeadTableProps {
  leads: LeadListItem[];
  onConvertClick?: (lead: LeadListItem) => void;
  onEditClick?: (lead: LeadListItem) => void;
}

export function LeadTable({ leads, onConvertClick, onEditClick }: LeadTableProps) {
  if (!leads || leads.length === 0) {
    return (
      <div className="p-8 text-center bg-card rounded-xl border border-border shadow-xs">
        <Target className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="text-base font-semibold text-foreground">No Sales Leads Found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          No lead records match your search criteria or filters. Create your first lead or update your filter parameters.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            New Lead
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
            Contacted
          </span>
        );
      case "qualified":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
            Qualified Prospect
          </span>
        );
      case "unqualified":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20">
            Unqualified
          </span>
        );
      case "converted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
            Converted Customer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-muted text-muted-foreground border-border">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
            Urgent
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
            High
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
            Medium
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-normal border bg-muted text-muted-foreground border-border">
            Low
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border bg-muted text-muted-foreground border-border">
            {priority}
          </span>
        );
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case "website_rfq":
        return "Website RFQ";
      case "direct_inquiry":
        return "Direct Inquiry";
      case "referral":
        return "Referral";
      case "trade_show":
        return "Trade Show";
      case "outreach":
        return "Sales Outreach";
      default:
        return source;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Lead Title & Company</th>
              <th className="py-3 px-4 font-semibold">Primary Contact</th>
              <th className="py-3 px-4 font-semibold">Source</th>
              <th className="py-3 px-4 font-semibold">Priority</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Est. Value</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {lead.title}
                    </Link>
                    {lead.companyName ? (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-muted-foreground/70" />
                        {lead.companyName}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic mt-0.5">Individual Inquiry</span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-xs">{lead.contactName}</span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs text-muted-foreground hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3 h-3 text-muted-foreground/70" />
                      {lead.email}
                    </a>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs font-medium text-muted-foreground">
                  {getSourceLabel(lead.leadSource)}
                </td>
                <td className="py-3.5 px-4">{getPriorityBadge(lead.priority)}</td>
                <td className="py-3.5 px-4">{getStatusBadge(lead.status)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-foreground">
                  {lead.estimatedValue > 0 ? (
                    `$${lead.estimatedValue.toLocaleString()}`
                  ) : (
                    <span className="text-muted-foreground font-normal">TBD</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/leads/${lead.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="w-4 h-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Lead Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/leads/${lead.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Overview
                          </Link>
                        </DropdownMenuItem>
                        {onEditClick && (
                          <DropdownMenuItem onClick={() => onEditClick(lead)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Lead Attributes
                          </DropdownMenuItem>
                        )}
                        {lead.status !== "converted" && onConvertClick && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onConvertClick(lead)}
                              className="text-amber-600 dark:text-amber-400 font-semibold focus:text-amber-600"
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Convert to Customer
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <a href={`mailto:${lead.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Direct Email
                          </a>
                        </DropdownMenuItem>
                        {lead.phone && (
                          <DropdownMenuItem asChild>
                            <a href={`tel:${lead.phone}`}>
                              <Phone className="w-4 h-4 mr-2" />
                              Call Phone Number
                            </a>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
