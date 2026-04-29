import { Header } from "@/components/header";
import { ProductGrid } from "@/components/product-grid";
import { Footer } from "@/components/footer";

export const revalidate = 60; // Revalidar cada 60 segundos

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
