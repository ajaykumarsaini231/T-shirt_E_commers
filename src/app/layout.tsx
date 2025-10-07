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
  title: "My App",
  description: "Next.js app with NextAuth + ThemeProvider",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* ✅ Wrap providers here */}
        
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

