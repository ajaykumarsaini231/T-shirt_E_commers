"use client"

import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube, MessageSquare } from 'lucide-react';
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="bg-white text-gray-700 font-sans border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
          
          {/* 1️ Contact Info */}
          <div>
            <div className="flex justify-center sm:justify-start mb-6">
              <Link href="/" className="inline-block">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-md text-3xl font-serif italic">
                  d
                </div>
              </Link>
            </div>

            <h3 className="font-bold text-lg mb-3">Contact :</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Address:</strong> IIT Patna, Bihta, Bihar, India, 801106</p>
              <p><strong>Phone:</strong> 810746****</p>
              <p><strong>Email:</strong> nabalsaini231@gmail.com</p>
              <p><strong>Hours:</strong> Open 365</p>
            </div>

            <h3 className="font-bold text-lg mt-6 mb-3">Follow Us :</h3>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600"><Facebook size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-sky-500"><Twitter size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-blue-700"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-500 hover:text-red-600"><Youtube size={20} /></a>
            </div>
          </div>

          {/* 2️ About */}
          <div>
            <h3 className="font-bold text-lg mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="/profile" className="hover:text-black transition-colors">Delivery Information</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* 3️ My Account */}
          <div>
            <h3 className="font-bold text-lg mb-4">My Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-black transition-colors">Sign In</Link></li>
              <li><Link href="/cart" className="hover:text-black transition-colors">View Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-black transition-colors">My Wishlist</Link></li>
              <li><Link href="/orders" className="hover:text-black transition-colors">Track My Order</Link></li>
              <li><Link href="/help" className="hover:text-black transition-colors">Help</Link></li>
            </ul>
          </div>

          {/* 4️ App & Payments */}
          <div>
            <h3 className="font-bold text-lg mb-4">Install App</h3>
            <p className="text-sm mb-4">From App Store or Google Play</p>

            <div className="flex flex-col items-center sm:items-start space-y-3">
              <a href="#">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="h-12"
                />
              </a>
              <a href="#">
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Google Play"
                  className="h-12"
                />
              </a>
            </div>

            <h3 className="font-bold text-lg mt-6 mb-4">Secured Payment Gateways</h3>
            <div className="flex justify-center sm:justify-start flex-wrap items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-6"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Maestro_logo.svg" alt="Maestro" className="h-6"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6"/>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 text-center py-6 px-6">
        <p className="text-sm text-gray-500">
          © Designed and built by <span className="font-medium text-gray-700">Ajay Kumar Saini</span> with Tailwind CSS.
        </p>
      </div>
    </footer>

      {/* Floating Chat Button */}
      <button 
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Open chat"
      >
        <MessageSquare size={24} />
      </button>
    </>
  );
};

export default Footer;