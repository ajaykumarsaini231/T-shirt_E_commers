"use client";

// *********************
// Role: Displays all orders on the admin dashboard
// Name: AdminOrders.tsx
// Developer: Aleksandar Kuzmanovic (updated by GPT-5)
// Version: 1.3 (fixed for fetch-based apiClient)
// *********************

import React, { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/api";

// -----------------------------
// 🧩 Type definitions
// -----------------------------
interface Order {
  id: string;
  name: string;
  country: string;
  status: string;
  total: number;
  dateTime: string;
}

interface OrdersResponse {
  orders: Order[];
}

// -----------------------------
// 🧩 Component
// -----------------------------
const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ✅ Your apiClient returns a native fetch Response
        const response = await apiClient.get("/admin/orders");

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        // ✅ Parse JSON response
        const data: OrdersResponse = await response.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("❌ Failed to fetch admin orders:", err);
        setError(err?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // -----------------------------
  // 🧩 Render Logic
  // -----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-gray-500 animate-pulse">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="xl:ml-5 w-full max-xl:mt-5">
      <h1 className="text-3xl font-semibold text-center mb-5">All Orders</h1>
      <div className="overflow-x-auto">
        <table className="table table-md table-pin-cols">
          {/* Head */}
          <thead>
            <tr>
              <th></th>
              <th>Order ID</th>
              <th>Name and Country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-100">
                  <td>
                    <input type="checkbox" className="checkbox" />
                  </td>
                  <td className="font-semibold text-gray-700">#{order.id}</td>
                  <td>
                    <div>
                      <div className="font-bold">{order.name}</div>
                      <div className="text-sm opacity-50">{order.country}</div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm text-white ${
                        order.status === "Completed"
                          ? "badge-success"
                          : order.status === "Pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>{new Date(order.dateTime).toLocaleDateString()}</td>
                  <td>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="btn btn-ghost btn-xs"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-10">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>

          {/* Foot */}
          <tfoot>
            <tr>
              <th></th>
              <th>Order ID</th>
              <th>Name and Country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
