"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PresetRange = "7d" | "30d" | "ytd" | "all";

interface FilterOption {
  id: PresetRange;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
  { id: "ytd", label: "Year to Date" },
  { id: "all", label: "All Time" },
];

export function AnalyticsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = (searchParams.get("range") as PresetRange) || "30d";

  const handleRangeChange = (range: PresetRange) => {
    const params = new URLSearchParams(searchParams.toString());
    if (range === "30d") {
      params.delete("range");
    } else {
      params.set("range", range);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border rounded-xl p-4 shadow-xs">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Filter className="h-4 w-4 text-primary shrink-0" />
        <span>Time Horizon Filter:</span>
        <span className="font-semibold text-primary capitalize">
          {FILTER_OPTIONS.find((f) => f.id === currentRange)?.label || "30 Days"}
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>Preset Range:</span>
        </div>
        <div className="inline-flex items-center p-1 bg-muted/50 border border-border/60 rounded-lg gap-1 w-full sm:w-auto">
          {FILTER_OPTIONS.map((option) => {
            const isActive = currentRange === option.id;
            return (
              <Button
                key={option.id}
                type="button"
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => handleRangeChange(option.id)}
                className={`h-8 px-3 text-xs font-medium rounded-md transition-all flex-1 sm:flex-initial ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/60"
                }`}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
