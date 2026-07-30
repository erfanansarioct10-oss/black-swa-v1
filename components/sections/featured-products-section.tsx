"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Check,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { useQuoteCart } from "@/components/providers/quote-cart-provider";
import { SAMPLE_PRODUCTS, type SampleProduct } from "@/constants/products";

export function FeaturedProductsSection() {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addItem } = useQuoteCart();

  const handleAddToQuote = (prod: SampleProduct) => {
    addItem({
      id: prod.id,
      name: prod.name,
      sku: prod.sku,
      category: prod.categoryDisplay,
    });

    setAddedIds((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [prod.id]: false }));
    }, 1500);
  };

  const spotlightProduct =
    SAMPLE_PRODUCTS.find((p) => p.isSpotlight) || SAMPLE_PRODUCTS[0];
  const companionProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.id !== spotlightProduct.id
  );

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-background border-b border-border w-full overflow-hidden">
      {/* Subtle Background Ambient Gray Lighting (Hero-style) */}
      <div className="absolute inset-0 bg-radial from-slate-200/50 via-background to-background pointer-events-none dark:from-slate-800/30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] bg-slate-400/10 dark:bg-slate-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-charcoal text-slate-300 border border-brand-marble text-xs font-semibold uppercase tracking-wider shadow-xs">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Featured Enterprise Hardware</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase">
            Flagship Hardware & Systems
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            High-performance medical technology processors, telehealth hardware gateways, and broadcast video workstations engineered for mission-critical uptime.
          </p>
        </div>

        {/* Spotlight + Card Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Hero Spotlight Card (6 cols on desktop) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="group relative bg-brand-charcoal text-white rounded-2xl border border-brand-marble/80 shadow-md flex flex-col justify-between h-full overflow-hidden hover:border-slate-400/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* Product Visual Showcase Header */}
              <div className="relative w-full aspect-[16/10] bg-brand-onyx overflow-hidden border-b border-brand-marble/60">
                <Image
                  src={spotlightProduct.image}
                  alt={spotlightProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-95"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-onyx/90 text-slate-300 border border-brand-marble/60 backdrop-blur-xs">
                    <Award className="h-3.5 w-3.5 text-blue-400" />
                    {spotlightProduct.badge || "Flagship System"}
                  </span>
                  <span className="text-xs font-mono text-slate-300 bg-brand-onyx/90 px-2.5 py-1 rounded border border-brand-marble/60 backdrop-blur-xs">
                    SKU: {spotlightProduct.sku}
                  </span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
                <div className="space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {spotlightProduct.categoryDisplay}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                    {spotlightProduct.name}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {spotlightProduct.desc}
                  </p>

                  {/* Technical Specifications List with Gray Icons */}
                  <div className="pt-3 border-t border-brand-marble/50 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Key Technical Specifications:
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                      {spotlightProduct.specs.map((spec, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Standards Compliance Pills */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                      Standards:
                    </span>
                    {spotlightProduct.compliance.map((cert, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-onyx text-slate-300 border border-brand-marble/60 text-[11px] font-semibold"
                      >
                        <ShieldCheck className="h-3 w-3 text-slate-400" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer - In Stock in Green */}
                <div className="pt-5 border-t border-brand-marble/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {spotlightProduct.stockStatus}
                  </span>

                  <button
                    onClick={() => handleAddToQuote(spotlightProduct)}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm cursor-pointer transition-all shadow-sm ${
                      addedIds[spotlightProduct.id]
                        ? "bg-slate-300 text-brand-onyx"
                        : "bg-white text-brand-onyx hover:bg-slate-100"
                    }`}
                  >
                    {addedIds[spotlightProduct.id] ? (
                      <>
                        <Check className="h-4 w-4 text-slate-600" />
                        <span>Added to Quote</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 text-slate-600" />
                        <span>Add to Quote Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 5 Companion Cards evenly spaced (6 cols on desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            {companionProducts.map((prod) => {
              const isAdded = !!addedIds[prod.id];
              return (
                <div
                  key={prod.id}
                  className="group bg-brand-charcoal text-white rounded-xl border border-brand-marble/80 shadow-sm flex flex-col sm:flex-row overflow-hidden hover:border-slate-400/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Companion Product Image Showcase */}
                  <div className="relative w-full sm:w-2/5 aspect-[16/10] sm:aspect-auto bg-brand-onyx shrink-0 border-b sm:border-b-0 sm:border-r border-brand-marble/60">
                    <Image
                      src={prod.image}
                      alt={prod.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 20vw"
                      className="object-cover opacity-95"
                    />

                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-onyx/90 text-slate-300 border border-brand-marble/60 backdrop-blur-xs">
                      {prod.categoryDisplay}
                    </span>
                  </div>

                  {/* Companion Product Body */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-2.5">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          SKU: {prod.sku}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-1">
                        {prod.name}
                      </h3>

                      <ul className="space-y-1 text-xs text-slate-300">
                        {prod.specs.slice(0, 1).map((spec, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer - In Stock in Green */}
                    <div className="pt-2 border-t border-brand-marble/50 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        {prod.stockStatus}
                      </span>

                      <button
                        onClick={() => handleAddToQuote(prod)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs ${
                          isAdded
                            ? "bg-slate-300 text-brand-onyx"
                            : "bg-white text-brand-onyx hover:bg-slate-100"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-slate-600" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-3.5 w-3.5 text-slate-600" />
                            <span>Add to Quote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Bottom CTA Bar */}
        <div className="pt-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-charcoal text-white border border-brand-marble font-bold text-sm sm:text-base rounded-lg cursor-pointer transition-all shadow-sm"
          >
            <span>Explore Full Hardware Catalog</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
