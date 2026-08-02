import { Award, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ThroughputMetrics {
  totalPipelineVolumeNpr: number;
  totalQuotesInPeriod: number;
  averageSlaHours: number;
  overallConversionRate: number;
  quotedAndCompletedCount: number;
  topCategoryName: string;
  topCategoryItemsCount: number;
}

export function ExecutiveThroughputCards({ metrics }: { metrics: ThroughputMetrics }) {
  const formattedPipelineVolume = new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(metrics.totalPipelineVolumeNpr);

  const slaFormatted =
    metrics.averageSlaHours === 0
      ? "N/A"
      : metrics.averageSlaHours < 24
      ? `${metrics.averageSlaHours.toFixed(1)} hrs`
      : `${(metrics.averageSlaHours / 24).toFixed(1)} days`;

  const slaStatusColor =
    metrics.averageSlaHours > 0 && metrics.averageSlaHours <= 24
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      : metrics.averageSlaHours > 24 && metrics.averageSlaHours <= 48
      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
      : "bg-blue-500/10 text-blue-600 border-blue-500/20";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Commercial Pipeline Volume */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Commercial Pipeline
          </span>
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground truncate">
            {formattedPipelineVolume}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{metrics.totalQuotesInPeriod} Total RFQ Submissions</span>
            <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
              Active Pipeline
            </Badge>
          </div>
        </div>
      </div>

      {/* 2. Average SLA Response Time */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Avg SLA Response
          </span>
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {slaFormatted}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Submission to Manager</span>
            <Badge variant="outline" className={`text-[10px] ${slaStatusColor}`}>
              Target: &lt; 24h
            </Badge>
          </div>
        </div>
      </div>

      {/* 3. Overall Conversion Rate */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Conversion Rate
          </span>
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {metrics.overallConversionRate.toFixed(1)}%
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{metrics.quotedAndCompletedCount} Quoted / Finalized</span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              Throughput
            </Badge>
          </div>
        </div>
      </div>

      {/* 4. Top Performing Category */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Demand Category
          </span>
          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg">
            <Award className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate" title={metrics.topCategoryName}>
            {metrics.topCategoryName}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{metrics.topCategoryItemsCount} Items Requested</span>
            <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20">
              Highest Demand
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
