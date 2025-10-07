"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  Heart,
  LogOut,
  ChevronRight,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import WishlistPage from "../wishlist/page";
import toast from "react-hot-toast"; // ✅ FIXED import
import { useRouter } from "next/navigation"; // ✅ Import router

// --- MOCK DATA (User and Orders can be replaced with actual session/API data) ---

const mockUser = {
  name: "user",
  email: "ajay@example.com",
  avatarUrl: "https://placehold.co/100x100/6366f1/white?text=A",
};

const mockOrders = [
  {
    id: "#34567",
    date: "October 3, 2025",
    status: "Delivered",
    total: "$150.00",
    items: 3,
  },
  {
    id: "#34566",
    date: "September 28, 2025",
    status: "Delivered",
    total: "$75.50",
    items: 1,
  },
  {
    id: "#34565",
    date: "September 15, 2025",
    status: "Cancelled",
    total: "$210.00",
    items: 2,
  },
  {
    id: "#34564",
    date: "August 21, 2025",
    status: "Processing",
    total: "$99.99",
    items: 1,
  },
];

// Define a type for our address object for type safety

// --- SUB-COMPONENTS for each tab ---

const DashboardContent = () => {
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // ✅ Ensure this runs only on the client to avoid hydration mismatch
    setIsClient(true);

    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (storedUser) setUser(JSON.parse(storedUser));

    // ✅ Only proceed if userId and token are available
    if (token && storedUserId) {
      const userId = storedUserId;

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      console.log(token);
      // ✅ Fetch total orders
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/${userId}`, { headers })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setOrdersCount(Array.isArray(data) ? data.length : 0))
        .catch((err) => {
          console.error("❌ Failed to fetch orders:", err);
          setOrdersCount(0);
        });

      // ✅ Fetch saved addresses
      // ✅ Correct
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses/${userId}`, { headers })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) =>
          setAddressesCount(Array.isArray(data) ? data.length : 0)
        )
        .catch((err) => {
          console.error("❌ Failed to fetch addresses:", err);
          setAddressesCount(0);
        });

      // ✅ Fetch wishlist count
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${userId}`, { headers })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setWishlistCount(Array.isArray(data) ? data.length : 0))
        .catch((err) => {
          console.error("❌ Failed to fetch wishlist:", err);
          setWishlistCount(0);
        });
    }
  }, []);

  // 🚫 Prevents rendering before client-side hydration completes
  if (!isClient) return null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <p className="text-gray-600 mb-6">
        Hello, <span className="font-semibold">{user?.name || "User"}</span>!
        From your dashboard, you can view your recent orders, manage your
        shipping and billing addresses, and edit your password and account
        details.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ✅ Total Orders */}
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <Package className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <p className="text-3xl font-bold">{ordersCount}</p>
          <p className="text-gray-500">Total Orders</p>
        </div>

        {/* ✅ Saved Addresses */}
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <MapPin className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <p className="text-3xl font-bold">{addressesCount}</p>
          <p className="text-gray-500">Saved Addresses</p>
        </div>

        {/* ✅ Wishlist Items */}
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <Heart className="mx-auto h-8 w-8 text-blue-600 mb-2" />
          <p className="text-3xl font-bold">{wishlistCount}</p>
          <p className="text-gray-500">Items in Wishlist</p>
        </div>
      </div>
    </div>
  );
};

const OrdersContent = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userId =
      typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    if (!token || !userId) {
      toast.error("⚠️ Please log in again.");
      setError("No token or user ID found");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // ✅ Handle special case for "no orders"
        if (res.status === 404) {
          console.warn("No orders found for this user.");
          setOrders([]); // Empty array = no orders
          return;
        }

        // ❌ Handle other failures
        if (!res.ok) {
          console.error("❌ Failed to fetch orders:", res.status);
          throw new Error(`Failed to fetch orders (${res.status})`);
        }

        const data = await res.json();

        // ✅ Safe handling for non-array responses
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.warn("⚠️ Orders API did not return an array:", data);
          setOrders([]);
        }
      } catch (err: any) {
        console.error("❌ Failed to load orders:", err);
        toast.error("Failed to load orders.");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🧩 Optional: You can uncomment this to test UI with fake orders
  /*
  useEffect(() => {
    setOrders([
      {
        id: "12345678",
        dateTime: new Date().toISOString(),
        status: "Delivered",
        total: 2999,
        products: [
          {
            id: "p1",
            quantity: 1,
            product: {
              title: "Sample Product",
              mainImage: "uploads/sample.jpg",
              price: 2999,
            },
          },
        ],
      },
    ]);
    setLoading(false);
  }, []);
  */

  const getStatusChipClass = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading your orders...
      </div>
    );

  if (error)
    return <div className="text-center py-20 text-red-500">⚠️ {error}</div>;

  if (orders.length === 0)
    return (
      <div className="text-center py-20 text-gray-500">
        <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
        <p className="text-gray-400">You haven’t placed any orders yet.</p>
      </div>
    );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      <div className="bg-white rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <React.Fragment key={order.id}>
                  <tr className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-blue-600">
                      #{order.id?.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4">
                      {order.dateTime
                        ? new Date(order.dateTime).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusChipClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      ₹{order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {expandedOrder === order.id
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </td>
                  </tr>

                  {/* Expandable product list */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 px-6 py-4">
                        <div className="space-y-4">
                          {order.products?.length ? (
                            order.products.map((p: any) => (
                              <div
                                key={p.id}
                                className="flex items-center border rounded-lg p-3 bg-white shadow-sm"
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL}/${p.product?.mainImage}`}
                                  alt={p.product?.title}
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                                <div className="ml-4 flex-1">
                                  <h4 className="font-semibold text-gray-800">
                                    {p.product?.title}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Qty: {p.quantity}
                                  </p>
                                </div>
                                <div className="text-right font-medium text-gray-800">
                                  ₹{(p.product?.price || 0) * (p.quantity || 1)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No product details found for this order.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface Address {
  id: string;
  name: string;
  lastname: string;
  adress: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const AddressesContent = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!userId || !token) {
      setError("User not logged in");
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save (create) or update address
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !token) return;

    try {
      setIsLoading(true);

      const payload = { ...form, userId };
      const url = editId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses/${editId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses/`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => null);
        throw new Error(
          txt ||
            (editId ? "Failed to update address" : "Failed to save address")
        );
      }

      await fetchAddresses();

      // ✅ Show toast only when updating
      if (editId) {
        toast.success("✅ Address updated successfully!");
      }

      setShowForm(false);
      setEditId(null);
      setForm({
        name: "",
        lastname: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        isDefault: false,
      });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({
      name: addr.name,
      lastname: addr.lastname,
      address: addr.adress,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone || "",
      isDefault: addr.isDefault,
    });
    setEditId(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/addresses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete address");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const formatDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "";

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-4 text-gray-500">Loading your addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-lg font-semibold text-red-700">
          Something went wrong
        </h3>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setEditId(null);
            setForm({
              name: "",
              lastname: "",
              address: "",
              city: "",
              postalCode: "",
              country: "",
              phone: "",
              isDefault: false,
            });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "Add New Address"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-gray-50 p-6 rounded-lg border space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="First Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full col-span-2"
              required
            />
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
            <input
              name="phone"
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              <span>Set as default address</span>
            </label>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {editId ? "Update Address" : "Save Address"}
          </button>
        </form>
      )}

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div key={addr.id} className="border rounded-lg p-5 relative">
              <p className="font-bold text-lg mb-1">
                {addr.name} {addr.lastname}
              </p>
              <p className="text-gray-600 text-sm mb-2">{addr.adress}</p>
              <p className="text-gray-600 text-sm">
                {addr.city}, {addr.postalCode}
              </p>
              <p className="text-gray-600 text-sm">{addr.country}</p>

              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => handleEdit(addr)}
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  <Edit3 size={16} className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} className="mr-1" /> Remove
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                <div>Added: {formatDate(addr.createdAt)}</div>
                <div>Updated: {formatDate(addr.updatedAt)}</div>
              </div>

              {addr.isDefault && (
                <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-12 px-6 bg-gray-50 rounded-lg border">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No Saved Addresses
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              You haven’t saved any addresses yet.{" "}
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Add one now
              </button>
            </p>
          </div>
        )
      )}
    </div>
  );
};

const AccountDetailsContent = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6">Account Details</h2>
    <div className="bg-white p-8 rounded-lg border">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              defaultValue={mockUser.name}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              defaultValue={mockUser.email}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">
            Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                placeholder="••••••••"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                placeholder="••••••••"
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
);

// --- MAIN PROFILE PAGE COMPONENT ---

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // State for managing addresses fetched from the API
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ If no token → redirect to login
    if (!token) {
      toast.error("⚠️ Please login to access your profile");
      router.push("/login");
    }
  }, [router]);

  // Fetch addresses when the component mounts or when the user email changes
  useEffect(() => {
    // We only fetch addresses if the user is viewing the addresses tab to be efficient
    if (activeTab === "addresses" && addresses.length === 0) {
      const fetchAddresses = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // This endpoint needs to be created in your Next.js API routes.
          // It should fetch all orders for a given user email.
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/orders/email/${mockUser.email}`
          );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch addresses. Please try again later."
            );
          }

          const ordersData = await response.json();

          // The API returns all orders. We need to extract unique addresses.
          const addressMap = new Map<string, Address>();

ordersData.orders.forEach((order: any) => {
  const fullAddress = `${order.adress}, ${order.city}, ${order.postalCode}, ${order.country}`.toLowerCase();

  if (!addressMap.has(fullAddress)) {
    addressMap.set(fullAddress, {
      id: order.id || crypto.randomUUID(), // ✅ fallback id
      name: order.name,
      lastname: order.lastname,
      adress: order.adress,
      city: order.city,
      country: order.country,
      postalCode: order.postalCode,
      phone: order.phone || "",
      isDefault: false,
      userId: order.userId || "unknown",
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || new Date().toISOString(),
    });
  }
});


          setAddresses(Array.from(addressMap.values()));
        } catch (err: any) {
          setError(err.message || "An unknown error occurred.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchAddresses();
    }
  }, [activeTab, addresses.length]);

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "orders":
        return <OrdersContent />;
      case "addresses":
        return (
          <AddressesContent  />
        );
      case "account":
        return <AccountDetailsContent />;
      case "wishlist":
        return <WishlistPage />;
      default:
        return <DashboardContent />;
    }
  };

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    photoUrl: "/default-avatar.png",
  });

  useEffect(() => {
    // ✅ Try to get user data from localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("⚠️ Failed to parse user from localStorage:", err);
      }
    }
  }, []);
interface NavLinkProps {
  tabName: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ tabName, icon: Icon, label }) => (

    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? "bg-blue-100 text-blue-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <Icon size={20} className="mr-3" />
      <span className="flex-1">{label}</span>
      <ChevronRight size={16} />
    </button>
  );

  const handleLogout = async () => {
    try {
      // 🔹 Call backend to invalidate session (optional but good)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // 🔹 Clear all app-related data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("cart");
      localStorage.removeItem("wishlist");
      localStorage.removeItem("checkoutData");

      // 🔹 Optional: clear session storage too
      sessionStorage.clear();

      // 🔹 Optional: if you use cookies for auth
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // 🔹 Optional: full site data reset
      localStorage.clear();

      toast.success("Logged out successfully!");

      // 🔹 Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (error) {
      console.error("❌ Logout failed:", error);
      toast.error("Logout failed, please try again!");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- Sidebar Navigation --- */}
          <aside className="lg:col-span-3">
            <div className="bg-white p-4 rounded-lg border sticky top-24">
              <div className="flex items-center space-x-4 mb-5">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${
                    user.photoUrl || "/default-avatar.png"
                  }`}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {user.name || "Guest User"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {user.email || "No email available"}
                  </p>
                </div>
              </div>
              <nav className="space-y-1">
                <NavLink
                  tabName="dashboard"
                  icon={LayoutDashboard}
                  label="Dashboard"
                />
                <NavLink tabName="orders" icon={Package} label="Orders" />
                <NavLink tabName="addresses" icon={MapPin} label="Addresses" />
                <NavLink
                  tabName="account"
                  icon={User}
                  label="Account Details"
                />
                <NavLink tabName="wishlist" icon={Heart} label="Wishlist" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
                >
                  <LogOut size={20} className="mr-3 text-red-500" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <main className="lg:col-span-9">
            <div className="bg-white p-6 sm:p-8 rounded-lg border">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
