"use client";

import { useState, useEffect } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, Ruler } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SizesPage() {
    const { sizes, fetchSizes, addSize, updateSize, deleteSize, isLoading, error: storeError } = useAdminStore();
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentSize, setCurrentSize] = useState<{ id: string; label: string } | null>(null);
    const [newLabel, setNewLabel] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    useEffect(() => {
        fetchSizes();
    }, [fetchSizes]);

    const displayError = localError || storeError;

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLabel.trim()) return;
        setIsSubmitting(true);
        setLocalError(null);
        try {
            await addSize(newLabel.trim());
            setNewLabel("");
            setIsAddDialogOpen(false);
        } catch (err: any) {
            setLocalError(err.message || "Error al crear el talle");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentSize || !newLabel.trim()) return;
        setIsSubmitting(true);
        try {
            await updateSize(currentSize.id, newLabel.trim());
            setNewLabel("");
            setCurrentSize(null);
            setIsEditDialogOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar este talle? Los productos asociados podrían mostrar datos inconsistentes.")) {
            await deleteSize(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/products"
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-muted-foreground" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-serif text-foreground">Talles</h1>
                        <p className="text-muted-foreground mt-1">
                            Gestiona las opciones de talles disponibles
                        </p>
                    </div>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-full gap-2">
                            <Plus size={18} />
                            Nuevo Talle
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] rounded-3xl">
                        <DialogHeader>
                            <DialogTitle>Agregar Talle</DialogTitle>
                            <DialogDescription>
                                Ingresa la etiqueta del nuevo talle (ej: "XL", "Talle 4").
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAdd} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="label">Etiqueta</Label>
                                <Input
                                    id="label"
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="Ej: 0-3m, XL, Talle 4..."
                                    className="rounded-xl"
                                    autoFocus
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting || !newLabel.trim()} className="rounded-full w-full">
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Crear Talle
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {displayError && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-xl mb-6">
                    {displayError}
                </div>
            )}

            <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                {isLoading && sizes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground text-sm">Cargando talles...</p>
                    </div>
                ) : sizes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No hay talles creados aún.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Talle</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sizes.map((size) => (
                                <TableRow key={size.id}>
                                    <TableCell className="font-medium">{size.label}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setCurrentSize({ id: size.id, label: size.label });
                                                    setNewLabel(size.label);
                                                    setIsEditDialogOpen(true);
                                                }}
                                                className="text-primary hover:text-primary hover:bg-primary/10"
                                            >
                                                <Pencil size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(size.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle>Editar Talle</DialogTitle>
                        <DialogDescription>
                            Modifica la etiqueta del talle seleccionado.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-label">Etiqueta</Label>
                            <Input
                                id="edit-label"
                                value={newLabel}
                                onChange={(e) => setNewLabel(e.target.value)}
                                className="rounded-xl"
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting || !newLabel.trim()} className="rounded-full w-full">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
