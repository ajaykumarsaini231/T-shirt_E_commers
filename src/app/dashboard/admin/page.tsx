"use client";

import { useEffect, useState } from "react";
import { Users, ShoppingBag, Layers, ClipboardList } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function SidebarLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-md w-full text-left text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {icon}
      {children}
    </button>
  );
}

export function RecentOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/recent-orders?sort=${sortOrder}&days=2`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data.data);
      } catch (err) {
        console.error("Failed to load recent orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentOrders();
  }, [sortOrder]);

  if (loading)
    return (
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Orders</h2>
        <p className="text-gray-500 text-sm">Loading recent orders...</p>
      </div>
    );

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-500">Sort by:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">No orders found in the last 2 days.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {order.name} {order.lastname}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{order.email}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right font-medium">₹{order.total}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {order.dateTime ? new Date(order.dateTime).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    orders: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) setStats(res.data.data);
      } catch (err: any) {
        toast.error("Failed to load dashboard stats");
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Users",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      value: stats.users,
      bg: "bg-blue-100",
      href: "/dashboard/admin/users",
    },
    {
      title: "Products",
      icon: <ShoppingBag className="h-8 w-8 text-green-600" />,
      value: stats.products,
      bg: "bg-green-100",
      href: "/dashboard/admin/products",
    },
    {
      title: "Categories",
      icon: <Layers className="h-8 w-8 text-purple-600" />,
      value: stats.categories,
      bg: "bg-purple-100",
      href: "/dashboard/admin/categories",
    },
    {
      title: "Orders",
      icon: <ClipboardList className="h-8 w-8 text-orange-600" />,
      value: stats.orders,
      bg: "bg-orange-100",
      href: "/dashboard/admin/orders",
    },
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen bg-gray-50 flex flex-col max-w-screen-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview 👇</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => router.push(card.href)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") router.push(card.href);
            }}
            className={`${card.bg} rounded-2xl shadow-md p-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition focus:outline-none focus:ring-4 focus:ring-indigo-400`}
          >
            <div>
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
            </div>
            <div className="p-3 bg-white rounded-full shadow-inner">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Sidebar Navigation */}


      {/* Recent Orders Section */}
      <RecentOrders />
    </div>
  );
}
