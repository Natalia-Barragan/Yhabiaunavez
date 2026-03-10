"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState("/");

    useEffect(() => {
        // Sections to observe
        const sections = [
            { id: "contacto", path: "/#contacto" },
        ];

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionPath = sections.find(s => s.id === entry.target.id)?.path;
                    if (sectionPath) setActiveSection(sectionPath);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            root: null,
            rootMargin: "-40% 0px -40% 0px", // Trigger when passing the middle of the screen
            threshold: 0
        });

        // Start observing
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });

        // Explicit fallback for "Inicio" when near the top
        const handleScroll = () => {
            if (window.scrollY < 300) {
                setActiveSection("/");
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const navLinks = [
        { href: "/", label: "INICIO" },
        { href: "/#contacto", label: "CONTACTO" },
    ];

    // Determine if the link is active
    const isActive = (href: string) => {
        return activeSection === href || (href === "/" && pathname === "/" && activeSection === "/");
    };

    return (
        <div className="bg-[#e5e5e5] text-primary hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-center items-center gap-16 py-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-base font-medium transition-colors tracking-wide uppercase hover:font-bold underline-offset-4 ${isActive(link.href) ? "font-bold text-primary underline" : "text-primary/80"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
