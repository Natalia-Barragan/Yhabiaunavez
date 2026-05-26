"use client";

import { useCartStore } from "@/lib/store";

export function HeroButtons() {
  const { clearAllFilters, setSelectedCategory } = useCartStore();

  const handleVerColeccion = () => {
    clearAllFilters();
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSetRegalos = () => {
    setSelectedCategory("Kits de regalo");
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="hero-buttons" style={{ display: "flex", gap: "16px" }}>
      <button onClick={handleVerColeccion} className="btn btn-primary">
        Ver Colección
      </button>
      <button onClick={handleSetRegalos} className="btn btn-outline">
        Set de regalos
      </button>
    </div>
  );
}
