import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductVariant {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number | string; // Supabase a veces lo manda como string ("8000.00")
  description: string;
  category?: any; // Para que no rompa si Supabase manda categoryId en vez del objeto
  image?: string; // Para la foto única que manda Supabase hoy
  images?: string[]; // Para las múltiples fotos que vas a tener mañana
  stock?: number; // Para el stock general de Supabase
  variants?: ProductVariant[]; // Para el stock por talles
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.size === size
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, size, quantity: 1 }],
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.size === size)
          ),
        }));
      },

      updateQuantity: (productId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, size);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.size === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (open) => set({ isOpen: open }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "habia-una-vez-cart",
    }
  )
);

// Sample products data
export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Conjunto Algodón COD#1",
    price: 3400,
    description:
      "Hermoso conjunto de algodón para bebé. Incluye campera con capucha y pantalón a juego. Perfecto para los días frescos de otoño.",
    category: "Conjuntos",
    images: ["/images/product-1.jpg"],
    variants: [
      { size: "0-3m", stock: 3 },
      { size: "3-6m", stock: 5 },
      { size: "6-12m", stock: 2 },
      { size: "12-18m", stock: 0 },
    ],
  },
  {
    id: "2",
    name: "Conjunto Bebé Plush COD#2",
    price: 2900,
    description:
      "Suave conjunto de plush ideal para los más pequeños. Material térmico y cómodo que mantiene a tu bebé abrigado.",
    category: "Conjuntos",
    images: ["/images/product-2.jpg"],
    variants: [
      { size: "0-3m", stock: 4 },
      { size: "3-6m", stock: 6 },
      { size: "6-12m", stock: 3 },
      { size: "12-18m", stock: 2 },
    ],
  },
  {
    id: "3",
    name: "Body Estampado Floral",
    price: 1800,
    description:
      "Delicado body con estampado floral. 100% algodón peinado, suave al contacto con la piel del bebé.",
    category: "Bodies",
    images: ["/images/product-3.jpg"],
    variants: [
      { size: "0-3m", stock: 8 },
      { size: "3-6m", stock: 5 },
      { size: "6-12m", stock: 4 },
      { size: "12-18m", stock: 3 },
    ],
  },
  {
    id: "4",
    name: "Ranita Tejida Premium",
    price: 4200,
    description:
      "Elegante ranita tejida a mano con detalles únicos. Perfecta para ocasiones especiales.",
    category: "Ranitas",
    images: ["/images/product-4.jpg"],
    variants: [
      { size: "0-3m", stock: 2 },
      { size: "3-6m", stock: 3 },
      { size: "6-12m", stock: 1 },
      { size: "12-18m", stock: 0 },
    ],
  },
  {
    id: "5",
    name: "Osito Polar Suave",
    price: 3800,
    description:
      "Adorable osito de polar extra suave. Ideal para mantener a tu bebé calentito en invierno.",
    category: "Ositos",
    images: ["/images/product-5.jpg"],
    variants: [
      { size: "0-3m", stock: 4 },
      { size: "3-6m", stock: 6 },
      { size: "6-12m", stock: 5 },
      { size: "12-18m", stock: 3 },
    ],
  },
  {
    id: "6",
    name: "Set de Gorros x3",
    price: 1500,
    description:
      "Pack de 3 gorros de algodón en colores neutros. Perfectos para combinar con cualquier outfit.",
    category: "Accesorios",
    images: ["/images/product-6.jpg"],
    variants: [
      { size: "0-6m", stock: 10 },
      { size: "6-12m", stock: 8 },
      { size: "12-24m", stock: 6 },
    ],
  },
];
