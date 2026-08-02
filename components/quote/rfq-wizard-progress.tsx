"use client";

import { Check, ShoppingCart, UserCheck, ShieldCheck } from "lucide-react";

export interface RFQWizardProgressProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const STEPS = [
  {
    step: 1,
    name: "Equipment & Cart",
    shortName: "Equipment",
    icon: ShoppingCart,
  },
  {
    step: 2,
    name: "Project & Contact Details",
    shortName: "Project Details",
    icon: UserCheck,
  },
  {
    step: 3,
    name: "Verification & Submit",
    shortName: "Review & Submit",
    icon: ShieldCheck,
  },
];

export function RFQWizardProgress({ currentStep, onStepClick }: RFQWizardProgressProps) {
  const activeStepObj = STEPS.find((s) => s.step === currentStep) || STEPS[0];

  return (
    <div className="w-full space-y-4">
      {/* Mobile Step Header (visible below md breakpoint) */}
      <div className="flex items-center justify-between md:hidden bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            {currentStep}
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              Step {currentStep} of 3
            </p>
            <h3 className="text-sm font-bold text-foreground leading-none mt-0.5">
              {activeStepObj.name}
            </h3>
          </div>
        </div>
        <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop / Tablet Step Bar (md and above) */}
      <nav aria-label="Quotation Wizard Progress" className="hidden md:block">
        <ol className="grid grid-cols-3 gap-4">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.step;
            const isCurrent = currentStep === step.step;
            const Icon = step.icon;

            return (
              <li key={step.step} className="relative">
                <button
                  type="button"
                  disabled={!isCompleted && !isCurrent}
                  onClick={() => isCompleted && onStepClick?.(step.step)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                    isCurrent
                      ? "bg-card border-primary shadow-sm text-foreground ring-1 ring-primary/20"
                      : isCompleted
                      ? "bg-card border-border hover:border-primary/50 text-foreground cursor-pointer"
                      : "bg-muted/40 border-border/60 text-muted-foreground opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isCurrent
                        ? "bg-primary text-primary-foreground font-bold shadow-sm"
                        : isCompleted
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-emerald-500 stroke-[2.5]" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-[10px] font-bold tracking-wider uppercase ${
                        isCurrent
                          ? "text-primary font-extrabold"
                          : isCompleted
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      Step {step.step}
                    </p>
                    <p className="text-xs font-bold truncate leading-snug">
                      {step.name}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
