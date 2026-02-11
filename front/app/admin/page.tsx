"use client";

import { useAdminStore } from "@/lib/admin-store";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const { products, fetchProducts } = useAdminStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (acc, p) => acc + p.variants.reduce((a, v) => a + v.stock, 0),
    0
  );
  const totalValue = products.reduce(
    (acc, p) =>
      acc + p.price * p.variants.reduce((a, v) => a + v.stock, 0),
    0
  );
  const lowStockProducts = products.filter((p) =>
    p.variants.some((v) => v.stock > 0 && v.stock <= 2)
  ).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const stats = [
    {
      title: "Productos",
      value: totalProducts,
      icon: Package,
      description: "Total en catálogo",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Stock Total",
      value: totalStock,
      icon: ShoppingCart,
      description: "Unidades disponibles",
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Valor Inventario",
      value: formatPrice(totalValue),
      icon: DollarSign,
      description: "Valor total del stock",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Stock Bajo",
      value: lowStockProducts,
      icon: TrendingUp,
      description: "Productos con pocas unidades",
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido al panel de administración
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors group"
              >
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Agregar Producto
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Crear un nuevo producto en el catálogo
                  </p>
                </div>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 p-4 bg-secondary/50 hover:bg-secondary rounded-xl transition-colors"
              >
                <div className="p-2 bg-secondary rounded-lg text-foreground">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="font-medium text-foreground">Gestionar Stock</p>
                  <p className="text-sm text-muted-foreground">
                    Actualizar inventario de productos
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Últimos Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.slice(0, 4).map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}`}
                    className="flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/50 rounded-xl transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
