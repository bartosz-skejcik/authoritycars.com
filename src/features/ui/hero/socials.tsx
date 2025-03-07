"use client";

import { cn } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  MessageCircleMoreIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  {
    name: "facebook",
    url: "https://facebook.com/username",
    icon: FacebookIcon,
  },
  {
    name: "instagram",
    url: "https://instagram.com/username",
    icon: InstagramIcon,
  },
  {
    name: "whatsapp",
    url: "https://wa.me/1234567890",
    icon: MessageCircleMoreIcon,
  },
];

type Props = {
  variant?: "default" | "accent";
  size?: "default" | "sm";
};

function Socials({ variant = "default", size = "default" }: Props) {
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
