
// import "./globals.css";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Geist } from "next/font/google";
// import { cn } from "@/lib/utils";
// import { CartProvider } from "@/components/grasa/CartContext";

// const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// export const metadata = {
//   title: "GRASA - Science Led Gut Health",
//   description: "Science Led Gut Health Solution",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={cn("font-sans", geist.variable)}>
//       <body className="bg-white antialiased text-slate-900">
//         <CartProvider>
//           <Header />
//           <main className="pt-[72px]">{children}</main>
//           <Footer />
//         </CartProvider>
//       </body>
//     </html>
//   );
// }



import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget"; // ✅ added
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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-white antialiased text-slate-900">
        <CartProvider>

          <Header />

          <main className="pt-[72px]">
            {children}
          </main>

          <Footer />

          {/* ✅ Global Chatbot */}
          <ChatbotWidget />

        </CartProvider>
      </body>
    </html>
  );
}