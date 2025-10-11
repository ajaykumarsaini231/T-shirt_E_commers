"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import SectionTitle from "@/components/SectionTitle";
import apiClient from "@/lib/api";

type Address = {
  id?: string;
  name: string;
  lastname: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
};

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

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const router = useRouter();
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  //  Fetch Cart
  const fetchCart = async () => {
    try {
      if (!user.id) {
        toast.error("Please login first!");
        router.push("/login");
        return;
      }
      const res = await apiClient.get(`/api/cart/${user.id}`);
      const data = await res.json();
      setCart(Array.isArray(data) ? data : data.cart || data.items || []);
    } catch (err) {
      console.error(" Error fetching cart:", err);
      toast.error("Failed to load cart");
    }
  };

  //  Fetch Addresses 
  const fetchAddresses = async () => {
    try {
      if (!user.id) return;
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch addresses");

      const data = await res.json();

      if (Array.isArray(data)) {
        setAddresses(data);
      } else if (Array.isArray(data.addresses)) {
        setAddresses(data.addresses);
      } else {
        console.warn(" Unexpected address format:", data);
        setAddresses([]);
      }
    } catch (err) {
      console.error(" Failed to load addresses:", err);
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  //  Select Address → Auto-fill
  const handleSelectAddress = (addr: Address | "new") => {
    if (addr === "new") {
      setSelectedAddressId(null);
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
    } else {
      setSelectedAddressId(addr.id || null);
      setForm((prev) => ({
        ...prev,
        name: addr.name || "",
        lastname: addr.lastname || "",
        phone: addr.phone || "",
        adress: addr.address || "",
        city: addr.city || "",
        country: addr.country || "",
        postalCode: addr.postalCode || "",
      }));
    }
  };

  //  Save Address
  const handleSaveAddress = async () => {
    if (!user.id) {
      toast.error("Login required to save address");
      router.push("/login");
      return;
    }

    if (!form.name || !form.phone || !form.adress || !form.city) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSavingAddress(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          name: form.name,
          lastname: form.lastname,
          phone: form.phone,
          address: form.adress,
          city: form.city,
          country: form.country,
          postalCode: form.postalCode,
        }),
      });

      if (!res.ok) throw new Error("Failed to save address");

      toast.success("Address saved successfully!");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  // 💳 Checkout
  const handleCheckout = async () => {
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
      const orderData = {
        ...form,
        total,
        status: "pending",
        userId: user.id,
      };

      const orderRes = await apiClient.post("/api/orders", orderData);
      if (!orderRes.ok) throw new Error("Failed to create order");

      const order = await orderRes.json();
      const orderId = order.id;

      for (const item of cart) {
        await apiClient.post("/api/order-product", {
          customerOrderId: orderId,
          productId: item.product.id,
          quantity: item.quantity,
        });
      }

      await apiClient.delete(`/api/cart/clear/${user.id}`);

      toast.success(" Order placed successfully!");
      router.push("/thankyou");
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Failed to complete order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />

      <main className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.product.id} className="flex py-4 items-center">
                      <Image
                        src={item.product.mainImage}
                        alt={item.product.title}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-indigo-600">
                        ₹{item.product.price}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between text-sm">
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

        {/*  Address & Shipping */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

          {/* Address Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Array.isArray(addresses) && addresses.length > 0 ? (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelectAddress(addr)}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedAddressId === addr.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <p className="font-medium">{addr.name} {addr.lastname}</p>
                  <p className="text-sm text-gray-600">{addr.address}</p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.country}</p>
                  <p className="text-sm text-gray-600"> {addr.phone}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm col-span-2">No saved addresses</p>
            )}

            {/* Add New Address */}
            <div
              onClick={() => handleSelectAddress("new")}
              className="p-4 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400"
            >
              <span className="text-blue-600 font-medium">+ Add New Address</span>
            </div>
          </div>

          {/* Manual Fields */}
          <div className="space-y-4">
            {[
              { label: "Name", key: "name" },
              { label: "Lastname", key: "lastname" },
              { label: "Phone", key: "phone" },
              { label: "Email", key: "email" },
              { label: "Company", key: "company" },
              { label: "Address", key: "adress" },
              { label: "Apartment", key: "apartment" },
              { label: "City", key: "city" },
              { label: "Country", key: "country" },
              { label: "Postal Code", key: "postalCode" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleSaveAddress}
              disabled={isSavingAddress}
              className="w-full sm:w-1/2 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition disabled:bg-gray-400"
            >
              {isSavingAddress ? "Saving..." : "Save Address"}
            </button>

            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full sm:w-1/2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
