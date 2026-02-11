"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-foreground">Pedidos</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona los pedidos de tus clientes
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Próximamente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <ShoppingCart
                size={48}
                className="mx-auto text-muted-foreground/30 mb-4"
              />
              <p className="text-muted-foreground mb-2">
                La gestión de pedidos estará disponible pronto
              </p>
              <p className="text-sm text-muted-foreground/70">
                Por ahora, los pedidos se gestionan a través de WhatsApp
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
