import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWhatsApp(phone: string): string {
  // Eliminar todo lo que no sea número
  let clean = phone.replace(/\D/g, "");

  // Eliminar el 0 inicial si existe
  if (clean.startsWith("0")) {
    clean = clean.substring(1);
  }

  // Si ya empieza con 54, no agregamos nada más
  if (clean.startsWith("54")) {
    return clean;
  }

  // De lo contrario, agregamos el prefijo 54 (Argentina)
  return `54${clean}`;
}
