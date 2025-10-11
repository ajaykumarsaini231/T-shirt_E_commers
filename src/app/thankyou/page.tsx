"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  const router = useRouter();

  // Redirect after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/shop");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center px-4"
      >
        {/*  Thank You Title */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-3"
        >
           Thank You for Your Purchase!
        </motion.h1>

        {/*  Stylish tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl sm:text-2xl text-gray-700 font-medium italic"
        >
          “Because one good choice deserves another 💫”
        </motion.p>

        {/* Bouncing icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="mt-8 text-5xl"
        >
          🛍️
        </motion.div>

        {/* Redirect message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-10 text-sm text-gray-500"
        >
          Redirecting you to more treasures... ✨
        </motion.p>
      </motion.div>
    </div>
  );
}
