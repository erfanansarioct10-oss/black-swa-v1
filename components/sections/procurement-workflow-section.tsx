"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2, Workflow } from "lucide-react";
import {
  PROCUREMENT_STEPS,
  getProcurementStepIcon,
  type ProcurementStepItem,
} from "@/constants/procurement-workflow";

interface ProcurementWorkflowSectionProps {
  steps?: ProcurementStepItem[];
  badgeText?: string;
  title?: string;
  subtitle?: string;
}

export function ProcurementWorkflowSection({
  steps = PROCUREMENT_STEPS,
  badgeText = "Enterprise Procurement Process",
  title = "How We Deliver Mission-Critical Infrastructure",
  subtitle = "From initial technical consultation to white-glove site integration—engineered for zero downtime and full regulatory compliance.",
}: ProcurementWorkflowSectionProps) {
  return (
    <section className="relative w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 border-b border-slate-200/80 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Ambient Lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Workflow className="h-4 w-4 text-blue-500" />
            <span>{badgeText}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx uppercase">
            {title}
          </h2>

          <p className="text-brand-granite text-sm sm:text-base lg:text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 4-Step Process: Circular Step Images, Arrows Between, Text Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative z-10">
          {steps.map((item, index) => {
            const IconComponent = getProcurementStepIcon(item.iconName);
            const isLastStep = index === steps.length - 1;

            return (
              <div
                key={item.id}
                className="relative group flex flex-col items-center text-center space-y-5"
              >
                {/* Large Circular Image Container (Image + Floating Badge) */}
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 shrink-0">
                  {/* Inner Overflow-Hidden Image Frame */}
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-200/90 shadow-xl bg-slate-100 group-hover:border-blue-500 group-hover:scale-105 transition-all duration-300 relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Icon Overlay Badge (Floating Unclipped on Bottom-Right) */}
                  <div className="absolute bottom-0 right-0 sm:bottom-0.5 sm:right-0.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-blue-600 shadow-md z-20 group-hover:border-blue-500 transition-colors">
                    <IconComponent className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-blue-600" />
                  </div>
                </div>

                {/* Arrow Pointing to Next Step (Desktop: Positioned between circles at image height) */}
                {!isLastStep && (
                  <div className="hidden lg:flex absolute top-14 -right-5 lg:-right-6 -translate-y-1/2 items-center justify-center z-20 pointer-events-none">
                    <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors stroke-[2.5]" />
                  </div>
                )}

                {/* Text Content BELOW the Circle */}
                <div className="space-y-3 max-w-xs">
                  {/* Step Number Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200/90 text-[11px] font-bold uppercase tracking-wider text-brand-granite">
                    <span>Step {item.stepNumber}</span>
                  </div>

                  {/* Step Title */}
                  <h3 className="text-base sm:text-lg font-bold text-brand-onyx leading-snug">
                    {item.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-xs sm:text-sm text-brand-granite leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Deliverable Badge */}
                  <div className="pt-2 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{item.deliverable}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
