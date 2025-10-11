"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { isValidEmailAddressFormat } from "@/lib/utils";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { sanitizeFormData } from "@/lib/form-sanitize";
import apiClient from "@/lib/api"; // ✅ use your Axios/fetch wrapper

const DashboardCreateNewUser = () => {
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const addNewUser = async () => {
    const { email, password, role } = userInput;

    //  Basic validation
    if (!email || !password) {
      toast.error("You must enter all input values to add a user");
      return;
    }

    if (!isValidEmailAddressFormat(email)) {
      toast.error("You entered an invalid email address format");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      // Sanitize before sending
      const sanitizedUserInput = sanitizeFormData({ email, password, role });

      // Send to backend
      const response = await apiClient.post(`/api/users`, sanitizedUserInput, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        toast.success("User added successfully");
        setUserInput({ email: "", password: "", role: "user" });
      } else {
        toast.error("Failed to create user");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user");
    }
  };

  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
      <DashboardSidebar />
      <div className="flex flex-col gap-y-7 xl:pl-5 max-xl:px-5 w-full">
        <h1 className="text-3xl font-semibold">Add new user</h1>

        {/* Email Field */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email:</span>
            </div>
            <input
              type="email"
              className="input input-bordered w-full max-w-xs"
              value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
            />
          </label>
        </div>

        {/* Password Field */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Password:</span>
            </div>
            <input
              type="password"
              className="input input-bordered w-full max-w-xs"
              value={userInput.password}
              onChange={(e) =>
                setUserInput({ ...userInput, password: e.target.value })
              }
            />
          </label>
        </div>

        {/* Role Selection */}
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">User role: </span>
            </div>
            <select
              className="select select-bordered"
              value={userInput.role}
              onChange={(e) =>
                setUserInput({ ...userInput, role: e.target.value })
              }
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-x-2">
          <button
            type="button"
            onClick={addNewUser}
            className="uppercase bg-blue-500 px-10 py-5 text-lg border border-gray-300 font-bold text-white shadow-sm hover:bg-blue-600 focus:ring-2"
          >
            Create user
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCreateNewUser;
