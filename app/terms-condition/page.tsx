import { FileText, Mail, Phone, MapPin } from 'lucide-react';

// --- JSON-LD Schema Generation ---
const generateTermsSchema = () => {
  const domain = "https://www.grasafoods.com"; // ⚠️ IMPORTANT: Replace with your actual domain

  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GRASA SUPER FOODS BEVERAGES PVT. LTD.",
    "url": domain,
    "logo": `${domain}/logo.png`, 
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
      "addressCountry": "IN",
    }
  };

  // 2. WebPage Schema (Defining the purpose of the page)
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Terms and Conditions of Use for GrasaFoods",
    "url": `${domain}/terms-condition`,
    "about": "Legal agreement defining the rules and guidelines for using the GrasaFoods website and its services, including limitations of liability and governing law (Indian Law).",
    "lastReviewed": "2025-10-08",
    "publisher": {
      "@type": "Organization",
      "name": "GRASA SUPER FOODS BEVERAGES PVT. LTD.",
    },
    "mainEntityOfPage": "Terms of Service"
  };

  return [organizationSchema, webPageSchema];
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms & Conditions</h1>
            <p className="font-[poppins] font-bold text-xl text-slate-700">GRASAFOODS</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
              <span>Effective Date: June 12, 2025</span>
              <span>Last Updated: Oct 8, 2025</span>
            </div>
          </header>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-5">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">1. Acceptance</h2>
              <p className="text-slate-700 leading-relaxed">
                By using GrasaFoods, you agree to comply with these Terms and our Privacy Policy.
                If you do not agree, do not use the web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">2. Services Offered</h2>
              <p className="text-slate-700 mb-3">GRASA SUPER FOODS BEVERAGES PVT. LTD. (“GRASA”) offers premium health and nutrition products including millet-based foods, functional beverages, and wellness subscriptions under its GrasaFoods SuperLife and related programs.
                All products are manufactured and packaged in compliance with applicable FSSAI standards.</p>

              <p className="text-slate-900 font-semibold mb-1">The website provides users the ability to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Access information related to nutrition, ingredients, and product benefits.</li>
                <li>Participate in promotions, loyalty, or referral programs.</li>
                <li>All prices, products, and offers are subject to change without prior notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">3. User Responsibilities</h2>
              <p className="text-slate-900 font-semibold mb-1">By using this website, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>Provide accurate, complete, and current personal and payment information.</li>
                <li>Use the website and products for lawful purposes only.</li>
                <li>Maintain the confidentiality of your login credentials (if any).</li>
                <li>Refrain from attempting to gain unauthorized access to GRASA’s systems or user data.</li>
              </ul>
              <p className="text-slate-700 mt-2">You acknowledge that GRASA is not responsible for losses arising due to misuse of your account, incorrect information, or any unauthorised transaction made using your credentials.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">4. Data Ownership</h2>
              <p className="text-slate-700 leading-relaxed">
                You retain ownership of your data. By using the app, you grant GrasaFoods a limited, revocable
                license to use your data for improving services and compliance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">5. Limitations of Liability</h2>
              
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                <li>GRASA shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use the website or its products.</li>
                <li>Product results and outcomes may vary depending on individual health conditions, diet, and lifestyle.</li>
                <li>GRASA’s total liability, for any reason whatsoever, shall not exceed the amount paid by the user for the concerned product or service.</li>
                <li>GRASA shall not be liable for delays, delivery issues, or system interruptions caused by third-party logistics, payment gateways, or service providers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">6. Intellectual Property</h2>
              <p className="text-slate-700 leading-relaxed">
                All web content, trademarks, logos, and software are property of GRASA SUPER FOODS BEVERAGES PVT. LTD.
                Unauthorized use is strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">7. Service Availability</h2>
              <p className="text-slate-700 leading-relaxed">
                We aim to ensure continuous access, but we may suspend or modify features due to maintenance,
                upgrades, or unforeseen circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">8. Governing Law & Jurisdiction</h2>
              <p className="text-slate-700 leading-relaxed">
                These terms are governed by Indian law. Any disputes shall be under the jurisdiction of
                New Delhi, Delhi courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-1">9. Termination</h2>
              <p className="text-slate-700 leading-relaxed">
                GrasaFoods may suspend or terminate your access if you violate the terms, or if your actions
                threaten the security and integrity of the platform.
              </p>
            </section>
            
            {/* Note: Sections 10-12 are missing in the original code, but I kept the Contact Info at 13 as per the original structure. */}

            <section className="bg-slate-50 rounded-xl">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Contact Information</h2>
              <p className="text-slate-700 mb-4">For concerns, contact:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Grievance Officer: Deepti Anand</p>
                    <a href="mailto:info@grasafoods.com" className="text-blue-600 hover:underline">info@grasafoods.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                  <a href="tel:+919870263399" className="text-slate-700 hover:text-blue-600">+91-9870263399</a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <a 
                    href="https://maps.google.com/?cid=3618521765991078645&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:underline hover:text-blue-700 cursor-pointer"
                  >
                    GL-7, Ashoka Estate Building, Barakhamba Road,
                    Connaught Place, New Delhi-110001
                  </a>
                  </div>
              </div>
            </section>

          </div>

          <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>&copy; 2026 GRASA SUPER FOODS BEVERAGES PVT. LTD. All rights reserved</p>
          </footer>
        </div>
      </div>
    </>
  );
}