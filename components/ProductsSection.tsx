
// "use client";

// import { Check, ShoppingCart, Leaf, Flame, Brain, Scale } from "lucide-react";
// import { useRouter } from "next/navigation";

// // ── Trial Pack product definition (single source of truth) ──────────────────
// export const TRIAL_PACK = {
//   id: "trial-pack-v1",
//   name: "GRASA 10-Day Trial Pack",
//   description: "Protein Rich Multi Millet Flour (2kg) + Fermented Millet Choco Cookies (1 pack) + Fermented Millet Sourdough Bread (1 loaf)",
//   price: 1800,
//   mrp: 2000,
//   discount: 200,
//   image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1765427203/medicaps/millet_products/file_m2fx1k.png",
//   quantity: 1,
//   items: [
//     {
//       product_id: 29, // Protein Rich Multi Millet Flour
//       name: "Protein Rich Multi Millet Flour — 2 kg",
//       quantity: 1,
//       price: "951.00",
//       effective_price: "951.00",
//       image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1763204113/medicaps/millet_products/file_eebepk.png",
//     },
//     {
//       product_id: 22, // Fermented Millet Choco Cookies
//       name: "Fermented Millet Choco Cookies (20pcs 540g)",
//       quantity: 1,
//       price: "649.00",
//       effective_price: "649.00",
//       image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1763203295/medicaps/millet_products/file_wdf2ug.png",
//     },
//     {
//       product_id: 20, // Millet Sourdough Bread
//       name: "Millet Sourdough Bread (400g)",
//       quantity: 1,
//       price: "400.00",
//       effective_price: "400.00",
//       image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1763203708/medicaps/millet_products/file_ljra0q.png",
//     },
//   ],
// };

// export default function ProductsSection() {
//   const router = useRouter();

//   const handleReservePack = () => {
//     // Store the trial pack details so CheckoutPage can read them
//     sessionStorage.setItem(
//       "trialPackOrder",
//       JSON.stringify({
//         cart: TRIAL_PACK.items,
//         total: TRIAL_PACK.price,
//         basePrice: TRIAL_PACK.mrp,
//         discount: TRIAL_PACK.discount,
//         isTrial: true,
//       })
//     );
//     router.push("/checkout?source=trial-pack");
//   };

//   return (
//     <section className="w-full bg-[#ebecdf] py-4 scroll-mt-20" id="products">
//       <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

//         <div className="bg-[#f4f4f2] rounded-xl p-8 lg:p-12 shadow-sm border border-[#d6d1c4] mb-16">
//           <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">

//             {/* ── Left: Headlines & Outcomes ─────────────────────────── */}
//             <div>
//               <span className="inline-block text-[#1b1b1b] text-sm uppercase tracking-wider font-bold mb-3">
//                 GRASA 10-Day Trial Pack
//               </span>
//               <h2 className="text-[34px] lg:text-[42px] leading-[1.1] font-bold text-[#1b1b1b] mb-4">
//                 10 days. Real change <br />
//                 <span className="text-[#5c5c5c] font-medium">begins here.</span>
//               </h2>
//               <div className="w-12 h-[3px] bg-[#1b1b1b] mb-4"></div>
//               <p className="text-[#5c5c5c] mb-8 text-lg">
//                 Not a detox. Not a diet. A biological reset — through food.
//               </p>

//               <span className="text-[#1b1b1b] text-xs uppercase tracking-widest font-bold mb-4 block">
//                 By day 10, your body starts behaving differently:
//               </span>

//               <div className="grid grid-cols-2 gap-4 mb-8">
//                 <div className="flex gap-3 items-start">
//                   <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
//                     <Leaf size={16} className="text-[#1b1b1b]" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#1b1b1b]">Gut diversity</p>
//                     <p className="text-[#5c5c5c] text-xs">Less bloating. More regularity.</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3 items-start">
//                   <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
//                     <Flame size={16} className="text-[#1b1b1b]" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#1b1b1b]">Metabolic calm</p>
//                     <p className="text-[#5c5c5c] text-xs">No post-meal crashes.</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3 items-start">
//                   <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
//                     <Brain size={16} className="text-[#1b1b1b]" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#1b1b1b]">Cognitive clarity</p>
//                     <p className="text-[#5c5c5c] text-xs">Sharper. Less fog.</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-3 items-start">
//                   <div className="w-8 h-8 rounded-md bg-[#C5D82D] flex items-center justify-center shrink-0">
//                     <Scale size={16} className="text-[#1b1b1b]" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-sm text-[#1b1b1b]">Hormonal balance</p>
//                     <p className="text-[#5c5c5c] text-xs">Calmer mood. Better sleep.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ── Right: Box Contents & Pricing ──────────────────────── */}
//             <div className="bg-white rounded-xl p-6 lg:p-8 border border-[#d6d1c4] shadow-sm">
//               <h3 className="text-xl font-bold text-[#1b1b1b] mb-4">What's inside your pack:</h3>
//               <ul className="space-y-4 mb-8">
//                 <li className="flex items-start gap-3">
//                   <Check size={20} className="text-[#8a9a20] shrink-0 mt-0.5" />
//                   <div>
//                     <p className="font-bold text-[#1b1b1b] text-sm">Protein Rich Multi Millet Flour — 2 kg</p>
//                     <p className="text-[#5c5c5c] text-xs mt-1">Your daily atta, reimagined. Fermented for gut compatibility.</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <Check size={20} className="text-[#8a9a20] shrink-0 mt-0.5" />
//                   <div>
//                     <p className="font-bold text-[#1b1b1b] text-sm">Fermented Millet Choco Cookies — 1 pack</p>
//                     <p className="text-[#5c5c5c] text-xs mt-1">Real chocolate. Real fermentation. No guilt.</p>
//                   </div>
//                 </li>
//                 <li className="flex items-start gap-3">
//                   <Check size={20} className="text-[#8a9a20] shrink-0 mt-0.5" />
//                   <div>
//                     <p className="font-bold text-[#1b1b1b] text-sm">Fermented Millet Sourdough Bread — 1 loaf</p>
//                     <p className="text-[#5c5c5c] text-xs mt-1">Slow-fermented. Easier to digest than regular bread.</p>
//                   </div>
//                 </li>
//               </ul>

//               <div className="border-t border-[#d6d1c4] pt-6">
//                 <div className="flex items-baseline gap-3 mb-2">
//                   <span className="text-3xl font-bold text-[#1b1b1b]">₹{TRIAL_PACK.price.toLocaleString("en-IN")}</span>
//                   <span className="text-lg text-[#5c5c5c] line-through">₹{TRIAL_PACK.mrp.toLocaleString("en-IN")}</span>
//                   <span className="bg-[#C5D82D]/30 text-[#1b1b1b] text-xs font-bold px-3 py-1 rounded-full">
//                     ₹{TRIAL_PACK.discount} OFF
//                   </span>
//                 </div>
//                 <p className="text-[#5c5c5c] text-sm mb-6">
//                   Fresh batch being prepared. Delivered to your door by Wednesday.
//                 </p>

//                 {/* ── CTA: now routes to checkout with session data ── */}
//                 <button
//                   onClick={handleReservePack}
//                   className="w-full bg-[#C5D82D] text-[#1b1b1b] py-4 rounded-md font-bold text-center hover:opacity-90 transition flex items-center justify-center gap-2"
//                 >
//                   <ShoppingCart size={18} />
//                   Reserve Your Trial Pack →
//                 </button>
//               </div>
//             </div>

//           </div>

//           {/* ── Terms & Conditions ──────────────────────────────────────── */}
//           <div className="border-t border-[#d6d1c4] pt-8">
//             <h4 className="text-[#1b1b1b] text-sm font-bold mb-3 uppercase tracking-wider">
//               Terms & Conditions
//             </h4>
//             <ol className="list-decimal pl-4 space-y-2 text-xs text-[#5c5c5c] mb-4">
//               <li>
//                 The 10-Day Trial Pack is priced at ₹1,800 as an early reservation offer (MRP ₹2,000). This price applies only to orders placed during the event period.
//               </li>
//               <li>
//                 Delivery is estimated by Wednesday following your order, subject to the completion of our fresh fermentation batch. As GRASA products are made in small, live-culture batches, exact delivery dates may vary by 1–2 days. You will receive a WhatsApp confirmation once your order is dispatched.
//               </li>
//               <li>
//                 In the rare event that the current batch is delayed, GRASA will notify you within 24 hours and offer either a revised delivery date or a full refund — whichever you prefer.
//               </li>
//               <li>
//                 All products are freshly prepared and perishable. Please store in a cool place.
//               </li>
//               <li>
//                 This is a one-time trial pack and does not constitute enrollment in any GRASA program.
//               </li>
//               <li>
//                 For queries, contact us on WhatsApp: +91 98702 63399 or email support@grasafoods.com.
//               </li>
//               <li>
//                 By completing payment, you agree to share your contact and delivery details with GRASA Millets & Foods for order fulfilment and follow-up.
//               </li>
//             </ol>
//             <p className="text-xs text-[#5c5c5c] italic">
//               * You agree to share information entered on this page with Grasa Millets (owner of this page) and Razorpay, adhering to applicable laws.
//             </p>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }









"use client";

import { Check, ShoppingCart, Leaf, Flame, Brain, Scale } from "lucide-react";
import { useRouter } from "next/navigation";

// ── Trial Pack product definition (single source of truth) ──────────────────
export const TRIAL_PACK = {
  id: "trial-pack-v1",
  name: "GRASA 10-Day Trial Pack",
  description: "Protein Rich Multi Millet Flour (2kg) + Fermented Millet Choco Cookies (1 pack) + Fermented Millet Sourdough Bread (1 loaf)",
  price: 1800,
  mrp: 2000,
  discount: 200,
  image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1765427203/medicaps/millet_products/file_m2fx1k.png",
  quantity: 1,
  items: [
    {
      product_id: 29, // Protein Rich Multi Millet Flour
      name: "Protein Rich Multi Millet Flour — 2 kg",
      quantity: 1,
      price: "951.00",
      effective_price: "951.00",
      image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1763204113/medicaps/millet_products/file_eebepk.png",
    },
    {
      product_id: 22, // Fermented Millet Choco Cookies
      name: "Fermented Millet Choco Cookies (20pcs 540g)",
      quantity: 1,
      price: "649.00",
      effective_price: "649.00",
      image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1763203295/medicaps/millet_products/file_wdf2ug.png",
    },
    {
      product_id: 20, // Millet Sourdough Bread
      name: "Millet Sourdough Bread (400g)",
      quantity: 1,
      price: "400.00",
      effective_price: "400.00",
      image_url: "https://res.cloudinary.com/daunsn0z7/image/upload/v1763203708/medicaps/millet_products/file_ljra0q.png",
    },
  ],
};

export default function ProductsSection() {
  const router = useRouter();

  const handleReservePack = () => {
    // Store the trial pack details so CheckoutPage can read them
    sessionStorage.setItem(
      "trialPackOrder",
      JSON.stringify({
        cart: TRIAL_PACK.items,
        total: TRIAL_PACK.price,
        basePrice: TRIAL_PACK.mrp,
        discount: TRIAL_PACK.discount,
        isTrial: true,
      })
    );
    router.push("/checkout?source=trial-pack");
  };

  return (
    <section className="w-full bg-[#ebecdf] py-4 scroll-mt-20" id="products">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        <div className="bg-[#f4f4f2] rounded-xl p-8 lg:p-12 shadow-sm border border-[#d6d1c4] mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">

            {/* ── Left: Headlines & Outcomes ─────────────────────────── */}
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

            {/* ── Right: Box Contents & Pricing ──────────────────────── */}
            <div className="bg-white rounded-xl p-6 lg:p-8 border border-[#d6d1c4] shadow-sm">
              <h3 className="text-xl font-bold text-[#1b1b1b] mb-4">What's inside your pack:</h3>
              <ul className="space-y-5 mb-8">
                
                <li className="flex items-start gap-4">
                  {/* <Check size={20} className="text-[#8a9a20] shrink-0 mt-1.5" /> */}
                  <img 
                    src={TRIAL_PACK.items[0].image_url} 
                    alt={TRIAL_PACK.items[0].name} 
                    className="w-16 h-16 rounded-md object-cover border border-[#d6d1c4] shrink-0 bg-[#f4f4f2]"
                  />
                  <div>
                    <p className="font-bold text-[#1b1b1b] text-sm">Protein Rich Multi Millet Flour — 2 kg</p>
                    <p className="text-[#5c5c5c] text-xs mt-1">Your daily atta, reimagined. Fermented for gut compatibility.</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  {/* <Check size={20} className="text-[#8a9a20] shrink-0 mt-1.5" /> */}
                  <img 
                    src={TRIAL_PACK.items[1].image_url} 
                    alt={TRIAL_PACK.items[1].name} 
                    className="w-16 h-16 rounded-md object-cover border border-[#d6d1c4] shrink-0 bg-[#f4f4f2]"
                  />
                  <div>
                    <p className="font-bold text-[#1b1b1b] text-sm">Fermented Millet Choco Cookies — 1 pack</p>
                    <p className="text-[#5c5c5c] text-xs mt-1">Real chocolate. Real fermentation. No guilt.</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  {/* <Check size={20} className="text-[#8a9a20] shrink-0 mt-1.5" /> */}
                  <img 
                    src={TRIAL_PACK.items[2].image_url} 
                    alt={TRIAL_PACK.items[2].name} 
                    className="w-16 h-16 rounded-md object-cover border border-[#d6d1c4] shrink-0 bg-[#f4f4f2]"
                  />
                  <div>
                    <p className="font-bold text-[#1b1b1b] text-sm">Fermented Millet Sourdough Bread — 1 loaf</p>
                    <p className="text-[#5c5c5c] text-xs mt-1">Slow-fermented. Easier to digest than regular bread.</p>
                  </div>
                </li>
                
              </ul>

              <div className="border-t border-[#d6d1c4] pt-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-[#1b1b1b]">₹{TRIAL_PACK.price.toLocaleString("en-IN")}</span>
                  <span className="text-lg text-[#5c5c5c] line-through">₹{TRIAL_PACK.mrp.toLocaleString("en-IN")}</span>
                  <span className="bg-[#C5D82D]/30 text-[#1b1b1b] text-xs font-bold px-3 py-1 rounded-full">
                    ₹{TRIAL_PACK.discount} OFF
                  </span>
                </div>
                <p className="text-[#5c5c5c] text-sm mb-6">
                  Fresh batch being prepared. Delivered to your door by Wednesday.
                </p>

                {/* ── CTA: now routes to checkout with session data ── */}
                <button
                  onClick={handleReservePack}
                  className="w-full bg-[#C5D82D] text-[#1b1b1b] py-4 rounded-md font-bold text-center hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Reserve Your Trial Pack →
                </button>
              </div>
            </div>

          </div>

          {/* ── Terms & Conditions ──────────────────────────────────────── */}
          <div className="border-t border-[#d6d1c4] pt-8">
            <h4 className="text-[#1b1b1b] text-sm font-bold mb-3 uppercase tracking-wider">
              Terms & Conditions
            </h4>
            <ol className="list-decimal pl-4 space-y-2 text-xs text-[#5c5c5c] mb-4">
              <li>
                The 10-Day Trial Pack is priced at ₹1,800 as an early reservation offer (MRP ₹2,000). This price applies only to orders placed during the event period.
              </li>
              <li>
                Delivery is estimated by Wednesday following your order, subject to the completion of our fresh fermentation batch. As GRASA products are made in small, live-culture batches, exact delivery dates may vary by 1–2 days. You will receive a WhatsApp confirmation once your order is dispatched.
              </li>
              <li>
                In the rare event that the current batch is delayed, GRASA will notify you within 24 hours and offer either a revised delivery date or a full refund — whichever you prefer.
              </li>
              <li>
                All products are freshly prepared and perishable. Please store in a cool place.
              </li>
              <li>
                This is a one-time trial pack and does not constitute enrollment in any GRASA program.
              </li>
              <li>
                For queries, contact us on WhatsApp: +91 98702 63399 or email support@grasafoods.com.
              </li>
              <li>
                By completing payment, you agree to share your contact and delivery details with GRASA Millets & Foods for order fulfilment and follow-up.
              </li>
            </ol>
            <p className="text-xs text-[#5c5c5c] italic">
              * You agree to share information entered on this page with Grasa Millets (owner of this page) and Razorpay, adhering to applicable laws.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}