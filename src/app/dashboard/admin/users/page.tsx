"use client";

// import DashboardSidebar from "@/components/DashboardSidebar";
// import CustomButton from "@/components/CustomButton";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
}

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/api/users");
        const data = await res.json();

        const usersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.users)
          ? data.users
          : [];

        setUsers(usersArray);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-700">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex max-w-screen-2xl mx-auto max-xl:flex-col">
      {/* <DashboardSidebar /> */}
      <div className="flex-1 px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 tracking-tight">
          All Users
        </h1>
        <div className="flex justify-end mb-6">
  <button
    type="button"
    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow px-6 py-2 text-lg font-medium transition"
    onClick={() => router.push("/dashboard/admin/users/new")}
  >
    Add new user
  </button>
</div>

        <div className="overflow-auto rounded-lg shadow h-[70vh] bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="p-4 text-left"></th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Role
                </th>
                <th className="p-4 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={nanoid()} className="hover:bg-indigo-50 transition">
                    <td className="p-4">
                      <input type="checkbox" className="checkbox checkbox-sm" />
                    </td>
                    <td className="p-4 text-gray-800">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          user.role === "admin"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                        onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-indigo-50">
              <tr>
                <th></th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsers;
