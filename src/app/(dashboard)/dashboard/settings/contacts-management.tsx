"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import {
  getContactInfo,
  updateContactInfo,
} from "@/utils/services/data-service";
import { useContactForm } from "./use-contact-form";
import { ContactDisplay } from "./contact-display";

// Types
export interface ContactInfo {
  id?: number;
  created_at?: string;
  updated_at?: string;
  email: string | null;
  phone: string | null;
  telegram_link: string | null;
  instagram_link: string | null;
  facebook_link: string | null;
}

export function ContactsManagement() {
  // State
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form handling
  const {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    resetForm,
    setFormData,
  } = useContactForm();

  // Load contact information
  useEffect(() => {
    const loadContactInfo = async () => {
      setIsLoading(true);
      try {
        const { data, success } = await getContactInfo();

        if (success && data) {
          setContact(data);
        }
      } catch (error) {
        console.error("Failed to load contact information:", error);
        toast.error("Failed to load contact information");
      } finally {
        setIsLoading(false);
      }
    };

    loadContactInfo();
  }, []);

  // Handle opening edit dialog
  const handleEdit = () => {
    if (contact) {
      setFormData({
        email: contact.email,
        phone: contact.phone,
        facebook_link: contact.facebook_link,
        instagram_link: contact.instagram_link,
        telegram_link: contact.telegram_link,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  // Update contact information
  const handleUpdateContact = async () => {
    if (!validateForm()) return;

    try {
      // @ts-expect-error asdf
      const result = await updateContactInfo(formData);

      if (result.success) {
        // @ts-expect-error asdf
        setContact(result.data);
        toast.success("Contact information updated successfully");
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error(
          // @ts-expect-error asdf
          `Failed to update contact information: ${result.error?.message || "Unknown error"}`,
        );
      }
    } catch (error) {
      toast.error("An error occurred while updating the contact information");
      console.error(error);
    }
  };

  // Function to check if contact info exists
  const hasContactInfo =
    contact &&
    (contact.email ||
      contact.phone ||
      contact.facebook_link ||
      contact.instagram_link ||
      contact.telegram_link);

  // Function to filter out empty fields for display

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Manage contact details for your organization
            </CardDescription>
          </div>
          <Button onClick={handleEdit}>
            {hasContactInfo ? (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Contact
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Loading contact information...</div>
          </div>
        ) : hasContactInfo ? (
          <ContactDisplay contact={contact} />
        ) : (
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No contact information has been added yet.
            </p>
            <Button onClick={handleEdit}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact Details
            </Button>
          </div>
        )}
      </CardContent>

      {/* Edit Contact Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {hasContactInfo
                ? "Edit Contact Information"
                : "Add Contact Information"}
            </DialogTitle>
            <DialogDescription>
              {hasContactInfo
                ? "Update your organization's contact details."
                : "Add contact information for your organization."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
              {formErrors.email && (
                <p className="text-destructive text-sm">{formErrors.email}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
              {formErrors.phone && (
                <p className="text-destructive text-sm">{formErrors.phone}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facebook_link">Facebook</Label>
              <Input
                id="facebook_link"
                name="facebook_link"
                placeholder="https://facebook.com/yourpage"
                value={formData.facebook_link || ""}
                onChange={handleInputChange}
              />
              {formErrors.facebook_link && (
                <p className="text-destructive text-sm">
                  {formErrors.facebook_link}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instagram_link">Instagram</Label>
              <Input
                id="instagram_link"
                name="instagram_link"
                placeholder="https://instagram.com/yourhandle"
                value={formData.instagram_link || ""}
                onChange={handleInputChange}
              />
              {formErrors.instagram_link && (
                <p className="text-destructive text-sm">
                  {formErrors.instagram_link}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telegram_link">Telegram</Label>
              <Input
                id="telegram_link"
                name="telegram_link"
                placeholder="https://t.me/yourusername"
                value={formData.telegram_link || ""}
                onChange={handleInputChange}
              />
              {formErrors.telegram_link && (
                <p className="text-destructive text-sm">
                  {formErrors.telegram_link}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateContact}>
              {hasContactInfo ? "Save Changes" : "Create Contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
