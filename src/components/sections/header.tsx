"use client";

import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu } from "lucide-react";
import React from "react";


const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#gallery", label: "Gallery" },
    { href: "#portfolio", label: "Portfolio" },
    { href: "#testimonials", label: "Testimonials" },
];
//t
export function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? 'bg-white/80 backdrop-blur-sm shadow-md' : 'bg-transparent')}>
            <div className="container mx-auto px-4 flex items-center justify-between h-20">
                <Logo />
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}>
                            <span className={cn("font-medium hover:text-primary transition-colors", pathname === link.href ? "text-primary" : "text-foreground/80")}>
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>
                <div className="hidden md:block">
                    <Button asChild className="rounded-full">
                        <Link href="#contact">Contact Now</Link>
                    </Button>
                </div>
                 <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                             <div className="flex flex-col gap-4 p-4">
                                <Logo />
                                {navLinks.map(link => (
                                    <Link key={link.href} href={link.href}>
                                        <span className="font-medium hover:text-primary transition-colors text-lg">
                                            {link.label}
                                        </span>
                                    </Link>
                                ))}
                                <Button asChild className="rounded-full mt-4">
                                    <Link href="#contact">Contact Now</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
