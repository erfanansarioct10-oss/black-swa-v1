"use client";

import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { CONTACT_INFO } from "@/constants/contact";
import { useSimulatedFormSubmit } from "@/hooks/use-simulated-form-submit";

export function ContactForm() {
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
      message: "",
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
      {/* Direct Contact Information Cards */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl border border-border space-y-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground pb-2 border-b border-border">
            Headquarters & Support
          </h2>

          <div className="space-y-5 text-sm">
            <div className="flex items-start gap-4">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Global Headquarters</p>
                <p className="text-muted-foreground leading-snug">
                  {CONTACT_INFO.address.line1}, {CONTACT_INFO.address.suite} <br />
                  {CONTACT_INFO.address.district}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Telephone</p>
                <a
                  href={CONTACT_INFO.phone.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {CONTACT_INFO.phone.display}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Inquiries & Quotes</p>
                <a
                  href={CONTACT_INFO.email.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {CONTACT_INFO.email.display}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground">Business Hours</p>
                <p className="text-muted-foreground">
                  {CONTACT_INFO.hours.display}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-charcoal text-white p-6 sm:p-8 rounded-xl border border-brand-marble/40 space-y-4">
          <h3 className="font-bold text-lg text-white">Emergency Hardware Support</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Existing enterprise healthcare systems and broadcast network operators with active 24/7 SLA contracts should contact their dedicated system engineer directly.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="lg:col-span-7 bg-card p-6 sm:p-8 rounded-xl border border-border shadow-sm">
        {submitted ? (
          <div className="text-center py-12 space-y-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Message Received</h3>
            <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
              Thank you for contacting Black Swan International. A dedicated technical accounts manager will review your request and respond within 1 business day.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-foreground pb-2 border-b border-border">
              Send an Inquiry
            </h2>

            {errorMessage && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="companyName" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Company / Organization <span className="text-destructive">*</span>
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. St. Jude Health System"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Corporate Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Telephone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Technical Inquiry / Project Scope <span className="text-destructive">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your hardware requirements, system quantities, or custom integration needs..."
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-foreground text-background text-sm font-bold shadow hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? (
                <span>Sending Inquiry...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
