"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

import { api } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    provincia: "",
    codigoPostal: "",
    pais: "",
    notas: "",
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Crear o buscar cliente (el backend maneja la lógica de upsert)
      const customer = await api.customers.create({
        name: `${formData.nombre} ${formData.apellido}`,
        email: formData.email,
        phone: formData.telefono,
        address: formData.direccion,
        city: formData.ciudad,
        state: formData.provincia,
        zipCode: formData.codigoPostal,
        country: formData.pais,
        notes: formData.notas,
      });

      if (!customer?.id) {
        throw new Error("No se pudo obtener el ID del cliente");
      }

      // 2. Crear la orden (esto descuenta stock en el backend)
      const orderData = {
        customerId: customer.id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
        }))
      };

      const savedOrder = await api.orders.create(orderData);

      // 3. Generar mensaje de WhatsApp
      const businessPhone = "542215043666";
      const orderNumber = savedOrder.id.slice(-6).toUpperCase();

      let message = `¡Hola! Acabo de realizar un pedido en la tienda online.\n\n`;
      message += `*Pedido #HUV-${orderNumber}*\n`;
      message += `*Cliente:* ${formData.nombre} ${formData.apellido}\n`;
      message += `*Email:* ${formData.email}\n`;
      message += `*Dirección:* ${formData.direccion}, ${formData.ciudad} (${formData.codigoPostal}), ${formData.provincia}\n\n`;
      message += `*Productos:*\n`;

      items.forEach(item => {
        message += `- ${item.product.name} (Talle: ${item.size}) x ${item.quantity}: ${formatPrice(Number(item.product.price) * item.quantity)}\n`;
      });

      message += `\n*TOTAL: ${formatPrice(getTotalPrice())}*\n\n`;
      if (formData.notas) message += `*Notas:* ${formData.notas}\n\n`;
      message += `Quedo a la espera para coordinar el pago y el envío. ¡Gracias!`;

      const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;

      // 4. Guardar detalles para la página de éxito
      const orderDetails = {
        items: items,
        total: getTotalPrice(),
        customer: formData,
        orderId: `HUV-${orderNumber}`,
        whatsappUrl: whatsappUrl
      };
      sessionStorage.setItem("lastOrder", JSON.stringify(orderDetails));

      // 5. Limpiar carrito y redirigir
      clearCart();

      // Abrir WhatsApp en una nueva pestaña
      window.open(whatsappUrl, '_blank');

      router.push("/checkout/success");
    } catch (error: any) {
      console.error("Error al procesar el pedido:", error);
      alert(error.message || "Hubo un error al procesar tu pedido. Por favor intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-serif text-foreground mb-3">
            Tu carrito está vacío
          </h1>
          <p className="text-muted-foreground mb-6">
            Explora nuestra colección y encuentra algo especial para los más
            pequeños.
          </p>
          <Link href="/#catalogo">
            <Button className="rounded-full px-8">Ver Catálogo</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Volver</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-lg font-serif text-primary-foreground">H</span>
            </div>
          </Link>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-serif text-foreground text-center mb-12"
        >
          Finalizar Pedido
        </motion.h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Datos de Contacto
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">WhatsApp</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Dirección de Envío
                </h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                      placeholder="Calle y número"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                        placeholder="1234"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provincia">Provincia</Label>
                      <Input
                        id="provincia"
                        name="provincia"
                        value={formData.provincia}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                        placeholder="Provincia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pais">País</Label>
                      <Input
                        id="pais"
                        name="pais"
                        value={formData.pais}
                        onChange={handleInputChange}
                        required
                        className="rounded-xl"
                        placeholder="País"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notas">Notas adicionales (opcional)</Label>
                    <Textarea
                      id="notas"
                      name="notas"
                      value={formData.notas}
                      onChange={handleInputChange}
                      className="rounded-xl resize-none"
                      rows={3}
                      placeholder="Instrucciones especiales para el envío..."
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full rounded-full h-14 text-base font-semibold bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Procesando..."
                  : (
                    <span className="flex items-center justify-center">
                      Finalizar Compra por WhatsApp
                      <MessageCircle size={20} className="ml-2" />
                    </span>
                  )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Al finalizar, te enviaremos un mensaje por WhatsApp para coordinar
                el pago y envío.
              </p>
            </form>
          </motion.div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-card rounded-3xl p-6 md:p-8 border border-border/50 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 p-4 bg-secondary/50 rounded-2xl"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={(item.product.images && item.product.images[0]) || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Talle: {item.size}
                      </p>
                      <p className="text-primary font-semibold text-sm mt-1">
                        {formatPrice(Number(item.product.price) * item.quantity)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="p-1 hover:bg-accent rounded-full transition-colors"
                      >
                        <Trash2 size={14} className="text-muted-foreground" />
                      </button>
                      <div className="flex items-center gap-1 bg-card rounded-full px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="p-1 hover:bg-accent rounded-full transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-medium w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="p-1 hover:bg-accent rounded-full transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-foreground">A coordinar</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
