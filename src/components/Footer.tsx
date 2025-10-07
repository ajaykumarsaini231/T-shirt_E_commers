"use client"

import React from 'react';
import { Facebook, Twitter, Linkedin, Youtube, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <>
      <footer className="bg-white text-gray-700 font-sans border-t border-gray-200">
        <div className="container mx-auto px-6 py-12">
          {/* Main footer content grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Contact Info & Socials */}
            <div>
              <div className="mb-6">
                {/* Logo */}
                <a href="#" className="inline-block">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-md text-3xl font-serif italic">
                        d
                    </div>
                </a>
              </div>
              <h3 className="font-bold text-lg mb-3">Contact :-</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Address:</strong> IIT Patna, Bihta, Bihar, India, 801106</p>
                <p><strong>Phone:</strong> 810746****</p>
                <p><strong>Email:</strong> nabalsaini231@gmail.com</p>
                <p><strong>Hours:</strong> Open 365</p>
              </div>
              <h3 className="font-bold text-lg mt-6 mb-3">Follow Us :</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><Facebook size={20} /></a>
                <a href="#" className="text-gray-500 hover:text-sky-500 transition-colors"><Twitter size={20} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors"><Linkedin size={20} /></a>
                <a href="#" className="text-gray-500 hover:text-red-600 transition-colors"><Youtube size={20} /></a>
              </div>
            </div>

            {/* Column 2: About */}
            <div>
              <h3 className="font-bold text-lg mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Delivery Information</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Term & Conditions</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 3: My Account */}
            <div>
              <h3 className="font-bold text-lg mb-4">My Account</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-black transition-colors">Sign In</a></li>
                <li><a href="#" className="hover:text-black transition-colors">View Cart</a></li>
                <li><a href="#" className="hover:text-black transition-colors">My Wishlist</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Track MY Order</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Help</a></li>
              </ul>
            </div>

            {/* Column 4: App & Payment */}
            <div>
              <h3 className="font-bold text-lg mb-4">Install App</h3>
              <p className="text-sm mb-4">From App Store or Google play</p>
              <div className="space-y-3">
                <a href="#" className="inline-block">
                  <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" className="h-12"/>
                </a>
                <a href="#" className="inline-block">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" className="h-12"/>
                </a>
              </div>
              <h3 className="font-bold text-lg mt-6 mb-4">Secured payment Gateways</h3>
              <div className="flex flex-wrap items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" className="h-6"/>
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fd/Maestro_logo.svg" alt="Maestro" className="h-6"/>
                
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="American Express" className="h-6"/>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 text-center py-6 px-6">
          <p className="text-sm text-gray-500">
            © Designed and built by Ajay Kumar Saini with the help of Tailwind CSS.
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