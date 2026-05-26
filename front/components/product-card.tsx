"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
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
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="product-card"
      onClick={() => onSelect(product)}
      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
    >
      {isOutOfStock && <div className="product-badge" style={{ backgroundColor: 'var(--color-secondary)' }}>Agotado</div>}
      
      <div style={{ position: 'relative', width: '100%', height: '300px' }}>
        <Image 
          src={imageUrl} 
          alt={product.name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="product-image object-cover" 
        />
      </div>
      
      <div className="product-info" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 className="product-title line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="line-clamp-2 text-sm mb-3" style={{ color: 'var(--color-text-light)' }}>
            {product.description}
          </p>
        )}
        <div style={{ marginTop: 'auto' }}>
          <p className="product-price" style={{ textAlign: 'right', marginBottom: '4px' }}>{formatPrice(product.price)}</p>
          <p style={{ textAlign: 'right', fontSize: '0.85rem', color: '#FF9900', marginBottom: '16px', fontWeight: 600 }}>
            o 3 cuotas de {formatPrice((Number(product.price) * 1.2943) / 3)}
          </p>
          <button 
            className="btn-add-cart" 
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            disabled={isOutOfStock}
            style={isOutOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <ShoppingBag size={18} />
            {isOutOfStock ? "Sin Stock" : "Agregar"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}