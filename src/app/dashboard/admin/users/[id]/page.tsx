"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import apiClient from "@/lib/api";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface DashboardUserDetailsProps {
  params: Promise<{ id: string }>;
}

interface UserData {
  id: string;
  name?: string;
  email: string;
  role: string;
  verified?: boolean;
  photoUrl?: string;
  addresses?: any[];
  Wishlist?: any[];
  Cart?: any[];
  orders?: any[];
}

const DashboardSingleUserPage = ({ params }: DashboardUserDetailsProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); 
  const [user, setUser] = useState<UserData | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    newPassword: "",
    role: "",
    photoUrl: "",
    verified: false,
  });

  /** Fetch user info */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get(`/api/users/${id}`);
        const data = await res.json();
        setUser(data);
        setUserInput({
          name: data.name || "",
          email: data.email || "",
          newPassword: "",
          role: data.role || "",
          photoUrl: data.photoUrl || "",
          verified: data.verified || false,
        });
      } catch (err) {
        toast.error("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  /**  Update user info */
  const updateUser = async () => {
    if (!isValidEmailAddressFormat(userInput.email)) {
      toast.error("Invalid email address format");
      return;
    }

    setUpdating(true); //show loading
    try {
      const response = await apiClient.put(`/api/users/${id}`, {
        name: userInput.name,
        email: userInput.email,
        password: userInput.newPassword || undefined,
        role: userInput.role,
        photoUrl: userInput.photoUrl,
        verified: userInput.verified,
      });

      if (response.status === 200) {
        toast.success("User updated successfully");
        const updated = await response.json();
        setUser(updated);
        setUserInput({ ...userInput, newPassword: "" });
      } else {
        toast.error("Failed to update user");
      }
    } catch (err) {
      toast.error("Error updating user");
    } finally {
      setUpdating(false); // back to normal
    }
  };

  /** Delete user */
  const deleteUser = async () => {
    try {
      const res = await apiClient.delete(`/api/users/${id}`);
      if (res.status === 204) {
        toast.success("User deleted successfully");
        router.push("/dashboard/admin/users");
      } else {
        toast.error("Error deleting user");
      }
    } catch {
      toast.error("Error deleting user");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading user details...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        User not found.
      </div>
    );

  /**  Collapsible Section Component */
  const Section = ({
    title,
    children,
    sectionKey,
  }: {
    title: string;
    children: React.ReactNode;
    sectionKey: string;
  }) => (
    <div className="border rounded-lg bg-white shadow">
      <button
        onClick={() =>
          setOpenSection(openSection === sectionKey ? null : sectionKey)
        }
        className="flex justify-between items-center w-full px-5 py-4 text-left font-semibold text-gray-800 hover:bg-gray-50 transition"
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: openSection === sectionKey ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: openSection === sectionKey ? "auto" : 0,
          opacity: openSection === sectionKey ? 1 : 0,
        }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden border-t border-gray-200"
      >
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );

  return (
    <div className="bg-neutral-50 min-h-screen flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-6 p-6 rounded-lg shadow-md">
      {/* Main Content */}
      <div className="flex flex-col gap-y-8 xl:pl-8 max-xl:px-6 w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 border-b border-gray-300 pb-4">
          Manage User
        </h1>

        {/* User Photo */}
        {userInput.photoUrl && (
          <img
            src={userInput.photoUrl}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border shadow-md"
          />
        )}

        {/* Editable Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Full name"
              value={userInput.name}
              onChange={(e) =>
                setUserInput({ ...userInput, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Email address"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              New Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter new password"
              value={userInput.newPassword}
              onChange={(e) =>
                setUserInput({ ...userInput, newPassword: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Profile Photo URL
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Enter photo URL"
              value={userInput.photoUrl}
              onChange={(e) =>
                setUserInput({ ...userInput, photoUrl: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Role</label>
            <select
              className="w-full px-4 py-3 border rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={userInput.verified}
              onChange={(e) =>
                setUserInput({ ...userInput, verified: e.target.checked })
              }
              className="h-5 w-5 text-indigo-600 border--300 rounded focus:ring-indigo-500"
            />
            <label className="font-semibold text-gray-700">Verified</label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 max-sm:flex-col">
          <button
            onClick={updateUser}
            disabled={updating}
            className={`w-full text-white font-semibold py-3 rounded-md shadow-md transition ${
              updating
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>

          <button
            onClick={deleteUser}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-md shadow-md hover:bg-red-700 transition"
          >
            Delete User
          </button>
        </div>

        {/* Collapsible Data Sections */}
        <Section title="Addresses" sectionKey="addresses">
          {user.addresses?.length ? (
            user.addresses.map((addr, i) => (
              <div key={i} className="border rounded-md p-4 mb-2 bg-gray-50">
                {addr.name} {addr.lastname}, {addr.address}, {addr.city},{" "}
                {addr.country} - {addr.postalCode}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No addresses available.</p>
          )}
        </Section>

        <Section title="Orders" sectionKey="orders">
          {user.orders?.length ? (
            user.orders.map((order, i) => (
              <div key={i} className="border rounded-md p-4 mb-2 bg-gray-50">
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
                <p>
                  <strong>Total:</strong> ₹{order.total}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No orders found.</p>
          )}
        </Section>

        <Section title="Wishlist" sectionKey="wishlist">
          {user.Wishlist?.length ? (
            user.Wishlist.map((item, i) => (
              <div key={i} className="border rounded-md p-4 mb-2 bg-gray-50">
                <p>
                  <strong>Product:</strong> {item.product?.title}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No wishlist items.</p>
          )}
        </Section>

        <Section title="Cart" sectionKey="cart">
          {user.Cart?.length ? (
            user.Cart.map((item, i) => (
              <div key={i} className="border rounded-md p-4 mb-2 bg-gray-50">
                <p>
                  <strong>Product:</strong> {item.product?.title}
                </p>
                <p>
                  <strong>Qty:</strong> {item.quantity}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No items in cart.</p>
          )}
        </Section>
      </div>
    </div>
  );
};

export default DashboardSingleUserPage;
