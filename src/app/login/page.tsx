"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "@/app/context/Authprovider";
import { jwtDecode } from "jwt-decode"; 
export interface User {
  id?: string;         
  name: string;
  email: string;
  photoUrl?: string;
}


const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const auth = useContext(AuthContext);

    // const router = useRouter();

  // if token exists → redirect to /
  useEffect(() => {
    const token = Cookies.get("Authorization");
    if (token) {
      router.replace("/"); // go home if logged in
    }
  }, [router]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
    formData,
    { headers: { "Content-Type": "application/json" } }
  );

      if (res.data.success) {
        // Decode token
        const decoded: any = jwtDecode(res.data.token);
        const userId = decoded.userId;
        const role = decoded.role || res.data.user?.role;

        //  Save token in cookie (for SSR access)
        Cookies.set("Authorization", `Bearer ${res.data.token}`, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        //  Save to localStorage for client-side
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);

        //  Update global AuthContext
        auth?.login(res.data.token, {
          id: userId,
          name: res.data.user.name,
          email: res.data.user.email,
          photoUrl:
            res.data.user.photoUrl ||
            "https://placehold.co/100x100/6366f1/white?text=U",
        });

        // Redirect based on role
        if (role === "superadmin" || role === "admin") {
          window.location.href="/dashboard/admin";
        } else {
        window.location.href = "/";// redirect after login
        }
      } else {
        setErrorMsg(res.data.message || "Invalid credentials");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Login request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/*  Hero Section */}
      <section
        className="w-full h-[50vh] flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 20, 30, 0.5), rgba(20, 20, 30, 0.5)), url(/banner/bannerwe.jpg)`,
        }}
      >
        <div className="max-w-4xl px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-md">
            #LoginNow
          </h2>
          <p className="text-lg md:text-xl drop-shadow-md">
            Log in to explore more, shop more, and enjoy more
          </p>
        </div>
      </section>

      {/*  Login Form */}
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all hover:scale-105">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Login
          </h2>

          {/*  Error Message */}
          {errorMsg && (
            <div className="mb-4 text-red-600 text-sm font-medium text-center animate-pulse">
              {errorMsg}
            </div>
          )}

          {/*  Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-xl text-white transition-transform transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 hover:from-green-500 hover:to-blue-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Sign up redirect */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-green-500 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
