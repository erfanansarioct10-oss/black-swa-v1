import { Layers, PieChart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface TrendPoint {
  label: string;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

export interface BudgetDistribution {
  range: string;
  count: number;
  percentage: number;
}

export function AnalyticsCharts({
  trends,
  categories,
  budgets,
}: {
  trends: TrendPoint[];
  categories: CategoryBreakdown[];
  budgets: BudgetDistribution[];
}) {
  const maxTrendCount = Math.max(...trends.map((t) => t.count), 1);
  const totalCategoryItems = categories.reduce((sum, c) => sum + c.count, 0);
  const totalBudgetQuotes = budgets.reduce((sum, b) => sum + b.count, 0);

  // Calculate SVG polyline points for time-series chart
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 20;

  const points = trends.map((t, idx) => {
    const x =
      trends.length === 1
        ? svgWidth / 2
        : paddingX + (idx / (trends.length - 1)) * (svgWidth - 2 * paddingX);
    const y =
      svgHeight -
      paddingY -
      (t.count / maxTrendCount) * (svgHeight - 2 * paddingY);
    return { x, y, count: t.count, label: t.label };
  });

  const pathD =
    points.length > 0
      ? points.reduce(
          (acc, p, idx) =>
            idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`,
          ""
        )
      : "";

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${
          svgHeight - paddingY
        } L ${points[0].x} ${svgHeight - paddingY} Z`
      : "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. RFQ Submission Trends Time-Series Chart (Spans 2 columns on lg) */}
      <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">RFQ Submission Trends</h3>
                <p className="text-xs text-muted-foreground">
                  Quotations requested over selected time horizon
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-muted/60 text-muted-foreground">
              {trends.reduce((acc, t) => acc + t.count, 0)} Submissions
            </Badge>
          </div>

          {/* Time Series Responsive SVG Graphic */}
          <div className="mt-6 relative w-full overflow-hidden">
            {trends.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-sm text-muted-foreground">
                No RFQ submissions recorded in this time horizon.
              </div>
            ) : (
              <div className="w-full">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto overflow-visible"
                >
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--color-primary, #2563eb)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[0, 0.33, 0.66, 1].map((pct, idx) => {
                    const yVal = paddingY + pct * (svgHeight - 2 * paddingY);
                    return (
                      <line
                        key={idx}
                        x1={paddingX}
                        y1={yVal}
                        x2={svgWidth - paddingX}
                        y2={yVal}
                        stroke="currentColor"
                        className="text-border"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Area fill under curve */}
                  {areaD && <path d={areaD} fill="url(#trendGradient)" />}

                  {/* Trend line */}
                  {pathD && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="var(--color-primary, #2563eb)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Data points */}
                  {points.map((p, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        className="fill-background stroke-primary stroke-[3px] transition-all group-hover:r-7"
                      />
                      <text
                        x={p.x}
                        y={p.y - 10}
                        textAnchor="middle"
                        className="fill-foreground text-[11px] font-bold opacity-80 group-hover:opacity-100"
                      >
                        {p.count}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between items-center px-6 mt-2 text-xs text-muted-foreground font-medium">
                  {trends.map((t, idx) => (
                    <span key={idx} className="truncate max-w-[60px] text-center">
                      {t.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>Peak Volume: {maxTrendCount} RFQs / interval</span>
          <span>Updated in real-time</span>
        </div>
      </div>

      {/* 2. Equipment Category Popularity Breakdown (1 column on lg) */}
      <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 text-blue-600 rounded-lg">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Equipment Popularity</h3>
                <p className="text-xs text-muted-foreground">Requested items by category</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
              {totalCategoryItems} Units
            </Badge>
          </div>

          <div className="mt-5 space-y-4">
            {categories.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No equipment line items found in this timeframe.
              </p>
            ) : (
              categories.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-foreground truncate max-w-[170px]" title={cat.category}>
                      {cat.category}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {cat.count} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted/70 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
          Top demand driver: Medical &amp; Broadcast IT
        </div>
      </div>

      {/* 3. Commercial Budget Distribution (Spans full width or 3 columns) */}
      <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
              <PieChart className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Commercial Budget Range Distribution</h3>
              <p className="text-xs text-muted-foreground">
                Distribution of client capital budget allocations across submitted RFQs
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            {totalBudgetQuotes} Quotes Evaluated
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {budgets.length === 0 ? (
            <p className="col-span-full text-xs text-muted-foreground text-center py-6">
              No budget allocation data recorded for this range.
            </p>
          ) : (
            budgets.map((b, idx) => (
              <div
                key={idx}
                className="bg-muted/30 border border-border/70 rounded-lg p-4 flex flex-col justify-between hover:bg-muted/50 transition-colors"
              >
                <div>
                  <span className="text-xs font-semibold text-muted-foreground block truncate">
                    {b.range}
                  </span>
                  <div className="text-2xl font-extrabold text-foreground mt-1">
                    {b.count} <span className="text-xs font-normal text-muted-foreground">RFQs</span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground mb-1">
                    <span>Share</span>
                    <span>{b.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(b.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
