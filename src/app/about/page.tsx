"use client"

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
        // We apply a semi-transparent overlay and the background image here
        // This helps make the white text more readable against the image.
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
            src="/banner/b23.jpg" // 👈 put your image inside public folder
            alt="Who We Are"
            width={500}
            height={400}
            className="rounded-lg"
          />
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who We Are ?</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto
            voluptatibus beatae aspernatur cumque fugiat distinctio perferendis
            sed eius veniam perspiciatis? Sed inventore minus tenetur quis
            reprehenderit blanditiis maiores, temporibus iusto nostrum aut atque
            minima aperiam, porro eum facilis. Saepe incidunt consequuntur hic
            praesentium laborum quisquam animi consequatur fugiat libero
            repellat?
          </p>
        </div>
      </div>
    </section>
    <Services/>
    </>
  );
}

