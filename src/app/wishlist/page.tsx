"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ If no token → redirect to login
    if (!token) {
      toast.error("Please login to access your wishlist");
      router.push("/login");
    }
  }, [router]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const userId = user?.id || null;

  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setWishlist(
            data.map((item: any) => ({
              id: item.product.id,
              title: item.product.title,
              price: item.product.price,
              description: item.product.description,
              image: item.product.mainImage || item.product.image,
            }))
          );
        } else {
          console.error(" Failed to fetch wishlist:", await res.text());
        }
      } catch (err) {
        console.error(" Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token, userId]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (!wishlist.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h2>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            userId={userId}
            token={token}
            onRemove={(id) =>
              setWishlist((prev) => prev.filter((item) => item.id !== id))
            }
          />

        ))}
      </div>
    </div>
  );
}

// Product Card Component
const ProductCard = ({
  product,
  userId,
  token,
  onRemove,
}: {
  product: any;
  userId: string | null;
  token: string | null;
  onRemove: (id: string) => void;
}) => {
  const router = useRouter();
  const isLoggedIn = !!token;
  const imageUrl = product.image
    ? `${product.image}`
    : "https://placehold.co/600x400/cccccc/ffffff?text=No+Image";

  // Add to Cart — now checks cart & removes from wishlist via API
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    try {
      // Step 1️ - Check if item already exists in cart
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!checkRes.ok) throw new Error("Failed to fetch cart");

      const cartItems = await checkRes.json();
      const alreadyInCart = cartItems.some(
        (item: any) => item.product.id === product.id
      );

      if (alreadyInCart) {
        toast.error(" Already in cart!");
        return;
      }

      // Step 2️ - Add to cart
      const addRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          productId: product.id,
          quantity: 1,
        }),
      });

      if (!addRes.ok) throw new Error(await addRes.text());

      toast.success("Added to cart!");

      // Step 3️ - Remove from wishlist after successful add
      const removeRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${userId}/${product.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (removeRes.ok) {
        onRemove(product.id);
        toast(" Removed from wishlist", { icon: "💨" });
      } else {
        console.warn("Could not remove from wishlist:", await removeRes.text());
      }
    } catch (err) {
      console.error(err);
      toast.error(" Something went wrong");
    }
  };

  // Remove from Wishlist
  const handleRemoveFromWishlist = async () => {
    if (!userId || !token) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${userId}/${product.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        onRemove(product.id);
        toast.success(" Removed from wishlist");
      } else {
        console.error(await res.text());
        toast.error(" Failed to remove from wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error(" Something went wrong");
    }
  };

  return (
 <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden group">
  {/* Product Image */}
  <div
    className="relative cursor-pointer overflow-hidden"
    onClick={() => router.push(`/product/${product.id}`)}
  >
    <img
      src={imageUrl}
      alt={product.title}
      className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
      onError={(e) =>
        ((e.currentTarget as HTMLImageElement).src =
          "https://placehold.co/600x400/cccccc/ffffff?text=No+Image")
      }
    />

    {/* Overlay Badge */}
    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
      {product.category?.name || "Product"}
    </div>
  </div>

  {/*  Product Details */}
  <div className="flex flex-col flex-grow p-5">
    <h3
      className="text-lg font-semibold text-gray-800 mb-1 cursor-pointer hover:text-indigo-600 line-clamp-1"
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {product.title}
    </h3>

    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>

    {/* Rating */}
    <div className="flex items-center mb-3">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          fill={i < product.rating ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-4 h-4 ${
            i < product.rating ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.06 4.17a.563.563 0 00.424.307l4.6.67a.563.563 0 01.312.96l-3.327 3.245a.563.563 0 00-.162.498l.785 4.58a.563.563 0 01-.817.592L12 17.75l-4.116 2.166a.563.563 0 01-.817-.592l.785-4.58a.563.563 0 00-.162-.498L4.363 9.606a.563.563 0 01.312-.96l4.6-.67a.563.563 0 00.424-.307l2.06-4.17z"
          />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-1">({product.rating || 0})</span>
    </div>

    {/*  Price + Actions */}
    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
      <p className="text-2xl font-bold text-indigo-600">
        ₹{(product.price || 0).toFixed(2)}
      </p>

      <div className="flex gap-2 items-center">
        {/* Remove from Wishlist */}
        <button
          onClick={handleRemoveFromWishlist}
          className="p-2 rounded-lg border border-gray-200 hover:bg-red-100 transition-all"
          title="Remove from Wishlist"
        >
          ❌
        </button>

        {/* Wishlist Heart */}
        <button
          className="p-2 rounded-lg border border-gray-200 hover:bg-pink-50"
          title="Already in Wishlist"
        >
          <Heart className="w-5 h-5 text-pink-500" />
        </button>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1 bg-indigo-500 text-white px-3 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-all"
        >
          <ShoppingCart className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  </div>
</div>

  );
};
