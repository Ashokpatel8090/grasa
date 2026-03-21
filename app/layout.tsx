import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import ChatbotWidget from "@/components/ChatbotWidget"; // ✅ added
import ChatbotWrapper from "@/components/ChatbotWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/grasa/CartContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "GRASA - Science Led Gut Health",
  description: "Science Led Gut Health Solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", geist.variable)}>
      <head>
        <meta name="theme-color" content="#C5D82D" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className="bg-white antialiased text-slate-900 min-h-screen flex flex-col">
        <CartProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded focus-ring">
            Skip to main content
          </a>

          <Header />

          <main id="main-content" className="pt-[72px] flex-grow transition-smooth">
            {children}
          </main>

          <Footer />

          {/* Global Chatbot Widget */}
          <ChatbotWrapper />

        </CartProvider>
      </body>
    </html>
  );
}
