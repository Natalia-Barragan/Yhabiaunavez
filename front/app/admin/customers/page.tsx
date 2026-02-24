"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import {
    Users,
    Search,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Trash2,
    X,
    MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import type { Customer } from "@/lib/store";
import { formatWhatsApp } from "@/lib/utils";

export default function CustomersPage() {
    const { customers, fetchCustomers, deleteCustomer, isLoading } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.phone.includes(searchTerm)
    );

    const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
        e.stopPropagation();
        if (confirm(`¿Estás seguro de eliminar a ${name}?`)) {
            await deleteCustomer(id);
            if (selectedCustomer?.id === id) setSelectedCustomer(null);
        }
    };

    const getWhatsAppLink = (phone: string) => {
        return `https://wa.me/${formatWhatsApp(phone)}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-foreground">Clientes</h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona la base de datos de clientes y sus envíos
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium">
                    <Users size={20} />
                    <span>{customers.length} Registrados</span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={20}
                    />
                    <Input
                        placeholder="Buscar por nombre, email o teléfono..."
                        className="pl-10 rounded-xl bg-background border-border/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="w-[100px]">Avatar</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                            <TableHead className="hidden lg:table-cell">Ubicación</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && customers.length === 0 ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i} className="animate-pulse">
                                    <TableCell colSpan={6}>
                                        <div className="h-12 bg-muted rounded-lg" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <TableCell>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {customer.name.charAt(0).toUpperCase()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        {customer.name}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {customer.email}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                                        {customer.phone}
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                                        {customer.city}, {customer.state}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => handleDelete(e, customer.id, customer.name)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Users className="text-muted-foreground/30" size={40} />
                                        <p className="text-muted-foreground text-sm">No se encontraron clientes</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Detail Modal/Card Overlay */}
            <AnimatePresence>
                {selectedCustomer && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCustomer(null)}
                            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border/50 overflow-hidden relative"
                            >
                                <button
                                    onClick={() => setSelectedCustomer(null)}
                                    className="absolute top-4 right-4 p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                <div className="p-8 space-y-6">
                                    {/* Avatar & Header */}
                                    <div className="text-center space-y-3">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mx-auto shadow-sm border-4 border-background">
                                            {selectedCustomer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif text-foreground">
                                                {selectedCustomer.name}
                                            </h2>
                                            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                                <Calendar size={14} />
                                                <span>
                                                    Registrado el{" "}
                                                    {selectedCustomer.createdAt
                                                        ? new Date(selectedCustomer.createdAt).toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Grid */}
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl">
                                            <Mail size={18} className="text-primary" />
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</p>
                                                <p className="text-sm font-medium truncate">{selectedCustomer.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl">
                                            <Phone size={18} className="text-primary" />
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Teléfono</p>
                                                <p className="text-sm font-medium">{selectedCustomer.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Info */}
                                    <div className="bg-primary/5 rounded-2xl p-5 space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin size={18} className="text-primary" />
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-primary/70">Datos de Envío</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Dirección</p>
                                                <p className="text-sm font-semibold">{selectedCustomer.address}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Ubicación</p>
                                                    <p className="text-xs">{selectedCustomer.city}, {selectedCustomer.state}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">C.P. / País</p>
                                                    <p className="text-xs">{selectedCustomer.zipCode} / {selectedCustomer.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Call to Action */}
                                    <div className="pt-2">
                                        <Button
                                            asChild
                                            className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold gap-3 shadow-lg shadow-green-500/20"
                                        >
                                            <a
                                                href={getWhatsAppLink(selectedCustomer.phone)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MessageCircle size={20} />
                                                Enviar WhatsApp
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
