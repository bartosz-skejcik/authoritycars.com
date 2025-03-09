import { useState } from "react";
import { ContactInfo } from "./contacts-management";

type ContactFormData = Omit<ContactInfo, "id" | "created_at" | "updated_at">;

export function useContactForm() {
    // Form state
    const [formData, setFormData] = useState<ContactFormData>({
        email: null,
        phone: null,
        facebook_link: null,
        instagram_link: null,
        whatsapp_link: null,
    });

    // Form errors
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Validation functions
    const validateEmail = (email: string | null) => {
        if (!email) return true; // Optional field
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string | null) => {
        if (!phone) return true; // Optional field
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
        return phoneRegex.test(phone);
    };

    const validateUrl = (url: string | null) => {
        if (!url) return true; // Optional field
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Form validation
    const validateForm = () => {
        const errors: Record<string, string> = {};

        if (formData.email && !validateEmail(formData.email)) {
            errors.email = "Please enter a valid email address";
        }

        if (formData.phone && !validatePhone(formData.phone)) {
            errors.phone = "Please enter a valid phone number";
        }

        if (formData.facebook_link && !validateUrl(formData.facebook_link)) {
            errors.facebook_link = "Please enter a valid URL";
        }

        if (formData.instagram_link && !validateUrl(formData.instagram_link)) {
            errors.instagram_link = "Please enter a valid URL";
        }

        if (formData.whatsapp_link && !validateUrl(formData.whatsapp_link)) {
            errors.whatsapp_link = "Please enter a valid URL";
        }

        // If all fields are empty, show error
        if (
            !formData.email &&
            !formData.phone &&
            !formData.facebook_link &&
            !formData.instagram_link &&
            !formData.whatsapp_link
        ) {
            errors.form = "Please fill at least one contact method";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value || null }));

        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            email: null,
            phone: null,
            facebook_link: null,
            instagram_link: null,
            whatsapp_link: null,
        });
        setFormErrors({});
    };

    return {
        formData,
        formErrors,
        setFormData,
        handleInputChange,
        validateForm,
        resetForm,
    };
}
