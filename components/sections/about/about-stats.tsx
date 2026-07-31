import { ABOUT_STATS } from "@/constants/about";

export function AboutStats() {
  return (
    <section className="w-full bg-brand-onyx border-b border-brand-marble/40 py-10 sm:py-14 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ABOUT_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-brand-charcoal border border-brand-marble/80 rounded-xl p-6 flex flex-col justify-between hover:border-slate-400/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-md cursor-default"
            >
              <div>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  {stat.value}
                </span>
                <h3 className="text-base font-bold text-slate-200 mt-2">
                  {stat.label}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-brand-marble/50">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
