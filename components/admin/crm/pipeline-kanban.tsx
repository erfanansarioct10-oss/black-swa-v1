"use client";

import { PipelineData, PipelineLeadItem, updateLeadStageAction } from "@/actions/pipeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeadStage } from "@/schemas/pipeline";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

interface PipelineKanbanProps {
  initialData: PipelineData;
}

export function PipelineKanban({ initialData }: PipelineKanbanProps) {
  const [data, setData] = useState<PipelineData>(initialData);
  const [, startTransition] = useTransition();
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const handleStageShift = (leadId: string, newStage: LeadStage) => {
    setUpdatingLeadId(leadId);
    startTransition(async () => {
      const res = await updateLeadStageAction({ leadId, newStage });
      if (res.success) {
        // Optimistically update client state
        setData((prev) => {
          let foundLead: PipelineLeadItem | null = null;
          for (const col of prev.columns) {
            const match = col.leads.find((l) => l.id === leadId);
            if (match) {
              foundLead = {
                ...match,
                status: newStage,
                isStale: false,
                updatedAt: new Date(),
              };
              break;
            }
          }

          if (!foundLead) return prev;
          const targetLead = foundLead;

          const updatedCols = prev.columns.map((col) => {
            const remainingLeads = col.leads.filter((l) => l.id !== leadId);
            const isTargetCol = col.id === newStage;
            const colLeads = isTargetCol ? [targetLead, ...remainingLeads] : remainingLeads;

            return {
              ...col,
              leads: colLeads,
              totalValue: colLeads.reduce((s, l) => s + l.estimatedValue, 0),
              count: colLeads.length,
            };
          });

          return {
            ...prev,
            columns: updatedCols,
          };
        });
      }
      setUpdatingLeadId(null);
    });
  };

  const STAGE_PROGRESSION: LeadStage[] = [
    "new",
    "contacted",
    "assessment",
    "proposal_sent",
    "negotiation",
    "closed_won",
    "closed_lost",
  ];

  const getNextStage = (currentStage: string): LeadStage | null => {
    const idx = STAGE_PROGRESSION.indexOf(currentStage as LeadStage);
    if (idx !== -1 && idx < STAGE_PROGRESSION.length - 2) {
      return STAGE_PROGRESSION[idx + 1];
    }
    return null;
  };

  const getPrevStage = (currentStage: string): LeadStage | null => {
    const idx = STAGE_PROGRESSION.indexOf(currentStage as LeadStage);
    if (idx > 0 && idx < STAGE_PROGRESSION.length - 1) {
      return STAGE_PROGRESSION[idx - 1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Interactive Sales Pipeline
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage stage progressions, track stale leads (&gt;48h), and monitor live pipeline valuation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs">
            Total Pipeline: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Rs. {data.totalPipelineValue.toLocaleString()}</span>
          </div>
          <div className="rounded-lg border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs">
            Leads: <span className="font-bold">{data.totalLeads}</span>
          </div>
          {data.staleCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold">
              <AlertTriangle className="h-3.5 w-3.5" />
              {data.staleCount} Stale Lead{data.staleCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Horizontal Scroll Kanban Container */}
      <div className="w-full overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-max">
          {data.columns.map((column) => (
            <div
              key={column.id}
              className="w-[310px] min-w-[310px] shrink-0 flex flex-col rounded-xl border border-border/80 bg-muted/30 p-3.5 shadow-2xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{column.title}</h3>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Rs. {column.totalValue.toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary" className="h-5 px-2 text-xs font-bold rounded-full">
                  {column.count}
                </Badge>
              </div>

              {/* Column Lead Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[72vh] pr-1">
                {column.leads.length === 0 ? (
                  <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border/80 bg-card/50 text-xs text-muted-foreground">
                    No leads in stage
                  </div>
                ) : (
                  column.leads.map((lead) => {
                    const nextStage = getNextStage(lead.status);
                    const prevStage = getPrevStage(lead.status);
                    const isUpdating = updatingLeadId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        className={`relative rounded-xl border bg-card p-3.5 transition-all shadow-xs hover:shadow-sm ${
                          lead.isStale
                            ? "border-amber-500/60 bg-amber-500/5 dark:bg-amber-500/10"
                            : "border-border/80 hover:border-primary/40"
                        }`}
                      >
                        {/* Title & SLA Badge Header */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="font-bold text-xs text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
                          >
                            {lead.title}
                          </Link>
                          {lead.isStale && (
                            <Badge
                              variant="destructive"
                              className="shrink-0 h-4 px-1.5 text-[9px] font-bold uppercase tracking-wider bg-amber-600 text-white hover:bg-amber-700"
                            >
                              SLA &gt;48h
                            </Badge>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="text-[11px] text-muted-foreground space-y-0.5 mb-3">
                          <p className="font-semibold text-foreground truncate">{lead.contactName}</p>
                          {lead.companyName && <p className="truncate text-muted-foreground">{lead.companyName}</p>}
                        </div>

                        {/* Financial Valuation & Date */}
                        <div className="flex items-center justify-between text-xs pt-1 mb-3 border-t border-border/40">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                            Rs. {lead.estimatedValue.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(lead.updatedAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Stage Progression Action Controls */}
                        <div className="flex items-center justify-between pt-2.5 border-t border-border/60 text-[11px]">
                          {/* Directional Shift Controls */}
                          <div className="flex items-center gap-1">
                            {prevStage ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 rounded-md border-border"
                                disabled={isUpdating}
                                onClick={() => handleStageShift(lead.id, prevStage)}
                                title={`Move back to ${prevStage}`}
                              >
                                <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
                              </Button>
                            ) : (
                              <div className="w-7" />
                            )}

                            {nextStage && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 w-7 p-0 rounded-md border-primary/30 text-primary hover:bg-primary/10"
                                disabled={isUpdating}
                                onClick={() => handleStageShift(lead.id, nextStage)}
                                title={`Advance to ${nextStage}`}
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>

                          {/* Quick Closure Actions */}
                          <div className="flex items-center gap-1">
                            {lead.status !== "closed_won" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10 rounded-md"
                                disabled={isUpdating}
                                onClick={() => handleStageShift(lead.id, "closed_won")}
                                title="Mark Won"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Won
                              </Button>
                            )}
                            {lead.status !== "closed_lost" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 rounded-md"
                                disabled={isUpdating}
                                onClick={() => handleStageShift(lead.id, "closed_lost")}
                                title="Mark Lost"
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Lost
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Loading Overlay */}
                        {isUpdating && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80 backdrop-blur-xs z-10">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
