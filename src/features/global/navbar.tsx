import { ThemeToggle } from "@/features/ui/theme-toggle";
import Link from "next/link";
import ProfileDropdown from "./profile-dropdown";
import Socials from "../ui/hero/socials";
import NavbarItems from "./navbar-items";

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

function Navbar() {
  return (
    <nav className="bg-card border-input flex h-screen w-1/6 flex-col items-center justify-between gap-5 border-b px-3 py-3">
      <Link href="/">
        <h2 className="text-2xl font-bold italic">authoritycars.com</h2>
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
