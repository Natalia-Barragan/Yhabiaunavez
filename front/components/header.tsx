'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react'
import { useCartStore } from "@/lib/store"
import { CartDrawer } from "./cart-drawer"

export function Header() {
  const { getTotalItems, setCartOpen, setSelectedCategory, searchQuery, setSearchQuery } = useCartStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const totalItems = getTotalItems()

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="container navbar-content" style={{ display: 'flex', alignItems: 'center' }}>
          
          {/* Menú Hamburguesa (oculto en desktop) */}
          <div className="mobile-menu-btn" style={{ display: 'none' }}>
            <button className="icon-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>

          {/* Izquierda: Links de navegación */}
          <ul className="nav-links" style={{ flex: 1, justifyContent: 'flex-start', margin: 0, padding: 0 }}>
            <li><Link href="/" onClick={() => handleCategoryClick("Todos")} className="nav-link">Inicio</Link></li>
            <li><Link href="/#catalogo" onClick={() => handleCategoryClick("Ropa Bebé")} className="nav-link">Bebés</Link></li>
            <li><Link href="/#catalogo" onClick={() => handleCategoryClick("Ropa Niñx")} className="nav-link">Niños</Link></li>
            <li><Link href="/#catalogo" onClick={() => handleCategoryClick("Accesorios")} className="nav-link">Accesorios</Link></li>
          </ul>

          {/* Derecha: Iconos */}
          <div className="nav-icons" style={{ flex: 1, justifyContent: 'flex-end', display: 'flex', alignItems: 'center', paddingRight: '40px', gap: '15px' }}>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Buscar..." 
                value={searchQuery}
                onChange={(e) => {
                  const isStartingToType = e.target.value.length > 0 && !searchQuery;
                  setSearchQuery(e.target.value);
                  if (isStartingToType) {
                    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                style={{
                  padding: '8px 35px 8px 16px',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                  outline: 'none',
                  fontSize: '14px',
                  width: '180px',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-foreground)'
                }}
              />
              <Search size={18} style={{ position: 'absolute', right: '12px', color: 'var(--color-muted-foreground)' }} />
            </div>

            <button className="icon-btn" style={{ position: 'relative' }} onClick={() => setCartOpen(true)}>
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px', 
                  backgroundColor: 'var(--color-primary)', color: 'white', 
                  fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', 
                  height: '18px', width: '18px', display: 'flex', 
                  alignItems: 'center', justifyContent: 'center'
                }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Menú Mobile Desplegable */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, backgroundColor: 'white', zIndex: 40, padding: '20px', borderBottom: '1px solid #eee' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href="/" onClick={() => handleCategoryClick("Todos")} style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }}>Inicio</Link></li>
            <li><Link href="/#catalogo" onClick={() => handleCategoryClick("Ropa Bebé")} style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }}>Bebés</Link></li>
            <li><Link href="/#catalogo" onClick={() => handleCategoryClick("Ropa Niñx")} style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }}>Niños</Link></li>
            <li><Link href="/#catalogo" onClick={() => handleCategoryClick("Accesorios")} style={{ textDecoration: 'none', color: '#333', fontSize: '18px' }}>Accesorios</Link></li>
          </ul>
        </div>
      )}

      {/* Carrito Lateral */}
      <CartDrawer />
    </>
  )
}
