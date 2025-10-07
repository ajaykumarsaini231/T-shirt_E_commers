import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ✅ Cart item type
export type ProductInCart = {
  id: string;
  title: string;
  price: number;
  image: string;
  amount: number; // quantity
};

// ✅ Store state type
export type State = {
  products: ProductInCart[];
  allQuantity: number; // total items count
  total: number;       // total price
};

// ✅ Actions type
export type Actions = {
  addToCart: (newProduct: ProductInCart) => void;
  removeFromCart: (id: string) => void;
  updateCartAmount: (id: string, quantity: number) => void;
  clearCart: () => void;
};

// ✅ Zustand store with persist (sessionStorage)
export const useProductStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: [],
      allQuantity: 0,
      total: 0,

      // ✅ Add item to cart
      addToCart: (newProduct) => {
        set((state) => {
          const cartItem = state.products.find(
            (item) => item.id === newProduct.id
          );

          let updatedProducts;
          if (!cartItem) {
            // if product not in cart, add it
            updatedProducts = [...state.products, newProduct];
          } else {
            // if already in cart, increase amount
            updatedProducts = state.products.map((product) =>
              product.id === cartItem.id
                ? { ...product, amount: product.amount + newProduct.amount }
                : product
            );
          }

          return recalc(updatedProducts);
        });
      },

      // ✅ Remove item from cart
      removeFromCart: (id) => {
        set((state) => {
          const updatedProducts = state.products.filter(
            (product) => product.id !== id
          );
          return recalc(updatedProducts);
        });
      },

      // ✅ Update quantity
      updateCartAmount: (id, amount) => {
        set((state) => {
          const updatedProducts = state.products.map((product) =>
            product.id === id ? { ...product, amount } : product
          );
          return recalc(updatedProducts);
        });
      },

      // ✅ Clear cart
      clearCart: () => {
        set(() => ({
          products: [],
          allQuantity: 0,
          total: 0,
        }));
      },
    }),
    {
      name: "products-storage", // unique name in storage
      storage: createJSONStorage(() => sessionStorage), 
      // 🔹 change to localStorage if you want cart to persist after closing browser
      // storage: createJSONStorage(() => localStorage),
    }
  )
);

// 🔹 Helper fn: recalculates totals
function recalc(products: ProductInCart[]) {
  let amount = 0;
  let total = 0;

  products.forEach((item) => {
    amount += item.amount;
    total += item.amount * item.price;
  });

  return {
    products,
    allQuantity: amount,
    total,
  };
}
