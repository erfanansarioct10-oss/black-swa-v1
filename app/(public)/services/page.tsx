import Link from "next/link";
import { Wrench, Cpu, RefreshCw, Layers, ArrowRight } from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Expert Services
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Industrial Engineering & Maintenance Services
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          From custom alloy machining to emergency field repairs, our specialized engineering services ensure operational continuity and safety compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            icon: Wrench,
            title: "Pump & Mechanical Seal Overhaul",
            desc: "Complete teardown, inspection, dynamic balancing, and re-sealing of industrial pumps and rotating equipment.",
          },
          {
            icon: Cpu,
            title: "Reverse Engineering & Custom Machining",
            desc: "3D laser scanning and CAD modeling of obsolete components to fabricate drop-in alloy replacements.",
          },
          {
            icon: RefreshCw,
            title: "Emergency On-Site Field Service",
            desc: "24/7 rapid response engineering teams for critical plant shutdowns and unexpected equipment failures.",
          },
          {
            icon: Layers,
            title: "Surface Coating & Corrosion Protection",
            desc: "Advanced ceramic, tungsten carbide, and polymer coatings engineered for severe abrasive and acidic exposure.",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-card border border-border rounded-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center text-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  <span>Inquire About Service</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
