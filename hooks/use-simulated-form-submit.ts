import { useState, ChangeEvent, FormEvent } from "react";

export interface UseSimulatedFormSubmitOptions<T> {
  initialValues: T;
  onSubmitSuccess?: () => void;
  delayMs?: number;
}

export function useSimulatedFormSubmit<T extends Record<string, any>>({
  initialValues,
  onSubmitSuccess,
  delayMs = 800,
}: UseSimulatedFormSubmitOptions<T>) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    }, delayMs);
  };

  const handleReset = () => {
    setFormData(initialValues);
    setSubmitted(false);
    setErrorMessage(null);
  };

  return {
    formData,
    setFormData,
    submitting,
    submitted,
    errorMessage,
    setErrorMessage,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
