"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import Socials from "../ui/hero/socials";
import NavbarItems from "./navbar-items";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type MobileMenuProps = {
    links: { name: string; href: string }[];
};

export default function MobileMenu({ links }: MobileMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="flex flex-col justify-between p-0"
            >
                <div className="flex flex-col p-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2"
                            onClick={() => setOpen(false)}
                        >
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
                    </div>
                    <div className="mt-8 flex flex-col gap-6">
                        <NavbarItems
                            links={links}
                            className="flex-col items-start gap-6"
                            itemClassName="text-lg"
                            onClick={() => setOpen(false)}
                        />
                    </div>
                </div>
                <div className="border-t p-6">
                    <div className="flex flex-col gap-6">
                        <Socials variant="accent" size="sm" />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
