"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Order } from "@/lib/store";
import { formatWhatsApp } from "@/lib/utils";

const ORDER_STATUSES = [
  { value: "pendiente", label: "Pendiente", color: "border-orange-400 text-orange-500 bg-orange-500/10" },
  { value: "pagado", label: "Pagado", color: "border-blue-400 text-blue-500 bg-blue-500/10" },
  { value: "enviado", label: "Enviado", color: "border-green-500 text-green-600 bg-green-500/10" },
  { value: "cancelado", label: "Cancelado", color: "border-destructive text-destructive bg-destructive/10" },
];

function getStatusStyle(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status) ?? ORDER_STATUSES[0];
}

function formatPrice(price: number | string) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(Number(price));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderRow({ order }: { order: Order }) {
  const { updateOrderStatus } = useAdminStore();
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const statusStyle = getStatusStyle(order.status);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    await updateOrderStatus(order.id, newStatus);
    setUpdating(false);
  };

  return (
    <>
      <TableRow className="border-border/50">
        {/* ID + expand toggle */}
        <TableCell
          className="font-mono text-xs text-muted-foreground cursor-pointer select-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="flex items-center gap-1">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            #{order.id.slice(0, 8).toUpperCase()}
          </span>
        </TableCell>

        <TableCell>
          <div>
            <p className="font-medium text-foreground">
              {order.customer?.name || "—"}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.customer?.email || ""}
            </p>
          </div>
        </TableCell>

        <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
          {formatDate(order.createdAt)}
        </TableCell>

        <TableCell className="text-right font-semibold">
          {formatPrice(order.total)}
        </TableCell>

        {/* Status selector */}
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={updating}
          >
            <SelectTrigger className="w-36 h-8 text-xs border-0 p-0 focus:ring-0 shadow-none bg-transparent">
              <SelectValue>
                <Badge variant="outline" className={`text-xs font-medium ${statusStyle.color}`}>
                  {updating ? "..." : statusStyle.label}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value} className="text-sm">
                  <Badge variant="outline" className={`text-xs ${s.color}`}>
                    {s.label}
                  </Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="bg-muted/20 hover:bg-muted/20">
          <TableCell colSpan={5} className="py-6 px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Items Section */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                  Ítems del pedido
                </p>
                <div className="space-y-3">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm py-1.5 border-b border-border/30 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {item.product?.name || "Producto eliminado"}
                        </span>
                        {item.size && (
                          <Badge variant="secondary" className="text-xs">
                            Talle: {item.size}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>x{item.quantity}</span>
                        <span className="font-medium text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Section */}
              <div className="bg-card/50 rounded-2xl p-4 border border-border/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-3">
                  Datos de Envío
                </p>
                {order.customer ? (
                  <div className="space-y-3 text-sm text-foreground">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {order.customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                        <p className="text-xs text-muted-foreground">{order.customer.phone}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <div className="flex items-start gap-2">
                        <div className="text-primary mt-1">📍</div>
                        <div>
                          <p className="font-medium">{order.customer.address}</p>
                          <p className="text-muted-foreground text-xs">
                            {order.customer.city}, {order.customer.state} ({order.customer.zipCode})
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {order.customer.country}
                          </p>
                        </div>
                      </div>
                    </div>

                    {order.customer.notes && (
                      <div className="pt-3 border-t border-border/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1 italic px-2 py-1 bg-amber-500/5 rounded border border-amber-500/10">
                          Nota: {order.customer.notes}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        asChild
                        size="sm"
                        className="w-full rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold gap-2 shadow-sm"
                      >
                        <a
                          href={`https://wa.me/${formatWhatsApp(order.customer.phone)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle size={16} />
                          Enviar WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Sin datos de cliente asociados.
                  </p>
                )}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function OrdersPage() {
  const { orders, fetchOrders, isLoading } = useAdminStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-foreground">Pedidos</h1>
        <p className="text-muted-foreground mt-1">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} registrado
          {orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Historial de Pedidos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-16 text-muted-foreground">
                Cargando pedidos...
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart
                  size={48}
                  className="mx-auto text-muted-foreground/30 mb-4"
                />
                <p className="text-muted-foreground">
                  Aún no hay pedidos registrados
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Los pedidos aparecerán aquí cuando alguien compre
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-xs uppercase">ID</TableHead>
                    <TableHead className="text-xs uppercase">Cliente</TableHead>
                    <TableHead className="hidden sm:table-cell text-xs uppercase">
                      Fecha
                    </TableHead>
                    <TableHead className="text-right text-xs uppercase">
                      Total
                    </TableHead>
                    <TableHead className="text-xs uppercase">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <OrderRow key={order.id} order={order} />
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
