"use client";

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="text-xl font-semibold text-foreground">Mi Carrito</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={64} className="text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-lg mb-2">
                    Tu carrito está vacío
                  </p>
                  <p className="text-muted-foreground/70 text-sm mb-6">
                    Explora nuestra colección y encuentra algo especial
                  </p>
                  <Button onClick={() => setCartOpen(false)} className="rounded-full">
                    Ver Catálogo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 p-4 bg-secondary/50 rounded-2xl"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Talle: {item.size}
                        </p>
                        <p className="text-primary font-semibold mt-1">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="p-1 hover:bg-accent rounded-full transition-colors"
                        >
                          <X size={16} className="text-muted-foreground" />
                        </button>
                        <div className="flex items-center gap-2 bg-card rounded-full px-2 py-1">
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
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">
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
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-semibold text-foreground">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <Link href="/checkout" onClick={() => setCartOpen(false)}>
                  <Button className="w-full rounded-full h-12 text-base font-semibold">
                    Finalizar Compra
                  </Button>
                </Link>
                <p className="text-xs text-center text-muted-foreground">
                  Envío y pago a coordinar por WhatsApp
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
