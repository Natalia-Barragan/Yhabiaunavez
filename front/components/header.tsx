"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, Menu, X, Instagram } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/lib/store";
import { CartDrawer } from "./cart-drawer";
import { Navbar } from "./navbar";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems, setCartOpen } = useCartStore();
  const totalItems = getTotalItems();

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/#catalogo", label: "Catálogo" },
    { href: "/#contacto", label: "Contacto" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        {/* Desktop Header Layout */}
        <div className="hidden lg:block shadow-sm">
          {/* Top Row: Search - Logo - Cart (White Background) */}
          <div className="bg-card py-1 border-b border-border/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-3 items-center">
                {/* Left: Search */}
                {/* Left: Instagram */}
                <div className="flex items-center">
                  <Link
                    href="https://www.instagram.com/yhabiaunavez"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors hover:scale-110 duration-200 ml-15"
                  >
                    <Instagram size={32} />
                    <span className="text-base font-medium uppercase tracking-wide hidden sm:inline">
                      Seguinos
                    </span>
                  </Link>
                </div>

                {/* Center: Logo */}
                <div className="flex justify-center">
                  <Link href="/" className="flex flex-col items-center group">
                    <div className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="relative w-72 h-32"
                      >
                        <Image
                          src="/images/yhabiaunavez.jpg"
                          alt="Había una vez Logo"
                          fill
                          className="object-contain"
                        />
                      </motion.div>
                    </div>
                  </Link>
                </div>

                {/* Right: Cart */}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    onClick={() => setCartOpen(true)}
                    className="flex items-center gap-2 hover:bg-transparent hover:text-primary hover:scale-110 transition-transform duration-200 p-0 mr-15"
                  >
                    <ShoppingCart size={32} style={{ width: '32px', height: '32px' }} />
                    <span className="text-base font-medium uppercase tracking-wide">
                      Mi Carrito
                    </span>
                    {totalItems > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center"
                      >
                        {totalItems}
                      </motion.span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Navigation (Teal Background) */}
          <Navbar />
        </div>

        {/* Mobile Header Layout (Unchanged) */}
        <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left section - Mobile Menu & Search Toggle */}
            <div className="flex items-center flex-1">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 mr-2 text-foreground hover:text-primary transition-colors"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-foreground hover:text-primary transition-colors"
                aria-label="Buscar"
              >
                <Search size={22} />
              </button>
            </div>

            {/* Center - Logo */}
            <Link href="/" className="flex flex-col items-center group absolute left-1/2 -translate-x-1/2">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-16 h-16"
                >
                  <Image
                    src="/images/yhabiaunavez.jpg"
                    alt="Había una vez Logo"
                    fill
                    className="object-contain rounded-full"
                  />
                </motion.div>
              </div>
            </Link>

            {/* Right section - Cart */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 hover:bg-accent"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline text-sm font-medium">
                  Mi Carrito
                </span>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pb-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-full bg-secondary border-transparent"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile navigation menu expanded */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border overflow-hidden"
            >
              <nav className="flex flex-col py-4 px-4 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-4 text-foreground hover:bg-accent rounded-xl transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Mobile Extra Links */}
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-foreground hover:bg-accent rounded-xl transition-colors font-medium"
                >
                  Crear Cuenta
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 px-4 text-foreground hover:bg-accent rounded-xl transition-colors font-medium"
                >
                  Iniciar Sesión
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <CartDrawer />
    </>
  );
}
