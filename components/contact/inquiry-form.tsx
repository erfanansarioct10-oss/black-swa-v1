"use client";

import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { useSimulatedFormSubmit } from "@/hooks/use-simulated-form-submit";
import { cn } from "@/lib/utils";

interface InquiryFormProps {
  title?: string;
  subtitle?: string;
  className?: string;
  variant?: "light" | "dark";
  defaultService?: string;
}

export function InquiryForm({
  title = "Send an Inquiry",
  subtitle,
  className,
  variant = "light",
  defaultService,
}: InquiryFormProps) {
  const isDark = variant === "dark";

  const {
    formData,
    submitting,
    submitted,
    errorMessage,
    handleChange,
    handleSubmit,
    handleReset,
  } = useSimulatedFormSubmit({
    initialValues: {
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      message: defaultService
        ? `I would like to inquire about system integration, architecture, and pricing for ${defaultService}.`
        : "",
    },
  });

  return (
    <div className={cn("space-y-6", className)}>
      {submitted ? (
        <div className="text-center py-10 sm:py-12 space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            Message Received
          </h3>
          <p className={cn("max-w-md mx-auto text-sm sm:text-base leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
            Thank you for contacting Black Swan International. A dedicated technical accounts manager will review your request and respond within 1 business day.
          </p>
          <button
            onClick={handleReset}
            type="button"
            className={cn(
              "inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer",
              isDark
                ? "bg-white text-brand-onyx hover:bg-slate-100"
                : "bg-brand-onyx text-white hover:bg-slate-800"
            )}
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={cn("pb-3 border-b", isDark ? "border-brand-marble/60" : "border-slate-200/80")}>
            <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              {title}
            </h2>
            {subtitle && (
              <p className={cn("text-xs sm:text-sm mt-1", isDark ? "text-slate-300" : "text-slate-600")}>
                {subtitle}
              </p>
            )}
          </div>

          {errorMessage && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-300" : "text-slate-700")}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Dr. Jane Smith"
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs",
                  isDark
                    ? "bg-brand-onyx border border-brand-marble/80 text-white placeholder:text-slate-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="companyName" className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-300" : "text-slate-700")}>
                Company / Organization <span className="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. St. Jude Health System"
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs",
                  isDark
                    ? "bg-brand-onyx border border-brand-marble/80 text-white placeholder:text-slate-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="email" className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-300" : "text-slate-700")}>
                Corporate Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs",
                  isDark
                    ? "bg-brand-onyx border border-brand-marble/80 text-white placeholder:text-slate-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-300" : "text-slate-700")}>
                Telephone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={cn(
                  "w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs",
                  isDark
                    ? "bg-brand-onyx border border-brand-marble/80 text-white placeholder:text-slate-400"
                    : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-300" : "text-slate-700")}>
              Technical Inquiry / Project Scope <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your hardware requirements, system quantities, or custom integration needs..."
              className={cn(
                "w-full px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs resize-y",
                isDark
                  ? "bg-brand-onyx border border-brand-marble/80 text-white placeholder:text-slate-400"
                  : "bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold shadow transition-all duration-200 disabled:opacity-50 cursor-pointer",
              isDark
                ? "bg-white text-brand-onyx hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0"
                : "bg-brand-onyx text-white hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0"
            )}
          >
            {submitting ? (
              <span>Sending Inquiry...</span>
            ) : (
              <>
                <Send className={cn("h-4 w-4", isDark ? "text-blue-600" : "text-blue-400")} />
                <span>Submit Inquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
