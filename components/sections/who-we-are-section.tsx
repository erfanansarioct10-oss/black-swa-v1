import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Award } from "lucide-react";

export function WhoWeAreSection() {
  return (
    <section className="relative w-full bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 border-b border-slate-200/80 py-14 sm:py-20 lg:py-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-14 lg:gap-y-6 items-center">
          {/* 1. Header (Badge & Heading): Renders at top on mobile, top-right on desktop */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1 text-center sm:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200/90 text-brand-granite text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Building2 className="h-4 w-4 text-blue-500" />
              <span>Who We Are</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-brand-onyx leading-tight uppercase">
              Pioneering Medical &amp; Broadcast Hardware Solutions for Over 15 Years
            </h2>
          </div>

          {/* 2. CEO Portrait Executive Card: Below heading on mobile, left column on desktop */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-span-2 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Outer Card Wrapper */}
              <div className="relative rounded-2xl bg-white p-3 border border-slate-200/90 shadow-xl overflow-hidden">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="/about/ceo.webp"
                    alt="Black Swan International Executive Leadership"
                    fill
                    sizes="(min-width: 1024px) 35vw, (min-width: 640px) 60vw, 90vw"
                    className="object-cover object-top"
                  />
                  {/* Subtle vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Executive Badge Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-brand-onyx/90 backdrop-blur-md text-white p-4 rounded-xl border border-brand-marble/50 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0 items-center justify-center h-10 w-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Executive Board</p>
                      <p className="text-sm font-bold text-white">15+ Years Leadership & Vision</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Description, Highlights & CTA: Below image on mobile, bottom-right on desktop */}
          <div className="lg:col-span-7 lg:col-start-6 lg:row-start-2 space-y-6 sm:space-y-7 text-center sm:text-left">
            <p className="text-sm sm:text-base lg:text-lg text-brand-granite leading-relaxed">
              Founded with a commitment to uncompromised reliability, Black Swan International has built a 15+ year legacy as a trusted technology partner. We specialize in engineering and deploying high-performance medical imaging processors, telehealth hardware gateways, broadcast media servers, and studio IT computing infrastructure across demanding enterprise environments worldwide.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-brand-onyx">ISO 13485 & IEC 60601-1</h3>
                  <p className="text-xs text-brand-granite">Strict compliance for healthcare hardware</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-brand-onyx">Mission-Critical Reliability</h3>
                  <p className="text-xs text-brand-granite">99.9% uptime architecture & dual redundancy</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-brand-onyx">SMPTE ST 2110 Ready</h3>
                  <p className="text-xs text-brand-granite">Ultra-low latency IP broadcast workflows</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-brand-onyx">24/7 Enterprise SLA Support</h3>
                  <p className="text-xs text-brand-granite">Dedicated technical engineering assistance</p>
                </div>
              </div>
            </div>

            {/* Read More CTA */}
            <div className="pt-3 flex justify-center sm:justify-start">
              <Link
                href="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-onyx text-white font-bold text-sm sm:text-base rounded-lg shadow-md hover:bg-slate-800 hover:text-white hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 transition-all duration-200 group cursor-pointer"
              >
                <span>Read Our Full Story</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
