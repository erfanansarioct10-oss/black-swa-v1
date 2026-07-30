"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Star,
  MessageSquareQuote,
  CheckCircle2,
  Building2,
  MapPin,
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CUSTOMER_REVIEWS, CustomerReviewItem } from "@/constants/reviews";

type FilterTab = "all" | "medical" | "broadcast";

export function CustomerReviewsSection() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredReviews =
    activeTab === "all"
      ? CUSTOMER_REVIEWS
      : CUSTOMER_REVIEWS.filter((item) => item.category === activeTab);

  // Reset current index when switching tabs
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scrollToCard = (index: number) => {
    const targetIndex = Math.max(0, Math.min(index, filteredReviews.length - 1));
    setCurrentIndex(targetIndex);
    if (scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.children[targetIndex] as HTMLElement;
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  const handlePrev = () => {
    scrollToCard(currentIndex - 1);
  };

  const handleNext = () => {
    scrollToCard(currentIndex + 1);
  };

  return (
    <section className="w-full bg-white border-b border-border py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted text-muted-foreground border border-border text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <MessageSquareQuote className="h-4 w-4 text-blue-500" />
            <span>Verified Executive Testimonials</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground uppercase">
            Trusted by Medical &amp; Broadcast Leaders
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">
            Discover how Black Swan&apos;s pre-calibrated enterprise hardware and guaranteed 4-hour replacement SLA power mission-critical healthcare systems and broadcast networks worldwide.
          </p>

          {/* Industry Filter Tabs */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center p-1.5 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
              <button
                type="button"
                onClick={() => handleTabChange("all")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "all"
                    ? "bg-brand-charcoal text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-200/60"
                }`}
              >
                All Reviews ({CUSTOMER_REVIEWS.length})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("medical")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "medical"
                    ? "bg-brand-charcoal text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-200/60"
                }`}
              >
                Medical Technology
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("broadcast")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "broadcast"
                    ? "bg-brand-charcoal text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-200/60"
                }`}
              >
                Broadcast Systems
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative pt-3 pb-3 px-1 overflow-visible">
          {/* Reviews Card Display: Horizontal Carousel on mobile (< md), Grid on desktop (>= md) */}
          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-5 sm:gap-6 lg:gap-8 pb-4 md:pb-0 scrollbar-none scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {filteredReviews.map((review: CustomerReviewItem, index: number) => {
              // Highlight cards based on active index position
              const isActiveCard = index === currentIndex;

              return (
                <div
                  key={review.id}
                  onClick={() => scrollToCard(index)}
                  className={`flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-brand-charcoal text-white border transition-all duration-300 group relative overflow-hidden cursor-pointer w-[85vw] max-w-sm sm:w-[380px] md:w-auto shrink-0 snap-center md:snap-align-none ${
                    isActiveCard
                      ? "border-blue-500/80 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/30 scale-[1.01]"
                      : "border-brand-marble/80 shadow-md hover:border-slate-400/60 hover:shadow-xl hover:-translate-y-1"
                  }`}
                >
                  {/* Decorative Background Quote Symbol */}
                  <span className="absolute -top-2 right-4 text-7xl font-serif font-black text-brand-marble/20 select-none pointer-events-none group-hover:text-blue-500/20 transition-colors">
                    &ldquo;
                  </span>

                  <div className="relative z-10">
                    {/* Top Bar: Rating, Location & Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex items-center gap-1"
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {review.location}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-brand-onyx text-slate-300 border border-brand-marble/60">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>
                            {review.category === "medical"
                              ? "Healthcare IT"
                              : "Media & Broadcast"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Verified Deployment & Metric Pill Row */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                        <span className="relative flex h-2 w-2 mr-0.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{review.deploymentBadge}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-semibold">
                        <TrendingUp className="w-3 h-3 text-blue-400" />
                        {review.metric}
                      </span>
                    </div>

                    {/* Quote Content */}
                    <blockquote className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Author & Organization Info Footer */}
                  <div className="relative z-10 pt-4 border-t border-brand-marble/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-brand-marble shrink-0 shadow-xs group-hover:border-blue-400/80 transition-colors">
                        <Image
                          src={review.avatar}
                          alt={review.authorName}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                          {review.authorName}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {review.authorTitle}
                        </p>
                        <p className="text-xs text-slate-300 font-medium truncate">
                          {review.organization}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Controls: Arrows (mobile-friendly) & Indicators */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous testimonial"
              className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              {filteredReviews.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToCard(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === filteredReviews.length - 1}
              aria-label="Next testimonial"
              className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Executive Metrics & Trust Bar */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-3">
            <Award className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="text-left">
              <span className="block text-lg font-extrabold text-slate-900 font-mono">
                4.98 / 5.0
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Executive Rating
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="text-left">
              <span className="block text-lg font-extrabold text-slate-900 font-mono">
                100%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Verified Executives
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-3">
            <Clock className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="text-left">
              <span className="block text-lg font-extrabold text-slate-900 font-mono">
                4-Hour
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Guaranteed On-Site SLA
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="text-left">
              <span className="block text-lg font-extrabold text-slate-900 font-mono">
                99.999%
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Mission-Critical Uptime
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
