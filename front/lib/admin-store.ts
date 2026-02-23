
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api"; // Import API client
import type { Product, ProductVariant, Category, Order } from "./store";

interface AdminStore {
  products: Product[];
  categories: Category[];
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  addProduct: (product: FormData) => Promise<void>; // Changed to receive FormData for image upload
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearSoldOut: () => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

// Helper to transform Backend Product to Frontend Product
const transformProduct = (backendProduct: any): Product => {
  // Extract sizes robustly: handles arrays, strings, and comma-separated values within arrays
  let sizes: string[] = [];
  if (Array.isArray(backendProduct.sizes)) {
    sizes = backendProduct.sizes.flatMap((s: any) =>
      typeof s === "string" ? s.split(",").map((v) => v.trim()) : s
    ).filter(Boolean);
  } else if (typeof backendProduct.sizes === "string") {
    sizes = backendProduct.sizes.split(",").map((s: string) => s.trim()).filter(Boolean);
  }

  // If backend returns 'sizes' array and 'stockBySize' map
  const variants = sizes.length > 0
    ? sizes.map((size: string) => ({
      size,
      stock: backendProduct.stockBySize?.[size] ?? 0
    }))
    : [{ size: "Único", stock: backendProduct.stock || 0 }]; // Fallback

  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price: Number(backendProduct.price),
    description: backendProduct.description || "",
    category: backendProduct.category?.name || "General",
    categoryId: backendProduct.category?.id || backendProduct.categoryId || "",
    images: backendProduct.images || (backendProduct.image ? [backendProduct.image] : []),
    variants: variants,
  };
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      orders: [],
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.orders.getAll();
          set({ orders: data, isLoading: false });
        } catch (error: any) {
          console.error("Failed to fetch orders:", error);
          set({ error: error.message, isLoading: false });
        }
      },

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
        set({ isLoading: true, error: null });
        try {
          const data = await api.categories.getAll();
          set({ categories: data, isLoading: false });
        } catch (error: any) {
          console.error("Failed to fetch categories:", error);
          set({ error: error.message, isLoading: false });
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

      addCategory: async (name) => {
        set({ isLoading: true });
        try {
          const newCategory = await api.categories.create({ name });
          set((state) => ({
            categories: [...state.categories, newCategory],
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateCategory: async (id: string, name: string) => {
        set({ isLoading: true });
        try {
          const updatedCategory = await api.categories.update(id, { name });
          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? updatedCategory : c
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      deleteCategory: async (id) => {
        set({ isLoading: true });
        try {
          await api.categories.delete(id);
          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      clearSoldOut: async () => {
        const { products, deleteProduct } = get();
        const soldOutProducts = products.filter(p => {
          const totalStock = (p.variants || []).reduce((acc, v) => acc + v.stock, 0);
          return totalStock === 0;
        });

        if (soldOutProducts.length === 0) return;

        set({ isLoading: true });
        try {
          await Promise.all(soldOutProducts.map(p => api.products.delete(p.id)));

          set((state) => ({
            products: state.products.filter(p => {
              const totalStock = (p.variants || []).reduce((acc, v) => acc + v.stock, 0);
              return totalStock > 0;
            }),
            isLoading: false
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateOrderStatus: async (id, status) => {
        try {
          await api.orders.updateStatus(id, status);
          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === id ? { ...o, status } : o
            ),
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },
    }),
    {
      name: "habia-una-vez-admin",
      skipHydration: true, // Don't hydrate automatically to avoid conflicts with fresh fetch
    }
  )
);

export const defaultSizes = ["Único", "0-3m", "3-6m", "6-12m", "12-18m", "12-24m"];
