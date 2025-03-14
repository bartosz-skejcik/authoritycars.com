"use client";

import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  MessageCircleMoreIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ContactInfo } from "@/app/(dashboard)/dashboard/settings/contacts-management";
import { getContactInfo } from "@/utils/services/data-service";

const socialsTemplate = [
  {
    name: "facebook_link",
    url: "#",
    icon: FacebookIcon,
  },
  {
    name: "instagram_link",
    url: "#",
    icon: InstagramIcon,
  },
  {
    name: "whatsapp_link",
    url: "#",
    icon: MessageCircleMoreIcon,
  },
];

type Props = {
  variant?: "default" | "accent";
  size?: "default" | "sm";
};

function Socials({ variant = "default", size = "default" }: Props) {
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, success } = await getContactInfo();

        if (success && data) {
          setContact(data);
        }
      } catch (error) {
        console.error("Failed to load contact information:", error);
      }
    })();
  }, []);

  const socials = useMemo(() => {
    if (!contact) return socialsTemplate;

    const processedSocials = socialsTemplate.map((social) => {
      if (contact.hasOwnProperty(social.name)) {
        // @ts-expect-error asdf
        social.url = contact[social.name];
      }
      return social;
    });

    const filteredSocials = processedSocials.filter((s) => s.url);
    console.log(filteredSocials);

    return filteredSocials;
  }, [contact]);

  return (
    <div className="flex gap-4">
      {socials.map((social, idx) => (
        <motion.a
          initial={{ y: 500, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * idx }}
          key={social.name}
          href={social.url}
          target="_blank"
          referrerPolicy="no-referrer"
          className={cn(
            "rounded-full p-2 transition-all duration-200",
            variant == "default"
              ? "bg-card hover:bg-transparent"
              : "bg-orange-400 hover:scale-105 hover:bg-orange-500",
          )}
        >
          <social.icon
            name={social.name}
            className={size == "default" ? "h-6 w-6" : "h-5 w-5"}
          />
        </motion.a>
      ))}
    </div>
  );
}

export default Socials;
