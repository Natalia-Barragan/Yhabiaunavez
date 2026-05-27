"use client";

import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { ProductCard } from "./product-card";
const ProductModal = lazy(() => import("./product-modal"));
import type { Product } from "@/lib/store";
import { useAdminStore } from "@/lib/admin-store";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Baby, CloudRain, Gift, Package } from "lucide-react";

const priceRanges = [
  { label: "Todos", min: 0, max: Infinity },
  { label: "$7.000 - $10.000", min: 7000, max: 10000 },
  { label: "$10.000 - $15.000", min: 10000, max: 15000 },
  { label: "Más de $15.000", min: 15000, max: Infinity },
];

export function ProductGrid() {
  const { products, categories, fetchProducts, fetchCategories } = useAdminStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { 
    selectedCategory, setSelectedCategory, 
    searchQuery, setSearchQuery,
    selectedPriceRangeLabel, setSelectedPriceRangeLabel,
    clearAllFilters 
  } = useCartStore();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // AJUSTE 1: El backend devuelve 'categoryId', pero el filtro busca 'category'.
      // Comparamos el nombre de la categoría si el backend trae el objeto completo.
      const productCategoryName = product.category || "Sin Categoría";

      const normalizeString = (str: string) => 
        str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

      const categoryMatch =
        selectedCategory === "Todos" || 
        normalizeString(productCategoryName) === normalizeString(selectedCategory);

      const searchMatch = 
        !searchQuery || 
        normalizeString(product.name).includes(normalizeString(searchQuery));

      const productPrice =
        typeof product.price === "string" ? parseFloat(product.price) : product.price;
      
      const activeRange = priceRanges.find(r => r.label === selectedPriceRangeLabel) || priceRanges[0];
      const priceMatch =
        activeRange.label === "Todos" ||
        (productPrice >= activeRange.min && productPrice <= activeRange.max);

      return categoryMatch && priceMatch && searchMatch;
    });
  }, [products, selectedCategory, selectedPriceRangeLabel, searchQuery]);

  const hasActiveFilters =
    selectedCategory !== "Todos" || selectedPriceRangeLabel !== "Todos" || searchQuery !== "";

  const clearFilters = () => {
    clearAllFilters();
  };

  return (
    <>
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <h2 className="section-title">¿Qué estás buscando?</h2>
          <div className="categories-grid">
            <button onClick={() => { setSelectedCategory("Ropa"); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }} className="category-card" style={{display: 'block', width: '100%', textAlign: 'center', border: 'none', background: 'var(--color-background)', cursor: 'pointer'}}>
              <div className="category-icon"><Baby size={40} /></div>
              <h3>Ropita para crecer</h3>
              <p className="text-light" style={{ color: 'var(--color-text-light)' }}>0 a 8 años</p>
            </button>
            <button onClick={() => { setSelectedCategory("Juguetes"); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }} className="category-card" style={{display: 'block', width: '100%', textAlign: 'center', border: 'none', background: 'var(--color-background)', cursor: 'pointer'}}>
              <div className="category-icon"><CloudRain size={40} /></div>
              <h3>Compañeros de aventuras</h3>
              <p className="text-light" style={{ color: 'var(--color-text-light)' }}>Juguetes</p>
            </button>
            <button onClick={() => { setSelectedCategory("Accesorios"); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }} className="category-card" style={{display: 'block', width: '100%', textAlign: 'center', border: 'none', background: 'var(--color-background)', cursor: 'pointer'}}>
              <div className="category-icon"><Gift size={40} /></div>
              <h3>Cositas que acompañan</h3>
              <p className="text-light" style={{ color: 'var(--color-text-light)' }}>Accesorios</p>
            </button>
            <button onClick={() => { setSelectedCategory("Kits de regalo"); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }} className="category-card" style={{display: 'block', width: '100%', textAlign: 'center', border: 'none', background: 'var(--color-background)', cursor: 'pointer'}}>
              <div className="category-icon"><Package size={40} /></div>
              <h3>Primeros capitulos</h3>
              <p className="text-light" style={{ color: 'var(--color-text-light)' }}>Regalos recien nacidos.</p>
            </button>
          </div>
        </div>
      </section>

      <section id="catalogo" className="py-8 pb-16 md:py-12 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">Magia Recién Llegada</h2>

        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-2 border-2 rounded-full border-primary text-primary bg-transparent hover:bg-primary hover:!text-white transition-all font-medium group"
          >
            <SlidersHorizontal size={18} />
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            
            {hasActiveFilters && (
              <span className="bg-primary-foreground text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                {(selectedCategory !== "Todos" ? 1 : 0) +
                  (selectedPriceRangeLabel !== "Todos" ? 1 : 0) +
                  (searchQuery !== "" ? 1 : 0)}
              </span>
            )}
          </button>
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
              <div className="flex items-center justify-end mb-6">
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

              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h4 className="text-sm font-semibold text-foreground mb-4 text-left uppercase tracking-wider">
                    Categoría
                  </h4>
                  <div className="flex flex-wrap justify-start gap-2">
                    <button
                      onClick={() => setSelectedCategory("Todos")}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedCategory === "Todos"
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-accent border border-border"
                        }`}
                    >
                      Todos
                    </button>
                    {categories.map((cat: any) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedCategory === cat.name
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-accent border border-border"
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-4 text-left uppercase tracking-wider">
                    Precio
                  </h4>
                  <div className="flex flex-wrap justify-start gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPriceRangeLabel(range.label)}
                        className={`px-4 py-2 rounded-xl text-sm transition-all ${selectedPriceRangeLabel === range.label
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
            </div>
          </motion.aside>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-foreground/90 text-lg mb-4">
                  No se encontraron productos con los filtros seleccionados.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-full bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Ver todos los productos
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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

      <Suspense fallback={null}>
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </Suspense>
    </section>
    </>
  );
}