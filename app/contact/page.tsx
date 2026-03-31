// "use client"

// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { ArrowRight, Phone, Mail } from "lucide-react"
// import { motion } from "framer-motion"

// // ✅ Function to generate JSON-LD schema object
// const generateContactSchema = () => {
//   const domain = "https://www.grasafoods.com"
//   const logoUrl = `${domain}/logo.png`

//   return {
//     "@context": "https://schema.org",
//     "@type": "ContactPage",
//     "name": "GRASA Super Foods & Beverages Contact Us",
//     "description":
//       "Get in touch with GRASA Super Foods & Beverages for product inquiries, partnership opportunities, or support.",
//     "url": `${domain}/contact`,
//     "mainEntity": {
//       "@type": "Organization",
//       "name": "GRASA Super Foods & Beverages Pvt. Ltd.",
//       "url": domain,
//       "logo": logoUrl,
//       "contactPoint": [
//         {
//           "@type": "ContactPoint",
//           "telephone": "+91-9870263399",
//           "contactType": "customer service",
//           "email": "support@grasafoods.com",
//           "areaServed": "IN",
//           "availableLanguage": "en",
//         },
//         {
//           "@type": "ContactPoint",
//           "email": "support@grasafoods.com",
//           "contactType": "sales",
//           "areaServed": "IN",
//           "availableLanguage": "en",
//         },
//       ],
//       "address": {
//         "@type": "PostalAddress",
//         "addressLocality": "New Delhi",
//         "addressCountry": "IN",
//       },
//     },
//   }
// }

// // ✅ Reusable floating animation bubble
// const FloatingBubble = ({ delay, size, color, top, left }: any) => (
//   <motion.div
//     initial={{ y: 0, opacity: 0.7 }}
//     animate={{
//       y: [0, -15, 0],
//       opacity: [0.7, 1, 0.7],
//     }}
//     transition={{
//       duration: 4,
//       repeat: Infinity,
//       delay,
//       ease: "easeInOut",
//     }}
//     className="absolute rounded-full blur-md"
//     style={{
//       background: color,
//       width: size,
//       height: size,
//       top,
//       left,
//     }}
//   />
// )

// export default function ContactPage() {
//   const jsonLd = generateContactSchema()

//   return (
//     <>
//       {/* ✅ JSON-LD Schema */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       {/* ✅ Main Content */}
//       <div className="bg-gray-50 min-h-screen flex items-center justify-center py-16 px-4">
//         <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl p-8 md:p-16 flex flex-col md:flex-row gap-12 relative overflow-hidden">
//           {/* ✅ Left Column: Framer Motion Animation */}
//           <div className="md:w-1/2 flex items-center justify-center relative overflow-hidden">
//             {/* Background Animated Layer */}
//             <div className="absolute inset-0">
//               <FloatingBubble
//                 delay={0}
//                 size="100px"
//                 color="rgba(30,119,10,0.25)"
//                 top="10%"
//                 left="20%"
//               />
//               <FloatingBubble
//                 delay={1.2}
//                 size="70px"
//                 color="rgba(20,92,8,0.35)"
//                 top="40%"
//                 left="60%"
//               />
//               <FloatingBubble
//                 delay={2.3}
//                 size="120px"
//                 color="rgba(45,140,20,0.2)"
//                 top="70%"
//                 left="30%"
//               />
//               <FloatingBubble
//                 delay={0.8}
//                 size="60px"
//                 color="rgba(15,80,5,0.25)"
//                 top="20%"
//                 left="70%"
//               />
//             </div>

//             {/* Foreground Text Animation */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//               className="relative z-10 text-center md:text-left"
//             >
//               <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e770a] mb-4">
//                 Let’s Connect!
//               </h2>
//               <p className="text-zinc-600 text-lg max-w-sm">
//                 Reach out for collaborations, support, or insights into our
//                 precision nutrition research.
//               </p>
//             </motion.div>
//           </div>

//           {/* ✅ Right Column: Contact Info */}
//           <div className="md:w-1/2 flex flex-col gap-2 relative z-10">
//             <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1e770a]">
//               We’d Love to Hear From You.
//             </h1>
//             <p className="text-zinc-600 text-lg">
//               Whether you have a question about our products, gut health, or
//               partnership opportunities — the GRASA team is here for you.
//             </p>

//             {/* --- Contact Details --- */}
//             <div className="flex flex-col gap-2 text-zinc-700">
//               <div>
//                 <p className="font-serif font-bold text-xl">Head Office</p>
//                 <p>GRASA Super Foods & Beverages Pvt. Ltd.</p>
//                 <p>New Delhi, India</p>
//               </div>

//               <div className="flex flex-col md:flex-row md:gap-8">
//                 {/* Phone Section */}
//                 <div className="flex flex-col gap-1">
//                   <p className="font-serif font-semibold text-xl flex items-center gap-2">
//                     <Phone className="w-5 h-5 text-gray-600" />
//                     Phone
//                   </p>
//                   <Link
//                     href="tel:+919870263399"
//                     className="text-[#1e770a] hover:underline"
//                   >
//                     +91-9870263399
//                   </Link>
//                 </div>

//                 {/* Email Section */}
//                 <div className="flex flex-col gap-1">
//                   <p className="font-serif font-semibold text-xl flex items-center gap-2">
//                     <Mail className="w-5 h-5 text-gray-600" />
//                     Email
//                   </p>
//                   <Link
//                     href="mailto:info@grasafoods.com"
//                     className="text-[#1e770a] hover:underline"
//                   >
//                     info@grasafoods.com
//                   </Link>
//                 </div>
//               </div>

//               {/* Orders Section */}
//               <div>
//                 <p className="font-serif font-semibold text-xl flex items-center gap-2">
//                   🛒 For Orders & Deliveries
//                 </p>
//                 <Link
//                   href="mailto:support@grasafoods.com"
//                   className="text-[#1e770a] hover:underline"
//                 >
//                   support@grasafoods.com
//                 </Link>
//               </div>
//             </div>

//             {/* CTA Section */}
//             <div>
//               <p className="text-lg text-zinc-700 mb-2">
//                 Looking for products?
//               </p>
//               <Button
//                 className="py-3 px-6 text-lg bg-[#1e770a] hover:bg-[#145c08] hover:underline shadow-lg rounded-xl"
//                 asChild
//               >
//                 <Link href="/products">
//                   Shop Products
//                   <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5 inline" />
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }







"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

// ✅ Function to generate JSON-LD schema object
const generateContactSchema = () => {
  const domain = "https://www.grasafoods.com";
  const logoUrl = `${domain}/logo.png`;

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "GRASA Super Foods & Beverages Contact Us",
    "description": "Get in touch with GRASA for product inquiries, partnership opportunities, or support.",
    "url": `${domain}/contact`,
    "mainEntity": {
      "@type": "Organization",
      "name": "GRASA Super Foods & Beverages Pvt. Ltd.",
      "url": domain,
      "logo": logoUrl,
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-9870263399",
          "contactType": "customer service",
          "email": "support@grasafoods.com",
          "areaServed": "IN",
          "availableLanguage": "en",
        },
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "New Delhi",
        "addressCountry": "IN",
      },
    },
  };
};

export default function ContactPage() {
  const jsonLd = generateContactSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="w-full bg-[#ebecdf] py-16 md:py-24 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-12 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT - Brand Style */}
          <div>
            <span className="inline-block text-[#1b1b1b] text-sm uppercase tracking-wider font-bold mb-3">
              Get in Touch
            </span>

            <h1 className="text-[34px] md:text-[42px] leading-tight font-bold text-[#1b1b1b] mb-4">
              We’d love to hear from you.
              <br />
              Talk to the GRASA team.
            </h1>

            <div className="w-12 h-[3px] bg-[#1b1b1b] mb-6"></div>

            <p className="text-[#5c5c5c] max-w-lg mb-10 text-md leading-relaxed">
              Whether you have questions about our products, gut health, or
              partnership opportunities, we are here to provide honest insights.
            </p>

            <div className="space-y-8">
              {/* ITEM: PHONE */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C5D82D] flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-[#1b1b1b]" />
                </div>
                <div>
                  <p className="font-semibold text-md text-[#1b1b1b]">Call or WhatsApp</p>
                  <Link href="tel:+919870263399" className="text-gray-600 text-sm mt-1 hover:text-[#1b1b1b] block">
                    +91 98702 63399
                  </Link>
                </div>
              </div>

              {/* ITEM: EMAIL */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C5D82D] flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-[#1b1b1b]" />
                </div>
                <div>
                  <p className="font-semibold text-md text-[#1b1b1b]">Email Support</p>
                  <Link href="mailto:support@grasafoods.com" className="text-gray-600 text-sm mt-1 hover:text-[#1b1b1b] block">
                    support@grasafoods.com
                  </Link>
                  <Link href="mailto:info@grasafoods.com" className="text-gray-600 text-sm mt-1 hover:text-[#1b1b1b] block">
                    info@grasafoods.com
                  </Link>
                </div>
              </div>

              {/* ITEM: ADDRESS */}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#C5D82D] flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-[#1b1b1b]" />
                </div>
                <div>
                  <p className="font-semibold text-md text-[#1b1b1b]">Head Office</p>
                  <p className="text-gray-600 text-sm mt-1">
                    GRASA MILLETS & FOODS Pvt. Ltd.
                    <br />
                    New Delhi, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Consultation Form Style */}
          <div className="bg-[#f4f4f2] rounded-xl p-8 shadow-sm border border-[#d6d1c4] relative overflow-hidden">
            <span className="inline-block bg-[#C5D82D] text-[#1b1b1b] uppercase text-xs px-4 py-2 rounded-full mb-6 font-bold">
              ✦ Support · Sales · Partnerships
            </span>

            <h3 className="text-2xl font-bold text-[#1b1b1b] mb-2">Instant Connection</h3>
            <p className="text-gray-600 mb-8">
              Reach out directly on WhatsApp for the fastest response regarding orders or product queries.
            </p>

            <div className="space-y-4">
              <a
                href="https://wa.me/919870263399"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#C5D82D] text-gray-900 py-4 rounded-md font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-xl" />
                Message Us on WhatsApp
              </a>

              <Link
                href="/products"
                className="w-full border border-[#1b1b1b] text-[#1b1b1b] py-4 rounded-md font-bold text-lg hover:bg-[#1b1b1b] hover:text-white transition flex items-center justify-center gap-2"
              >
                Browse Shop
                <ArrowRight size={20} />
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-[#d6d1c4]">
              <p className="text-sm text-gray-500 text-center">
                Our support team is available Monday to Saturday
                <br />
                {/* <span className="font-bold text-[#1b1b1b]">10:00 AM — 07:00 PM IST</span> */}
              </p>
            </div>
            
            {/* Subtle background flair to match the "bubbles" but in brand colors */}
            <motion.div 
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#C5D82D] rounded-full blur-3xl -z-10"
            />
          </div>

        </div>
      </section>
    </>
  );
}