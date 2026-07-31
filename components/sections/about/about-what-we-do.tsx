"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Layers } from "lucide-react";
import { ABOUT_PILLARS, AboutPillar } from "@/constants/about";
import { cn } from "@/lib/utils";

export function AboutWhatWeDo() {
  const [activeTabId, setActiveTabId] = useState<string>(ABOUT_PILLARS[0].id);

  const activePillar: AboutPillar =
    ABOUT_PILLARS.find((p) => p.id === activeTabId) || ABOUT_PILLARS[0];

  return (
    <section id="capabilities" className="relative w-full bg-brand-onyx text-white border-b border-brand-marble/40 py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* Neutral metallic ambient radial background matching homepage */}
      <div className="absolute inset-0 bg-radial from-brand-charcoal/80 via-brand-onyx to-brand-onyx pointer-events-none" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-tr from-brand-marble/30 via-slate-500/15 to-brand-charcoal/40 rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble text-xs font-semibold uppercase tracking-wider">
            <Layers className="h-4 w-4 text-blue-400" />
            <span>Core Capabilities &amp; Services</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase">
            What We Do
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            From carrier-grade DVB head-end hardware to custom cloud OTT software and round-the-clock AMC maintenance, we offer full-service broadcast engineering.
          </p>
        </div>

        {/* Desktop Interactive Tabs Header */}
        <div className="hidden lg:flex items-center justify-center gap-2 p-1.5 rounded-xl bg-brand-charcoal border border-brand-marble/80" role="tablist">
          {ABOUT_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            const isActive = pillar.id === activeTabId;
            return (
              <button
                key={pillar.id}
                id={`tab-${pillar.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${pillar.id}`}
                onClick={() => setActiveTabId(pillar.id)}
                className={cn(
                  "flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none",
                  isActive
                    ? "bg-brand-onyx text-white border border-brand-marble/80 shadow-md hover:-translate-y-0.5"
                    : "text-slate-400 hover:text-slate-200 hover:bg-brand-onyx/60 hover:-translate-y-0.5"
                )}
              >
                <IconComponent className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-slate-400")} />
                <span>{pillar.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Tab Active Detail Card (Desktop View) */}
        <div
          role="tabpanel"
          id={`tabpanel-${activePillar.id}`}
          aria-labelledby={`tab-${activePillar.id}`}
          className="hidden lg:block bg-brand-charcoal text-white rounded-2xl border border-brand-marble/80 p-8 shadow-2xl hover:border-slate-400/60 transition-all duration-300"
        >
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Detail Content */}
            <div className="col-span-7 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-brand-onyx text-slate-300 border border-brand-marble/60 text-xs font-semibold uppercase tracking-wider">
                {activePillar.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {activePillar.title}
              </h3>

              <p className="text-slate-300 text-base leading-relaxed">
                {activePillar.fullDesc}
              </p>

              {/* Bullet Features */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Deliverables &amp; Specifications:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activePillar.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href={`/contact?service=${encodeURIComponent(activePillar.title)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-onyx hover:bg-slate-800 text-white border border-brand-marble/60 font-bold text-sm rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer group/btn"
                >
                  <span>Inquire About {activePillar.title}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Detail Image */}
            <div className="col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-brand-marble/60 bg-brand-onyx">
              <Image
                src={activePillar.image}
                alt={activePillar.title}
                fill
                sizes="35vw"
                className="object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-onyx/80 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Accordion-Style Card Grid (Visible on small & medium screens) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-6">
          {ABOUT_PILLARS.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group bg-brand-charcoal text-white border border-brand-marble/80 rounded-xl p-6 flex flex-col justify-between space-y-6 shadow-lg hover:border-slate-400/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-brand-onyx border border-brand-marble/60 flex items-center justify-center text-slate-300 shrink-0 shadow-2xs">
                      <IconComponent className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="text-2xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-onyx border border-brand-marble/60 text-slate-300">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white uppercase">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pillar.shortDesc}</p>

                  <div className="space-y-2 pt-2 border-t border-brand-marble/50">
                    {pillar.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/contact?service=${encodeURIComponent(pillar.title)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-onyx border border-brand-marble/60 text-white text-xs font-bold rounded-lg transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer group/mbtn"
                >
                  <span>Request Technical Specs</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover/mbtn:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
