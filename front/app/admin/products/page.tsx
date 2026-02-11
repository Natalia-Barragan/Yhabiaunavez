"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Pencil, Trash2, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";

export default function ProductsPage() {
  const { products, deleteProduct } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalStock = (variants: { size: string; stock: number }[]) => {
    return variants.reduce((acc, v) => acc + v.stock, 0);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Productos</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tu catálogo de productos
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button className="rounded-full gap-2">
              <Plus size={18} />
              Nuevo Producto
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>

        {/* Products table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 overflow-hidden"
        >
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No se encontraron productos"
                  : "No hay productos en el catálogo"}
              </p>
              {!searchQuery && (
                <Link href="/admin/products/new">
                  <Button className="mt-4 rounded-full">
                    Agregar primer producto
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="w-20">Imagen</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="hidden md:table-cell">Categoría</TableHead>
                    <TableHead className="text-right">Precio</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">
                      Stock
                    </TableHead>
                    <TableHead className="text-right w-28">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const totalStock = getTotalStock(product.variants);
                    const isLowStock = totalStock > 0 && totalStock <= 5;
                    const isOutOfStock = totalStock === 0;

                    return (
                      <TableRow key={product.id} className="border-border/50">
                        <TableCell>
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted">
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {product.name}
                            </p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {product.category}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {product.category}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(product.price)}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              isOutOfStock
                                ? "bg-destructive/10 text-destructive"
                                : isLowStock
                                ? "bg-orange-500/10 text-orange-600"
                                : "bg-green-500/10 text-green-600"
                            }`}
                          >
                            {totalStock} uds
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg"
                              >
                                <Pencil size={16} />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteId(product.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>

        {/* Delete confirmation dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El producto será eliminado
                permanentemente del catálogo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="rounded-full bg-destructive hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Suspense>
  );
}
