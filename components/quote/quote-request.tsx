"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { useQuoteCart } from "@/components/providers/quote-cart-provider";
import { createQuoteAction } from "@/actions/quote";
import type { CreateQuoteSchemaType } from "@/schemas/quote";

import { RFQWizardProgress } from "./rfq-wizard-progress";
import { RFQStepEquipment, RFQStepDetails, RFQStepReview } from "./rfq-wizard-steps";
import { RFQConfirmation } from "./rfq-confirmation";

const FORM_STORAGE_KEY = "blackswan_quote_wizard_form";
const STEP_STORAGE_KEY = "blackswan_quote_wizard_step";

const EMPTY_FORM: Partial<CreateQuoteSchemaType> = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  budgetRange: "",
  timeline: "",
  projectScope: "",
  turnstileToken: "",
};

export function QuoteRequest() {
  const { user } = useUser();
  const { items, mounted, clearCart } = useQuoteCart();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form details state
  const [formData, setFormData] = useState<Partial<CreateQuoteSchemaType>>({ ...EMPTY_FORM });
  const [initialized, setInitialized] = useState(false);

  // Success result state
  const [confirmationData, setConfirmationData] = useState<{
    referenceId: string;
    contactName: string;
    email: string;
    companyName?: string;
    itemCount: number;
  } | null>(null);

  // Restore state from sessionStorage after initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedStep = sessionStorage.getItem(STEP_STORAGE_KEY);
        if (savedStep) {
          const stepNum = parseInt(savedStep, 10);
          if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 3) {
            setCurrentStep(stepNum);
          }
        }
        const savedForm = sessionStorage.getItem(FORM_STORAGE_KEY);
        if (savedForm) {
          const parsed: unknown = JSON.parse(savedForm);
          if (parsed && typeof parsed === "object") {
            setFormData(parsed as Partial<CreateQuoteSchemaType>);
          }
        }
      } catch {
        // Ignore storage read exceptions
      } finally {
        setInitialized(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Persist form data to sessionStorage whenever formData changes (excluding turnstileToken)
  useEffect(() => {
    if (!initialized) return;
    try {
      const draft = { ...formData };
      delete draft.turnstileToken;
      sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to persist quote wizard form to sessionStorage:", e);
    }
  }, [formData, initialized]);

  // Persist current step to sessionStorage whenever currentStep changes
  useEffect(() => {
    if (!initialized) return;
    try {
      sessionStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    } catch (e) {
      console.error("Failed to persist quote wizard step to sessionStorage:", e);
    }
  }, [currentStep, initialized]);

  // Active form data with fallback to Clerk identity if field has not been explicitly modified
  const activeFormData: Partial<CreateQuoteSchemaType> = {
    ...formData,
    fullName:
      formData.fullName && formData.fullName.trim() !== ""
        ? formData.fullName
        : user?.fullName || user?.firstName || "",
    email:
      formData.email && formData.email.trim() !== ""
        ? formData.email
        : user?.primaryEmailAddress?.emailAddress || "",
  };

  const handleFieldChange = (field: keyof CreateQuoteSchemaType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTurnstileSuccess = (token?: string) => {
    setFormData((prev) => ({ ...prev, turnstileToken: token || "" }));
  };

  const handleSubmitQuote = async () => {
    if (items.length === 0) {
      setSubmitError("Your quote cart is empty. Please add items before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload: CreateQuoteSchemaType = {
      fullName: activeFormData.fullName || "",
      email: activeFormData.email || "",
      phone: activeFormData.phone || "",
      companyName: activeFormData.companyName || undefined,
      budgetRange: activeFormData.budgetRange || undefined,
      timeline: activeFormData.timeline || undefined,
      projectScope: activeFormData.projectScope || undefined,
      turnstileToken: activeFormData.turnstileToken || undefined,
      items: items.map((item) => ({
        productId: item.id,
        productTitle: item.name,
        category: item.category,
        quantity: item.quantity,
        notes: item.notes || undefined,
      })),
    };

    try {
      const res = await createQuoteAction(payload);
      if (!res.success || !res.data) {
        setSubmitError(res.error || "Failed to process quotation request.");
        return;
      }

      setConfirmationData({
        referenceId: res.data.referenceId,
        contactName: payload.fullName,
        email: payload.email,
        companyName: payload.companyName,
        itemCount: items.length,
      });

      // Reset form state, clear draft form & step from sessionStorage, and clear cart
      setFormData({ ...EMPTY_FORM });
      try {
        sessionStorage.removeItem(FORM_STORAGE_KEY);
        sessionStorage.removeItem(STEP_STORAGE_KEY);
      } catch {
        // ignore
      }
      clearCart();
      setCurrentStep(4);
    } catch (err) {
      console.error("RFQ submission exception:", err);
      setSubmitError("An unexpected error occurred. Please verify your internet connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground bg-card rounded-xl border border-border">
        Loading quotation wizard...
      </div>
    );
  }

  // Confirmation view
  if (currentStep === 4 && confirmationData) {
    return (
      <RFQConfirmation
        referenceId={confirmationData.referenceId}
        contactName={confirmationData.contactName}
        email={confirmationData.email}
        companyName={confirmationData.companyName}
        itemCount={confirmationData.itemCount}
        onReset={() => {
          setConfirmationData(null);
          setFormData({ ...EMPTY_FORM });
          try {
            sessionStorage.removeItem(FORM_STORAGE_KEY);
            sessionStorage.removeItem(STEP_STORAGE_KEY);
          } catch {
            // ignore
          }
          setCurrentStep(1);
        }}
      />
    );
  }

  const effectiveStep = items.length === 0 ? 1 : currentStep;

  return (
    <div className="space-y-8">
      {/* Wizard Progress Header */}
      <RFQWizardProgress
        currentStep={effectiveStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Step Content Card */}
      <div className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
        {effectiveStep === 1 && (
          <RFQStepEquipment onNext={() => setCurrentStep(2)} />
        )}

        {effectiveStep === 2 && (
          <RFQStepDetails
            formData={activeFormData}
            onChange={handleFieldChange}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {effectiveStep === 3 && (
          <RFQStepReview
            formData={activeFormData}
            onTurnstileSuccess={handleTurnstileSuccess}
            onSubmit={handleSubmitQuote}
            onBack={() => setCurrentStep(2)}
            submitting={submitting}
            submitError={submitError}
          />
        )}
      </div>
    </div>
  );
}


