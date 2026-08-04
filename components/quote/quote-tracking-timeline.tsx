"use client";

import React from "react";
import { CheckCircle2, Clock, UserCheck, FileCheck, Flag, XCircle } from "lucide-react";
import type { QuoteStatus } from "@/types/quote";

interface QuoteTrackingTimelineProps {
  status: QuoteStatus;
}

interface StepConfig {
  key: QuoteStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  {
    key: "pending",
    label: "RFQ Submitted",
    description: "Request received & logged in system",
    icon: Clock,
  },
  {
    key: "under_review",
    label: "Under Technical Review",
    description: "Engineering team auditing hardware specs",
    icon: CheckCircle2,
  },
  {
    key: "manager_assigned",
    label: "Manager Assigned",
    description: "Dedicated Managing Director assigned",
    icon: UserCheck,
  },
  {
    key: "quoted",
    label: "Quotation Issued",
    description: "Official pricing proposal generated",
    icon: FileCheck,
  },
  {
    key: "completed",
    label: "Order Finalized",
    description: "Procurement finalized",
    icon: Flag,
  },
];

const STATUS_ORDER: Record<QuoteStatus, number> = {
  pending: 1,
  under_review: 2,
  manager_assigned: 3,
  quoted: 4,
  completed: 5,
  rejected: -1,
};

export function QuoteTrackingTimeline({ status }: QuoteTrackingTimelineProps) {
  if (status === "rejected") {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/20 text-destructive mb-1">
          <XCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-destructive">Quotation Request Declined / Archived</h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          This quotation request could not be fulfilled at this time or has been archived. Please contact our engineering support desk at <strong className="text-foreground">support@blackswan.com.np</strong> or reach out directly via phone.
        </p>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER[status] || 1;

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Live Fulfillment Timeline</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time status updates from our medical & broadcast engineering desk.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 self-start sm:self-auto">
          Status: {status.replace("_", " ")}
        </div>
      </div>

      {/* Stepper Grid for Desktop & Mobile */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = stepNumber <= currentStepIndex;
            const isCurrent = stepNumber === currentStepIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className="flex md:flex-col items-start md:items-center text-left md:text-center gap-4 md:gap-3 group"
              >
                {/* Step Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shrink-0 ${
                    isCompleted
                      ? isCurrent
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-600/20 shadow-md"
                        : "bg-emerald-600 text-white shadow-sm"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>


                {/* Step Content */}
                <div className="space-y-1">
                  <h4
                    className={`text-sm font-semibold leading-tight ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-snug">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
