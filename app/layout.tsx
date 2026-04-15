
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotWrapper from "@/components/ChatbotWrapper";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/grasa/CartContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "GRASA",
  description: "Science Led Gut Health Solution",
  icons: {
  icon: [
    { url: "/logo.png", type: "image/png" },
    { url: "/favicon.ico" },
  ],
},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // ✅ Schema Added Here
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Grasa",
    "url": "https://www.grasamillets.com",
    "logo": "https://www.grasamillets.com/logo.png",
    "description": "Science-led gut health solution helping users identify root causes of digestive issues.",
    "areaServed": {
      "@type": "Place",
      "name": "Delhi NCR"
    }
  };

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      
      {/* ✅ ADD THIS HEAD */}
      <head>

        {/* ✅ Favicon FIX */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>

      <body className="bg-white antialiased text-slate-900">
        <CartProvider>

          <Header />

          <main className="pt-[72px]">
            {children}
          </main>

          <Footer />

          {/* ✅ Global Chatbot */}
          <ChatbotWrapper />

        </CartProvider>
      </body>
    </html>
  );
}