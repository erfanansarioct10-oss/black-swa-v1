"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LeadFormModal } from "@/components/admin/leads/lead-form-modal";

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
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-card p-4 rounded-xl border border-border shadow-xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
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
          <Button type="submit" size="sm" variant="secondary" className="h-8 text-xs">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Select */}
          <select
            value={currentStatus}
            onChange={(e) => updateFilters("status", e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
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
            className="px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Source Select */}
          <select
            value={currentSource}
            onChange={(e) => updateFilters("source", e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring font-medium"
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
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}

          <Button
            onClick={() => setCreateModalOpen(true)}
            size="sm"
            className="h-8 text-xs gap-1.5 ml-auto md:ml-0"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </Button>
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
