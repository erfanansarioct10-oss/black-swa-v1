import Link from "next/link";
import { Building2, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export function AboutHero() {
  return (
    <section className="relative w-full bg-brand-onyx text-white overflow-hidden py-12 sm:py-16 lg:py-20 border-b border-brand-marble/40">
      {/* Neutral metallic ambient radial background */}
      <div className="absolute inset-0 bg-radial from-brand-charcoal/80 via-brand-onyx to-brand-onyx pointer-events-none" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-gradient-to-tr from-brand-marble/30 via-slate-500/15 to-brand-charcoal/40 rounded-full blur-3xl opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <Breadcrumbs items={[{ label: "About Us", href: "/about" }]} variant="dark" />

        <div className="max-w-4xl space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Building2 className="h-4 w-4 text-blue-400" />
            <span>Full-Service Broadcast Integrator &amp; IT Solutions</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight uppercase">
            Pioneering Broadcast Systems, DVB Head-Ends &amp; Custom IT Infrastructure
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed">
            Black Swan International and Simulcast Technologies Pvt. Ltd provide comprehensive broadcasting integration, digital video broadcasting (DVB-C, DVB-S2, IPTV), OTT platforms, custom software development, and 24/7 Annual Maintenance Contracts (AMC).
          </p>

          {/* Key Quick Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-1.5 bg-brand-charcoal text-slate-300 px-3 py-1.5 rounded-lg border border-brand-marble/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Established 2019 under Company Act 2063 BS</span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-charcoal text-slate-300 px-3 py-1.5 rounded-lg border border-brand-marble/60">
              <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0" />
              <span>15+ Years Enterprise Hardware Leadership</span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-charcoal text-slate-300 px-3 py-1.5 rounded-lg border border-brand-marble/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>DVB-C / DVB-S2 / IPTV / OTT / AMC</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-brand-onyx font-bold text-sm sm:text-base rounded-lg shadow-md hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 group cursor-pointer"
            >
              <span>Consult Our Engineering Team</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-brand-onyx group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#capabilities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-charcoal text-white border border-brand-marble font-semibold text-sm sm:text-base rounded-lg hover:bg-brand-marble/50 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 group cursor-pointer"
            >
              <span>Explore Services &amp; Capabilities</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
