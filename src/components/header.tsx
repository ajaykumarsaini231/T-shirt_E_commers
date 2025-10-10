"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "../app/context/ThemeProvider";
import UserPanel from "../components/userPanel";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import { toast } from "react-hot-toast";

// ---------- ICONS ----------
const SunIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 
      12H3m15.364 6.364l-.707-.707M6.343 
      6.343l-.707-.707m12.728 0l-.707.707M6.343 
      17.657l-.707.707M16 12a4 4 0 11-8 
      0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 
      018.646 3.646 9.003 9.003 0 
      0012 21a9.003 9.003 0 
      008.354-5.646z"
    />
  </svg>
);

const HamburgerIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Logo = () => (
  <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-md text-2xl font-serif italic">
    d
  </div>
);

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

// ---------- HEADER ----------
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Load user + token from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(storedToken);
    }
  }, []);

  // ✅ Token expiry check
 // ✅ Token expiry check & full data clear
useEffect(() => {
  if (!token) return;

  try {
    const decoded: DecodedToken = jwtDecode(token);

    // Token expired
    if (Date.now() >= decoded.exp * 1000) {
      localStorage.clear();                // 🧹 Clear all localStorage
      sessionStorage.clear();              // 🧹 Also clear sessionStorage (if used)
      indexedDB.databases?.().then((dbs) => {
        dbs?.forEach((db) => indexedDB.deleteDatabase(db.name!)); // 🧹 Optional but full wipe
      });

      toast.error("Session expired. Please login again.");
      router.push("/login");

      // Optional: force reload to reset React states
      setTimeout(() => window.location.reload(), 500);
    }
  } catch {
    // Handle invalid/malformed token too
    localStorage.clear();
    sessionStorage.clear();
    indexedDB.databases?.().then((dbs) => {
      dbs?.forEach((db) => indexedDB.deleteDatabase(db.name!));
    });

    toast.error("Invalid session. Please login again.");
    router.push("/login");
    setTimeout(() => window.location.reload(), 500);
  }
}, [token, router]);


  // ✅ Fetch wishlist + cart counts
  const fetchCounts = useCallback(async () => {
    if (!user?.id || !token) return;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [wishlistRes, cartRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${user.id}`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${user.id}`, { headers }),
      ]);

      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        setWishlistCount(Array.isArray(wishlistData) ? wishlistData.length : 0);
      }

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const totalCount = Array.isArray(cartData)
          ? cartData.reduce((sum, item) => sum + (item.quantity || 1), 0)
          : 0;
        setCartCount(totalCount);
      }
    } catch (err) {
      console.error("❌ Failed to fetch counts:", err);
    }
  }, [user, token]);

  // ✅ Fetch counts on mount and pathname change
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, pathname]);

  // ✅ Listen for real-time updates
  useEffect(() => {
    const handleUpdate = () => fetchCounts();
    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("wishlistUpdated", handleUpdate);
    };
  }, [fetchCounts]);

  // ✅ NAV ITEMS
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-sky-100 dark:bg-sky-900 shadow-md p-4 flex justify-between items-center transition-colors duration-300 relative">
      <Link href="/">
        <Logo />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-8 font-medium">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`hover:text-black dark:hover:text-white transition-colors ${
              pathname === item.path
                ? "font-bold underline underline-offset-4"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white cursor-pointer transition-transform hover:scale-110"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Wishlist */}
        <Link href="/wishlist" className="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-black">
          <FaHeart className="w-6 h-6" />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Cart */}
        <Link href="/cart" className="relative flex items-center text-gray-700 dark:text-gray-300 hover:text-black">
          <FaShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User Avatar */}
        {!user ? (
          <Link
            href="/login"
            className="font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            Login
          </Link>
        ) : (
          <div className="flex items-center space-x-2">
            <img
              src={user.photoUrl || "https://placehold.co/100x100/6366f1/white?text=U"}
              alt="avatar"
              className="w-8 h-8 rounded-full border cursor-pointer"
              onClick={() => setIsPanelOpen(true)}
            />
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {user.name?.split(" ")[0] || "User"}
            </span>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
      >
        {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="absolute top-full left-0 w-full bg-sky-100 dark:bg-sky-900 shadow-md flex flex-col items-center space-y-4 py-6 md:hidden z-50">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`hover:text-black dark:hover:text-white ${
                pathname === item.path
                  ? "font-bold underline underline-offset-4"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {!user ? (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              Login
            </Link>
          ) : (
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {user.name?.split(" ")[0] || "User"}
            </span>
          )}
        </nav>
      )}

      {/* User Panel */}
      <UserPanel user={user} isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </header>
  );
}
