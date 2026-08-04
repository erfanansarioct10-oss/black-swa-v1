import React from "react";
import { AlertCircle } from "lucide-react";

import { recordProposalViewAction } from "@/actions/proposal";
import { getQuoteByLookupTokenAction, getQuoteByTrackingAction } from "@/actions/quote";
import { QuoteTrackingDetails } from "@/components/quote/quote-tracking-details";
import { QuoteTrackingSearchForm } from "@/components/quote/quote-tracking-search-form";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { generatePageMetadata } from "@/lib/seo";
import type { QuoteWithItems } from "@/types/quote";


interface PageProps {
  params: Promise<{ referenceId: string }>;
  searchParams: Promise<{ token?: string; email?: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { referenceId } = await params;
  return generatePageMetadata({
    title: `Quote Status ${referenceId} | Black Swan International`,
    description: `Track real-time status and view official quotation documentation for RFQ reference ${referenceId}.`,
    path: `/quote/track/${referenceId}`,
  });
}

export default async function QuoteTrackDetailPage({ params, searchParams }: PageProps) {
  const { referenceId } = await params;
  const { token, email } = await searchParams;

  let quoteData: QuoteWithItems | null = null;
  let fetchError: string | null = null;

  // 1. If direct lookup token from email receipt is present
  if (token) {
    const res = await getQuoteByLookupTokenAction(token);
    if (res.success) {
      quoteData = res.data;
    } else {
      fetchError = res.error || "Invalid or expired quotation lookup token.";
    }
  }
  // 2. If email parameter is provided from tracking search form
  else if (email) {
    const res = await getQuoteByTrackingAction({
      referenceId,
      email,
    });
    if (res.success) {
      quoteData = res.data;
    } else {
      fetchError = res.error || "No quotation request matching this reference ID and email was found.";
    }
  }

  // If quote record was successfully loaded, render tracking details
  if (quoteData) {

    // Record proposal view receipt asynchronously
    recordProposalViewAction(quoteData.referenceId).catch((err) => {
      console.warn("[Proposal View Tracking Warning]:", err);
    });

    return (
      <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <Breadcrumbs
          items={[
            { label: "Request Quote", href: "/quote" },
            { label: "Track Quote", href: "/quote/track" },
            { label: quoteData.referenceId, href: `/quote/track/${quoteData.referenceId}` },
          ]}
        />
        <QuoteTrackingDetails quote={quoteData} />
      </div>
    );
  }


  // If verification is needed or lookup failed, render verification prompt with search form
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      <Breadcrumbs
        items={[
          { label: "Request Quote", href: "/quote" },
          { label: "Track Quote", href: "/quote/track" },
          { label: referenceId, href: `/quote/track/${referenceId}` },
        ]}
      />

      <div className="space-y-4 text-center sm:text-left border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          RFQ Identity Verification Required
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Verify Quotation Access
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl">
          To view status details for <code className="text-foreground bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{referenceId}</code>, please provide the email address used during request submission.
        </p>
      </div>

      {fetchError && (
        <div className="max-w-2xl mx-auto bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-start gap-3 text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Lookup Error</h4>
            <p className="text-xs text-destructive/90">{fetchError}</p>
          </div>
        </div>
      )}

      <QuoteTrackingSearchForm initialReferenceId={referenceId} initialEmail={email || ""} />
    </div>
  );
}
