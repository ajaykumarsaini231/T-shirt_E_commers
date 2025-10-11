"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

export const CartModule = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const userId = user?.id || null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) {
        // token expired
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [token, router]);

  // Fetch Cart from API
  useEffect(() => {
    const fetchCart = async () => {
      if (!token || !userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();

        setCartItems(
          data.map((item: any) => ({
            id: item.id,
            productId: item.product.id,
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
            image:
              item.product.mainImage ||
              item.product.image ||
              "https://placehold.co/600x400/cccccc/ffffff?text=No+Image",
            description: item.product.description,
          }))
        );
      } catch (err) {
        console.error(" Fetch cart error:", err);
        toast.error("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, userId]);

  //  Update Quantity (Protected)
  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!res.ok) throw new Error(await res.text());
      const updatedItem = await res.json();
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(" Failed to update quantity");
    }
  };

  //  Remove Item (Protected)
  const removeItem = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      toast.success(" Removed from cart");
    } catch (err) {
      console.error(err);
      toast.error(" Failed to remove item");
    }
  };

  //  Clear Cart (Protected)
  const clearCart = async () => {
    if (!userId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setCartItems([]);
      toast.success(" Cart cleared");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear cart");
    }
  };

  // Calculate totals
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">Loading cart...</div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
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
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-6 border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex flex-col flex-grow">
              <h3
                className="text-lg font-bold text-gray-800 cursor-pointer"
                onClick={() => router.push(`/product/${item.productId}`)}
              >
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.description}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <p className="text-indigo-600 font-semibold text-lg">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>₹0.00</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => {
            toast.success("🛒 Proceeding to checkout...");
            setTimeout(() => {
              router.push("/checkout");
            }, 800);
          }}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Checkout
        </button>
        <button
          onClick={clearCart}
          className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};
