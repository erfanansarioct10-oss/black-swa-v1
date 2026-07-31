"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Check,
  BookOpen,
  Filter,
} from "lucide-react";
import {
  CATEGORY_TABS,
  getServiceIcon,
  type ServiceItem,
  type ServiceCategory,
} from "@/constants/services";

interface ServicesClientGridProps {
  services: ServiceItem[];
}

export function ServicesClientGrid({ services }: ServicesClientGridProps) {
  const [activeTab, setActiveTab] = useState<"all" | ServiceCategory>("all");

  const filteredServices =
    activeTab === "all"
      ? services
      : services.filter((s) => s.category === activeTab);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Responsive Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-r border-slate-200 mr-1 shrink-0">
          <Filter className="h-3.5 w-3.5 text-blue-600" />
          <span>Category</span>
        </div>

        {CATEGORY_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count =
            tab.id === "all"
              ? services.length
              : services.filter((s) => s.category === tab.id).length;

          return (
            <button
              key={tab.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Responsive Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredServices.map((service) => {
          const IconComponent = getServiceIcon(service.iconName);

          return (
            <article
              key={service.id}
              className="group relative bg-white text-slate-900 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Visual Header Image */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden border-b border-slate-200/80">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/95 text-slate-800 border border-slate-200 shadow-xs backdrop-blur-xs">
                    {service.categoryLabel}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50/95 border border-emerald-200 shadow-xs backdrop-blur-xs">
                    <Check className="h-3 w-3 text-emerald-600 stroke-[3]" />
                    <span>{service.slaBadge}</span>
                  </span>
                </div>
              </div>

              {/* Card Content Body */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-3.5">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs mt-0.5">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>

                    <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug tracking-tight">
                      {service.title}
                    </h2>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {service.desc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Key Deliverables:
                    </h3>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {service.deliverables.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action Buttons: Read More & Inquire About Service */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 group/read"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                    <span>Read More</span>
                    <ArrowRight className="h-3 w-3 text-slate-400 group-hover/read:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors py-2 px-3.5 rounded-lg shadow-xs group/inquire"
                  >
                    <span>Inquire About Service</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
