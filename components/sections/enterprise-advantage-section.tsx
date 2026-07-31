"use client";

import Image from "next/image";
import {
  ShieldCheck,
  CheckCircle2,
  Check,
} from "lucide-react";
import {
  ENTERPRISE_ADVANTAGES,
  getAdvantageIcon,
  type AdvantageItem,
} from "@/constants/advantages";

interface EnterpriseAdvantageSectionProps {
  advantages?: AdvantageItem[];
  title?: string;
  subtitle?: string;
}

export function EnterpriseAdvantageSection({
  advantages = ENTERPRISE_ADVANTAGES,
  title = "Why Leading Enterprises Choose Black Swan",
  subtitle = "Direct Tier-1 component traceability, guaranteed 4-hour SLA field response, factory-certified compliance, and insured white-glove global transport.",
}: EnterpriseAdvantageSectionProps) {
  return (
    <section className="relative w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 border-b border-slate-200/80 py-16 sm:py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-blue-500" />
            <span>Enterprise Quality & Uptime Guarantees</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx uppercase">
            {title}
          </h2>

          <p className="text-brand-granite text-sm sm:text-base lg:text-lg leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 4-Column Advantage Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {advantages.map((item) => {
            const IconComponent = getAdvantageIcon(item.iconName);

            return (
              <div
                key={item.id}
                className="group relative bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual Card Header Image */}
                <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-200/80">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {/* Overlaid Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/95 text-slate-800 border border-slate-200 shadow-xs backdrop-blur-xs">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                  <div className="space-y-3.5">
                    {/* Top Bar: Metric Badge & Icon */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <IconComponent className="h-4.5 w-4.5 text-blue-600" />
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 shadow-xs">
                        <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                        <span>{item.metric}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Key Guarantee Points */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5">
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {item.points.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
