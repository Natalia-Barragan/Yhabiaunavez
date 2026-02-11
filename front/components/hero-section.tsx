"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary-foreground leading-tight mb-6 text-balance">
              Ropa y juguetes para bebé.{" "} <br />
              <span className="text-primary-foreground/90">Para jugar, descubrir y moverse cómodxs.</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 leading-relaxed mb-8 max-w-lg mx-auto text-pretty">
              Diseños únicos - precios reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#catalogo">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-8 h-12 text-base font-semibold group"
                >
                  Ver Colección
                  <ArrowRight
                    size={18}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>
              <Link href="#contacto">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-12 text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Contactanos
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Visual element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Decorative circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full bg-primary-foreground/10 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full bg-primary-foreground/20" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-primary-foreground/30 flex items-center justify-center">
                  <span className="text-6xl font-serif text-primary">
                    H
                  </span>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-10 right-10 bg-card shadow-lg rounded-2xl px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  100% Algodón
                </span>
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-20 left-0 bg-card shadow-lg rounded-2xl px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">
                  Hecho con Amor
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
