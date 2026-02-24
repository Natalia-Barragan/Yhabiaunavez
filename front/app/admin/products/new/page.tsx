"use client";

import React from "react"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminStore, defaultSizes } from "@/lib/admin-store";
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
import { useEffect } from "react";

interface VariantInput {
  size: string;
  stock: number;
}

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, categories, fetchCategories, sizes, fetchSizes } = useAdminStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSizes();
  }, [fetchCategories, fetchSizes]);

  // Use dynamic sizes if available, otherwise fallback to common ones
  const activeSizes = sizes.length > 0 ? sizes.map(s => s.label) : defaultSizes;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [variants, setVariants] = useState<VariantInput[]>([
    { size: "0-3m", stock: 0 },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const addVariant = () => {
    const usedSizes = variants.map((v) => v.size);
    const availableSize = activeSizes.find((s) => !usedSizes.includes(s));
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

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("description", formData.description);
      formDataToSend.append("categoryId", formData.category); // Note: frontend uses 'category' but backend expects 'categoryId' (usually UUID)


      // Stock por talle (mapeamos el array de variantes a un objeto { talle: stock })
      const stockBySize: Record<string, number> = {};
      variants.forEach(v => {
        stockBySize[v.size] = Number(v.stock);
      });
      formDataToSend.append("stockBySize", JSON.stringify(stockBySize));

      // Stock general (calculado de la suma de talles)
      const totalStock = variants.reduce((acc, v) => acc + Number(v.stock), 0);
      formDataToSend.append("stock", totalStock.toString());

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      await addProduct(formDataToSend);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error submitting product:", error);
      setIsSubmitting(false);
    }
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
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
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
            {imagePreview && (
              <div className="relative aspect-square rounded-xl bg-muted overflow-hidden group">
                <img src={imagePreview} alt="Vista previa" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Trash2 size={20} className="text-white" />
                </button>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {!imagePreview && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              >
                <ImagePlus size={24} />
                <span className="text-xs">Seleccionar Imagen</span>
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Sube una imagen representativa para el producto.
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
              disabled={variants.length >= activeSizes.length}
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
                      {activeSizes.map((size) => (
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
