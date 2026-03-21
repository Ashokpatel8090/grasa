// "use client";
 
// import { Mail, Phone, MapPin } from "lucide-react";
 
// export default function Footer() {
//   return (
//     <footer className="bg-[#071a33] text-gray-300 w-full">
//       <div className="max-w-7xl mx-auto px-6 py-16">
 
//         {/* TOP GRID */}
//         <div className="grid md:grid-cols-4 gap-10">
 
//           {/* BRAND */}
//           <div>
//             <h2 className="text-white text-2xl font-semibold mb-4">
//               GRASA.
//             </h2>
 
//             <p className="text-gray-400 leading-relaxed mb-6">
//               Precision nutrition and functional foods crafted to support gut
//               health, anti-aging, and disease reversal.
//             </p>
 
//             <div className="flex gap-4">
//               {["YT", "IG", "FB", "💬"].map((item, i) => (
//                 <div
//                   key={i}
//                   className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
//                 >
//                   {item}
//                 </div>
//               ))}
//             </div>
//           </div>
 
//           {/* QUICK LINKS */}
//           <div>
//             <h3 className="text-white font-semibold mb-4 tracking-wide">
//               QUICK LINKS
//             </h3>
 
//             <ul className="space-y-3 text-gray-400">
//               <li className="hover:text-white cursor-pointer">
//                 Take The Gut Test™
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 My Recommended Plan
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 All Products
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 Customer Stories
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 Blog
//               </li>
//             </ul>
//           </div>
 
//           {/* POLICIES */}
//           <div>
//             <h3 className="text-white font-semibold mb-4 tracking-wide">
//               POLICIES
//             </h3>
 
//             <ul className="space-y-3 text-gray-400">
//               <li className="hover:text-white cursor-pointer">
//                 Money Back Policy
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 Return Policy
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 Privacy Policy
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 Terms & Conditions
//               </li>
//               <li className="hover:text-white cursor-pointer">
//                 Our Story
//               </li>
//             </ul>
//           </div>
 
//           {/* CONTACT */}
//           <div>
//             <h3 className="text-white font-semibold mb-4 tracking-wide">
//               CONTACT US
//             </h3>
 
//             <div className="space-y-4 text-gray-400">
 
//               <div className="flex items-center gap-3">
//                 <Mail size={18} />
//                 hello@grasafoods.com
//               </div>
 
//               <div className="flex items-center gap-3">
//                 <Phone size={18} />
//                 +91 9876543210
//               </div>
 
//               <div className="flex items-start gap-3">
//                 <MapPin size={18} />
//                 MediCAPS Healthcare Ecosystem, India
//               </div>
 
//             </div>
//           </div>
 
//         </div>
 
//         {/* DIVIDER */}
//         <div className="border-t border-white/10 mt-14 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-500">
 
//           <p>
//             © 2025 GRASA Foods. Powered by MediCAPS. All rights reserved.
//           </p>
 
//           <p>
//             Precision Nutrition · AI-Powered Healthcare
//           </p>
 
//         </div>
 
//       </div>
//     </footer>
//   );
// }




"use client"

import Link from "next/link"
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa"

// --- JSON-LD Schema Generation (Unchanged, as it's for SEO/data, not UI) ---
const generateFooterSchema = () => {
  const domain = "https://www.grasafoods.com"
  const logoUrl = `${domain}/GRASA.png`

  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GRASA SUPER FOODS BEVERAGES PVT LTD",
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
      "streetAddress": "IDC INDIA, GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
      "addressLocality": "New Delhi",
      "postalCode": "110001",
      "addressCountry": "IN",
    },
    "sameAs": [
      "https://www.instagram.com/grasa.medicaps.official/",
      "https://www.facebook.com/profile.php?id=61583618278901",
      "https://www.linkedin.com/company/medicaps-medical-comprehensive-awareness-prevention-and-treatment-support/posts/?feedView=all",
      "https://wa.me/919870263399"
    ]
  }

  // 2. Site Navigation Schema
  const navigationLinks = [
    { href: "/products", label: "Products" },
    { href: "/millet", label: "Millet" },
    { href: "/partner", label: "Partner" },
    { href: "/privacy-policy", label: "Privacy & Policy" },
    { href: "/terms-condition", label: "Terms & Conditions" },
    { href: "/contact", label: "Contact Us" },
  ]

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Footer Navigation",
    "url": domain,
    "hasPart": navigationLinks.map((item) => ({
      "@type": "WebPage",
      "name": item.label,
      "url": `${domain}${item.href}`,
    })),
  }

  return [organizationSchema, siteNavigationSchema]
}

// --- Social Icon Data ---
const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61583618278901", Icon: FaFacebook, color: "#1877F2", label: "Facebook" },
  { href: "https://www.instagram.com/grasa.medicaps.official/", Icon: FaInstagram, color: "#E1306C", label: "Instagram" },
  { href: "https://www.linkedin.com/company/medicaps-medical-comprehensive-awareness-prevention-and-treatment-support/posts/?feedView=all", Icon: FaLinkedin, color: "#0A66C2", label: "LinkedIn" },
  { href: "https://wa.me/919870263399", Icon: FaWhatsapp, color: "#25D366", label: "WhatsApp" },
]

// --- Footer Component ---
export default function Footer() {
  const year = new Date().getFullYear()
  const schemaData = generateFooterSchema()

  const links = {
    Product: [
      { href: "/products", label: "Products" },
      { href: "/blogs", label: "Blogs" },
      { href: "/vision-mission", label: "Vision & Mission" },
      { href: "/science", label: "Science" },
    ],
    Legal: [
      { href: "/privacy-policy", label: "Privacy & Policy" },
      { href: "/terms-condition", label: "Terms & Conditions" },
      { href: "/cancellation-refund", label: "Cancellation & Refund Policy" },
    ],
  }

  return (
    <>
      {/* JSON-LD SCHEMA SCRIPT */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* FOOTER STRUCTURE START */}
      <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 text-gray-700 transition-smooth">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-12 md:py-16 animate-fade-in-up">

          {/* Top Section: Logo, Info, Links, and Social */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">

            {/* Column 1: Company Logo and Core Info */}
            <div className="md:col-span-2 lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Grasa logo"
                  className="h-14 w-14 rounded-full shadow-md"
                />
                <h2 className="font-sans text-xl uppercase font-bold tracking-tight text-gray-800">
                  GRASA
                </h2>
              </div>

              <p className="text-md text-gray-600 max-w-md">
                Precision Nutrition Innovation Arm of MediCAPS. Dedicated to evidence-based wellness with a gentle, clinical aesthetic.
              </p>

              {/* Contact Information */}
              <div className="space-y-2 text-md">
                <p className="font-semibold text-gray-800">
                   GRASA MILLETS & FOODS PVT LTD
                </p>
                <p>
                  <a href="tel:9870263399" className="hover:text-primary transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    +91 9870263399
                  </a>
                </p>
                <p>
                  <a href="mailto:support@grasafoods.com" className="hover:text-primary transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    support@grasafoods.com
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">FSSAI Regd. No.:</span> 23326009000349
                </p>
              </div>
            </div>

            {/* Column 2 & 3: Navigation Links */}
            {Object.entries(links).map(([group, items], index) => (
              <div key={group} className={`space-y-4 ${index === 0 ? 'md:col-span-1' : 'md:col-span-1'}`}>
                <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary-500 inline-block pb-1">{group}</h3>
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className="text-md text-gray-600 hover:text-[#C5D82D] transition-smooth hover:translate-x-1 inline-block"
                      >
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 4 (or 5): Address and Social Media */}
            <div className="space-y-4 lg:col-span-1">
              <h3 className="text-base font-bold text-gray-800 border-b-2 border-primary-500 inline-block pb-1">Our Location</h3>
              <a
                href="https://www.google.com/maps?cid=3618521765991078645&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="text-md text-gray-600 leading-relaxed hover:text-primary block"
              >
                IDC INDIA, GL-7, Ashoka Estate Building, Barakhamba Road,
                Connaught Place, New Delhi – 110001
              </a>


              {/* Social Icons */}
              <div className="pt-2">
                <h3 className="text-base font-bold text-gray-800 mb-3">Connect</h3>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ href, Icon, color, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-transform duration-300 hover:scale-110"
                      aria-label={`Follow us on ${label}`}
                    >
                      <Icon size={46} style={{ color: color }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-md text-gray-500">
              © {year} GRASA MILLETS & FOODS PVT. LTD. || All rights reserved.
            </p>
          </div>

        </div>
      </footer>
      {/* FOOTER STRUCTURE END */}
    </>
  )
}
