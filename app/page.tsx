
import Award from "@/components/award";
import ConsultationSection from "@/components/ConsultationSection";
import FAQComponent from "@/components/faq";
import FloatingConsultationButton from "@/components/FloatingConsultationButton";
import HeroSection from "@/components/HeroSection";
import LongevityCheck from "@/components/LongevityCheck";
import ProductsGrid from "@/components/ProductsGrid";
import RegimenPlans from "@/components/RegimenPlans";
import RegimenSection from "@/components/RegimenSection";
import ScienceSection from "@/components/ScienceSection";
import SuccessStoriesCarousel from "@/components/SuccessStories";
import Testimonials from "@/components/testimonials";
import Script from "next/script";

export default function Home() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      // 🏢 Organization (NEW: This tells Google that Grasa and Grasa Millets are the same brand)
      {
        "@type": "Organization",
        "@id": "https://www.grasamillets.com/#organization",
        "name": "Grasa",
        "alternateName": ["Grasa Millets", "GRASA", "Grasa Wellness", "Grasa Nutrition", "GrasaMillets"],
        "url": "https://www.grasamillets.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.grasamillets.com/logo.png"
        },
        "description": "Grasa specializes in millet-based nutrition and root-cause solutions for gut health and digestive wellness."
      },

      // 🌐 WebPage
      {
        "@type": "WebPage",
        "@id": "https://www.grasamillets.com/#webpage",
        "url": "https://www.grasamillets.com",
        "name": "Grasa - Gut Health & Millets Nutrition",
        "alternateName": ["Grasa", "Grasa Millets"],
        "description": "Discover the root cause of digestive problems and explore millet-based nutrition with Grasa.",
        "inLanguage": "en",
        "publisher": {
          "@id": "https://www.grasamillets.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.grasamillets.com/?q={search_term}",
          "query-input": "required name=search_term"
        }
      },

      // 🧠 Digestive Causes
      {
        "@type": "MedicalCondition",
        "name": "Digestive Problems",
        "description": "Digestive problems arise due to multiple lifestyle and environmental factors affecting gut health and metabolism.",
        "cause": [
          {
            "@type": "MedicalCause",
            "name": "Poor Diet",
            "description": "Processed foods and sugar reduce nutrient absorption and disturb digestion."
          },
          {
            "@type": "MedicalCause",
            "name": "Stress",
            "description": "Chronic stress disrupts gut bacteria and leads to digestive imbalance."
          },
          {
            "@type": "MedicalCause",
            "name": "Hormonal Imbalance",
            "description": "Hormonal changes affect digestive function and gut microbiome balance."
          },
          {
            "@type": "MedicalCause",
            "name": "Toxins",
            "description": "Pollution, pesticides and chemicals damage gut lining and reduce healthy bacteria."
          },
          {
            "@type": "MedicalCause",
            "name": "Inflammation",
            "description": "Chronic inflammation disrupts digestion and contributes to long-term health issues."
          }
        ],
        "possibleTreatment": {
          "@type": "MedicalTherapy",
          "name": "Millet-Based Nutrition & Lifestyle Changes",
          "description": "Improving gut health through millet-based diet, personalised nutrition and lifestyle correction by Grasa."
        }
      },

      // 🧪 Longevity Test
      {
        "@type": "MedicalWebPage",
        "name": "Grasa Longevity Test",
        "url": "https://www.grasamillets.com/longevity-test",
        "description": "Take the Grasa longevity test to identify the root cause of digestive issues, assess your biological age, and improve gut health.",
        "about": {
          "@type": "MedicalCondition",
          "name": "Digestive Health",
          "description": "Assessment of gut health, digestion issues, metabolism and biological age."
        },
        "mainEntity": {
          "@type": "MedicalTest",
          "name": "Longevity & Gut Health Test",
          "description": "A science-led test that evaluates digestive health, lifestyle factors and biological age to provide personalised nutrition recommendations.",
          "usedToDiagnose": {
            "@type": "MedicalCondition",
            "name": "Digestive Issues"
          },
          "relevantSpecialty": {
            "@type": "MedicalSpecialty",
            "name": "Nutrition"
          }
        },
        "publisher": {
          "@id": "https://www.grasamillets.com/#organization"
        }
      },

      // 📦 Plans (Improved Service)
      {
        "@type": "Service",
        "name": "Grasa Nutrition Plans",
        "description": "Personalised millet-based nutrition programs designed to improve gut health, digestion and long-term wellness.",
        "provider": {
          "@id": "https://www.grasamillets.com/#organization"
        },
        "areaServed": {
          "@type": "Place",
          "name": "India"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Nutrition Plans",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": "Starter Reset Plan",
              "price": "21000",
              "priceCurrency": "INR",
              "description": "1-month plan to improve digestion and energy with personalised nutrition guidance."
            },
            {
              "@type": "Offer",
              "name": "Transformation Plan",
              "price": "31500",
              "priceCurrency": "INR",
              "description": "3-month structured nutrition plan for weight loss, energy improvement and metabolic health."
            },
            {
              "@type": "Offer",
              "name": "Complete Reset Plan",
              "price": "42000",
              "priceCurrency": "INR",
              "description": "6-month advanced program for long-term health, PCOS, thyroid and metabolic support."
            }
          ]
        }
      },

      // 💬 Testimonials
      {
        "@type": "ItemList",
        "name": "Customer Testimonials for Grasa",
        "itemListElement": [
          {
            "@type": "Review",
            "reviewBody": "I used to feel completely flat after lunch every day. By Week 3 that was gone. Three months later my energy is consistent through the whole day.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Riya S."
            }
          },
          {
            "@type": "Review",
            "reviewBody": "I had tried every diet. This is the first thing that felt sustainable — I wasn't restricting, I was just eating better food. 6kg down and the bloating I had for years is gone.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Amit K."
            }
          },
          {
            "@type": "Review",
            "reviewBody": "My PCOS had been affecting my energy and weight for years. The personalised guidance made the difference — not generic advice, but someone actually looking at my situation.",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "author": {
              "@type": "Person",
              "name": "Meera J."
            }
          }
        ]
      },

      // 📞 CONSULTATION
      {
        "@type": "ContactPage",
        "name": "Free Consultation | Grasa",
        "url": "https://www.grasamillets.com/#consultation-form",
        "description": "Book a free consultation with Grasa nutrition experts.",
        "mainEntity": {
          "@type": "Service",
          "name": "Free Nutrition Consultation",
          "description": "Talk to a nutrition expert to understand your gut health and suitable plan.",
          "provider": {
            "@id": "https://www.grasamillets.com/#organization"
          },
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceLocation": {
              "@type": "Place",
              "name": "Online / Phone Consultation"
            },
            "availableLanguage": "English"
          },
          "potentialAction": {
            "@type": "CommunicateAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.grasamillets.com/#consultation-form"
            }
          }
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaData),
        }}
      />

      <HeroSection />
      <div id="award-section">
        <Award />
      </div>
      <SuccessStoriesCarousel />
      <ScienceSection />
      <LongevityCheck />

      <ProductsGrid />
      <RegimenSection />
      <RegimenPlans />
      <Testimonials />
      <ConsultationSection />
      <FAQComponent />
      {/* ✅ ADD HERE (last) */}
      <FloatingConsultationButton />
    </>
  );
}