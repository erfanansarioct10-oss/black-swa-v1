import { CheckCircle2, Clock, Filter, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FunnelStage {
  stageName: string;
  count: number;
  conversionPercent: number; // relative to stage 1 (Submission)
  dropoffPercent: number; // dropoff from previous stage
}

export interface SlaBreakdown {
  assignmentAvgHours: number;
  quotingAvgHours: number;
  completionAvgHours: number;
}

export function ConversionFunnelSla({
  funnel,
  sla,
}: {
  funnel: FunnelStage[];
  sla: SlaBreakdown;
}) {
  const formatSlaHours = (hours: number) => {
    if (hours === 0) return "N/A";
    if (hours < 24) return `${hours.toFixed(1)} hrs`;
    return `${(hours / 24).toFixed(1)} days`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. 5-Stage Commercial Conversion Funnel (Spans 2 columns on lg) */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                <Filter className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  5-Stage Commercial Conversion Funnel
                </h3>
                <p className="text-xs text-muted-foreground">
                  RFQ lifecycle progression from initial submission to contract execution
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              Commercial Lifecycle
            </Badge>
          </div>

          {/* Funnel Visualizer */}
          <div className="mt-6 space-y-3">
            {funnel.map((stage, idx) => {
              const bgOpacityClass =
                idx === 0
                  ? "bg-primary text-primary-foreground"
                  : idx === 1
                  ? "bg-blue-600 text-white"
                  : idx === 2
                  ? "bg-indigo-600 text-white"
                  : idx === 3
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-700 text-white";

              return (
                <div key={idx} className="relative group">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-foreground">{stage.stageName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-foreground font-bold">{stage.count} RFQs</span>
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {stage.conversionPercent.toFixed(1)}% of total
                      </span>
                    </div>
                  </div>

                  {/* Funnel Bar Container */}
                  <div className="w-full bg-muted/60 rounded-lg h-9 p-1 flex items-center overflow-hidden border border-border/50">
                    <div
                      className={`h-full rounded-md flex items-center justify-between px-3 text-xs font-medium transition-all duration-500 ${bgOpacityClass}`}
                      style={{ width: `${Math.max(stage.conversionPercent, 8)}%` }}
                    >
                      <span className="truncate">{stage.stageName}</span>
                      <span className="font-mono text-[11px] opacity-90 ml-2">
                        {stage.count}
                      </span>
                    </div>
                  </div>

                  {/* Dropoff Indicator between stages */}
                  {idx > 0 && stage.dropoffPercent > 0 && (
                    <div className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-0.5 ml-7">
                      <span>Drop-off from stage {idx}: {stage.dropoffPercent.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>End-to-End Pipeline Health</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> High conversion integrity
          </span>
        </div>
      </div>

      {/* 2. SLA Response Time Analytics Breakdown (1 column on lg) */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-500/10 text-amber-600 rounded-lg">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">SLA Response Performance</h3>
                <p className="text-xs text-muted-foreground">Operational response velocity</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20">
              SLA Standard
            </Badge>
          </div>

          <div className="mt-5 space-y-4">
            {/* Metric 1: Submission -> Manager Assigned */}
            <div className="p-3.5 bg-muted/30 border border-border/70 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Manager Assignment SLA</span>
                <Badge
                  variant="outline"
                  className={
                    sla.assignmentAvgHours > 0 && sla.assignmentAvgHours <= 24
                      ? "text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }
                >
                  Target &lt; 24h
                </Badge>
              </div>
              <div className="text-xl font-extrabold text-foreground mt-1">
                {formatSlaHours(sla.assignmentAvgHours)}
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">
                Avg time from customer RFQ submission to director assignment
              </span>
            </div>

            {/* Metric 2: Submission -> Quoted */}
            <div className="p-3.5 bg-muted/30 border border-border/70 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Quote Dispatch SLA</span>
                <Badge
                  variant="outline"
                  className={
                    sla.quotingAvgHours > 0 && sla.quotingAvgHours <= 48
                      ? "text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }
                >
                  Target &lt; 48h
                </Badge>
              </div>
              <div className="text-xl font-extrabold text-foreground mt-1">
                {formatSlaHours(sla.quotingAvgHours)}
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">
                Avg time from customer submission to official proposal dispatch
              </span>
            </div>

            {/* Metric 3: Submission -> Completed */}
            <div className="p-3.5 bg-muted/30 border border-border/70 rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Full Resolution SLA</span>
                <Badge
                  variant="outline"
                  className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-500/20"
                >
                  Target &lt; 72h
                </Badge>
              </div>
              <div className="text-xl font-extrabold text-foreground mt-1">
                {formatSlaHours(sla.completionAvgHours)}
              </div>
              <span className="text-[11px] text-muted-foreground mt-1">
                Avg total turnaround time from submission to contract closure
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground flex items-center justify-between">
          <span>Benchmark: ISO/IEC Quality SLA</span>
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
        </div>
      </div>
    </div>
  );
}
