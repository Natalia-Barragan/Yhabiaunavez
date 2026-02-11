"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: "INICIO" },
        { href: "/#contacto", label: "CONTACTO" },
        { href: "/register", label: "CREAR CUENTA" },
        { href: "/login", label: "INICIAR SESION" },
    ];

    return (
        <div className="bg-[#e5e5e5] text-primary hidden lg:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-center items-center gap-8 py-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors tracking-wide uppercase hover:font-bold underline-offset-4 ${pathname === link.href ? "font-bold text-primary underline" : "text-primary/80"
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
