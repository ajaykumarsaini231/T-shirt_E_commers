"use client";

import CategorySlider from "@/components/Category";
import Image from "next/image";
import Services from "@/components/features";

export default function About() {
  const imageUrl = '/banner/b2.jpg';

  return (
    <>
      <section
        className="w-full h-[50vh] min-h-[300px] flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 20, 30, 0.5), rgba(20, 20, 30, 0.5)), url(${imageUrl})`,
        }}
      >
        <div className="max-w-4xl px-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 drop-shadow-md">
            #KnowUs
          </h2>
          <p className="text-lg md:text-xl drop-shadow-md">
            Because every great brand has a story
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/banner/b23.jpg"
              alt="About Dreamora"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to <span className="font-semibold text-gray-800">Dreamora</span> — where creativity meets comfort. 
              Dreamora is a modern online store built with <span className="font-medium">Next.js, Express, and Prisma</span>, 
              dedicated to offering stylish, high-quality T-shirts that let you express your individuality.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe that fashion should be simple, expressive, and sustainable. 
              Every Dreamora T-shirt is designed to bring together unique designs, premium fabrics, 
              and a seamless online shopping experience.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From concept to checkout, Dreamora is built to make your journey effortless — 
              combining the power of modern web technologies with a passion for creativity. 
              Join us as we redefine how you shop for everyday essentials, one T-shirt at a time.
            </p>
          </div>
        </div>
      </section>

      <Services />
    </>
  );
}
