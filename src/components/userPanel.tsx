"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  photoUrl?: string; 
};


interface UserPanelProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserPanel({ user, isOpen, onClose }: UserPanelProps) {
  const router = useRouter();

const handleLogout = async () => {
  try {
    // Call backend to invalidate session (optional but good)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    //  Clear all app-related data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("checkoutData");
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    localStorage.clear();

    toast.success("Logged out successfully!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 800);
  } catch (error) {
    console.error(" Logout failed:", error);
    toast.error("Logout failed, please try again!");
  }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose} // click outside closes
      ></div>

      {/* Sidebar */}
      <div className="relative w-80 bg-white dark:bg-gray-800 h-full shadow-lg p-6 flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
        >
          ✕
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center mt-8">
          <img
            src={user?.photoUrl || "https://placehold.co/100x100/6366f1/white?text=U"}
            alt="avatar"
            className="w-20 h-20 rounded-full border mb-4"
          />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {user?.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => {
              onClose(); // close panel
              router.push("/profile");
            }}
            className="w-full py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
