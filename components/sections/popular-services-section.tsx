"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  ArrowRight,
  CheckCircle2,
  Check,
  BookOpen,
} from "lucide-react";
import {
  POPULAR_SERVICES,
  getServiceIcon,
  type ServiceItem,
} from "@/constants/services";

interface PopularServicesSectionProps {
  services?: ServiceItem[];
  title?: string;
  subtitle?: string;
}

export function PopularServicesSection({
  services = POPULAR_SERVICES,
  title = "Popular Engineering & Integration Services",
  subtitle = "Turnkey hardware assembly, DICOM compliance calibration, 12G-SDI video routing, and 24/7 SLA infrastructure support engineered for critical operational uptime.",
}: PopularServicesSectionProps) {
  return (
    <section className="relative w-full bg-brand-onyx text-white border-b border-brand-marble/40 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Background Ambient Lighting & Glow */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-brand-charcoal/70 via-brand-onyx to-brand-onyx" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-slate-400/15 to-indigo-600/20 rounded-full blur-3xl opacity-70" />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12 sm:space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble text-xs font-semibold uppercase tracking-wider">
            <Wrench className="h-4 w-4 text-blue-400" />
            <span>Technical Integration & Services</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase">
            {title}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 2x2 Grid of Feature Service Cards with Visual Header Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service) => {
            const IconComponent = getServiceIcon(service.iconName);

            return (
              <div
                key={service.id}
                className="group relative bg-brand-charcoal text-white rounded-2xl border border-brand-marble/80 shadow-md flex flex-col justify-between overflow-hidden hover:border-slate-400/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Visual Service Header Image */}
                <div className="relative w-full aspect-[16/10] bg-brand-onyx overflow-hidden border-b border-brand-marble/60">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-95"
                  />

                  {/* Overlaid Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-onyx/90 text-slate-300 border border-brand-marble/60 backdrop-blur-xs">
                      {service.categoryLabel}
                    </span>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-brand-onyx/90 border border-emerald-500/30 backdrop-blur-xs">
                      <Check className="h-3.5 w-3.5 text-emerald-400 stroke-[3]" />
                      <span>{service.slaBadge}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body Content */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
                  <div className="space-y-4">
                    {/* Icon Seal & Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-onyx border border-brand-marble/60 flex items-center justify-center text-slate-300 shrink-0 shadow-2xs">
                        <IconComponent className="h-5 w-5 text-blue-400" />
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                        {service.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {service.desc}
                    </p>

                    {/* Deliverables Bullet List */}
                    <div className="pt-3 border-t border-brand-marble/50 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Key Service Deliverables:
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                        {service.deliverables.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer Action Buttons: Read More & Inquire About Service */}
                  <div className="pt-4 border-t border-brand-marble/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-lg bg-brand-onyx hover:bg-slate-800 border border-brand-marble/60 group/read cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                      <span>Read More</span>
                      <ArrowRight className="h-3 w-3 text-slate-400 group-hover/read:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href={`/contact?service=${service.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white hover:text-slate-100 transition-all duration-200 py-2 px-3.5 rounded-lg bg-black hover:bg-slate-900 border border-slate-700/80 shadow-sm cursor-pointer group/inquire"
                    >
                      <span>Inquire About Service</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Bottom CTA Bar */}
        <div className="pt-4 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-charcoal text-white border border-brand-marble font-bold text-sm sm:text-base rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 shadow-sm cursor-pointer group"
          >
            <span>Explore Full Technical Services</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
