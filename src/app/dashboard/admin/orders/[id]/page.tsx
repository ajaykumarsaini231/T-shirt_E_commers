"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/api";
import { toast } from "react-hot-toast"

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  mainImage?: string;
}

interface OrderProduct {
  id: string;
  quantity: number;
  product: Product;
}

interface Order {
  id: string;
  adress: string;
  apartment: string;
  company: string;
  dateTime: string;
  email: string;
  lastname: string;
  name: string;
  phone: string;
  postalCode: string;
  city: string;
  country: string;
  orderNotice: string;
  status: "processing" | "delivered" | "canceled";
  total: number;
}

const AdminSingleOrder: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, productsRes] = await Promise.all([
          apiClient.get(`/api/orders/${params?.id}`),
          apiClient.get(`/api/order-product/${params?.id}`),
        ]);

        const orderData = await orderRes.json();
        const productsData = await productsRes.json();

        setOrder(orderData);
        setOrderProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        toast.error("Error fetching order data");
      }
    };
    fetchData();
  }, [params?.id]);

  const handleUpdate = async () => {
    if (!order) return;

    try {
      const response = await apiClient.put(`/api/orders/${order.id}`, order);
      if (response.ok) {
        toast.success(" Order updated successfully!");
      } else {
        throw new Error("Failed to update order");
      }
    } catch {
      toast.error(" Error updating order");
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    try {
      await apiClient.delete(`/api/order-product/${order.id}`);
      await apiClient.delete(`/api/orders/${order.id}`);
      toast.success(" Order deleted");
      router.push("/dashboard/admin/orders");
    } catch {
      toast.error(" Error deleting order");
    }
  };

  if (!order)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading order details...
        </p>
      </div>
    );

  const totalTax = order.total / 5;
  const shipping = 5;
  const grandTotal = order.total + totalTax + shipping;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">
         Order Details — #{order.id}
      </h1>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Customer Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "First Name", value: order.name, key: "name" },
                { label: "Last Name", value: order.lastname, key: "lastname" },
                { label: "Email", value: order.email, key: "email" },
                { label: "Phone", value: order.phone, key: "phone" },
                { label: "Company", value: order.company, key: "company" },
                { label: "Address", value: order.adress, key: "adress" },
                { label: "Apartment", value: order.apartment, key: "apartment" },
                { label: "City", value: order.city, key: "city" },
                { label: "Country", value: order.country, key: "country" },
                { label: "Postal Code", value: order.postalCode, key: "postalCode" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-sm text-gray-500">{f.label}</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={f.value || ""}
                    onChange={(e) => setOrder({ ...order, [f.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Order Products */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ordered Products
            </h2>
            {orderProducts.length > 0 ? (
              <div className="space-y-4">
                {orderProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={
                          p.product.mainImage
                            ? `${p.product.mainImage}`
                            : "/product_placeholder.jpg"
                        }
                        alt={p.product.title}
                        width={60}
                        height={60}
                        className="rounded-lg border"
                      />
                      <div>
                        <Link
                          href={`/product/${p.product.id}`}
                          className="font-medium text-gray-800 hover:text-indigo-600"
                        >
                          {p.product.title}
                        </Link>
                        <p className="text-sm text-gray-500">
                          ₹{p.product.price} × {p.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-800">
                      ₹{(p.product.price * p.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No products found for this order.</p>
            )}
          </div>
        </div>

        {/* Right Column — Summary + Actions */}
        <div className="space-y-6">
          {/* Order Status & Notes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Order Settings
            </h2>

            <label className="text-sm text-gray-500">Status</label>
            <select
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              value={order.status}
              onChange={(e) =>
                setOrder({
                  ...order,
                  status: e.target.value as "processing" | "delivered" | "canceled",
                })
              }
            >
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>

            <div className="mt-4">
              <label className="text-sm text-gray-500">Order Notice</label>
              <textarea
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                rows={3}
                value={order.orderNotice || ""}
                onChange={(e) =>
                  setOrder({ ...order, orderNotice: e.target.value })
                }
              />
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Payment Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
<span>₹{order?.total?.toFixed(2) ?? "0.00"}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (20%)</span>
                <span>₹ {totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹ {shipping.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹ {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpdate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
            >
              Update Order
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
            >
              Delete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSingleOrder;
