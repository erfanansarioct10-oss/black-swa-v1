import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, FileText, Inbox } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PendingDirectivesAlertProps {
  unassignedQuotesCount: number;
  newInquiriesCount: number;
}

export function PendingDirectivesAlert({
  unassignedQuotesCount,
  newInquiriesCount,
}: PendingDirectivesAlertProps) {
  const totalActionItems = unassignedQuotesCount + newInquiriesCount;
  const isAllClear = totalActionItems === 0;

  if (isAllClear) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 text-card-foreground shadow-xs transition-all">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-foreground">All Directives Clear</h2>
              <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold">
                Operational
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              All commercial RFQ requests have been assigned and contact inquiries are up to date.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 text-card-foreground shadow-xs transition-all">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0">
          <AlertTriangle className="w-5 h-5 motion-safe:animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-extrabold text-foreground tracking-tight">
              High-Priority Action Required
            </h2>
            <Badge variant="outline" className="text-xs bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold uppercase tracking-wider">
              {totalActionItems} Pending {totalActionItems === 1 ? "Directive" : "Directives"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {unassignedQuotesCount > 0 && (
              <span className="font-semibold text-foreground">
                {unassignedQuotesCount} unassigned {unassignedQuotesCount === 1 ? "RFQ request" : "RFQ requests"}
              </span>
            )}
            {unassignedQuotesCount > 0 && newInquiriesCount > 0 && " and "}
            {newInquiriesCount > 0 && (
              <span className="font-semibold text-foreground">
                {newInquiriesCount} unreviewed {newInquiriesCount === 1 ? "contact inquiry" : "contact inquiries"}
              </span>)}
            {" requiring immediate Managing Director review."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0 border-t border-amber-500/20 lg:border-t-0">
        {unassignedQuotesCount > 0 && (
          <Button asChild size="sm" className="w-full sm:w-auto text-xs font-semibold shadow-xs">
            <Link href="/admin/quotes">
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Assign Pending RFQs ({unassignedQuotesCount})
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 opacity-70" />
            </Link>
          </Button>
        )}
        {newInquiriesCount > 0 && (
          <Button asChild size="sm" variant="outline" className="w-full sm:w-auto text-xs font-semibold bg-background/80 hover:bg-background">
            <Link href="/admin/inquiries">
              <Inbox className="w-3.5 h-3.5 mr-1.5" />
              Review Inquiries ({newInquiriesCount})
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
