import { Suspense } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Target,
  UserCheck,
  UserPlus,
} from "lucide-react";

import { getLeadsAction, getLeadStatsAction } from "@/actions/lead";
import { LeadFilterBar } from "@/components/admin/leads/lead-filter-bar";
import { LeadsTableContainer } from "@/components/admin/leads/leads-table-container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Lead Pipeline & Inquiry Processing | Black Swan Admin",
  description: "Manage inbound leads, RFQ inquiries, deal pipeline valuation, and client conversion.",
};

interface LeadsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    source?: string;
    page?: string;
  }>;
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const status = params.status || "all";
  const priority = params.priority || "all";
  const source = params.source || "all";
  const page = parseInt(params.page || "1", 10);

  const [statsRes, leadsRes] = await Promise.all([
    getLeadStatsAction(),
    getLeadsAction({
      search,
      status,
      priority,
      source,
      page,
      pageSize: 10,
    }),
  ]);

  const stats = statsRes.success && statsRes.data
    ? statsRes.data
    : { totalLeads: 0, newInbound: 0, qualifiedProspects: 0, estimatedPipelineValue: 0 };

  const leadsData = leadsRes.success && leadsRes.data
    ? leadsRes.data
    : {
        leads: [],
        pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 },
        statusCounts: { new: 0, contacted: 0, qualified: 0, unqualified: 0, converted: 0 },
      };

  const { leads, pagination } = leadsData;


  const buildPaginationUrl = (newPage: number) => {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status && status !== "all") query.set("status", status);
    if (priority && priority !== "all") query.set("priority", priority);
    if (source && source !== "all") query.set("source", source);
    query.set("page", newPage.toString());
    return `/admin/leads?${query.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Lead Management & Inbound Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Qualify prospective buyers, manage estimated valuation, and execute automated customer account conversions.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Registered Leads</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalLeads.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">All captured pipeline opportunities</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Target className="w-5 h-5" />
          </div>
        </div>

        {/* New Inbound */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">New Inbound Opportunities</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.newInbound.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting initial team outreach</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        {/* Qualified Prospects */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Qualified Prospects</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
              {stats.qualifiedProspects.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Ready for account conversion</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Estimated Pipeline Value */}
        <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Est. Active Pipeline Value</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">
              ${stats.estimatedPipelineValue.toLocaleString()}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Combined valuation across active stages</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar Component */}
      <Suspense fallback={<div className="h-14 bg-card rounded-xl border animate-pulse" />}>
        <LeadFilterBar />
      </Suspense>

      {/* Directory Table */}
      <LeadsTableContainer leads={leads} />

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-xs text-xs">
          <span className="text-muted-foreground">
            Showing <strong className="text-foreground">{leads.length}</strong> of{" "}
            <strong className="text-foreground">{pagination.total}</strong> lead records (Page{" "}
            {pagination.page} of {pagination.totalPages})
          </span>

          <div className="flex items-center gap-2">
            {pagination.page > 1 ? (
              <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                <Link href={buildPaginationUrl(pagination.page - 1)}>
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>
            )}

            {pagination.page < pagination.totalPages ? (
              <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                <Link href={buildPaginationUrl(pagination.page + 1)}>
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="h-8 text-xs">
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
