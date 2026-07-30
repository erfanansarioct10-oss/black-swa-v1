import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { BRAND_LOGOS_ROW_1, BRAND_LOGOS_ROW_2, type BrandLogo } from "@/constants/brands";

function BrandItem({ brand, priority = false }: { brand: BrandLogo; priority?: boolean }) {
  return (
    <div className="group flex items-center justify-center shrink-0 px-6 py-3.5 sm:px-8 sm:py-4.5 bg-white hover:bg-slate-100 rounded-xl border border-brand-marble/60 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 select-none">
      <Image
        src={brand.imageSrc}
        alt={brand.name}
        width={360}
        height={140}
        priority={priority}
        className="h-14 sm:h-18 lg:h-20 w-auto max-w-[180px] sm:max-w-[220px] lg:max-w-[250px] object-contain opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
      />
    </div>
  );
}

const repeatArray = <T,>(arr: T[], times = 4): T[] =>
  Array.from({ length: times }, () => arr).flat();

export function BrandMarquee() {
  // Quadruple arrays to guarantee continuous infinite marquee tracks on wide screens
  const row1 = repeatArray(BRAND_LOGOS_ROW_1);
  const row2 = repeatArray(BRAND_LOGOS_ROW_2);
  const allBrands = [...BRAND_LOGOS_ROW_1, ...BRAND_LOGOS_ROW_2];

  return (
    <section className="relative w-full bg-brand-onyx text-white border-y border-brand-marble/40 py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* Accessible Non-Duplicated Screen Reader Brand List */}
      <div className="sr-only">
        <h3>Featured Brand Partners</h3>
        <ul>
          {allBrands.map((brand) => (
            <li key={`sr-${brand.id}`}>{brand.name}</li>
          ))}
        </ul>
      </div>

      {/* Subtle Background Ambient Charcoal & Blue Radial Lighting */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-brand-charcoal/60 via-brand-onyx to-brand-onyx" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-600/10 rounded-full blur-3xl" />


      {/* Header Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 mb-12 sm:mb-16 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble/60 text-xs font-bold uppercase tracking-wider shadow-2xs">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <span>Industry Proven Reliability</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white uppercase">
          Trusted Brand Partners
        </h2>
        
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Powering mission-critical medical technology, healthcare facilities, and broadcast computing infrastructure worldwide.
        </p>
      </div>

      {/* Dual-Row Marquee Tracks (Decorative Visual Display) */}
      <div className="relative z-10 space-y-6 sm:space-y-8 lg:space-y-10" aria-hidden="true">
        {/* Row 1 (Right-to-Left, Slow Motion) */}
        <div className="flex w-max animate-marquee items-center gap-6 sm:gap-8 lg:gap-10">
          {row1.map((logo, idx) => (
            <BrandItem
              key={`r1-${logo.id}-${idx}`}
              brand={logo}
              priority={idx < 3}
            />
          ))}
        </div>

        {/* Row 2 (Left-to-Right Reverse, Slow Motion) */}
        <div className="flex w-max animate-marquee-reverse items-center gap-6 sm:gap-8 lg:gap-10">
          {row2.map((logo, idx) => (
            <BrandItem
              key={`r2-${logo.id}-${idx}`}
              brand={logo}
              priority={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
