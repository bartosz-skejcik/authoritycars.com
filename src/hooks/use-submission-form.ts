import { useState, useEffect } from "react";
import { getStatuses } from "@/utils/services/data-service"; // Update this path to match your project structure

export const useSubmissionForm = (refParam?: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openStatusId, setOpenStatusId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpenStatus = async () => {
      try {
        const statuses = await getStatuses();
        const openStatus = statuses.find(
          (status) => status.name.toLowerCase() === "open",
        );

        if (openStatus) {
          setOpenStatusId(openStatus.id);
        } else {
          console.error("No 'open' status found in the database");
          setError("Configuration error: No 'open' status found");
        }
      } catch (err) {
        console.error("Error fetching statuses:", err);
        setError("Failed to load form configuration");
      }
    };

    fetchOpenStatus();
  }, []);

  const submitForm = async (formData: {
    telephone: string;
    name: string;
    budget_from: string;
    budget_to: string;
    model: string;
  }) => {
    if (!openStatusId) {
      setError("Cannot submit form: Status configuration missing");
      return false;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.telephone,
          name: formData.name,
          budget_from: parseFloat(formData.budget_from),
          budget_to: parseFloat(formData.budget_to),
          vehicle_type: formData.model,
          status_id: openStatusId,
          ref: refParam || null,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setError(responseData.error || "Failed to submit form");
        return false;
      }

      setIsSuccess(true);

      // Reset success state after a delay
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);

      return true;
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isSuccess,
    error,
    openStatusId,
    submitForm,
  };
};
