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
      <body className="bg-white antialiased text-foreground">
        <CartProvider>
          <Header />
          <main className="pt-[72px] min-h-screen">
            {children}
          </main>
          <Footer />
          <ChatbotWrapper />
        </CartProvider>
      </body>
    </html>
  );
}
