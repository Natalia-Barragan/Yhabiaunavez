"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Product, useCartStore } from "@/lib/store";
import Image from "next/image";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, setCartOpen } = useCartStore();

  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setQuantity(1);
      setAddedToCart(false);
    }
  }, [product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;

    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }

    setAddedToCart(true);
    setTimeout(() => {
      onClose();
      setCartOpen(true);
    }, 800);
  };

  const availableSizes = product?.variants?.map((v) => v.size) || [];
  const selectedVariant = product?.variants?.find((v) => v.size === selectedSize);
  const maxQuantity = selectedVariant?.stock || 1;

  if (!product) return null;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-card rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-accent transition-colors"
            >
              <X size={20} className="text-foreground" />
            </button>

            <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
              <div className="md:w-1/2 relative aspect-square md:aspect-auto flex-shrink-0">
                <Image
                  src={product.images?.[0] || "/placeholder.svg"} // Solo esto. Sin localhost.
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="md:w-1/2 p-6 md:p-8 flex flex-col md:overflow-y-auto">
                <span className="text-sm font-medium text-primary tracking-wider uppercase">
                  {product.category || "General"}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground mt-2 mb-4">
                  {product.name}
                </h2>
                <p className="text-3xl font-semibold text-primary mb-6">
                  {formatPrice(product.price)}
                </p>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">
                    Seleccionar talle
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => {
                      const variant = product.variants.find((v) => v.size === size);
                      const isOutOfStock = (variant?.stock || 0) === 0;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (!isOutOfStock) {
                              setSelectedSize(size);
                              setQuantity(1);
                            }
                          }}
                          disabled={isOutOfStock}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isSelected
                            ? "bg-primary text-primary-foreground"
                            : isOutOfStock
                              ? "bg-muted text-muted-foreground cursor-not-allowed line-through"
                              : "bg-secondary text-foreground hover:bg-accent"
                            }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedSize && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      Cantidad
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-secondary rounded-full">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-3 hover:bg-accent rounded-l-full transition-colors"
                          disabled={quantity <= 1}
                        >
                          <Minus size={18} />
                        </button>
                        <span className="px-4 font-medium min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(Math.min(maxQuantity, quantity + 1))
                          }
                          className="p-3 hover:bg-accent rounded-r-full transition-colors"
                          disabled={quantity >= maxQuantity}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {maxQuantity} disponible{maxQuantity > 1 ? "s" : ""}
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="mt-auto">
                  <Button
                    size="lg"
                    className={`w-full rounded-full h-14 text-base font-semibold transition-all ${addedToCart ? "bg-green-600 hover:bg-green-600" : ""
                      }`}
                    onClick={handleAddToCart}
                    disabled={!selectedSize || addedToCart}
                  >
                    {addedToCart ? (
                      <>
                        <Check size={20} className="mr-2" />
                        Agregado al carrito
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={20} className="mr-2" />
                        {selectedSize
                          ? `Agregar al carrito - ${formatPrice(
                            product.price * quantity
                          )}`
                          : "Selecciona un talle"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}