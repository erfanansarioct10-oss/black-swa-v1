import { createElement } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ALL_SERVICES,
  getServiceIcon,
} from "@/constants/services";
import { generatePageMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/constants/site";
import { InquiryForm } from "@/components/contact/inquiry-form";
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  Clock,
  UserCheck,
  ShieldCheck,
  HelpCircle,
  Cpu,
  Zap,
} from "lucide-react";

interface ServiceDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return ALL_SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = ALL_SERVICES.find((s) => s.slug === slug);

  if (!service) {
    return generatePageMetadata({
      title: "Service Not Found",
      description: "The requested broadcast service specification could not be found.",
      path: `/services/${slug}`,
    });
  }

  return generatePageMetadata({
    title: `${service.title} - Broadcast Engineering Guide & Service Details`,
    description: service.desc,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = ALL_SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const serviceIcon = getServiceIcon(service.iconName);

  // Schema.org Structured Data
  const serviceDetailSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.categoryLabel,
    provider: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    description: service.desc,
    areaServed: "Global",
    termsOfService: `${SITE_CONFIG.url}/terms`,
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: service.title,
    description: service.desc,
    image: `${SITE_CONFIG.url}${service.image}`,
    author: {
      "@type": "Organization",
      name: service.blogContent.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/brand-logo.svg`,
      },
    },
    datePublished: service.blogContent.publishedDate,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/services/${service.slug}`,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.blogContent.faq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 text-slate-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <JsonLd data={serviceDetailSchema} />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Services", href: "/services" },
            { label: service.title, href: `/services/${service.slug}` },
          ]}
        />

        {/* Back Link */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-blue-600" />
            <span>Back to All Technical Services</span>
          </Link>
        </div>

        {/* Service Detail Hero Section */}
        <header className="relative bg-white text-slate-900 rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {service.categoryLabel}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                <span>{service.slaBadge}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 ml-auto">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                <span>{service.blogContent.readingTime}</span>
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs hidden sm:flex">
                {createElement(serviceIcon, { className: "h-6 w-6" })}
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 uppercase leading-tight">
                  {service.title}
                </h1>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed max-w-4xl">
                  {service.longDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Banner */}
          <div className="relative w-full aspect-[21/9] bg-slate-100 border-t border-slate-200/80 overflow-hidden">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </header>

        {/* Main 2-Column Content & Inquiry Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left / Primary Column: Engineering Overview, Features, Blog & FAQ */}
          <div className="lg:col-span-2 space-y-10 sm:space-y-12">
            {/* Section 1: Core Engineering Capabilities Grid */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-slate-900 tracking-tight">
                  Core System Capabilities
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="bg-white text-slate-900 rounded-xl border border-slate-200/90 p-5 space-y-2 shadow-2xs"
                  >
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{feat.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Deep-Dive Technical Engineering Blog Article */}
            <article className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-8 shadow-sm">
              {/* Article Author Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200/80 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">
                    {service.blogContent.author}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{service.blogContent.authorTitle}</span>
                </div>
                <div>
                  <span>Published on {service.blogContent.publishedDate}</span>
                </div>
              </div>

              {/* Article Body Sections */}
              <div className="space-y-6">
                {service.blogContent.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                      {sec.heading}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Architectural Highlights Box */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span>Technical Specifications & Standards:</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  {service.blogContent.architecturalHighlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            {/* Section 3: Key Deliverables & Standard SLA Checklist */}
            <section className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight">
                  Turnkey SLA & Engineering Deliverables
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                Every deployment includes full documentation, factory acceptance testing, and continuous operational guarantees:
              </p>

              <ul className="grid grid-cols-1 gap-3 pt-2">
                {service.deliverables.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Section 4: Frequently Asked Technical Questions (FAQ) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight">
                  Frequently Asked Engineering Questions
                </h2>
              </div>

              <div className="space-y-4">
                {service.blogContent.faq.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-white text-slate-900 rounded-xl border border-slate-200/90 p-5 space-y-2 shadow-2xs"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Q: {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column / Sidebar: Sticky Inquiry Form Card */}
          <aside className="sticky top-24 space-y-6">
            <div className="bg-white text-slate-900 rounded-2xl border border-slate-200/90 p-6 shadow-md space-y-5">
              <div className="space-y-2 border-b border-slate-200/80 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                  Direct Engineering Desk
                </span>
                <h2 className="text-xl font-black uppercase text-slate-900">
                  Inquire About Service
                </h2>
                <p className="text-xs text-slate-600">
                  Request custom system architecture design, equipment quotation, or SLA maintenance support for{" "}
                  <span className="font-semibold text-slate-900">{service.title}</span>.
                </p>
              </div>

              {/* Embedded Inquiry Form with prefilled service parameter */}
              <InquiryForm defaultService={service.title} />
            </div>

            {/* Quick SLA Commitment Card */}
            <div className="bg-white text-slate-900 rounded-xl border border-slate-200/90 p-5 space-y-3 text-xs text-slate-600 shadow-2xs">
              <h3 className="font-bold text-slate-900 uppercase text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Black Swan Engineering SLA</span>
              </h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Response SLA:</span>
                  <span className="font-mono text-emerald-700 font-bold">Under 2 Hours</span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Deployment Mode:</span>
                  <span className="font-semibold text-slate-800">On-Site & Cloud Hybrid</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-500">Support Desk:</span>
                  <span className="font-semibold text-slate-800">24/7/365 Continuous</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
