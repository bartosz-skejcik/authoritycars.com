import Image from "next/image";
import { ThemeToggle } from "@/features/ui/theme-toggle";
import Link from "next/link";
import ProfileDropdown from "./profile-dropdown";
import Socials from "../ui/hero/socials";
import NavbarItems from "./navbar-items";
import { cn } from "@/lib/utils";

const links = [
  {
    name: "Opinie klientów",
    href: "/#opinie",
  },
  {
    name: "Zostań partnerem",
    href: "/#partner",
  },
  {
    name: "Popularne pytania",
    href: "/faq",
  },
  {
    name: "Formularz zgłoszeniowy",
    href: "/#formularz",
  },
];

function Navbar({ className }: { className?: string }) {
  return (
    <nav
      className={cn(
        "bg-card border-input flex h-screen w-full flex-col items-center justify-between gap-5 border-b px-3 py-3",
        className,
      )}
    >
      <Link href="/" className="flex items-center justify-center gap-2">
        <Image
          src="/logo.jpg"
          alt="Authoritycars logo"
          width={150}
          height={50}
          className="aspect-square w-10 rounded-xl"
        />
        <h2 className="mb-1 text-xl font-bold italic">authoritycars.com</h2>
      </Link>
      <NavbarItems links={links} />
      <div className="flex w-full flex-col items-center justify-center gap-12">
        <Socials variant="accent" size="sm" />
        <div className="flex w-full gap-2">
          <ProfileDropdown />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
