import Link from "next/link";
import { ShieldCheck, Award, Target, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          About Black Swan International
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Pioneering Heavy Industrial Excellence
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          For over two decades, Black Swan International has provided robust engineering components, custom fabrication, and specialized equipment servicing to heavy processing industries worldwide.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: ShieldCheck,
            title: "Uncompromising Quality",
            desc: "Every component undergoes rigorous pressure testing and non-destructive examination (NDE) prior to field delivery.",
          },
          {
            icon: Target,
            title: "Precision Engineering",
            desc: "Custom mechanical seal profiles and alloy machining engineered to exact tolerances down to the micron.",
          },
          {
            icon: Award,
            title: "Global Supply Chain",
            desc: "Rapid delivery network ensuring zero downtime for critical manufacturing, power generation, and chemical facilities.",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-card border border-border rounded-xl space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* CTA Banner */}
      <div className="p-8 sm:p-12 bg-brand-onyx text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-2xl font-bold">Need Custom Engineering Guidance?</h2>
          <p className="text-sm text-slate-300">
            Consult directly with our technical team for custom part specifications.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-6 py-3 bg-white text-brand-onyx font-bold rounded-lg hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-2"
        >
          <span>Contact Engineers</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
