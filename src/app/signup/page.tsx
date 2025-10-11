"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";


const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestedPassword, setSuggestedPassword] = useState("");
  const router = useRouter();

    // const router = useRouter();

  // if token exists → redirect to /
  useEffect(() => {
    const token = Cookies.get("Authorization");
    if (token) {
      router.replace("/"); 
    }
  }, [router]);
  const generateStrongPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handlePasswordChange = (value: string) => {
    setFormData((prev) => ({ ...prev, password: value }));

    // Suggest password only once when typing weak password
    if (value.length > 0 && value.length < 8 && !suggestedPassword) {
      const newPassword = generateStrongPassword();
      setSuggestedPassword(newPassword);
    }

    // Hide suggestion when password is strong or cleared
    if (value.length >= 8 || value.length === 0) {
      setSuggestedPassword("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      handlePasswordChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        router.push(`/otp?email=${formData.email}`);
      } else {
        setErrorMsg(res.data.message || "Signup failed");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="w-full h-[50vh] min-h-[300px] flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 20, 30, 0.5), rgba(20, 20, 30, 0.5)), url(/banner/bannerwe.jpg)`,
        }}
      >
        <div className="max-w-4xl px-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">
            #SignUpNow
          </h2>
          <p className="text-lg md:text-xl drop-shadow-md">
            Create an account to start your journey with us!
          </p>
        </div>
      </section>

      {/* Signup Form */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all hover:scale-105">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
            Create Account
          </h2>

          {errorMsg && (
            <div className="mb-4 text-red-600 text-sm font-medium text-center animate-pulse">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />

              {/* Show strong password suggestion */}
              {suggestedPassword && (
                <div className="mt-2 text-sm text-gray-600">
                 <span className="font-medium">Suggested strong password:</span>{" "}
                  <span
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, password: suggestedPassword }))
                    }
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    title="Click to use this password"
                  >
                    {suggestedPassword}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-xl text-white transition-transform transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 hover:from-green-500 hover:to-blue-600"
              }`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Redirect to Login */}
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
