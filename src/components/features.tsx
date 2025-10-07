"use client";

import Image from "next/image";

const services = [
  { id: 1, title: "Less Shipping Charges", image: "/features/f1.png", color: "bg-pink-100 text-pink-600" },
  { id: 2, title: "Order Online", image: "/features/f2.png", color: "bg-green-100 text-green-600" },
  { id: 3, title: "Save Money", image: "/features/f3.png", color: "bg-blue-100 text-blue-600" },
  { id: 4, title: "Promotions", image: "/features/f4.png", color: "bg-purple-100 text-purple-600" },
  { id: 5, title: "Happy Sell", image: "/features/f5.png", color: "bg-indigo-100 text-indigo-600" },
  { id: 6, title: "24/7 Support", image: "/features/f6.png", color: "bg-orange-100 text-orange-600" },
];

export default function Services() {
  return (
    <section className="py-12 px-4 md:px-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        Our Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex flex-col items-center justify-between p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 h-56"
          >
            {/* Image */}
            <div className="w-28 h-28 relative mb-4 flex items-center justify-center">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-contain"
              />
            </div>

            {/* Title */}
            <span
              className={`text-center mt-auto px-4 py-2 rounded-md text-sm font-semibold ${service.color}`}
            >
              {service.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
