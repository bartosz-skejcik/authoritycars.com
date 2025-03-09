import { Phone, Mail, Facebook, Instagram, Send } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { ContactInfo } from "./contacts-management";

interface ContactDisplayProps {
    contact: ContactInfo | null;
}

export function ContactDisplay({ contact }: ContactDisplayProps) {
    if (!contact) return null;

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <div className="space-y-4 p-6">
                    {contact.email && (
                        <div className="flex items-center">
                            <Mail className="text-muted-foreground mr-2 h-5 w-5" />
                            <a
                                href={`mailto:${contact.email}`}
                                className="hover:underline"
                            >
                                {contact.email}
                            </a>
                        </div>
                    )}

                    {contact.phone && (
                        <div className="flex items-center">
                            <Phone className="text-muted-foreground mr-2 h-5 w-5" />
                            <a
                                href={`tel:${contact.phone}`}
                                className="hover:underline"
                            >
                                {contact.phone}
                            </a>
                        </div>
                    )}

                    {contact.facebook_link && (
                        <div className="flex items-center">
                            <Facebook className="text-muted-foreground mr-2 h-5 w-5" />
                            <a
                                href={contact.facebook_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all hover:underline"
                            >
                                {contact.facebook_link}
                            </a>
                        </div>
                    )}

                    {contact.instagram_link && (
                        <div className="flex items-center">
                            <Instagram className="text-muted-foreground mr-2 h-5 w-5" />
                            <a
                                href={contact.instagram_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all hover:underline"
                            >
                                {contact.instagram_link}
                            </a>
                        </div>
                    )}

                    {contact.whatsapp_link && (
                        <div className="flex items-center">
                            <Send className="text-muted-foreground mr-2 h-5 w-5" />
                            <a
                                href={contact.whatsapp_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="break-all hover:underline"
                            >
                                {contact.whatsapp_link}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {contact.updated_at && (
                <p className="text-muted-foreground text-sm">
                    Last updated: {formatDate(contact.updated_at)}
                </p>
            )}
        </div>
    );
}
