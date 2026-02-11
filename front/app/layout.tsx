import React from "react"
import type { Metadata, Viewport } from "next";
import { Quicksand, Playfair_Display, Pacifico } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

const _playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const _pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
});

export const metadata: Metadata = {
  title: "Había una Vez | Ropa Infantil Premium",
  description:
    "Boutique de ropa infantil con diseños únicos y materiales de calidad para los más pequeños del hogar.",
  generator: "v0.app",
  keywords: ["ropa infantil", "bebé", "niños", "boutique", "moda infantil"],
};

export const viewport: Viewport = {
  themeColor: "#2E8B7E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased bg-background text-foreground ${_pacifico.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
