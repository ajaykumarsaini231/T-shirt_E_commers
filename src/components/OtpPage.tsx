"use client"

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email: string })?.email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        // Store token and user info in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.user.name,
            email: res.data.user.email,
            photoUrl: res.data.user.photoUrl || "https://placehold.co/100x100/6366f1/white?text=U",
          })
        );

        alert(res.data.message);
        navigate("/"); // Redirect to home/dashboard
      } else {
        setErrorMsg(res.data.message || "OTP verification failed");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        {errorMsg && (
          <div className="mb-4 text-red-600 text-sm font-medium text-center animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium mb-1">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpPage;
