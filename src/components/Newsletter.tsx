"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news-letter/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Subscribed successfully!");
        setEmail(""); // clear input
      } else {
        setStatus(` Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      setStatus(" Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#0a2342] py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Sign Up For Newsletters
          </h2>
          <p className="text-gray-300 mt-2">
            Get E-mail updates about our latest shop and{" "}
            <span className="text-yellow-400 font-semibold">Special offers.</span>
          </p>
        </div>

        {/* Right Form */}
        <form
          onSubmit={handleSubmit}
          className="flex justify-center flex-col sm:flex-row w-full md:w-auto rounded-md overflow-hidden shadow-md"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 w-full sm:w-80 outline-none bg-white text-gray-700 placeholder-gray-500 sm:rounded-l-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white font-semibold px-6 py-3 hover:bg-teal-700 transition w-full sm:w-auto mt-2 sm:mt-0 sm:rounded-r-md"
          >
            {loading ? "Submitting..." : "Sign Up"}
          </button>
        </form>
      </div>

      {status && (
        <p className="text-center mt-4 text-sm font-medium text-gray-200">
          {status}
        </p>
      )}
    </section>
  );
}
