
import { Shield, Mail, Phone, MapPin } from 'lucide-react';

// --- JSON-LD Schema Generation ---
const generatePrivacyPolicySchema = () => {
  const domain = "https://www.grasamillets.com";

  return {
    "@context": "https://schema.org",
    "@graph": [

      // 🏢 ORGANIZATION
      {
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        "name": "GRASA MILLETS & FOODS PVT LTD",
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
          "areaServed": "IN"
        },
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
          "addressLocality": "New Delhi",
          "postalCode": "110001",
          "addressCountry": "IN"
        }
      },

      // 📄 PRIVACY POLICY PAGE
      {
        "@type": "WebPage",
        "@id": `${domain}/privacy-policy#webpage`,
        "url": `${domain}/privacy-policy`,
        "name": "Privacy Policy - GrasaMillets",
        "description": "Privacy policy outlining data collection, usage, and compliance with DPDP, GDPR and CCPA.",
        "inLanguage": "en",
        "isPartOf": {
          "@id": `${domain}/#website`
        },
        "publisher": {
          "@id": `${domain}/#organization`
        },
        "datePublished": "2025-06-12",
        "dateModified": "2025-10-08",

        // ✅ IMPORTANT
        "mainEntity": {
          "@type": "Article",
          "name": "Privacy Policy",
          "description": "Detailed privacy practices including data collection, usage, sharing, retention and user rights."
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
      }

    ]
  };
};

export default function PrivacyPolicy() {
  const schemaData = generatePrivacyPolicySchema();

  return (
    <>
      {/* 1. JSON-LD SCHEMA SCRIPT (Multiple Schemas) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />
      
      {/* 2. Main Component Content */}
      <div className="min-h-screen bg-[#ebecdf] px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          <header className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C5D82D] rounded-full mb-4 shadow-sm">
              <Shield className="w-8 h-8 text-[#1b1b1b]" />
            </div>
            <h1 className="text-4xl font-bold text-[#1b1b1b] mb-2">Privacy Policy</h1>
            <p className="font-[poppins] font-bold text-xl text-[#1b1b1b]">GRASAMILLETS</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[#5c5c5c]">
              <span>Effective Date: June 12, 2025</span>
              <span>Last Updated: Oct 8, 2025</span>
            </div>
          </header>

          <div className="bg-[#f4f4f2] md:max-w-[90%] mx-auto rounded-xl shadow-sm border border-[#d6d1c4] p-8 md:p-12 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">1. Introduction</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                GrasaMillets is committed to protecting your privacy.
                This Privacy Policy describes how we collect, use, share, and safeguard your personal data
                in accordance with the Digital Personal Data Protection Act (DPDP) 2023, Information Technology
                Act 2000, GDPR, and CCPA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">2. User Consent</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                By registering on or using GrasaMillets, you explicitly consent to the collection, processing,
                and sharing of your data as outlined in this policy. You may withdraw your consent at any
                time by contacting us at <a href="mailto:info@grasafoods.com" className="text-[#1b1b1b] font-semibold hover:underline">info@grasafoods.com</a> or
                via the app settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">3. Refund Policy</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                Users are eligible for a refund on applicable services or products if the request is raised
                within <strong className="text-[#1b1b1b]">14 days</strong> of the purchase or service commencement, subject to the terms
                and conditions outlined in our separate Terms of Service document. Please refer to the Terms
                of Service for full details on eligibility and processing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">4. Shipping/Delivery Policy</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                For physical products or services that require delivery, the estimated delivery timeframe is
                generally within <strong className="text-[#1b1b1b]">7 days</strong> from the confirmation of the order. This is subject
                to availability and logistics. Specific delivery timelines will be provided at the time of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">5. Information We Collect</h2>
              <p className="text-[#1b1b1b] font-semibold mb-3">We collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li><strong className="text-[#1b1b1b]">Personal Information:</strong> Name, contact details, delivery address, email, and payment information.</li>
                <li><strong className="text-[#1b1b1b]">Usage Data:</strong> IP address, browser type, device information, and website interaction details.</li>
                <li><strong className="text-[#1b1b1b]">Optional Health Information:</strong> When provided voluntarily (for example, during health consultations or SuperLife assessments).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">6. Purpose of Data Collection</h2>
              <p className="text-[#5c5c5c] mb-3">The information we collect is used to:</p>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>Process orders and payments securely.</li>
                <li>Deliver products and services efficiently.</li>
                <li>Send medication reminders and care tips.</li>
                <li>Personalize your user experience and improve our offerings.</li>
                <li>Send transactional updates, promotional offers, or feedback requests.</li>
                <li>Ensure compliance with legal, taxation, and regulatory obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">7. Data Sharing</h2>
              <p className="text-[#1b1b1b] font-semibold mb-3">GRASA does not sell or rent your data.
                We may share limited information with:</p>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>Payment gateways (e.g., Razorpay) for secure transaction processing.</li>
                <li>Logistics partners for order delivery.</li>
                <li>Technology service providers for website maintenance and analytics.</li>
                <li>All partners are bound by confidentiality and data protection obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">8. International Compliance</h2>
              <p className="text-[#5c5c5c] mb-3">
                If you're a resident of the EU or California, you have rights under GDPR/CCPA, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>Access, correction, or deletion of your data.</li>
                <li>Data portability.</li>
                <li>Right to object to data processing.</li>
              </ul>
              <p className="text-[#5c5c5c] mt-3">
                To exercise these rights, email <a href="mailto:support@grasamillets.com" className="text-[#1b1b1b] font-semibold hover:underline">support@grasamillets.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">9. Data Security</h2>
              <p className="text-[#5c5c5c] mb-1">
                We follow industry-standard practices to safeguard your data from unauthorized access, misuse, or disclosure. However, no electronic storage or internet transmission is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">10. Data Retention</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                Your data is retained only as long as necessary to provide services or comply with applicable
                law. On request, data can be anonymized or deleted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">
                11. Account Deletion (iOS App)
              </h2>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>
                  Users can delete their account directly from within the iOS Grasa app after logging in.
                </li>
                <li>
                  The <strong className="text-[#1b1b1b]">Delete Account</strong> option is available in the <strong className="text-[#1b1b1b]">Profile</strong> section of the app.
                </li>
                <li>
                  When a user selects the Delete Account option, their account and associated personal data will be permanently deleted from our systems.
                </li>
                <li>
                  Account deletion is irreversible and cannot be undone once confirmed by the user.
                </li>
                <li>
                  Certain data may be retained temporarily if required by law, security, or regulatory obligations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">12. Children's Privacy</h2>
              <ul className="list-disc list-inside space-y-2 text-[#5c5c5c] ml-4">
                <li>Our website and products are not intended for children under the age of 13.</li>
                <li>We do not knowingly collect or store personal information from children.</li>
                <li>If we learn that a child’s information has been collected without parental consent, we will delete it promptly.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">13. Changes to this Policy</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                We may update this Privacy Policy. Users will be notified through the app or via email in
                the event of significant changes.
              </p>
            </section>

            <section className="bg-[#ebecdf] rounded-xl p-6 border border-[#d6d1c4]">
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-4">14. Contact Information</h2>
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
          <p>© 2026 GRASA MILLETS & FOODS PVT LTD. All rights reserved.</p>
        </footer>
          
        </div>
      </div>
    </>
  );
}