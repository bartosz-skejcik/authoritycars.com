"use client";

import Link from "next/link";

type Props = {
  links: {
    name: string;
    href: string;
  }[];
};

function NavbarItems({ links }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-3 overflow-hidden">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="text-center text-lg transition-all duration-200 hover:text-orange-400"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}

export default NavbarItems;
