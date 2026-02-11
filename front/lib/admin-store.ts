
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api"; // Import API client
import type { Product, ProductVariant } from "./store";

interface AdminStore {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: FormData) => Promise<void>; // Changed to receive FormData for image upload
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
}

// Helper to transform Backend Product to Frontend Product
const transformProduct = (backendProduct: any): Product => {
  // If backend returns 'sizes' array (new structure), map them to variants
  // We distribute the global stock across variants or just assign it to all (simplified logic)
  const variants = backendProduct.sizes && backendProduct.sizes.length > 0
    ? backendProduct.sizes.map((size: string) => ({
      size,
      stock: backendProduct.stock || 0
    }))
    : [{ size: "Único", stock: backendProduct.stock || 0 }]; // Fallback

  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price: Number(backendProduct.price),
    description: backendProduct.description || "",
    category: backendProduct.category?.name || "General",
    images: backendProduct.image ? [backendProduct.image] : [],
    variants: variants,
  };
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: [],
      categories: ["Todos"], // Default category
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.products.getAll();
          console.log("Trace: API Products Data:", data); // DEBUG
          const products = data.map(transformProduct);
          console.log("Trace: Transformed Products:", products); // DEBUG
          set({ products, isLoading: false });
        } catch (error: any) {
          console.error("Failed to fetch products:", error);
          set({ error: error.message, isLoading: false });
        }
      },

      fetchCategories: async () => {
        try {
          const data = await api.categories.getAll();
          // Assuming data is array of { id, name }
          const categoryNames = data.map((c: any) => c.name);
          set({ categories: ["Todos", ...categoryNames] });
        } catch (error: any) {
          console.error("Failed to fetch categories:", error);
        }
      },

      addProduct: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
          const newBackendProduct = await api.products.create(formData);
          const newProduct = transformProduct(newBackendProduct);
          set((state) => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));
        } catch (error: any) {
          console.error("Failed to add product:", error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateProduct: async (id, updates) => {
        // Note: Full update implementation would require adapting frontend updates to backend PATCH
        // For now, we update local state and basic backend fields if possible
        set({ isLoading: true });
        try {
          await api.products.update(id, updates);
          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? { ...p, ...updates } : p
            ),
            isLoading: false
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      deleteProduct: async (id) => {
        set({ isLoading: true });
        try {
          await api.products.delete(id);
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },
    }),
    {
      name: "habia-una-vez-admin",
      skipHydration: true, // Don't hydrate automatically to avoid conflicts with fresh fetch
    }
  )
);

export const categories = [
  "Conjuntos",
  "Bodies",
  "Ranitas",
  "Ositos",
  "Accesorios",
  "General",
];

export const defaultSizes = ["Único", "0-3m", "3-6m", "6-12m", "12-18m", "12-24m"];
