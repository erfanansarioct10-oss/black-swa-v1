import Link from "next/link";
import { MessageSquare, FileText } from "lucide-react";

export function AboutCta() {
  return (
    <section className="w-full bg-slate-50/80 py-12 sm:py-16 lg:py-20 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-brand-charcoal text-white p-8 sm:p-12 lg:p-16 border border-brand-marble/80 shadow-2xl hover:border-slate-400/60 transition-all duration-300">
          {/* Neutral metallic ambient glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-tr from-brand-marble/30 via-slate-500/15 to-brand-charcoal/40 rounded-full blur-3xl opacity-60" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Partner With Engineering Leaders
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
                Ready to Upgrade Your Broadcast &amp; DVB Infrastructure?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Consult directly with our broadcast system integrators for DVB-C/S2 head-end designs, OTT platform setup, or 24/7 Annual Maintenance Contract (AMC) proposals.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-brand-onyx font-bold text-sm sm:text-base rounded-lg shadow-md hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 group cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-brand-onyx" />
                <span>Contact Integrator Team</span>
              </Link>
              <Link
                href="/quote"
                className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-onyx hover:bg-slate-800 text-slate-200 font-semibold text-sm sm:text-base rounded-lg border border-brand-marble/60 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 group cursor-pointer"
              >
                <FileText className="h-4 w-4 text-slate-300" />
                <span>Build Hardware Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
