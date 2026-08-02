import { Suspense } from "react";
import Link from "next/link";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Filter,
  Hospital,
  Radio,
  Search,
  Users,
} from "lucide-react";

import { getCustomersAction, getCustomerStatsAction } from "@/actions/customer";
import { CustomerFormModal } from "@/components/admin/customers/customer-form-modal";
import { CustomerTable } from "@/components/admin/customers/customer-table";
import { Button } from "@/components/ui/button";
import { ORGANIZATION_TYPES, CUSTOMER_STATUSES } from "@/schemas/customer";

export const metadata = {
  title: "Customer Directory | Black Swan Admin",
  description: "Manage medical healthcare facilities, broadcast networks, and client accounts.",
};

interface CustomersPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function AdminCustomersPage({ searchParams }: CustomersPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  const type = params.type || "all";
  const status = params.status || "all";
  const page = parseInt(params.page || "1", 10);

  const [statsRes, customersRes] = await Promise.all([
    getCustomerStatsAction(),
    getCustomersAction({
      query,
      organizationType: type,
      status,
      page,
      pageSize: 10,
    }),
  ]);

  const stats = statsRes.success && statsRes.data
    ? statsRes.data
    : { totalAccounts: 0, healthcareClients: 0, broadcastNetworks: 0, activeProspects: 0 };

  const customersData = customersRes.success && customersRes.data
    ? customersRes.data
    : { customers: [], pagination: { total: 0, page: 1, pageSize: 10, totalPages: 1 } };

  const { customers, pagination } = customersData;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Customer & Account Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Centralized B2B client repository across healthcare facilities and broadcast media networks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CustomerFormModal />
        </div>
      </div>

      {/* Executive Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Accounts
            </span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {stats.totalAccounts}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Registered organization profiles</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Healthcare Clients
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Hospital className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {stats.healthcareClients}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Hospitals & diagnostic clinics</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Broadcast Networks
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {stats.broadcastNetworks}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Studios & media infrastructure</p>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Prospects
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mt-2">
            {stats.activeProspects}
          </div>
          <p className="text-xs text-muted-foreground mt-1">In negotiation / procurement</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
        <form method="GET" className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by organization name, contact person, email, or tax ID..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                name="type"
                defaultValue={type}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Industries / Types</option>
                {ORGANIZATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 sm:flex-none">
              <select
                name="status"
                defaultValue={status}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Statuses</option>
                {CUSTOMER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" variant="secondary" className="font-medium shrink-0">
              <Filter className="mr-1.5 h-4 w-4" />
              Filter
            </Button>
          </div>
        </form>
      </div>

      {/* Directory Table */}
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading directory...</div>}>
        <CustomerTable customers={customers} />
      </Suspense>

      {/* Pagination Footer */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
          <div className="text-muted-foreground">
            Page <span className="font-semibold text-foreground">{pagination.page}</span> of{" "}
            <span className="font-semibold text-foreground">{pagination.totalPages}</span> ({pagination.total} total accounts)
          </div>

          <div className="flex items-center gap-2">
            {pagination.page > 1 ? (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/admin/customers?q=${encodeURIComponent(query)}&type=${encodeURIComponent(
                    type
                  )}&status=${encodeURIComponent(status)}&page=${pagination.page - 1}`}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>
            )}

            {pagination.page < pagination.totalPages ? (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/admin/customers?q=${encodeURIComponent(query)}&type=${encodeURIComponent(
                    type
                  )}&status=${encodeURIComponent(status)}&page=${pagination.page + 1}`}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
