import { FileText, Mail, Phone, MapPin } from 'lucide-react';

// --- JSON-LD Schema Generation ---
const generateTermsSchema = () => {
  const domain = "https://www.grasamillets.com";

  return {
    "@context": "https://schema.org",
    "@graph": [

      // 🏢 ORGANIZATION
      {
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        "name": "GRASA Millets & Foods Pvt. Ltd. New Delhi",
        "url": domain,
        "logo": {
          "@type": "ImageObject",
          "url": `${domain}/logo.png`
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-9870263399",
          "email": "info@grasafoods.com",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": "en"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
          "addressLocality": "New Delhi",
          "postalCode": "110001",
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

      // 📄 TERMS PAGE
      {
        "@type": "WebPage",
        "@id": `${domain}/terms-condition#webpage`,
        "url": `${domain}/terms-condition`,
        "name": "Terms and Conditions - GrasaMillets",
        "description": "Legal terms governing the use of GrasaMillets website, products, and services.",
        "inLanguage": "en",

        "isPartOf": {
          "@id": `${domain}/#website`
        },

        "publisher": {
          "@id": `${domain}/#organization`
        },

        "datePublished": "2025-06-12",
        "dateModified": "2025-10-08",

        // ✅ IMPORTANT FIX
        "mainEntity": {
          "@type": "Article",
          "name": "Terms and Conditions",
          "description": "Legal agreement outlining user responsibilities, services, liabilities, and governing law."
        }
      }

    ]
  };
};

// --- Main Terms Component ---
export default function Terms() {
  const schemaData = generateTermsSchema();
  
  return (
    <>
      {/* 1. JSON-LD SCHEMA SCRIPT (Multiple Schemas) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      
      {/* 2. Main Component Content */}
      <div className="min-h-screen bg-[#ebecdf] px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C5D82D] rounded-full mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-[#1b1b1b]" />
            </div>
            <h1 className="text-4xl font-bold text-[#1b1b1b] mb-2">Terms & Conditions</h1>
            <p className="font-[poppins] font-bold text-xl text-[#1b1b1b]">GRASAMILLETS</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[#5c5c5c]">
              <span>Effective Date: June 12, 2025</span>
              <span>Last Updated: Oct 8, 2025</span>
            </div>
          </header>

          <div className="bg-[#f4f4f2] rounded-xl md:max-w-[90%] mx-auto shadow-sm border border-[#d6d1c4] p-8 md:p-12 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">1. Acceptance</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                By using GrasaMillets, you agree to comply with these Terms and our Privacy Policy.
                If you do not agree, do not use the web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">2. Services Offered</h2>
              <p className="text-[#5c5c5c] mb-3">
                GRASA Millets & Foods Pvt. Ltd. New Delhi. (GRASA) offers premium health and nutrition products including millet-based foods, functional beverages, and wellness subscriptions under its GrasaMillets SuperLife and related programs.
                All products are manufactured and packaged in compliance with applicable FSSAI standards.
              </p>

              <p className="text-[#1b1b1b] font-semibold mb-1">The website provides users the ability to:</p>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>Access information related to nutrition, ingredients, and product benefits.</li>
                <li>Participate in promotions, loyalty, or referral programs.</li>
                <li>All prices, products, and offers are subject to change without prior notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">3. User Responsibilities</h2>
              <p className="text-[#1b1b1b] font-semibold mb-1">By using this website, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>Provide accurate, complete, and current personal and payment information.</li>
                <li>Use the website and products for lawful purposes only.</li>
                <li>Maintain the confidentiality of your login credentials (if any).</li>
                <li>Refrain from attempting to gain unauthorized access to GRASA’s systems or user data.</li>
              </ul>
              <p className="text-[#5c5c5c] mt-2">
                You acknowledge that GRASA is not responsible for losses arising due to misuse of your account, incorrect information, or any unauthorised transaction made using your credentials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">4. Data Ownership</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                You retain ownership of your data. By using the app, you grant GrasaMillets a limited, revocable
                license to use your data for improving services and compliance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">5. Limitations of Liability</h2>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>GRASA shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use the website or its products.</li>
                <li>Product results and outcomes may vary depending on individual health conditions, diet, and lifestyle.</li>
                <li>GRASA’s total liability, for any reason whatsoever, shall not exceed the amount paid by the user for the concerned product or service.</li>
                <li>GRASA shall not be liable for delays, delivery issues, or system interruptions caused by third-party logistics, payment gateways, or service providers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">6. Intellectual Property</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                All web content, trademarks, logos, and software are property of GRASA Millets & Foods Pvt. Ltd. New Delhi.
                Unauthorized use is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">7. Service Availability</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                We aim to ensure continuous access, but we may suspend or modify features due to maintenance,
                upgrades, or unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">8. Governing Law & Jurisdiction</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                These terms are governed by Indian law. Any disputes shall be under the jurisdiction of
                New Delhi, Delhi courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">9. Termination</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                GrasaMillets may suspend or terminate your access if you violate the terms, or if your actions
                threaten the security and integrity of the platform.
              </p>
            </section>

            <section className="bg-[#ebecdf] rounded-xl p-6 border border-[#d6d1c4]">
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-4">10. Contact Information</h2>
              <p className="text-[#5c5c5c] mb-4">For concerns, contact:</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#C5D82D] p-2 rounded-full mt-0.5">
                    <Mail className="w-4 h-4 text-[#1b1b1b]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1b1b1b]">Grievance Officer: Deepti Anand</p>
                    <a href="mailto:info@grasafoods.com" className="text-[#5c5c5c] hover:text-[#1b1b1b] hover:underline transition-colors">info@grasafoods.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-[#C5D82D] p-2 rounded-full">
                    <Phone className="w-4 h-4 text-[#1b1b1b]" />
                  </div>
                  <a href="tel:+919870263399" className="text-[#5c5c5c] hover:text-[#1b1b1b] hover:underline transition-colors">+91-9870263399</a>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#C5D82D] p-2 rounded-full mt-0.5">
                    <MapPin className="w-4 h-4 text-[#1b1b1b]" />
                  </div>
                  <a 
                    href="https://maps.google.com/?cid=3618521765991078645&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#5c5c5c] hover:text-[#1b1b1b] hover:underline transition-colors max-w-sm"
                  >
                    GL-7, Ashoka Estate Building, Barakhamba Road,
                    Connaught Place, New Delhi-110001
                  </a>
                </div>
              </div>
            </section>

          </div>

          <footer className="text-center mt-8 pb-4 font-medium text-[#5c5c5c] text-sm">
          <p>© 2026 GRASA Millets & Foods Pvt. Ltd. New Delhi. All rights reserved.</p>
        </footer>
          
        </div>
      </div>
    </>
  );
}








