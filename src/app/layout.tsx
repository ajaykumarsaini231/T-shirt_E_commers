// import "./globals.css";
// import { ThemeProvider } from "./context/ThemeProvider";
import Header from "../components/header";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "@/app/context/Authprovider";
import Newsletter from "@/components/Newsletter";
export const metadata = {
  title: "Dreamora",
  description: "Dreamora is a modern e-commerce web application built with Next.js, Express, and Prisma, designed to sell custom T-shirts online. It offers a seamless shopping experience with a dynamic product catalog, secure backend, and smooth checkout process.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>        
          <AuthProvider>
          <ThemeProvider>
           <Header />

            {children}
             <Toaster position="top-right" />
            <Newsletter/>
          <Footer />
          </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}

