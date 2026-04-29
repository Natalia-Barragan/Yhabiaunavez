"use client";

import * as React from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

const aboutImages = [
    {
        src: "/images/Foto 1.jpeg",
        alt: "Sabrina creadora de Yhabiaunavez",
    },
    {
        src: "/images/Foto 2.png",
        alt: "Productos artesanales Yhabiaunavez",
    },
    {
        src: "/images/Foto 3.jpeg",
        alt: "Letrero Yhabiaunavez",
    },
];

export function AboutUsModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-left">
                    Sobre Nosotros
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1100px] w-[95vw] max-h-[90vh] p-0 border-none rounded-3xl overflow-hidden focus:outline-none focus-visible:outline-none">
                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    {/* Carousel Section */}
                    <div className="bg-secondary/30 relative min-h-[400px] md:min-h-full flex items-center justify-center p-8 lg:p-16 md:w-[40%]">
                        <Carousel className="w-full max-w-[340px] sm:max-w-sm">
                            <CarouselContent>
                                {aboutImages.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="hidden sm:block">
                                <CarouselPrevious className="-left-12 border-primary/20 text-primary hover:bg-primary hover:text-white" />
                                <CarouselNext className="-right-12 border-primary/20 text-primary hover:bg-primary hover:text-white" />
                            </div>
                        </Carousel>
                    </div>

                    {/* Text Section */}
                    <div className="p-8 md:p-12 lg:p-20 bg-white flex flex-col justify-start min-h-full flex-1 overflow-y-auto">
                        <DialogHeader className="mb-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4"
                            >
                                <DialogTitle className="text-3xl font-serif text-primary leading-tight">
                                    Nuestra Historia
                                </DialogTitle>
                                <div className="h-1 w-12 bg-primary rounded-full mt-2" />
                            </motion.div>
                        </DialogHeader>

                        <div className="space-y-4 text-muted-foreground leading-relaxed text-sm lg:text-base">
                            <p>
                                ¡Hola! Mi nombre es <span className="text-primary font-semibold">Sabrina</span> (aunque casi todos me dicen Chavi), tengo 33 años y soy la mamá de Renzo.
                            </p>
                            <p>
                                Soy la persona que está detrás de cada detalle de <strong>Yhabiaunavez</strong>. Este proyecto nació allá por el <strong>2013</strong>, primero como una necesidad laboral, pero hoy se transformó en muchísimo más que eso. Todo empezó gracias a mi mamá, que es una grosa total cosiendo y enseñando.
                            </p>
                            <p>
                                Después de algunos años compartiendo el camino con una socia, quedé al frente siempre empujando para adelante, con el aguante incondicional de mi familia.
                            </p>
                            <p>
                                Hoy me dedico a diseñar accesorios para acompañar la mapaternidad y juguetes para los más peques. Mi objetivo es crear cosas útiles, lindas y divertidas. Quiero que te lleves algo <span className="text-primary font-medium italic">verdaderamente único</span>, porque esa es la magia de lo hecho a mano.
                            </p>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AboutUsModal;
