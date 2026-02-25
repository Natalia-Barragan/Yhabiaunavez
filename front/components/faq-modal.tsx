"use client";

import * as React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, ShoppingBag, CreditCard, Ruler, Truck } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
    {
        id: "item-1",
        question: "¿Cómo es el proceso de compra?",
        answer: "¡Es súper fácil y directo! Elegís los productos y talles que te gusten, los agregás al carrito y completás tus datos. Al finalizar, el sistema te va a redirigir a mi WhatsApp con el detalle de tu pedido. Ahí charlamos, te confirmo el stock disponible, ultimamos detalles y recién ahí avanzamos con el pago.",
        icon: ShoppingBag
    },
    {
        id: "item-2",
        question: "¿Tengo que crear una cuenta o registrarme?",
        answer: "¡No hace falta! Podés hacer tu pedido sin necesidad de inventar contraseñas. Al momento de finalizar la compra te vamos a pedir los datos básicos para el envío y el contacto. El sistema los guarda de forma segura para que tu próxima visita sea mucho más ágil, pero sin las vueltas de iniciar sesión.",
        icon: HelpCircle
    },
    {
        id: "item-3",
        question: "¿Cómo y cuándo se paga el pedido?",
        answer: "El pago se realiza recién después de que nos comuniquemos por WhatsApp. Una vez que revisamos juntas tu pedido y te confirmo que tengo todo lo que elegiste, te envío por ese mismo medio el link de pago o los datos para hacer una transferencia. ¡No pagás nada hasta que no hablemos!",
        icon: CreditCard
    },
    {
        id: "item-4",
        question: "Tengo dudas con los talles o los colores, ¿qué hago?",
        answer: "¡Tranqui! Armá tu carrito igual con la opción que creas correcta. Como el paso final es hablar conmigo por WhatsApp antes de abonar, ahí mismo me podés consultar todo. Te asesoro con las medidas, te muestro combinaciones y nos aseguramos de que te lleves exactamente lo que buscás para los peques.",
        icon: Ruler
    },
    {
        id: "item-5",
        question: "¿Hacen envíos?",
        answer: "¡Sí! Tenemos varias opciones dependiendo de dónde estés:\n\n• Si sos de la ciudad: Te lo podemos mandar con una moto (tipo PedidosYa).\n• Si sos de otra ciudad: Hacemos envíos por correo.\n• Retiro en persona: Podés pasar por nuestro showroom.\n\nAl hablar por WhatsApp elegimos juntas la opción que te quede más cómoda y te paso los costos exactos.",
        icon: Truck
    }
];

export function FaqModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                    Preguntas Frecuentes
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1100px] w-[95vw] max-h-[90vh] p-0 border-none rounded-3xl overflow-hidden focus:outline-none focus-visible:outline-none">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    {/* Left Side: Visual/Branding */}
                    <div className="hidden md:flex bg-secondary/30 relative items-center justify-center p-12 lg:p-16 border-r border-secondary/20 md:w-[40%]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative z-10 text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mx-auto mb-6">
                                <HelpCircle className="text-primary" size={48} />
                            </div>
                            <h3 className="text-2xl font-serif text-primary mb-2">Ayuda & Soporte</h3>
                            <p className="text-primary/60 text-sm max-w-[200px] mx-auto leading-relaxed">
                                Estamos aquí para acompañarte en cada paso de tu compra.
                            </p>
                        </motion.div>
                        {/* Decorative shapes */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 rounded-full blur-3xl opacity-50" />
                        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-50" />
                    </div>

                    {/* Right Side: FAQ Content */}
                    <div className="p-8 md:p-12 lg:p-16 bg-white flex flex-col justify-start flex-1 overflow-y-auto">
                        <DialogHeader className="mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="h-0.5 w-8 bg-primary/30 rounded-full" />
                                    <span className="text-xs uppercase tracking-widest text-primary/60 font-medium">Preguntas Frecuentes</span>
                                </div>
                                <DialogTitle className="text-4xl font-serif text-primary leading-tight">
                                    Tus dudas, resueltas
                                </DialogTitle>
                            </motion.div>
                        </DialogHeader>

                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {faqs.map((faq) => (
                                <AccordionItem
                                    key={faq.id}
                                    value={faq.id}
                                    className="border border-secondary/40 rounded-2xl overflow-hidden px-4 transition-all data-[state=open]:border-primary/20 data-[state=open]:bg-secondary/5"
                                >
                                    <AccordionTrigger className="hover:no-underline py-5 group text-primary/80 hover:text-primary transition-colors">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-primary/60 group-data-[state=open]:bg-primary group-data-[state=open]:text-white transition-all duration-300">
                                                <faq.icon size={16} />
                                            </div>
                                            <span className="text-base font-medium leading-tight">
                                                {faq.question}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground/90 leading-relaxed pl-12 pr-4 pb-6 whitespace-pre-line text-sm lg:text-base">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-10 p-6 bg-secondary/10 rounded-2xl border border-dashed border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4"
                        >
                            <div className="text-center sm:text-left">
                                <p className="text-primary font-semibold text-sm">¿Todavía tenés dudas?</p>
                                <p className="text-xs text-muted-foreground">Escribime y charlamos por WhatsApp.</p>
                            </div>
                            <a
                                href="https://wa.me/542215547170"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all hover:shadow-lg active:scale-95"
                            >
                                Hablar con Chavi
                            </a>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
