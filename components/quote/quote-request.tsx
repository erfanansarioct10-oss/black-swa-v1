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

const getInitialFormData = (): Partial<CreateQuoteSchemaType> => {
  if (typeof window === "undefined") {
    return {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      budgetRange: "",
      timeline: "",
      projectScope: "",
      turnstileToken: "",
    };
  }
  try {
    const savedForm = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (savedForm) {
      const parsed: unknown = JSON.parse(savedForm);
      if (parsed && typeof parsed === "object") {
        return parsed as Partial<CreateQuoteSchemaType>;
      }
    }
  } catch {
    // Ignore storage read exceptions
  }
  return {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    budgetRange: "",
    timeline: "",
    projectScope: "",
    turnstileToken: "",
  };
};

const getInitialStep = (): number => {
  if (typeof window === "undefined") return 1;
  try {
    const savedStep = sessionStorage.getItem(STEP_STORAGE_KEY);
    if (savedStep) {
      const stepNum = parseInt(savedStep, 10);
      if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 3) {
        return stepNum;
      }
    }
  } catch {
    // Ignore storage read exceptions
  }
  return 1;
};

export function QuoteRequest() {
  const { user } = useUser();
  const { items, mounted, clearCart } = useQuoteCart();

  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form details state
  const [formData, setFormData] = useState<Partial<CreateQuoteSchemaType>>(getInitialFormData);

  // Success result state
  const [confirmationData, setConfirmationData] = useState<{
    referenceId: string;
    contactName: string;
    email: string;
    companyName?: string;
    itemCount: number;
  } | null>(null);

  // Persist form data to sessionStorage whenever formData changes
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error("Failed to persist quote wizard form to sessionStorage:", e);
    }
  }, [formData, mounted]);

  // Persist current step to sessionStorage whenever currentStep changes
  useEffect(() => {
    if (!mounted) return;
    try {
      sessionStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    } catch (e) {
      console.error("Failed to persist quote wizard step to sessionStorage:", e);
    }
  }, [currentStep, mounted]);

  // Compute effective initial form data using user identity if logged in
  const activeFormData: Partial<CreateQuoteSchemaType> = {
    ...formData,
    fullName: formData.fullName || (user?.fullName || user?.firstName || ""),
    email: formData.email || (user?.primaryEmailAddress?.emailAddress || ""),
  };

  const handleFieldChange = (field: keyof CreateQuoteSchemaType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTurnstileSuccess = (token: string) => {
    setFormData((prev) => ({ ...prev, turnstileToken: token }));
  };

  const handleSubmitQuote = async () => {
    if (items.length === 0) {
      setSubmitError("Your quote cart is empty. Please add hardware items before submitting.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
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

      const response = await createQuoteAction(payload);

      if (!response.success) {
        setSubmitError(response.error || "An error occurred while submitting your quote request.");
        setSubmitting(false);
        return;
      }

      // Save confirmation state & advance to Step 4 (Confirmation View)
      setConfirmationData({
        referenceId: response.data.referenceId,
        contactName: payload.fullName,
        email: payload.email,
        companyName: payload.companyName,
        itemCount: items.length,
      });

      // Clear draft form & step from sessionStorage and clear cart
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
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            companyName: "",
            budgetRange: "",
            timeline: "",
            projectScope: "",
            turnstileToken: "",
          });
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


