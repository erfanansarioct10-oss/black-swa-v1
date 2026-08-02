import Link from "next/link";
import { and, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { PendingDirectivesAlert } from "@/components/admin/pending-directives-alert";
import { ActivityItem, RecentActivityStream } from "@/components/admin/recent-activity-stream";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";
import { contactInquiries, quotes } from "@/db/schema";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Executive Dashboard | Admin Portal",
  description: "Executive commercial metrics, active RFQs, and customer inquiry monitoring for Black Swan International.",
  path: "/admin",
});

export default async function AdminDashboardPage() {
  let pendingCount = 0;
  let unassignedCount = 0;
  let processedCount = 0;
  let totalQuotesCount = 0;
  let activeInquiriesCount = 0;
  let newInquiriesCount = 0;
  let activityItems: ActivityItem[] = [];


  try {
    const [
      [pendingRes],
      [unassignedRes],
      [processedRes],
      [totalQuotesRes],
      [activeInquiriesRes],
      [newInquiriesRes],
      latestQuotes,
      latestInquiries,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(quotes).where(eq(quotes.status, "pending")),
      db.select({ count: sql<number>`count(*)` }).from(quotes).where(and(eq(quotes.status, "pending"), isNull(quotes.assignedManagerId))),
      db.select({ count: sql<number>`count(*)` }).from(quotes).where(inArray(quotes.status, ["quoted", "completed"])),
      db.select({ count: sql<number>`count(*)` }).from(quotes),
      db.select({ count: sql<number>`count(*)` }).from(contactInquiries).where(inArray(contactInquiries.status, ["new", "in_progress"])),
      db.select({ count: sql<number>`count(*)` }).from(contactInquiries).where(eq(contactInquiries.status, "new")),
      db.select().from(quotes).orderBy(desc(quotes.createdAt)).limit(6),
      db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt)).limit(6),
    ]);

    pendingCount = Number(pendingRes?.count || 0);
    unassignedCount = Number(unassignedRes?.count || 0);
    processedCount = Number(processedRes?.count || 0);
    totalQuotesCount = Number(totalQuotesRes?.count || 0);
    activeInquiriesCount = Number(activeInquiriesRes?.count || 0);
    newInquiriesCount = Number(newInquiriesRes?.count || 0);

    const mappedQuotes: ActivityItem[] = latestQuotes.map((q) => ({
      id: q.id,
      type: "rfq",
      referenceId: q.referenceId,
      customerName: q.fullName,
      companyName: q.companyName,
      details: q.budgetRange ? `Budget: ${q.budgetRange}` : q.projectScope || "Custom Quotation Request",
      status: q.status,
      createdAt: q.createdAt.toISOString(),
      link: "/admin/quotes",
    }));

    const mappedInquiries: ActivityItem[] = latestInquiries.map((i) => ({
      id: i.id,
      type: "inquiry",
      referenceId: null,
      customerName: i.fullName,
      companyName: i.companyName,
      details: i.serviceSlug ? `Service: ${i.serviceSlug}` : i.message,
      status: i.status,
      createdAt: i.createdAt.toISOString(),
      link: "/admin/inquiries",
    }));

    activityItems = [...mappedQuotes, ...mappedInquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Failed to query admin metrics:", error);
  }


  const completionRate =
    totalQuotesCount > 0 ? Math.round((processedCount / totalQuotesCount) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Page Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Executive Portal
            </span>
            <Badge variant="outline" className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
              v1.0 Operational
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl mt-0.5">
            Executive Command Dashboard
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time commercial quotation metrics, client service inquiry monitoring, and system status.
          </p>
        </div>
      </div>

      {/* High-Priority Directives Alert Banner */}
      <PendingDirectivesAlert
        unassignedQuotesCount={unassignedCount}
        newInquiriesCount={newInquiriesCount}
      />

      {/* 4 Executive KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* KPI Card 1: Pending RFQs */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-3 shadow-xs relative overflow-hidden group hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Pending RFQs
            </span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">
                {pendingCount}
              </span>
              <span className="text-xs text-muted-foreground font-medium">requests</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
              {unassignedCount > 0 ? `${unassignedCount} unassigned` : "All pending assigned"}
            </p>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Awaiting director action</span>
            <Link href="/admin/quotes" className="text-foreground hover:underline font-semibold flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* KPI Card 2: Active Contact Inquiries */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-3 shadow-xs relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Active Inquiries
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">
                {activeInquiriesCount}
              </span>
              <span className="text-xs text-muted-foreground font-medium">inquiries</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">
              {newInquiriesCount > 0 ? `${newInquiriesCount} new unreviewed` : "All inquiries reviewed"}
            </p>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Submitted contact leads</span>
            <Link href="/admin/inquiries" className="text-foreground hover:underline font-semibold flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* KPI Card 3: Total Quotes Processed */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-3 shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Quotes Processed
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">
                {processedCount}
              </span>
              <span className="text-xs text-muted-foreground font-medium">/ {totalQuotesCount} total</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {completionRate}% completion rate
            </p>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Quoted or completed</span>
            <Link href="/admin/quotes" className="text-foreground hover:underline font-semibold flex items-center gap-0.5">
              History <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* KPI Card 4: Total Commercial Portfolio */}
        <div className="p-5 bg-card border border-border rounded-xl space-y-3 shadow-xs relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Commercial Requests
            </span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">
                {totalQuotesCount + activeInquiriesCount}
              </span>
              <span className="text-xs text-muted-foreground font-medium">total leads</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> All system data secured
            </p>
          </div>
          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>RFQs & Inquiries Combined</span>
            <Link href="/admin/quotes" className="text-foreground hover:underline font-semibold flex items-center gap-0.5">
              Explore <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* Main Content Area: Recent Activity Stream */}
      <div className="pt-2">
        <RecentActivityStream items={activityItems} />
      </div>
    </div>
  );
}
