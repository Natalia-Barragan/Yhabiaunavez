"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer id="contacto" className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <Image
                  src="/images/yhabiaunavez.jpg"
                  alt="Logo"
                  fill
                  className="object-contain scale-150"
                />
              </div>
              <span className="font-serif text-xl">Yhabiaunavez</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              Vistiendo sueños y creando recuerdos para los más pequeños desde
              2017.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/yhabiaunavez"
                className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="ml-20">
            <h3 className="font-semibold text-lg mb-4">Enlaces</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="#catalogo"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="ml-20">
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Phone size={18} />
                <span>+54 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/80">
                <Mail size={18} />
                <span>hola@habiaunavez.com</span>
              </li>
              <li className="flex items-start gap-3 text-primary-foreground/80">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
          {/* <div>
            <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-primary-foreground/80 mb-4 text-sm">
              Suscribite para recibir novedades y ofertas exclusivas.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="tu@email.com"
                className="rounded-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
              />
              <Button
                type="submit"
                variant="secondary"
                className="rounded-full px-6"
              >
                Enviar
              </Button>
            </form>
          </div> */}
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>&copy; 2026 Yhabiaunavez. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
