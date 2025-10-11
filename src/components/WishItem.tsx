"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaHeartCrack } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import apiClient from "@/lib/api";
import { sanitize } from "@/lib/sanitize";
import { ProductInWishlist as BaseWishlistProduct } from "@/app/_zustand/wishlistStore";

// Extend base wishlist product for UI-specific props
interface ProductInWishlist extends BaseWishlistProduct {
  slug?: string;
  stockAvailabillity?: boolean;
}

const WishItem: React.FC<ProductInWishlist> = ({
  id,
  title,
  price,
  image,
  slug,
  stockAvailabillity,
}) => {
  const { data: session } = useSession();
  const { removeFromWishlist } = useWishlistStore();
  const router = useRouter();
  const [userId, setUserId] = useState<string>();

  // Open product page
  const openProduct = (slug?: string): void => {
    if (slug) router.push(`/product/${slug}`);
  };

  // Fetch user by email
  const getUserByEmail = async () => {
    if (session?.user?.email) {
      try {
        const response = await apiClient.get(`/api/users/email/${session.user.email}`, {
          cache: "no-store",
        });
        const data = await response.json();
        setUserId(data?.id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
  };

  // Delete wishlist item
  const deleteItemFromWishlist = async (productId: string) => {
    if (!userId) return;

    try {
      await apiClient.delete(`/api/wishlist/${userId}/${productId}`, {
        method: "DELETE",
      });
      removeFromWishlist(productId);
      toast.success("Item removed from your wishlist");
    } catch (err) {
      console.error("Failed to delete item:", err);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email]);

  return (
    <tr className="hover:bg-gray-100 cursor-pointer">
      <th
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {id}
      </th>

      <th>
        <div className="w-12 h-12 mx-auto" onClick={() => openProduct(slug)}>
          <Image
            src={`/${image}`}
            width={200}
            height={200}
            className="w-auto h-auto"
            alt={sanitize(title)}
          />
        </div>
      </th>

      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {sanitize(title)}
      </td>

      <td
        className="text-black text-sm text-center"
        onClick={() => openProduct(slug)}
      >
        {stockAvailabillity ? (
          <span className="text-success">In stock</span>
        ) : (
          <span className="text-error">Out of stock</span>
        )}
      </td>

      <td>
        <button
          type="button"
          className="btn btn-xs bg-blue-500 text-white hover:text-blue-500 border border-blue-500 hover:bg-white text-sm flex items-center gap-1"
          onClick={() => deleteItemFromWishlist(id)}
        >
          <FaHeartCrack />
          <span className="max-sm:hidden">Remove</span>
        </button>
      </td>
    </tr>
  );
};

export default WishItem;
