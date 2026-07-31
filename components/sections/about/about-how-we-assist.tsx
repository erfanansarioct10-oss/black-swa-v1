import { WORKFLOW_STEPS } from "@/constants/about";
import { CheckCircle2, Workflow } from "lucide-react";

export function AboutHowWeAssist() {
  return (
    <section className="w-full bg-slate-50/80 py-14 sm:py-20 lg:py-24 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Workflow className="h-4 w-4 text-blue-500" />
            <span>Integrator Methodology</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx leading-tight uppercase">
            How We Assist Our Clients
          </h2>

          <p className="text-base sm:text-lg text-brand-granite leading-relaxed">
            Our structured 4-step engineering process guarantees seamless integration, rapid deployment, and zero operational downtime.
          </p>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WORKFLOW_STEPS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-xl border border-slate-200/90 p-6 flex flex-col justify-between space-y-6 shadow-2xs hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="space-y-4 text-left">
                  {/* Header: Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-brand-onyx font-mono">
                      {item.step}
                    </span>
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-slate-100 text-brand-onyx border border-slate-200">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-brand-onyx leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-brand-granite leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Deliverables List */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-left">
                  <p className="text-2xs font-bold text-brand-granite uppercase tracking-wider">Key Deliverables:</p>
                  {item.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-brand-granite">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
