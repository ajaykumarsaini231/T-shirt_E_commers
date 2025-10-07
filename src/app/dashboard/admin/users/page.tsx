"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import CustomButton from "@/components/CustomButton";
import apiClient from "@/lib/api";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
}

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/api/users");

        // ✅ Handle both Axios and Fetch responses
        const data =
          res.data || (await res.json?.()) || {}; // If axios, use res.data; if fetch, call res.json()

        console.log("📦 API response:", data);

        // ✅ Extract the actual users array
        const usersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.users)
          ? data.users
          : [];

        if (!Array.isArray(usersArray)) {
          console.error("❌ Invalid data format from /api/users");
          setUsers([]);
        } else {
          setUsers(usersArray);
        }
      } catch (error) {
        console.error("❌ Failed to fetch users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto h-full max-xl:flex-col max-xl:h-fit max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="w-full">
        <h1 className="text-3xl font-semibold text-center mb-5">All Users</h1>

        <div className="flex justify-end mb-5">
          <Link href="/admin/users/new">
            <CustomButton
              buttonType="button"
              customWidth="110px"
              paddingX={10}
              paddingY={5}
              textSize="base"
              text="Add new user"
            />
          </Link>
        </div>

        <div className="xl:ml-5 w-full max-xl:mt-5 overflow-auto h-[80vh]">
          <table className="table table-md table-pin-cols w-full">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user) => (
                  <tr key={nanoid()}>
                    <th>
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>

            {/* foot */}
            <tfoot>
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
