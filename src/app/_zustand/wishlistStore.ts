import { create } from "zustand";

export type ProductInWishlist = {
  id: string;
  title: string;   // ✅ Use only title
  price: number;
  image: string;
   slug?: string;
  stockAvailabillity?: boolean;
};

export type State = {
  wishlist: ProductInWishlist[];
  wishQuantity: number;
};


export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: ProductInWishlist[]) => void;
  clearWishlist: () => void;
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,

  addToWishlist: (product) => {
    set((state) => {
      const exists = state.wishlist.find((item) => item.id === product.id);

      if (!exists) {
        const updated = [...state.wishlist, product];
        return {
          wishlist: updated,
          wishQuantity: updated.length,
        };
      }

      return {
        wishlist: state.wishlist,
        wishQuantity: state.wishlist.length,
      };
    });
  },

  removeFromWishlist: (id) => {
    set((state) => {
      const updated = state.wishlist.filter((item) => item.id !== id);
      return {
        wishlist: updated,
        wishQuantity: updated.length,
      };
    });
  },

  setWishlist: (wishlist: ProductInWishlist[]) => {
    set(() => ({
      wishlist: [...wishlist],
      wishQuantity: wishlist.length,
    }));
  },

  clearWishlist: () => ({
    wishlist: [],
    wishQuantity: 0,
  }),
}));
