"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Store, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-serif text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Configura los ajustes de tu tienda
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Store info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store size={20} className="text-primary" />
              Información de la Tienda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nombre de la tienda</Label>
              <Input
                id="storeName"
                defaultValue="Había una Vez"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDesc">Descripción</Label>
              <Input
                id="storeDesc"
                defaultValue="Boutique de ropa infantil premium"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone size={20} className="text-primary" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp</Label>
                <Input
                  id="phone"
                  defaultValue="+54 11 1234-5678"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="hola@habiaunavez.com"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                defaultValue="Buenos Aires, Argentina"
                className="rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social media */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              Redes Sociales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="@habiaunavez"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="habiaunavez"
                  className="rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button className="rounded-full px-8">Guardar Cambios</Button>
      </motion.div>
    </div>
  );
}
