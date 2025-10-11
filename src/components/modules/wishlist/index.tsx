"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import WishItem from "@/components/WishItem";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import { useEffect } from "react";

export const WishlistModule = () => {
  const { wishlist, setWishlist } = useWishlistStore();

 const getWishlistByUserId = async (id: string) => {
  const response = await apiClient.get(`/api/wishlist/${id}`, {
    cache: "no-store",
  });
  const wishlist = await response.json();

  const productArray = wishlist.map((item: any) => ({
    id: item?.product?.id,
    title: item?.product?.title,
    price: item?.product?.price,
    image: item?.product?.mainImage,
    slug: item?.product?.slug,
    // Convert number → boolean safely
    stockAvailabillity: Boolean(item?.product?.inStock),
  }));

  setWishlist(productArray);
};


  // Example: get current user via your API auth
  const getCurrentUser = async () => {
    try {
      const response = await apiClient.get(`/api/auth/me`, { cache: "no-store" });
      const data = await response.json();
      if (data?.id) {
        getWishlistByUserId(data.id);
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      {wishlist && wishlist.length === 0 ? (
        <h3 className="text-center text-4xl py-10 text-black max-lg:text-3xl max-sm:text-2xl max-sm:pt-5 max-[400px]:text-xl">
          No items found in the wishlist
        </h3>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <div className="overflow-x-auto">
            <table className="table text-center">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-accent-content">Image</th>
                  <th className="text-accent-content">Name</th>
                  <th className="text-accent-content">Stock Status</th>
                  <th className="text-accent-content">Action</th>
                </tr>
              </thead>
              <tbody>
                {wishlist &&
                  wishlist.map((item) => (
                    <WishItem
                      id={item?.id}
                      title={item?.title}
                      price={item?.price}
                      image={item?.image}
                      slug={item?.slug}
                      stockAvailabillity={item?.stockAvailabillity}
                      key={nanoid()}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};
