"use client";

import { exportCrmDataAction } from "@/actions/crm-export";
import { getPipelineAnalyticsAction, PipelineAnalyticsMetrics } from "@/actions/pipeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CrmDateHorizon } from "@/schemas/pipeline";
import {
  ArrowUpRight,
  Clock,
  Download,
  FileSpreadsheet,
  Loader2,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useState, useTransition } from "react";

interface CrmAnalyticsViewProps {
  initialMetrics: PipelineAnalyticsMetrics;
  initialHorizon: CrmDateHorizon;
}

export function CrmAnalyticsView({ initialMetrics, initialHorizon }: CrmAnalyticsViewProps) {
  const [metrics, setMetrics] = useState<PipelineAnalyticsMetrics>(initialMetrics);
  const [horizon, setHorizon] = useState<CrmDateHorizon>(initialHorizon);
  const [isPending, startTransition] = useTransition();

  const [exportType, setExportType] = useState<"customers" | "leads" | "quotes">("leads");
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [isExporting, setIsExporting] = useState(false);

  const handleHorizonChange = (newHorizon: CrmDateHorizon) => {
    setHorizon(newHorizon);
    startTransition(async () => {
      const res = await getPipelineAnalyticsAction(newHorizon);
      if (res.success && res.metrics) {
        setMetrics(res.metrics);
      }
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await exportCrmDataAction({
        exportType,
        format: exportFormat,
        horizon,
      });

      if (res.success && res.payload) {
        const blob = new Blob([res.payload], { type: res.contentType || "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = res.fileName || `export.${exportFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert(res.error || "Failed to generate export file");
      }
    } catch (err) {
      console.error("Export download error:", err);
      alert("Error occurred while generating export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Date Horizon Tabs */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Executive CRM Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor B2B sales throughput, conversion funnels, win/loss ratios, and cycle performance.
          </p>
        </div>

        {/* Date Horizon Filter Selector */}
        <div className="grid grid-cols-4 sm:flex items-center gap-1 rounded-xl border bg-muted/60 p-1 text-xs w-full sm:w-auto shrink-0">
          {(
            [
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
              { id: "ytd", label: "YTD" },
              { id: "all", label: "All Time" },
            ] as const
          ).map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={horizon === item.id ? "default" : "ghost"}
              className="h-8 px-2 sm:px-3 text-xs font-semibold rounded-lg"
              onClick={() => handleHorizonChange(item.id)}
              disabled={isPending}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Win Rate */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Win Rate %
            </span>
            <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{metrics.winRate}%</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {metrics.wonLeadsCount} won / {metrics.lostLeadsCount} lost ({metrics.totalClosed} closed)
            </p>
          </div>
        </div>

        {/* 2. Total Pipeline Value */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Pipeline Value
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-500 shrink-0" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              Rs. {metrics.totalPipelineValuation.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Active pipeline valuation sum</p>
          </div>
        </div>

        {/* 3. Won Revenue */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Won Revenue
            </span>
            <ArrowUpRight className="h-4 w-4 text-primary shrink-0" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-foreground">
              Rs. {metrics.wonRevenue.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Closed won deals sum</p>
          </div>
        </div>

        {/* 4. Avg Sales Cycle */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Sales Cycle
            </span>
            <Clock className="h-4 w-4 text-sky-500 shrink-0" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {metrics.avgSalesCycleDays} {metrics.avgSalesCycleDays === 1 ? "day" : "days"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">From initial inquiry to deal closure</p>
          </div>
        </div>
      </div>

      {/* Stage Conversion Funnel Card */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-foreground">Stage Conversion Funnel</h3>
            <p className="text-xs text-muted-foreground">
              Progression volume and conversion rates across sales pipeline stages.
            </p>
          </div>
          <Badge variant="outline" className="text-xs uppercase shrink-0">
            {horizon}
          </Badge>
        </div>

        <div className="space-y-4">
          {metrics.funnel.map((item) => (
            <div key={item.stage} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-medium gap-0.5">
                <span className="text-foreground font-semibold">{item.stage}</span>
                <span className="text-muted-foreground text-[11px] sm:text-xs">
                  {item.count} lead{item.count === 1 ? "" : "s"} &bull; Rs. {item.value.toLocaleString()} ({item.conversionRate}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.max(4, item.conversionRate)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Data Export Center */}
      <div className="rounded-xl border border-primary/30 bg-card p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">Enterprise Data Export Center</h3>
            <p className="text-xs text-muted-foreground">
              Export sanitized CSV or JSON data streams for customers, leads, or quotation records.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            {/* Export Target Entity */}
            <div className="grid grid-cols-3 sm:flex items-center gap-1 rounded-lg border bg-background p-1 text-xs">
              {(["customers", "leads", "quotes"] as const).map((target) => (
                <Button
                  key={target}
                  size="sm"
                  variant={exportType === target ? "default" : "ghost"}
                  className="h-7 px-2.5 capitalize text-xs font-medium"
                  onClick={() => setExportType(target)}
                >
                  {target}
                </Button>
              ))}
            </div>

            {/* Export Format */}
            <div className="grid grid-cols-2 sm:flex items-center gap-1 rounded-lg border bg-background p-1 text-xs">
              {(["csv", "json"] as const).map((fmt) => (
                <Button
                  key={fmt}
                  size="sm"
                  variant={exportFormat === fmt ? "default" : "ghost"}
                  className="h-7 px-2.5 uppercase text-xs font-semibold"
                  onClick={() => setExportFormat(fmt)}
                >
                  {fmt}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full lg:w-auto font-bold h-9 text-xs"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download {exportType.toUpperCase()} ({exportFormat.toUpperCase()})
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
