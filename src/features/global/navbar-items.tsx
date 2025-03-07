"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type NavbarItemsProps = {
  links: { name: string; href: string }[];
  className?: string;
  itemClassName?: string;
  onClick?: () => void;
};

function NavbarItems({
  links,
  className,
  itemClassName,
  onClick,
}: NavbarItemsProps) {
  return (
    <ul className={cn("flex grow flex-col items-center gap-3", className)}>
      {links.map((link) => (
        <li key={link.name}>
          <Link
            href={link.href}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              itemClassName,
            )}
            onClick={onClick}
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default NavbarItems;
