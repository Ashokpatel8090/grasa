// import { Shield, Mail, Phone, MapPin } from 'lucide-react';

// // --- JSON-LD Schema Generation ---
// const generatePrivacyPolicySchema = () => {
//   const domain = "https://www.grasafoods.com"; // ⚠️ IMPORTANT: Replace with your actual domain

//   // 1. Organization Schema
//   const organizationSchema = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     "name": "GRASA SUPER FOODS BEVERAGES PVT LTD",
//     "url": domain,
//     "contactPoint": {
//       "@type": "ContactPoint",
//       "telephone": "+91-9870263399",
//       "email": "info@grasafoods.com",
//       "contactType": "customer service",
//       "areaServed": "IN",
//     },
//     "address": {
//       "@type": "PostalAddress",
//       "streetAddress": "GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
//       "addressLocality": "New Delhi",
//       "postalCode": "110001",
//       "addressCountry": "IN",
//     },
//     // The policy mentions a Grievance Officer, which is great for transparency
//     "knowsAbout": "Digital Personal Data Protection Act (DPDP) 2023, GDPR, CCPA", 
//   };

//   // 2. WebPage Schema (Defining the purpose of the page)
//   const webPageSchema = {
//     "@context": "https://schema.org",
//     "@type": "WebPage",
//     "name": "Privacy Policy for GrasaFoods",
//     "url": `${domain}/privacy-policy`, // ⚠️ IMPORTANT: Update this if the route is different
//     "about": "This page outlines the privacy policy, data collection, and legal compliance for GrasaFoods, including contact information for the Grievance Officer.",
//     "lastReviewed": "2025-10-08", // Matches "Last Updated" date
//     "publisher": {
//       "@type": "Organization",
//       "name": "GRASA SUPER FOODS BEVERAGES PVT LTD",
//     }
//   };

//   return [organizationSchema, webPageSchema];
// };


// export default function PrivacyPolicy() {
//   const schemaData = generatePrivacyPolicySchema();

//   return (
//     <>
//       {/* 1. JSON-LD SCHEMA SCRIPT (Multiple Schemas) */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
//       />
      
//       {/* 2. Main Component Content */}
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
//         <div className="max-w-6xl mx-auto px-6 py-12">
//           <header className="text-center mb-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-4">
//               <Shield className="w-8 h-8 text-white" />
//             </div>
//             <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
//             <p className="font-[poppins] font-bold text-xl text-slate-700">GRASAFOODS</p>
//             <div className="flex items-center justify-center gap-6 mt-4 text-sm text-slate-500">
//               <span>Effective Date: June 12, 2025</span>
//               <span>Last Updated: Oct 8, 2025</span>
//             </div>
//           </header>

//           <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-5">
//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">1. Introduction</h2>
//               <p className="text-slate-700 leading-relaxed">
//                 GrasaFoods is committed to protecting your privacy.
//                 This Privacy Policy describes how we collect, use, share, and safeguard your personal data
//                 in accordance with the Digital Personal Data Protection Act (DPDP) 2023, Information Technology
//                 Act 2000, GDPR, and CCPA.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">2. User Consent</h2>
//               <p className="text-slate-700 leading-relaxed">
//                 By registering on or using GrasaFoods, you explicitly consent to the collection, processing,
//                 and sharing of your data as outlined in this policy. You may withdraw your consent at any
//                 time by contacting us at <a href="mailto:info@grasafoods.com" className="text-blue-600 hover:underline">info@grasafoods.com</a> or
//                 via the app settings.
//               </p>
//             </section>
//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">3. Refund Policy</h2>
//               <p className="text-slate-700 leading-relaxed">
//                 Users are eligible for a refund on applicable services or products if the request is raised
//                 within <strong>14 days</strong> of the purchase or service commencement, subject to the terms
//                 and conditions outlined in our separate Terms of Service document. Please refer to the Terms
//                 of Service for full details on eligibility and processing.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">4. Shipping/Delivery Policy</h2>
//               <p className="text-slate-700 leading-relaxed">
//                 For physical products or services that require delivery, the estimated delivery timeframe is
//                 generally within <strong>7 days</strong> from the confirmation of the order. This is subject
//                 to availability and logistics. Specific delivery timelines will be provided at the time of purchase.
//               </p>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">5. Information We Collect</h2>
//               <p className="text-slate-800 font-semibold mb-3">We collect the following types of information:</p>
//               <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
//                 <li><strong>Personal Information:</strong> Name, contact details, delivery address, email, and payment information.</li>
//                 <li><strong>Usage Data:</strong> IP address, browser type, device information, and website interaction details.</li>
//                 <li><strong>Optional Health Information:</strong> When provided voluntarily (for example, during health consultations or SuperLife assessments).</li>
//                 {/* <li><strong>Location Data:</strong> Only if you permit location access</li> */}
//               </ul>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">6. Purpose of Data Collection</h2>
//               <p className="text-slate-700 mb-3">The information we collect is used to:</p>
//               <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
//                 <li>Process orders and payments securely.</li>
//                 <li>Deliver products and services efficiently.</li>
//                 <li>Send medication reminders and care tips</li>
//                 <li>Personalize your user experience and improve our offerings.</li>
//                 <li>Send transactional updates, promotional offers, or feedback requests.</li>
//                 <li>Ensure compliance with legal, taxation, and regulatory obligations.</li>
//               </ul>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">7. Data Sharing</h2>
//               <p className="text-slate-800 font-semibold mb-3">GRASA does not sell or rent your data.
//                 We may share limited information with:</p>
//               <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
//                 <li>Payment gateways (e.g., Razorpay) for secure transaction processing.</li>
//                 <li>Logistics partners for order delivery.</li>
//                 <li>Technology service providers for website maintenance and analytics.</li>
//                 <li>All partners are bound by confidentiality and data protection obligations.</li>
//               </ul>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">8. International Compliance</h2>
//               <p className="text-slate-700 mb-3">
//                 If you're a resident of the EU or California, you have rights under GDPR/CCPA, including:
//               </p>
//               <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
//                 <li>Access, correction, or deletion of your data</li>
//                 <li>Data portability</li>
//                 <li>Right to object to data processing</li>
//               </ul>
//               <p className="text-slate-700 mt-3">
//                 To exercise these rights, email <a href="mailto:support@grasafoods.com" className="text-blue-600 hover:underline">support@grasafoods.com</a>
//               </p>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">9. Data Security</h2>
//               <p className="text-slate-700 mb-1">We follow industry-standard practices to safeguard your data from unauthorized access, misuse, or disclosure. However, no electronic storage or internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
            
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">10. Data Retention</h2>
//               <p className="text-slate-700 leading-relaxed">
//                 Your data is retained only as long as necessary to provide services or comply with applicable
//                 law. On request, data can be anonymized or deleted.
//               </p>
//             </section>

//            <section>
//   <h2 className="text-2xl font-semibold text-slate-900 mb-1">
//     11. Account Deletion (iOS App)
//   </h2>

//   <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
//     <li>
//       Users can delete their account directly from within the iOS Grasda app after logging in.
//     </li>

//     <li>
//       The <strong>Delete Account</strong> option is available in the <strong>Profile</strong> section of the app.
//     </li>

//     <li>
//       When a user selects the Delete Account option, their account and associated personal data will be permanently deleted from our systems.
//     </li>

//     <li>
//       Account deletion is irreversible and cannot be undone once confirmed by the user.
//     </li>

//     <li>
//       Certain data may be retained temporarily if required by law, security, or regulatory obligations.
//     </li>
//   </ul>
// </section>


//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">12. Children's Privacy</h2>
//               <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
//                 <li>Our website and products are not intended for children under the age of 13.</li>
//                 <li>We do not knowingly collect or store personal information from children.</li>
//                 <li>If we learn that a child’s information has been collected without parental consent, we will delete it promptly.</li>
//                 {/* <li>All partners are bound by confidentiality and data protection obligations.</li> */}
//               </ul>
//             </section>

//             <section>
//               <h2 className="text-2xl font-semibold text-slate-900 mb-1">13. Changes to this Policy</h2>
//               <p className="text-slate-700 leading-relaxed">
//                 We may update this Privacy Policy. Users will be notified through the app or via email in
//                 the event of significant changes.
//               </p>
//             </section>

//             <section className="bg-slate-50 rounded-xl">
//               <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Contact Information</h2>
//               <p className="text-slate-700 mb-4">For concerns, contact:</p>
//               <div className="space-y-3">
//                 <div className="flex items-start gap-3">
//                   <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <p className="font-medium text-slate-900">Grievance Officer: Deepti Anand</p>
//                     <a href="mailto:info@grasafoods.com" className="text-blue-600 hover:underline">info@grasafoods.com</a>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
//                   <a href="tel:+919870263399" className="text-slate-700 hover:text-blue-600">+91-9870263399</a>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
//                   <a 
//                     href="https://maps.google.com/?cid=3618521765991078645&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQ" 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-gray-800 hover:underline hover:text-blue-700 cursor-pointer"
//                   >
//                     GL-7, Ashoka Estate Building, Barakhamba Road,
//                     Connaught Place, New Delhi-110001
//                   </a>
//                   </div>
//               </div>
//             </section>

//           </div>

//           <footer className="text-center mt-12 text-slate-500 text-sm">
//             <p>© 2026 GRASA SUPER FOODS BEVERAGES PVT. LTD. All rights reserved.</p>
//           </footer>
//         </div>
//       </div>
//     </>
//   );
// }













import { Shield, Mail, Phone, MapPin } from 'lucide-react';

// --- JSON-LD Schema Generation ---
const generatePrivacyPolicySchema = () => {
  const domain = "https://www.grasafoods.com"; // ⚠️ IMPORTANT: Replace with your actual domain

  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GRASA SUPER FOODS BEVERAGES PVT LTD",
    "url": domain,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9870263399",
      "email": "info@grasafoods.com",
      "contactType": "customer service",
      "areaServed": "IN",
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
      "addressLocality": "New Delhi",
      "postalCode": "110001",
      "addressCountry": "IN",
    },
    // The policy mentions a Grievance Officer, which is great for transparency
    "knowsAbout": "Digital Personal Data Protection Act (DPDP) 2023, GDPR, CCPA", 
  };

  // 2. WebPage Schema (Defining the purpose of the page)
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy for GrasaFoods",
    "url": `${domain}/privacy-policy`, // ⚠️ IMPORTANT: Update this if the route is different
    "about": "This page outlines the privacy policy, data collection, and legal compliance for GrasaFoods, including contact information for the Grievance Officer.",
    "lastReviewed": "2025-10-08", // Matches "Last Updated" date
    "publisher": {
      "@type": "Organization",
      "name": "GRASA SUPER FOODS BEVERAGES PVT LTD",
    }
  };

  return [organizationSchema, webPageSchema];
};

export default function PrivacyPolicy() {
  const schemaData = generatePrivacyPolicySchema();

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
              <Shield className="w-8 h-8 text-[#1b1b1b]" />
            </div>
            <h1 className="text-4xl font-bold text-[#1b1b1b] mb-2">Privacy Policy</h1>
            <p className="font-[poppins] font-bold text-xl text-[#1b1b1b]">GRASAFOODS</p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-[#5c5c5c]">
              <span>Effective Date: June 12, 2025</span>
              <span>Last Updated: Oct 8, 2025</span>
            </div>
          </header>

          <div className="bg-[#f4f4f2] md:max-w-[90%] mx-auto rounded-xl shadow-sm border border-[#d6d1c4] p-8 md:p-12 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">1. Introduction</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                GrasaFoods is committed to protecting your privacy.
                This Privacy Policy describes how we collect, use, share, and safeguard your personal data
                in accordance with the Digital Personal Data Protection Act (DPDP) 2023, Information Technology
                Act 2000, GDPR, and CCPA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#1b1b1b] mb-2">2. User Consent</h2>
              <p className="text-[#5c5c5c] leading-relaxed">
                By registering on or using GrasaFoods, you explicitly consent to the collection, processing,
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
                To exercise these rights, email <a href="mailto:support@grasafoods.com" className="text-[#1b1b1b] font-semibold hover:underline">support@grasafoods.com</a>
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

          <footer className="text-center mt-8 pb-4 text-[#5c5c5c] text-sm">
            <p>© 2026 GRASA SUPER FOODS BEVERAGES PVT. LTD. All rights reserved.</p>
          </footer>
          
        </div>
      </div>
    </>
  );
}