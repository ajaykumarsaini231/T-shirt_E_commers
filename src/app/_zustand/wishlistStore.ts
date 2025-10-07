import { create } from "zustand";

export type ProductInWishlist = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type Actions = {
  addToWishlist: (product: ProductInWishlist) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (wishlist: ProductInWishlist[]) => void;
  clearWishlist: () => void;   // ✅ Add this
};

export const useWishlistStore = create<State & Actions>((set) => ({
  wishlist: [],
  wishQuantity: 0,
  addToWishlist: (product) => {
    set((state) => {
      const productInWishlist = state.wishlist.find(
        (item) => product.id === item.id
      );

      if (!productInWishlist) {
        return {
          wishlist: [...state.wishlist, product],
          wishQuantity: state.wishlist.length + 1, // ✅ +1 count fix
        };
      } else {
        return {
          wishlist: [...state.wishlist],
          wishQuantity: state.wishlist.length,
        };
      }
    });
  },
  removeFromWishlist: (id) => {
    set((state) => {
      const newWishlist = state.wishlist.filter((item) => item.id !== id);
      return {
        wishlist: newWishlist,
        wishQuantity: newWishlist.length, // ✅ fix count
      };
    });
  },
  setWishlist: (wishlist: ProductInWishlist[]) => {
    set(() => ({
      wishlist: [...wishlist],
      wishQuantity: wishlist.length,
    }));
  },
  clearWishlist: () =>
    set(() => ({
      wishlist: [],
      wishQuantity: 0, // ✅ Reset count
    })),
}));
