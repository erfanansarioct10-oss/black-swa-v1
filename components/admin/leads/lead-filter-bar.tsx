"use client";

import { LeadFormModal } from "@/components/admin/leads/lead-form-modal";
import { Button } from "@/components/ui/button";
import { Plus, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LeadFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "all";
  const currentPriority = searchParams.get("priority") || "all";
  const currentSource = searchParams.get("source") || "all";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`/admin/leads?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchTerm.trim());
  };

  const clearFilters = () => {
    setSearchTerm("");
    router.push("/admin/leads");
  };

  const hasActiveFilters = currentSearch || currentStatus !== "all" || currentPriority !== "all" || currentSource !== "all";

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-card p-3.5 sm:p-4 rounded-xl border border-border shadow-xs">
        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full lg:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads by title, contact, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs shrink-0">
            Search
          </Button>
        </form>

        {/* Filter Controls & Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 w-full lg:w-auto">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 flex-1 sm:flex-initial">
            {/* Status Select */}
            <select
              value={currentStatus}
              onChange={(e) => updateFilters("status", e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="new">New Lead</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
              <option value="converted">Converted</option>
            </select>

            {/* Priority Select */}
            <select
              value={currentPriority}
              onChange={(e) => updateFilters("priority", e.target.value)}
              className="w-full sm:w-auto px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Source Select */}
            <select
              value={currentSource}
              onChange={(e) => updateFilters("source", e.target.value)}
              className="flex-1 sm:flex-initial px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
            >
              <option value="all">All Sources</option>
              <option value="website_rfq">Website RFQ</option>
              <option value="direct_inquiry">Direct Inquiry</option>
              <option value="referral">Referral</option>
              <option value="trade_show">Trade Show</option>
              <option value="outreach">Sales Outreach</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}

            <Button
              onClick={() => setCreateModalOpen(true)}
              size="sm"
              className="h-8 text-xs gap-1.5 font-bold shrink-0 ml-auto"
            >
              <Plus className="w-4 h-4" />
              New Lead
            </Button>
          </div>
        </div>
      </div>

      <LeadFormModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
