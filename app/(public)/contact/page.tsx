"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { CONTACT_INFO } from "@/constants/contact";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    // Simulate async submission processing
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      companyName: "",
      email: "",
      phone: "",
      message: "",
    });
    setSubmitted(false);
    setErrorMessage(null);
  };

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
      <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Contact Black Swan International
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          Have inquiries regarding product technical specs, volume quotes, or emergency servicing? Reach out to our engineering support team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Sidebar */}
        <div className="lg:col-span-5 space-y-6 bg-card border border-border p-6 sm:p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-foreground">Global Headquarters</h2>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{CONTACT_INFO.address.full}</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <a href={CONTACT_INFO.phone.href} className="hover:text-foreground transition-colors">
                {CONTACT_INFO.phone.display}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <a href={CONTACT_INFO.email.href} className="hover:text-foreground transition-colors">
                {CONTACT_INFO.email.display}
              </a>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-border">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-foreground block">Operating Hours</span>
                <span>{CONTACT_INFO.hours.display}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-card border border-border p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-foreground">Send a Direct Message</h2>

          {submitted ? (
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-xl space-y-4 text-center sm:text-left">
              <div className="flex items-center gap-3 text-primary">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <h3 className="text-lg font-bold">Message Submitted Successfully</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thank you for contacting Black Swan International, <span className="font-semibold text-foreground">{formData.fullName}</span>. An engineering account executive will review your inquiry and get back to you within 1 business day.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground font-semibold text-xs rounded-md shadow-xs hover:opacity-90 transition-opacity"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-xs font-semibold text-foreground">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="companyName" className="text-xs font-semibold text-foreground">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Industrial Corp"
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-foreground">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@acme.com"
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-foreground">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-foreground">
                  Message / Specifications *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your equipment needs, serial numbers, or inquiry..."
                  className="w-full px-3.5 py-2 text-sm bg-background border border-border rounded-md focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm rounded-md shadow-xs hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Submitting..." : "Submit Message"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
