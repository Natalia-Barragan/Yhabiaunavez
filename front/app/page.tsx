import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";
import { HeroButtons } from "@/components/hero-buttons";
import { Star, Sun, Baby, CloudRain, Gift, Package } from "lucide-react";

export const revalidate = 60; // Revalidar cada 60 segundos

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />
      <main className="flex-1">
        {/* Banner Section */}
        <section style={{ width: '100%', backgroundColor: 'var(--color-secondary)' }}>
          <img
            src="/banner.jpeg"
            alt="Y Había Una Vez - Banner Pandas"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain', maxHeight: '400px', backgroundColor: 'var(--color-secondary)' }}
          />
        </section>

        {/* Hero Section */}
        <section className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <h1>Vestimos sus <span style={{ color: 'var(--color-primary)' }}>aventuras</span> mágicas</h1>
              <p>Descubrí nuestra nueva colección inspirada en la naturaleza. Ropa cómoda, divertida y con mucho color para acompañar cada paso de los más chicos.</p>
              <HeroButtons />
            </div>
            <div className="hero-image">
              <div className="blob" style={{ zIndex: 3 }}></div>
              <div className="animate-float" style={{ position: 'relative', zIndex: 1 }}>
                <div className="logo-circle" style={{
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  padding: '24px',
                  boxShadow: '0 20px 40px rgba(0, 168, 150, 0.15)',
                  display: 'inline-block',
                  border: '8px solid rgba(255,255,255,0.8)',
                  overflow: 'hidden'
                }}>
                  <img
                    src="/logo.jpg"
                    alt="Y Había Una Vez - Búho"
                    style={{ width: '300px', maxWidth: '350px', display: 'block', borderRadius: '50%' }}
                  />
                </div>
              </div>
              <div style={{ position: 'absolute', top: '10%', right: '5%', color: '#FF9900' }} className="animate-wiggle"><Star size={48} fill="currentColor" /></div>
              <div style={{ position: 'absolute', bottom: '15%', left: '0', color: '#EB008B' }} className="animate-wiggle"><Sun size={56} fill="currentColor" /></div>
            </div>
          </div>
        </section>

        {/* Wave Separator */}
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,121.22,192.27,100.5,235.8,85.83,278.4,70.62,321.39,56.44Z" fill="var(--color-surface)"></path>
          </svg>
        </div>

        {/* Catálogo con Categorías Integradas */}
        <ProductGrid />

        {/* Promotional Banner (Oculto temporalmente)
        <section className="banner-section">
          <div className="container banner-content">
            <h2 className="banner-title">¡15% OFF en tu primera compra!</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>Suscribite a nuestro newsletter y enterate de todas las novedades y descuentos exclusivos.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="email"
                placeholder="Tu email mágico..."
                style={{ padding: '16px 24px', borderRadius: 'var(--border-radius-pill)', border: 'none', width: '100%', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none' }}
              />
              <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>Suscribirme</button>
            </div>
          </div>
          <div style={{ position: 'absolute', top: '-20px', left: '10%', opacity: '0.2' }}><Star size={100} fill="currentColor" /></div>
          <div style={{ position: 'absolute', bottom: '-20px', right: '10%', opacity: '0.2' }}><Sun size={120} fill="currentColor" /></div>
        </section>
        */}
      </main>
      <Footer />
    </div>
  );
}
