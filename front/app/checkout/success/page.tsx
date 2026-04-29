"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

interface OrderDetails {
  orderId: string;
  total: number;
  customer: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
  whatsappUrl?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const payment_id = searchParams.get("payment_id");
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  useEffect(() => {
    const orderData = sessionStorage.getItem("lastOrder");
    if (orderData) {
      setOrder(JSON.parse(orderData));
    }

    const verify = async () => {
      if (payment_id) {
        setVerifying(true);
        try {
          const res = await api.mercadopago.verifyPayment(payment_id);
          if (res && res.success) {
            setPaymentStatus(res.status);
          }
        } catch (e) {
          console.error("Error al verificar pago", e);
        }
        setVerifying(false);
      }
    };
    verify();
  }, [payment_id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        <div className="bg-card rounded-3xl p-8 md:p-12 border border-border/50 text-center">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={40} className="text-primary" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-serif text-foreground mb-3">
              ¡Gracias por tu pedido!
            </h1>
            {order && (
              <p className="text-muted-foreground mb-2">
                Pedido #{order.orderId}
              </p>
            )}
            
            {verifying ? (
              <div className="flex items-center justify-center text-muted-foreground mb-8">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Verificando estado del pago...</span>
              </div>
            ) : paymentStatus === 'pagado' ? (
              <p className="text-[#25D366] font-medium leading-relaxed mb-8">
                ¡Tu pago fue procesado exitosamente! Nos pondremos en contacto por WhatsApp para coordinar el envío.
              </p>
            ) : (
              <p className="text-muted-foreground leading-relaxed mb-8">
                Hemos recibido tu pedido. Si pagaste a través de Mercado Pago, el estado se actualizará en breve. Contáctanos por WhatsApp para coordinar el envío o despejar dudas.
              </p>
            )}
          </motion.div>

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-secondary/50 rounded-2xl p-6 mb-8 text-left"
            >
              <h2 className="font-semibold text-foreground mb-4">
                Resumen del Pedido
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente</span>
                  <span className="text-foreground">
                    {order.customer.nombre} {order.customer.apellido}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="text-foreground">{order.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">WhatsApp</span>
                  <span className="text-foreground">{order.customer.telefono}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border mt-3">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-semibold text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            {/* Next steps */}
            <div className="grid gap-3 text-left mb-8">
              <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
                <MessageCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Contáctanos por WhatsApp
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Para coordinar detalles del envío
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-xl">
                <Package size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Preparamos tu pedido
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Una vez acreditado el pago, preparamos todo
                  </p>
                </div>
              </div>
            </div>

            {order && (
              <a href={`https://wa.me/542215043666?text=${encodeURIComponent(`Hola! Acabo de completar el pedido ${order.orderId}. Mi nombre es ${order.customer.nombre} ${order.customer.apellido}.`)}`} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="w-full rounded-full h-12 font-semibold mb-4 bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                  <MessageCircle size={20} className="mr-2" />
                  Escribir al WhatsApp
                </Button>
              </a>
            )}

            <Link href="/">
              <Button className="w-full rounded-full h-12 font-semibold group">
                Volver al Inicio
                <ArrowRight
                  size={18}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Logo */}
        <div className="mt-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-serif text-primary-foreground">H</span>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Yhabiaunavez
            </span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>}>
      <SuccessContent />
    </Suspense>
  );
}
