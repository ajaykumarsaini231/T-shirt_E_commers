"use client"
import CategorySlider from "@/components/Category";
import Image from "next/image";

export default function Shop() {
  const imageUrl = '/banner/b1.jpg'; 

  return (
    <>
    <section
      className="w-full h-[50vh] min-h-[300px] flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
      style={{
        // We apply a semi-transparent overlay and the background image here
        // This helps make the white text more readable against the image.
        backgroundImage: `linear-gradient(rgba(20, 20, 30, 0.5), rgba(20, 20, 30, 0.5)), url(${imageUrl})`,
      }}
    >
      <div className="max-w-4xl px-4">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">
          #stayhome
        </h2>
        <p className="text-lg md:text-xl drop-shadow-md">
          save more with coupons & up to 70%off!
        </p>
      </div>
      
    </section>
    <CategorySlider />
    </>
  );
}

