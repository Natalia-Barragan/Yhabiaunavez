"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

export function ProductCard({ product, onSelect, index }: ProductCardProps) {
  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const rawStock = Number(product.stock || 0);
  const variantsStock = product.variants
    ? product.variants.reduce((total, variant) => total + variant.stock, 0)
    : 0;

  const totalStock = product.variants ? variantsStock : rawStock;
  const isOutOfStock = totalStock === 0;

  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0]
    : (product.image || "/placeholder.svg");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50">

        {/* Foto menos alta: cambiamos aspect-square por aspect-[4/3] */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
              <span className="bg-card px-3 py-1.5 rounded-full text-xs font-medium text-foreground">
                Agotado
              </span>
            </div>
          )}
        </div>

        {/* Reducimos padding y márgenes */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-medium text-primary tracking-wider uppercase">
              {product.category?.name || "General"}
            </span>
          </div>

          <h3 className="text-sm font-medium text-foreground mb-1 line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {product.description || "Sin descripción"}
          </p>

          <p className="text-lg font-semibold text-foreground mb-3">
            {formatPrice(product.price)}
          </p>

          {/* Botón un poco más compacto */}
          <Button
            variant="outline"
            className="w-full h-9 text-sm rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
            onClick={() => onSelect(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Sin Stock" : "Comprar"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}