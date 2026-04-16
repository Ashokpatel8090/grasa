"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

// ✅ Function to generate JSON-LD schema object
const generateContactSchema = () => {
  const domain = "https://www.grasamillets.com";

  return {
    "@context": "https://schema.org",
    "@graph": [

      // 🏢 ORGANIZATION
      {
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        "name": "GRASA SUPER FOODS & BEVERAGES PVT. LTD.",
        "url": domain,
        "logo": {
          "@type": "ImageObject",
          "url": `${domain}/logo.png`
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-9870263399",
            "contactType": "customer service",
            "email": "support@grasafoods.com",
            "areaServed": "IN",
            "availableLanguage": "en"
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "New Delhi",
          "addressCountry": "IN"
        }
      },

      // 🌐 WEBSITE
      {
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        "url": domain,
        "name": "Grasa",
        "publisher": {
          "@id": `${domain}/#organization`
        }
      },

      // 📞 CONTACT PAGE
      {
        "@type": "ContactPage",
        "@id": `${domain}/contact#webpage`,
        "url": `${domain}/contact`,
        "name": "Contact GRASA",
        "description": "Get in touch with GRASA for product inquiries, support, or partnerships.",
        "inLanguage": "en",

        "isPartOf": {
          "@id": `${domain}/#website`
        },

        "publisher": {
          "@id": `${domain}/#organization`
        },

        // ✅ MAIN ENTITY (IMPORTANT)
        "mainEntity": {
          "@type": "Organization",
          "@id": `${domain}/#organization`
        },

        // ✅ ACTION (POWERFUL)
        "potentialAction": {
          "@type": "CommunicateAction",
          "target": [
            {
              "@type": "EntryPoint",
              "urlTemplate": "https://wa.me/919870263399",
              "actionPlatform": [
                "http://schema.org/MobileWebPlatform",
                "http://schema.org/DesktopWebPlatform"
              ]
            }
          ]
        }
      }

    ]
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

      <section className="w-full bg-[#ebecdf] py-10 min-h-screen">
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