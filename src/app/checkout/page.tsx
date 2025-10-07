"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import SectionTitle from "@/components/SectionTitle";
import apiClient from "@/lib/api";

const CheckoutPage = () => {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    company: "",
    adress: "",
    apartment: "",
    city: "",
    country: "",
    postalCode: "",
    orderNotice: "",
  });

  const [cart, setCart] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // ✅ Fetch cart data
  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        toast.error("Please login first!");
        router.push("/login");
        return;
      }

      const res = await apiClient.get(`/api/cart/${user.id}`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      toast.error("Failed to load your cart");
    }
  };

  // ✅ Fetch user profile and auto-fill adress fields
  const fetchUserProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) return;

      const res = await apiClient.get(`/api/users/${user.id}`);
      if (!res.ok) return;
      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        name: data.name || "",
        lastname: data.lastname || "",
        phone: data.phone || "",
        email: data.email || "",
        company: data.company || "",
        adress: data.adress || "",
        apartment: data.apartment || "",
        city: data.city || "",
        country: data.country || "",
        postalCode: data.postalCode || "",
      }));
    } catch (err) {
      console.error("⚠️ Error loading user profile:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUserProfile();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // ✅ Handle Checkout
 const handleCheckout = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.id) {
    toast.error("You must login to place an order");
    router.push("/login");
    return;
  }

  if (cart.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  setIsSubmitting(true);

  try {
    // 1️⃣ Create the order
    const orderData = {
      name: form.name,
      lastname: form.lastname,
      phone: form.phone,
      email: form.email,
      company: form.company,
      adress: form.adress,
      apartment: form.apartment,
      city: form.city,
      country: form.country,
      postalCode: form.postalCode,
      total: total,
      status: "pending",
      orderNotice: form.orderNotice,
      userId: user.id,
    };

    const orderRes = await apiClient.post("/api/orders", orderData);

    // ✅ Handle validation error gracefully
    if (!orderRes.ok) {
      const errorText = await orderRes.text();
      try {
        const errObj = JSON.parse(errorText);
        if (errObj.details && Array.isArray(errObj.details)) {
          errObj.details.forEach((d: any) =>
            toast.error(`${d.field}: ${d.message}`)
          );
        } else if (errObj.error) {
          toast.error(errObj.error);
        } else {
          toast.error("Something went wrong while placing order");
        }
      } catch {
        toast.error("Failed to place order");
      }
      setIsSubmitting(false);
      return;
    }

    const order = await orderRes.json();
    const orderId = order.id;
    toast.success("✅ Order created successfully!");

    // 2️⃣ Save user's adress permanently
    await apiClient.put(`/api/users/${user.id}`, {
      phone: form.phone,
      company: form.company,
      adress: form.adress,
      apartment: form.apartment,
      city: form.city,
      country: form.country,
      postalCode: form.postalCode,
    });

    // 3️⃣ Add each product to order-product table
    for (const item of cart) {
      const orderProductRes = await apiClient.post("/api/order-product", {
        customerOrderId: orderId,
        productId: item.product.id,
        quantity: item.quantity,
      });

      if (!orderProductRes.ok) {
        const error = await orderProductRes.text();
        console.error("❌ Failed to add product:", error);
      }
    }

    // 4️⃣ Clear cart
    await apiClient.delete(`/api/cart/clear/${user.id}`);
    toast.success("🎉 Order completed successfully!");

    setForm({
      name: "",
      lastname: "",
      phone: "",
      email: "",
      company: "",
      adress: "",
      apartment: "",
      city: "",
      country: "",
      postalCode: "",
      orderNotice: "",
    });

    setCart([]);
    router.push("/thankyou");
  } catch (err: any) {
    console.error("💥 Checkout failed:", err);
    toast.error("Failed to complete order");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="bg-white">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />
      <main className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 🧾 Checkout Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            {[
              { label: "Name", key: "name" },
              { label: "Lastname", key: "lastname" },
              { label: "Phone", key: "phone" },
              { label: "Email", key: "email" },
              { label: "Company", key: "company" },
              { label: "adress", key: "adress" },
              { label: "Apartment", key: "apartment" },
              { label: "City", key: "city" },
              { label: "Country", key: "country" },
              { label: "Postal Code", key: "postalCode" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label} *
                </label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-lg"
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Order Notes
              </label>
              <textarea
                className="w-full mt-1 p-2 border rounded-lg"
                rows={3}
                value={form.orderNotice}
                onChange={(e) =>
                  setForm({ ...form, orderNotice: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>

        {/* 🛒 Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex py-4 items-center">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${item.product.mainImage}`}
                        alt={item.product.title}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-indigo-600">
                        ₹{item.product.price}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
