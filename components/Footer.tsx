// "use client"

// import Link from "next/link"
// import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa"

// // --- JSON-LD Schema Generation ---
// const generateFooterSchema = () => {
//   const domain = "https://www.grasafoods.com"
//   const logoUrl = `${domain}/GRASA.png`

//   // 1. Organization Schema
//   const organizationSchema = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     "name": "GRASA SUPER FOODS BEVERAGES PVT LTD",
//     "url": domain,
//     "logo": logoUrl,
//     "contactPoint": [
//       {
//         "@type": "ContactPoint",
//         "telephone": "+91-9870263399",
//         "contactType": "customer service",
//         "email": "",
//         "areaServed": "IN",
//         "availableLanguage": "en",
//       },
//     ],
//     "address": {
//       "@type": "PostalAddress",
//       "streetAddress": "IDC INDIA, GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
//       "addressLocality": "New Delhi",
//       "postalCode": "110001",
//       "addressCountry": "IN",
//     },
//     "sameAs": [
//       "https://www.instagram.com/grasa.medicaps.official/",
//       "https://www.facebook.com/profile.php?id=61583618278901",
//       "https://www.linkedin.com/company/medicaps-medical-comprehensive-awareness-prevention-and-treatment-support/posts/?feedView=all",
//       "https://wa.me/919870263399"
//     ]
//   }

//   // 2. Site Navigation Schema
//   const navigationLinks = [
//     { href: "/products", label: "Products"support@grasafoods.com },
//     { href: "/millet", label: "Millet" },
//     { href: "/partner", label: "Partner" },
//     { href: "/privacy-policy", label: "Privacy & Policy" },
//     { href: "/terms-condition", label: "Terms & Conditions" },
//     { href: "/contact", label: "Contact Us" },
//   ]

//   const siteNavigationSchema = {
//     "@context": "https://schema.org",
//     "@type": "SiteNavigationElement",
//     "name": "Footer Navigation",
//     "url": domain,
//     "hasPart": navigationLinks.map((item) => ({
//       "@type": "WebPage",
//       "name": item.label,
//       "url": `${domain}${item.href}`,
//     })),
//   }

//   return [organizationSchema, siteNavigationSchema]
// }

// // --- Social Icon Data ---
// const socialLinks = [
//   { href: "https://www.facebook.com/profile.php?id=61583618278901", Icon: FaFacebook, color: "#1877F2", label: "Facebook" },
//   { href: "https://www.instagram.com/grasa.medicaps.official/", Icon: FaInstagram, color: "#dc1d5c", label: "Instagram" },
//   { href: "https://www.linkedin.com/company/medicaps-medical-comprehensive-awareness-prevention-and-treatment-support/posts/?feedView=all", Icon: FaLinkedin, color: "#0A66C2", label: "LinkedIn" },
//   { href: "https://wa.me/919870263399", Icon: FaWhatsapp, color: "#25D366", label: "WhatsApp" },
// ]

// // --- Footer Component ---
// export default function Footer() {
//   const year = new Date().getFullYear()
//   const schemaData = generateFooterSchema()

//   const links = {
//     Product: [
//       { href: "/products", label: "Products" },
//       { href: "/blogs", label: "Blogs" },
//       { href: "/vision-mission", label: "Vision & Mission" },
//       { href: "/science", label: "Science" },
//     ],
//     Legal: [
//       { href: "/privacy-policy", label: "Privacy & Policy" },
//       { href: "/terms-condition", label: "Terms & Conditions" },
//       { href: "/cancellation-refund", label: "Cancellation & Refund Policy" },
//     ],
//   }

//   return (
//     <>
//       {/* JSON-LD SCHEMA SCRIPT */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
//       />

//       {/* FOOTER STRUCTURE START */}
//       <footer className="bg-[#f4f4f2] border-t border-[#d6d1c4] text-[#5c5c5c] font-sans">
//         <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16 md:py-24">

//           {/* Top Section: Logo, Info, Links, and Social */}
//           <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">

//             {/* Column 1: Company Logo and Core Info */}
//             <div className="md:col-span-2 lg:col-span-2 space-y-6">
//   {/* Replaced the div with a Link tag and added 'w-fit' so the clickable area wraps tightly */}
//   <Link href="/" className="flex items-center gap-4 cursor-pointer w-fit group">
//     <div className="bg-white p-1 rounded-2xl shadow-sm border border-[#d6d1c4] transition-colors group-hover:border-[#1b1b1b]">
//       <img
//         src="/logo.png"
//         alt="Grasa logo"
//         className="h-14 w-14 object-contain transition-transform group-hover:scale-105"
//       />
//     </div>
//     <h2 className="text-2xl uppercase font-extrabold tracking-tight text-[#1b1b1b]">
//       GRASA
//     </h2>
//   </Link>

//               <p className="text-[15px] font-medium leading-relaxed max-w-sm">
//                 Precision Nutrition Innovation Arm of MediCAPS. Dedicated to evidence-based wellness with a gentle, clinical aesthetic.
//               </p>

//               {/* Contact Information */}
//               <div className="space-y-3 text-[15px] pt-2">
//                 <p className="font-bold text-[#1b1b1b]">
//                    GRASA MILLETS & FOODS PVT LTD
//                 </p>
//                 <p>
//                   <a href="tel:9870263399" className="hover:text-[#849411] transition-colors flex items-center gap-2 font-medium group">
//                     <svg className="w-4 h-4 text-[#C5D82D] group-hover:text-[#849411] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
//                     +91 98702 63399
//                   </a>
//                 </p>
//                 <p>
//                   <a href="mailto:support@grasafoods.com" className="hover:text-[#849411] transition-colors flex items-center gap-2 font-medium group">
//                     <svg className="w-4 h-4 text-[#C5D82D] group-hover:text-[#849411] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
//                     support@grasafoods.com
//                   </a>
//                 </p>
//                 <div className="pt-2">
//                   <span className="inline-block bg-[#ebecdf] text-[#849411] text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
//                     FSSAI: 23326009000349
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Column 2 & 3: Navigation Links */}
//             {Object.entries(links).map(([group, items], index) => (
//               <div key={group} className="space-y-5">
//                 <div>
//                   <h3 className="text-lg font-bold text-[#1b1b1b]">{group}</h3>
//                   <div className="w-6 h-1 bg-[#C5D82D] mt-2 rounded-full"></div>
//                 </div>
//                 <ul className="space-y-3">
//                   {items.map((it) => (
//                     <li key={it.href}>
//                       <Link
//                         href={it.href}
//                         className="text-[15px] font-medium hover:text-[#1b1b1b] transition-all duration-300 block hover:translate-x-1"
//                       >
//                         {it.label}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}

//             {/* Column 4: Address and Social Media */}
//             <div className="space-y-6 lg:col-span-1">
//               <div>
//                 <h3 className="text-lg font-bold text-[#1b1b1b]">Our Location</h3>
//                 <div className="w-6 h-1 bg-[#C5D82D] mt-2 rounded-full mb-4"></div>
//                 <a
//                   href="https://www.google.com/maps?cid=3618521765991078645&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-[15px] font-medium leading-relaxed hover:text-[#1b1b1b] transition-colors block"
//                 >
//                   IDC INDIA, GL-7, Ashoka Estate Building, Barakhamba Road,
//                   Connaught Place, New Delhi – 110001
//                 </a>
//               </div>

//               {/* Social Icons */}
//               <div className="pt-4">
//                 <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wider mb-4">Connect With Us</h3>
//                 <div className="flex flex-wrap items-center gap-2">
//                   {socialLinks.map(({ href, Icon, color, label }) => (
//                     <a
//                       key={label}
//                       href={href}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="bg-white border border-[#d6d1c4] p-1 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1b1b1b] hover:shadow-md group flex items-center justify-center"
//                       aria-label={`Follow us on ${label}`}
//                     >
//                       <Icon size={40} style={{ color: color }} className="transition-transform group-hover:scale-110" />
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             </div>

//           </div>

//           {/* Bottom Section: Copyright */}
//           <div className="mt-8 pt-8 border-t border-[#d6d1c4] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
//             <p className="text-sm font-medium">
//               © {year} GRASA MILLETS & FOODS PVT. LTD. All rights reserved.
//             </p>
//             <p className="text-xs font-bold uppercase tracking-wider text-[#d6d1c4]">
//               Precision Nutrition • Delhi NCR
//             </p>
//           </div>

//         </div>
//       </footer>
//       {/* FOOTER STRUCTURE END */}
//     </>
//   )
// }










"use client"

import Link from "next/link"
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from "react-icons/fa"

// --- JSON-LD Schema Generation ---
const generateFooterSchema = () => {
  const domain = "https://www.grasamillets.com"
  const logoUrl = `${domain}/GRASA.png`

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GRASA Millets & Foods Pvt. Ltd. New Delhi",
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
      "https://wa.me/919870263399",
      "https://www.youtube.com/@grasamillets/shorts"
    ]
  }

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

const socialLinks = [
  { href: "https://www.facebook.com/profile.php?id=61583618278901", Icon: FaFacebook, color: "#1877F2", label: "Facebook" },
  { href: "https://www.instagram.com/grasa_official/", Icon: FaInstagram, color: "#dc1d5c", label: "Instagram" },
  { href: "https://www.linkedin.com/company/medicaps-medical-comprehensive-awareness-prevention-and-treatment-support/posts/?feedView=all", Icon: FaLinkedin, color: "#0A66C2", label: "LinkedIn" },
  { href: "https://wa.me/919870263399", Icon: FaWhatsapp, color: "#25D366", label: "WhatsApp" },
  { href: "https://www.youtube.com/@grasamillets/shorts", Icon: FaYoutube, color: "#FF0000", label: "YouTube" }
]

export default function Footer() {
  const year = new Date().getFullYear()
  const schemaData = generateFooterSchema()

  const links = {
    Product: [
      { href: "/products", label: "Products" },
      { href: "/blogs", label: "Blogs" },
      { href: "/vision-mission", label: "Vision & Mission" },
      { href: "/science", label: "Science" },
      { 
        href: "https://play.google.com/store/apps/details?id=com.idc.grasa&pcampaignid=web_share", 
        label: "Get it on Play Store", 
        isApp: true, 
        img: "/play-store.png" 
      },
      { 
        href: "https://apps.apple.com/in/app/grasa/id6754323632", 
        label: "Download on App Store", 
        isApp: true, 
        img: "/App-store.png" 
      },
    ],
    Legal: [
      { href: "/privacy-policy", label: "Privacy & Policy" },
      { href: "/terms-condition", label: "Terms & Conditions" },
      { href: "/cancellation-refund", label: "Cancellation & Refund Policy" },
      { href: "/contact", label: "Contact Us" },
      
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <footer className="bg-[#f4f4f2] border-t border-[#d6d1c4] text-[#5c5c5c] font-sans">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 py-5">

          <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">

            {/* Column 1: Company Logo and Core Info */}
            <div className="md:col-span-2 lg:col-span-2 space-y-6">
              <Link href="/" className="flex items-center gap-4 cursor-pointer w-fit group">
                <div className="bg-white p-1 rounded-2xl shadow-sm border border-[#d6d1c4] transition-colors group-hover:border-[#1b1b1b]">
                  <img
                    src="/logo.png"
                    alt="Grasa logo"
                    className="h-14 w-14 object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <h2 className="text-2xl uppercase font-extrabold tracking-tight text-[#1b1b1b]">
                  GRASA
                </h2>
              </Link>

              <p className="text-[15px] font-medium leading-relaxed max-w-sm">
                Precision Nutrition Innovation Arm of MediCAPS. Dedicated to evidence-based wellness with a gentle, clinical aesthetic.
              </p>

              <div className="space-y-3 text-[15px] pt-2">
                <p className="font-bold text-[#1b1b1b]">
                   GRASA Millets & Foods Pvt. Ltd. New Delhi
                </p>
                <p>
                  <a href="tel:9870263399" className="hover:text-[#849411] transition-colors flex items-center gap-2 font-medium group">
                    <svg className="w-4 h-4 text-[#C5D82D] group-hover:text-[#849411] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    +91 98702 63399
                  </a>
                </p>
                <p>
                  <a href="mailto:support@grasafoods.com" className="hover:text-[#849411] transition-colors flex items-center gap-2 font-medium group">
                    <svg className="w-4 h-4 text-[#C5D82D] group-hover:text-[#849411] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    support@grasafoods.com
                  </a>
                </p>
                <div className="pt-2">
                  <span className="inline-block bg-[#ebecdf] text-[#849411] text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                    FSSAI: 23326009000349
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2 & 3: Navigation Links */}
            {Object.entries(links).map(([group, items]) => (
              <div key={group} className="space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-[#1b1b1b]">{group}</h3>
                  <div className="w-6 h-1 bg-[#C5D82D] mt-2 rounded-full"></div>
                </div>
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li key={it.href}>
                      {it.isApp ? (
                        /* App Store / Play Store Badges — fixed to same height & width */
                        <a 
                          href={it.href} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block transition-transform hover:scale-102 active:scale-95"
                        >
                          <img 
                            src={it.img} 
                            alt={it.label} 
                            className="h-12 w-auto  object-contain"
                          />
                        </a>
                      ) : (
                        /* Regular Links */
                        <Link
                          href={it.href}
                          className="text-[15px] font-medium hover:text-[#1b1b1b] transition-all duration-300 block hover:translate-x-1"
                        >
                          {it.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 4: Address and Social Media */}
            <div className="space-y-6 lg:col-span-1">
              <div>
                <h3 className="text-lg font-bold text-[#1b1b1b]">Our Location</h3>
                <div className="w-6 h-1 bg-[#C5D82D] mt-2 rounded-full mb-4"></div>
                <a
                  href="https://maps.google.com/?q=IDC+INDIA+Ashoka+Estate+Building+New+Delhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-medium leading-relaxed hover:text-[#1b1b1b] transition-colors block"
                >
                  IDC INDIA, GL-7, Ashoka Estate Building, Barakhamba Road,
                  Connaught Place, New Delhi – 110001
                </a>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-bold text-[#1b1b1b] uppercase tracking-wider mb-4">Connect With Us</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {socialLinks.map(({ href, Icon, color, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white border border-[#d6d1c4] p-1 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1b1b1b] hover:shadow-md group flex items-center justify-center"
                      aria-label={`Follow us on ${label}`}
                    >
                      <Icon size={40} style={{ color: color }} className="transition-transform group-hover:scale-110" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Copyright */}
          <div className="mt-8 pt-8 border-t border-[#d6d1c4] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm font-medium">
              © {year} GRASA Millets & Foods Pvt. Ltd. New Delhi. All rights reserved.
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#d6d1c4]">
              Precision Nutrition • Delhi NCR
            </p>
          </div>

        </div>
      </footer>
    </>
  )
}