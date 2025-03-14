import Image from "next/image";
import Link from "next/link";
import ProfileDropdown from "./profile-dropdown";
import Socials from "../ui/hero/socials";
import NavbarItems from "./navbar-items";
import { cn } from "@/lib/utils";
import MobileMenu from "./mobile-menu";

const links = [
    //{
    //  name: "Opinie klientów",
    //  href: "/#opinie",
    //},
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
        <>
            {/* Mobile Navbar */}
            <nav
                className={cn(
                    "bg-card border-input sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-4 py-2 lg:hidden",
                    className
                )}
            >
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.jpg"
                        alt="Authoritycars logo"
                        width={150}
                        height={50}
                        className="aspect-square w-8 rounded-xl"
                    />
                    <h2 className="text-lg font-bold italic">
                        authoritycars.pl
                    </h2>
                </Link>

                <MobileMenu links={links} />
            </nav>

            {/* Desktop Sidebar */}
            <nav
                className={cn(
                    "bg-card border-input hidden h-screen w-full flex-col items-center justify-between gap-5 border-b px-3 py-3 lg:flex",
                    className
                )}
            >
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2"
                >
                    <Image
                        src="/logo.jpg"
                        alt="Authoritycars logo"
                        width={150}
                        height={50}
                        className="aspect-square w-10 rounded-xl"
                    />
                    <h2 className="mb-1 text-xl font-bold italic">
                        authoritycars.pl
                    </h2>
                </Link>
                <NavbarItems links={links} />
                <div className="flex w-full flex-col items-center justify-center gap-12">
                    <Socials variant="accent" size="sm" />
                    <ProfileDropdown />
                </div>
            </nav>
        </>
    );
}

export default Navbar;
