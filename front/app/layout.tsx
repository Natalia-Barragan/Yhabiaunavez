import React from "react"
import type { Metadata, Viewport } from "next";
import { Quicksand, Fredoka } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const _quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
});

const _fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Yhabiaunavez | Ropa Infantil",
  description:
    "Ropa y juguetes para bebé. Para jugar, descubrir y moverse cómodxs.",
  keywords: ["ropa infantil", "bebé", "niños", "boutique", "moda infantil", "juguetes", "ajuar", "accesorios"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${_quicksand.variable} ${_fredoka.variable} antialiased`} style={{ fontFamily: 'var(--font-body)' }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
