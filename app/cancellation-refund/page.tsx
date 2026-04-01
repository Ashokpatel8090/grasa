
"use client"

import { Shield } from "lucide-react"

const generateRefundSchema = () => {
  const domain = "https://www.grasamillets.com";

  return {
    "@context": "https://schema.org",
    "@graph": [

      // 🏢 ORGANIZATION
      {
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        "name": "GRASA SUPER FOODS BEVERAGES PVT. LTD.",
        "url": domain,
        "logo": {
          "@type": "ImageObject",
          "url": `${domain}/logo.png`
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

      // 📄 POLICY PAGE
      {
        "@type": "WebPage",
        "@id": `${domain}/refund-policy#webpage`,
        "url": `${domain}/refund-policy`,
        "name": "Refund, Cancellation & Delivery Policy - GrasaFoods",
        "description": "Policy covering refunds, cancellations, and delivery timelines for GrasaFoods products and services.",
        "inLanguage": "en",

        "isPartOf": {
          "@id": `${domain}/#website`
        },

        "publisher": {
          "@id": `${domain}/#organization`
        },

        "datePublished": "2025-06-12",
        "dateModified": "2026-02-13",

        // ✅ MAIN CONTENT
        "mainEntity": {
          "@type": "Article",
          "name": "Refund, Cancellation & Delivery Policy",
          "description": "Details about refund eligibility, cancellation window, and shipping timelines for GrasaFoods.",

          "hasPart": [
            {
              "@type": "CreativeWork",
              "name": "Refund Policy",
              "description": "Refunds available within 14 days of purchase or service start."
            },
            {
              "@type": "CreativeWork",
              "name": "Cancellation Policy",
              "description": "Orders can be cancelled within 24 hours of confirmation."
            },
            {
              "@type": "CreativeWork",
              "name": "Delivery Policy",
              "description": "Orders are delivered within approximately 7 days."
            }
          ]
        }
      }

    ]
  };
};

export default function RefundCancellationPolicy() {
  const schemaData = generateRefundSchema();
  
  return (

    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
   

    <div className="min-h-screen bg-[#ebecdf] px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C5D82D] rounded-full mb-4 shadow-sm">
            <Shield className="w-8 h-8 text-[#1b1b1b]" />
          </div>

          <h1 className="text-4xl font-bold text-[#1b1b1b] mb-2 font-[roboto]">
            Refund, Cancellation & Delivery Policy
          </h1>

          <p className="font-[poppins] font-bold text-xl text-[#1b1b1b]">
            GRASAFOODS
          </p>

          {/* Dates */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[#5c5c5c]">
            <span>Effective Date: June 12, 2025</span>
            <span>Last Updated: Feb 13, 2026</span>
          </div>
        </header>

        {/* Content Card */}
        <div className="bg-[#f4f4f2] rounded-xl md:max-w-[90%] mx-auto shadow-sm border border-[#d6d1c4] p-8 md:p-12 space-y-8">

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#1b1b1b] mb-3">
              1. Refund Policy
            </h2>
            <p className="text-[#5c5c5c] leading-relaxed">
              Users are eligible for a refund on applicable services or
              products if the request is raised within <strong className="text-[#1b1b1b]">14 days</strong> of the
              purchase or service commencement, subject to the terms and
              conditions outlined in our separate Terms of Service document.
              Please refer to the Terms of Service for complete details on
              eligibility and refund processing.
            </p>
          </section>

          {/* Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#1b1b1b] mb-3">
              2. Cancellation Policy
            </h2>
            <p className="text-[#5c5c5c] leading-relaxed">
              Users may cancel an order within <strong className="text-[#1b1b1b]">24 hours</strong> after placing
              an order and once the order has been successfully confirmed.
              Cancellation requests made after this period may not be eligible,
              depending on the processing stage of the product or service.
            </p>
          </section>

          {/* Delivery Policy */}
          <section>
            <h2 className="text-2xl font-bold text-[#1b1b1b] mb-3">
              3. Shipping / Delivery Policy
            </h2>
            <p className="text-[#5c5c5c] leading-relaxed">
              For physical products or services requiring delivery, the estimated
              delivery timeframe is generally within <strong className="text-[#1b1b1b]">7 days</strong> from
              order confirmation, subject to availability and logistics. Specific
              delivery timelines will be communicated at the time of purchase.
            </p>
          </section>

        </div>

        {/* Footer */}
        <footer className="text-center mt-8 pb-4 font-medium text-[#5c5c5c] text-sm">
          <p>© 2026 GRASA MILLETS & FOODS PVT. LTD. All rights reserved.</p>
        </footer>

      </div>
    </div>
     </>
  )
}