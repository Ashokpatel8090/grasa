"use client";

import { Check } from "lucide-react";

export default function RegimenPlans() {

  const plans = [
  {
    weeks: "6 WEEKS",
    title: "Start & Feel Better",
    description:
      "For: Healthy but feeling slower than you should. Low energy, heavy after meals, want to see what's possible.",
    tags: ["Low energy", "Heavy after meals", "Lifestyle reset"],
    features: [
      "Fresh specially made food · 3× per week",
      "Blood check at Week 3 and Week 6",
      "Weekly call with a health coach",
    ],
    oldPrice: "₹42,000",
    price: "₹21,000",
    offer: "50% launch offer",
    button: "Start Here",
    badge: "Most chosen",
  },
  {
    weeks: "9 WEEKS",
    title: "Restore & Strengthen",
    description:
      "For: Reports showing early concerns — sugar, cholesterol, or liver. Want to reverse it before it becomes a bigger problem.",
    tags: ["Sugar", "Cholesterol", "Liver health"],
    features: [
      "Fresh specially made food · 3× per week",
      "Blood checks at Week 3, 6, and 9",
      "Weekly coach + doctor review of your reports",
    ],
    oldPrice: "₹63,000",
    price: "₹31,500",
    offer: "50% launch offer",
    button: "Get This Plan",
  },
  {
    weeks: "12 WEEKS",
    title: "Full Reset",
    description:
      "For: Multiple concerns, medicine dependency, or simply wanting the most complete and lasting transformation.",
    tags: ["Multiple concerns", "Medicine dependency", "Full transformation"],
    features: [
      "Fresh specially made food · 3× per week",
      "Blood checks at Weeks 3, 6, 9, 12",
      "Dedicated coordinator + full doctor support",
    ],
    oldPrice: "₹84,000",
    price: "₹42,000",
    offer: "50% launch offer",
    button: "Talk to Us First",
  },
];


  return (
    <section id="regimen-plans" className="py-10 bg-gradient-to-b from-[#f7f7f4] to-[#f1f1ec]">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* SECTION HEADER */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl  font-bold text-gray-900 ">
            Three plans. One goal —
          </h2>
          <h2 className="text-4xl  font-bold text-gray-900 mb-4">
            more healthy years ahead.
          </h2>

          <p className="text-lg text-gray-600 ">
            Our clinically guided nutrition programs help restore gut balance,
            improve metabolism, and support long-term health through fermented
            grain nutrition and expert coaching.
          </p>
        </div>

        {/* PLANS GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {plans.map((plan, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gray-300">

              {/* TOP SECTION */}
              <div className="p-8 bg-[#f6f7f5]">

                <p className="text-[11px] tracking-[3px] text-[#2c5f3f] font-semibold mb-3">
                  {plan.weeks}
                </p>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {plan.title}
                </h3>

                <p className="text-gray-600 text-[15px] leading-relaxed mb-3">
                  {plan.description}
                </p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {plan.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-[#e3f4ea] text-[#2c5f3f] text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* FEATURES */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-1 text-[15px] text-gray-700"
                    >
                      <Check size={18} className="text-[#2c5f3f] mt-[2px]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* PRICE SECTION */}
              <div className="bg-[#efe9dc] p-6 flex items-center justify-between">

                <div>
                  <p className="text-gray-500 line-through text-sm">
                    {plan.oldPrice}
                  </p>

                  <p className="text-2xl font-bold text-[#1e3a2f]">
                    {plan.price}
                  </p>

                  <p className="text-[#ff7a00] text-[11px] font-semibold tracking-wide">
                    50% LAUNCH OFFER
                  </p>
                </div>

                <button className="bg-[#C5D82D] text-gray-900 px-6 py-3 rounded-lg font-semibold shadow hover:shadow-md hover:scale-[1.03] transition">
                  {plan.button}
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}