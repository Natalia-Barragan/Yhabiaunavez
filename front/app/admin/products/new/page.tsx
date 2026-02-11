"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminStore, categories, defaultSizes } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, ImagePlus } from "lucide-react";
import { motion } from "framer-motion";

interface VariantInput {
  size: string;
  stock: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    images: ["/images/product-1.jpg"],
  });

  const [variants, setVariants] = useState<VariantInput[]>([
    { size: "0-3m", stock: 0 },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const addVariant = () => {
    const usedSizes = variants.map((v) => v.size);
    const availableSize = defaultSizes.find((s) => !usedSizes.includes(s));
    if (availableSize) {
      setVariants([...variants, { size: availableSize, stock: 0 }]);
    }
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (
    index: number,
    field: keyof VariantInput,
    value: string | number
  ) => {
    setVariants(
      variants.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const product = {
      name: formData.name,
      price: Number.parseFloat(formData.price),
      description: formData.description,
      category: formData.category,
      images: formData.images,
      variants: variants.map((v) => ({
        size: v.size,
        stock: Number(v.stock),
      })),
    };

    addProduct(product);

    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push("/admin/products");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif text-foreground">Nuevo Producto</h1>
          <p className="text-muted-foreground mt-1">
            Agrega un nuevo producto al catálogo
          </p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic info */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Información Básica
          </h2>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del producto</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="rounded-xl"
              placeholder="Ej: Conjunto Algodón Premium"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (ARS)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="100"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="rounded-xl"
                placeholder="3400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="rounded-xl resize-none"
              rows={4}
              placeholder="Describe el producto, materiales, características..."
            />
          </div>
        </div>

        {/* Images */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Imágenes</h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {formData.images.map((img, index) => (
              <div
                key={img}
                className="relative aspect-square rounded-xl bg-muted overflow-hidden group"
              >
                <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }
                  className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 size={20} className="text-white" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
            >
              <ImagePlus size={24} />
              <span className="text-xs">Agregar</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Las imágenes se pueden agregar mediante URL o subir archivos
          </p>
        </div>

        {/* Variants */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Talles y Stock
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
              className="rounded-full gap-2 bg-transparent"
              disabled={variants.length >= defaultSizes.length}
            >
              <Plus size={16} />
              Agregar Talle
            </Button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl"
              >
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">Talle</Label>
                  <Select
                    value={variant.size}
                    onValueChange={(value) => updateVariant(index, "size", value)}
                  >
                    <SelectTrigger className="rounded-lg mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultSizes.map((size) => (
                        <SelectItem
                          key={size}
                          value={size}
                          disabled={
                            variants.some((v, i) => i !== index && v.size === size)
                          }
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    Stock (unidades)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, "stock", Number.parseInt(e.target.value) || 0)
                    }
                    className="rounded-lg mt-1"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeVariant(index)}
                  disabled={variants.length === 1}
                  className="mt-5 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={18} />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <Link href="/admin/products" className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full bg-transparent"
            >
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Crear Producto"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
