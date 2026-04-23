"use client";

import { useState, useEffect } from "react";
import { Check, ShoppingCart, Leaf, Flame, Brain, Scale, Cookie, BatteryCharging } from "lucide-react";

// Fallback data matching your JSON response in case the local API is unreachable
const FALLBACK_PRODUCTS = [
  {
    id: 22,
    name: "Fermented Millet Choco Cookies (20pcs 540g)",
    description: "Unlike empty-calorie snacks, our Millet Cookies blend Foxtail, Ragi, Bajra, Barnyard, Soya, Moong Dal, Almond, Cocoa, and Whole Wheat, sweetened with jaggery and fermented for better digestibility.",
    price: "649.00",
    image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1765427203/medicaps/millet_products/file_m2fx1k.png",
  },
  {
    id: 20,
    name: "Millet Sourdough Bread (400g)",
    description: "Naturally fermented with sourdough starter and apple cider vinegar. Rich in protein, fiber, and omega-3s, this bread feeds your gut microbiome — improving digestion, immunity, and overall well-being.",
    price: "400.00",
    image_url: "https://res.cloudinary.com/do3gnmt7p/image/upload/v1762920736/medicaps/millet_products/file_sbpzop.png",
  },
  {
    id: 21,
    name: "Millet Kulcha (2pcs)",
    description: "Fermented with sourdough and enriched with jaggery. It’s a gut-friendly upgrade of a family favorite, designed for those who value taste and precision nutrition. Ideal for sugar and weight control.",
    price: "185.00",
    image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1758199494/medicaps/millet_products/file_aghoqd.jpg",
  }
];

export default function ProductsSection() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://192.168.1.5:5000/millets/products");
        if (response.ok) {
          const data = await response.json();
          if (data.items && data.items.length > 0) {
            setProducts(data.items);
          }
        }
      } catch (error) {
        console.error("Using fallback products due to API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full bg-[#ebecdf] py-16 scroll-mt-20" id="products">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* =========================================
            PART 1: THE TRIAL PACK (From HTML)
        ========================================= */}
        <div className="bg-[#f4f4f2] rounded-xl p-8 lg:p-12 shadow-sm border border-[#d6d1c4] mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content: Headlines & Outcomes */}
            <div>
              <span className="inline-block text-[#1b1b1b] text-sm uppercase tracking-wider font-bold mb-3">
                GRASA 10-Day Trial Pack
              </span>
              <h2 className="text-[34px] lg:text-[42px] leading-[1.1] font-bold text-[#1b1b1b] mb-4">
                10 days. Real change <br />
                <span className="text-[#5c5c5c] font-medium">begins here.</span>
              </h2>
              <div className="w-12 h-[3px] bg-[#1b1b1b] mb-4"></div>
              <p className="text-[#5c5c5c] mb-8 text-lg">
                Not a detox. Not a diet. A biological reset — through food.
              </p>

              <span className="text-[#1b1b1b] text-xs uppercase tracking-widest font-bold mb-4 block">
                By day 10, your body starts behaving differently:
              </span>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
                    <Leaf size={16} className="text-[#1b1b1b]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1b1b]">Gut diversity</p>
                    <p className="text-[#5c5c5c] text-xs">Less bloating. More regularity.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
                    <Flame size={16} className="text-[#1b1b1b]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1b1b]">Metabolic calm</p>
                    <p className="text-[#5c5c5c] text-xs">No post-meal crashes.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
                    <Brain size={16} className="text-[#1b1b1b]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1b1b]">Cognitive clarity</p>
                    <p className="text-[#5c5c5c] text-xs">Sharper. Less fog.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
                    <Scale size={16} className="text-[#1b1b1b]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1b1b]">Hormonal balance</p>
                    <p className="text-[#5c5c5c] text-xs">Calmer mood. Better sleep.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: Box Contents & Pricing */}
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-[#d6d1c4] shadow-sm">
              <h3 className="text-xl font-bold text-[#1b1b1b] mb-4">What's inside your pack:</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#8a9a20] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#1b1b1b] text-sm">Protein Rich Multi Millet Flour — 2 kg</p>
                    <p className="text-[#5c5c5c] text-xs mt-1">Your daily atta, reimagined. Fermented for gut compatibility.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#8a9a20] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#1b1b1b] text-sm">Fermented Millet Choco Cookies — 1 pack</p>
                    <p className="text-[#5c5c5c] text-xs mt-1">Real chocolate. Real fermentation. No guilt.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#8a9a20] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#1b1b1b] text-sm">Fermented Millet Sourdough Bread — 1 loaf</p>
                    <p className="text-[#5c5c5c] text-xs mt-1">Slow-fermented. Easier to digest than regular bread.</p>
                  </div>
                </li>
              </ul>

              <div className="border-t border-[#d6d1c4] pt-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-[#1b1b1b]">₹1,800</span>
                  <span className="text-lg text-[#5c5c5c] line-through">₹2,000</span>
                  <span className="bg-[#C5D82D]/30 text-[#1b1b1b] text-xs font-bold px-3 py-1 rounded-full">
                    ₹200 OFF
                  </span>
                </div>
                <p className="text-[#5c5c5c] text-sm mb-6">
                  Fresh batch being prepared. Delivered to your door by Wednesday.
                </p>

                <a
                  href="https://pages.razorpay.com/pl_SdkXgwiOGcNNPO/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#C5D82D] text-[#1b1b1b] py-4 rounded-md font-bold text-center hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Reserve Your Trial Pack →
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}