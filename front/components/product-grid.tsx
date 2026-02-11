"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "./product-card";
import { ProductModal } from "./product-modal";
import type { Product } from "@/lib/store";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

const priceRanges = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "$7.000 - $10.000", min: 7000, max: 10000 },
  { label: "$10.000 - $15.000", min: 10000, max: 15000 },
  { label: "Más de $15.000", min: 15000, max: Infinity },
];

export function ProductGrid() {
  const { products, categories, fetchProducts, fetchCategories } = useAdminStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // AJUSTE 1: El backend devuelve 'categoryId', pero el filtro busca 'category'.
      // Comparamos el nombre de la categoría si el backend trae el objeto completo.
      const productCategoryName = product.category || "General";

      const categoryMatch =
        selectedCategory === "Todos" || productCategoryName === selectedCategory;

      const productPrice =
        typeof product.price === "string" ? parseFloat(product.price) : product.price;

      const priceMatch =
        productPrice >= selectedPriceRange.min &&
        productPrice <= selectedPriceRange.max;

      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategory, selectedPriceRange]);

  const hasActiveFilters =
    selectedCategory !== "Todos" || selectedPriceRange.label !== "Todos";

  const clearFilters = () => {
    setSelectedCategory("Todos");
    setSelectedPriceRange(priceRanges[0]);
  };

  return (
    <section id="catalogo" className="pt-8 pb-16 md:pt-12 md:pb-24 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-8xl md:text-8xl font-handwriting text-primary-foreground mb-6"
          >
            Yhabíaunavez
          </motion.h2>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-primary-foreground font-medium tracking-widest text-sm mb-4 uppercase"
          >
            Ropa y juguetes para bebé. Para jugar, descubrir y moverse cómodxs
          </motion.span>
        </div>

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full rounded-full justify-center gap-2 border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary"
          >
            <SlidersHorizontal size={18} />
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            {hasActiveFilters && (
              <span className="bg-primary-foreground text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {(selectedCategory !== "Todos" ? 1 : 0) +
                  (selectedPriceRange.label !== "Todos" ? 1 : 0)}
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          <motion.aside
            initial={false}
            animate={{
              height: showFilters ? "auto" : 0,
              opacity: showFilters ? 1 : 0,
            }}
            className={`w-full overflow-hidden ${showFilters ? "mb-6" : ""}`}
          >
            <div className="bg-card rounded-3xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Filtros</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <X size={14} />
                    Limpiar
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Categoría
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedCategory === cat
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-accent border border-border"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Precio
                </h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedPriceRange.label === range.label
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-accent border border-border"
                        }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-primary-foreground/90 text-lg mb-4">
                  No se encontraron productos con los filtros seleccionados.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-full bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Ver todos los productos
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}