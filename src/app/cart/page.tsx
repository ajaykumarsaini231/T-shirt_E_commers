"use client"
import SectionTitle from "@/components/SectionTitle"; 
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation"; 
import { toast } from "react-hot-toast";

const CartPage = () => {
  const router = useRouter(); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("⚠️ Please login to access your Cart");
      router.push("/login");
    }
  }, [router]);
  return (
    <div className="bg-white">
      <SectionTitle title="Cart Page" path="Home | Cart" />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Shopping Cart
          </h1>
          <Suspense fallback={<Loader />}>
            <CartModule />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
