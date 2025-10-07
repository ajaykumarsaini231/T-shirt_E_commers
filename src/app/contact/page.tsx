"use client"

import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import ContactForm from "@/components/contactForm";

export default function Contact() {
  const imageUrl = "/banner/banner.png";


  return (
    <>
      {/* Hero Banner */}
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
            Building trust, one connection at a time ✨
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Google Map */}
          <div className="w-full h-80 md:h-[400px] rounded-lg overflow-hidden shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228510.23901948958!2d87.8316013!3d26.1036194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e4f57d79e3e0f5%3A0xfbc62f6c1c8d4eb1!2sKishanganj%2C%20Bihar!5e0!3m2!1sen!2sin!4v1706690000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center text-gray-800">
            <h2 className="text-2xl font-bold mb-4">Contact :</h2>

            <p className="mb-2">
              <strong>Address:</strong> Modigola, Caltex Chawk, Kishanganj, Bihar, India, 855107
            </p>
            <p className="mb-2">
              <strong>Phone:</strong>{" "}
              <a href="tel:810746****" className="text-blue-600 hover:underline">
                810746****
              </a>
            </p>
            <p className="mb-2">
              <strong>Email:</strong>{" "}
              <a
                href="mailto:nabalsaini231@gmail.com"
                className="text-blue-600 hover:underline"
              >
                nabalsaini231@gmail.com
              </a>
            </p>
            <p className="mb-4">
              <strong>Hours:</strong> Open 365
            </p>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-2">Follow Us :</h3>
              <div className="flex gap-4 text-xl">
                <a href="#" className="hover:text-blue-600">
                  <FaFacebookF />
                </a>
                <a href="#" className="hover:text-sky-400">
                  <FaTwitter />
                </a>
                <a href="#" className="hover:text-blue-700">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="hover:text-red-600">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm/>
    </>
  );
}
