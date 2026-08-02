"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Clock,
  ExternalLink,
  Filter,
  MessageSquare,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface ActivityItem {
  id: string;
  type: "rfq" | "inquiry";
  referenceId: string | null;
  customerName: string;
  companyName: string | null;
  details: string;
  status: string;
  createdAt: string; // ISO timestamp string
  link: string;
}

interface RecentActivityStreamProps {
  items: ActivityItem[];
}

type FilterTab = "all" | "rfqs" | "inquiries";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 172800) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "under_review":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
    case "manager_assigned":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
    case "quoted":
    case "completed":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "new":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
    case "in_progress":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
    case "rejected":
    case "archived":
      return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function formatStatusText(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function RecentActivityStream({ items }: RecentActivityStreamProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const mounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const filteredItems = useMemo(() => {
    if (activeTab === "rfqs") return items.filter((item) => item.type === "rfq");
    if (activeTab === "inquiries") return items.filter((item) => item.type === "inquiry");
    return items;
  }, [items, activeTab]);

  return (
    <div className="space-y-4 bg-card border border-border rounded-xl p-4 sm:p-6 shadow-xs">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-foreground tracking-tight">
              Real-Time Activity Stream
            </h3>
            <Badge variant="outline" className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              Live Feed
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Combined log of commercial RFQs and client service inquiries ordered by dispatch time.
          </p>
        </div>

        {/* Tab Filter Controls */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/50 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rfqs")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "rfqs"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            RFQs ({items.filter((i) => i.type === "rfq").length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "inquiries"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Inquiries ({items.filter((i) => i.type === "inquiry").length})
          </button>
        </div>
      </div>

      {/* Stream Items List */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="mx-auto w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center text-muted-foreground">
            <Filter className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">No recent activity found</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are no recent items matching the selected filter tab.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {filteredItems.map((item) => {
            const isRfq = item.type === "rfq";

            return (
              <div
                key={`${item.type}-${item.id}`}
                className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-muted/30 px-2 rounded-lg transition-colors"
              >
                {/* Left Side: Type Icon + Title + Details */}
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isRfq
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    }`}
                  >
                    {isRfq ? (
                      <Briefcase className="w-4 h-4" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                        {isRfq ? `RFQ #${item.referenceId}` : "Contact Inquiry"}
                      </span>
                      <span className="text-xs text-muted-foreground/40">•</span>
                      <h4 className="text-sm font-bold text-foreground truncate">
                        {item.customerName}
                      </h4>
                      {item.companyName && (
                        <span className="text-xs text-muted-foreground truncate">
                          ({item.companyName})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.details}
                    </p>
                  </div>
                </div>

                {/* Right Side: Timestamp + Status Badge + Direct Link */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center pt-1 sm:pt-0">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{mounted ? formatRelativeTime(item.createdAt) : item.createdAt.slice(0, 10)}</span>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[11px] font-semibold uppercase tracking-wider ${getStatusBadgeVariant(
                      item.status
                    )}`}
                  >
                    {formatStatusText(item.status)}
                  </Badge>

                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-muted-foreground hover:text-foreground opacity-80 group-hover:opacity-100"
                  >
                    <Link href={item.link} title="View Details">
                      <ArrowUpRight className="w-4 h-4" />
                      <span className="sr-only">View Details</span>
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stream Footer Quick Action */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span>Showing top {filteredItems.length} recent activity items</span>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/quotes"
            className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
          >
            All Quotes <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/admin/inquiries"
            className="font-semibold text-foreground hover:underline inline-flex items-center gap-1"
          >
            All Inquiries <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
