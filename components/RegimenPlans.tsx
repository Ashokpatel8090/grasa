

"use client";

import React from "react";
import { Check } from "lucide-react";

export default function RegimenPlans() {
  const plans = [
    {
      weeks: "1 MONTH",
      title: "Starter Reset",
      subtitle: "Start feeling better, faster",
      description:
        "For: First-timers who want to understand how food affects their body and start feeling a real difference.",
      features: [
        "Personalised nutrition plan",
        "Millet-based meal guidance",
        "Nutritionist consultation (ongoing)",
        "Basic lifestyle guidance",
        "Follow-up support",
        "Fresh food, home delivered",
      ],
      benefits: ["Reduced bloating", "Better digestion", "Improved daily energy"],
      oldPrice: "42,000",
      price: "21,000",
      button: "Start Here",
      badge: "",
      active: false,
    },
    {
      weeks: "3 MONTHS",
      title: "Transformation",
      subtitle: "Where real results begin",
      description:
        "For: Anyone serious about lasting change — weight, energy, digestion, or managing blood sugar naturally.",
      features: [
        "Fully personalised & updated nutrition plan",
        "Structured week-by-week guidance",
        "3–4 consultations + ongoing check-ins",
        "Habit & lifestyle coaching",
        "Continuous support",
        "Fresh food, home delivered",
      ],
      benefits: [
        "Weight loss & fat reduction",
        "Stabilised blood sugar",
        "Improved energy & digestion",
      ],
      oldPrice: "63,000",
      price: "31,500",
      button: "Get This Plan",
      badge: "⭐ Most Popular",
      active: true,
    },
    {
      weeks: "6 MONTHS",
      title: "Complete Reset",
      subtitle: "Build long-term health that lasts",
      description:
        "For: Managing lifestyle conditions — PCOS, thyroid, metabolic issues — or wanting a complete, lasting transformation.",
      features: [
        "Everything in Transformation Plan",
        "Advanced personalisation",
        "More frequent check-ins",
        "Priority support",
        "Long-term habit building",
        "Lifestyle condition support",
        "Fresh food, home delivered",
      ],
      benefits: [
        "Sustainable weight loss",
        "Long-term blood sugar management",
        "PCOS, thyroid & metabolic support",
        "Complete lifestyle transformation",
      ],
      oldPrice: "84,000",
      price: "42,000",
      button: "Talk to Us First",
      badge: "",
      active: false,
    },
  ];

  return (
    <section
    id="regimen-plans"
    className="w-full bg-[#f4f4f2] py-10 px-6  font-sans border-y border-[#d6d1c4]"
  >
      <div className=" px-6">

        {/* SECTION HEADER */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] mb-6">
            Three plans. One goal —
            <br />
            more healthy years ahead.
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl text-[16px]">
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
              className={`
                group relative rounded-2xl p-1 transition-all duration-500 flex flex-col
                ${plan.active
                  ? 'bg-[#C5D82D] border-[#C5D82D] border-2 scale-105 shadow-xl hover:bg-[#0c0e0d] hover:border-[#C5D82D]'
                  : 'bg-[#f3f3ee] border-gray-300 border hover:bg-[#C5D82D] hover:border-transparent hover:scale-105 hover:shadow-xl'
                }
              `}
            >
              {/* BADGE */}
              {plan.badge && (
                <div className="absolute -top-3 left-6 z-10 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="p-7 flex-grow">
                <p className={`text-[11px] tracking-[3px] font-bold mb- ${plan.active ? 'text-gray-900 group-hover:text-[#C5D82D]' : 'text-gray-800'}`}>
                  {plan.weeks}
                </p>

                <h3 className={`text-2xl font-bold mb-1 ${plan.active ? 'text-gray-900 group-hover:text-white' : 'text-gray-900'}`}>
                  {plan.title}
                </h3>
                <p className={`font-semibold text-sm mb-2 opacity-80 ${plan.active ? 'text-gray-800 group-hover:text-gray-200' : 'text-gray-800'}`}>
                  {plan.subtitle}
                </p>

                <p className={`text-[14px] leading-relaxed mb-2 italic min-h-[60px] ${plan.active ? 'text-gray-700 group-hover:text-gray-300' : 'text-gray-700'}`}>
                  {plan.description}
                </p>

                {/* FEATURES LIST */}
                <ul className="space-y-1 mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className={`flex items-start gap-3 text-[14px] font-medium ${plan.active ? 'text-gray-900 group-hover:text-gray-100' : 'text-gray-900'}`}>
                      <div className="mt-1 bg-white rounded-full p-0.5 shadow-sm flex-shrink-0">
                        <Check size={14} className="text-[#2c5f3f]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* BENEFITS FOOTER */}
                <div className={`border-t pt-3 ${plan.active ? 'border-black/10 group-hover:border-white/10' : 'border-gray-400/20'}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${plan.active ? 'text-gray-900/60 group-hover:text-white/50' : 'text-gray-900/60'}`}>
                    By end of plan:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {plan.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className={`text-[12px] px-2 py-0.5 rounded-md font-semibold border
                          ${plan.active
                            ? 'bg-white/30 text-gray-900 border-black/10 group-hover:bg-white/10 group-hover:text-gray-100 group-hover:border-white/10'
                            : 'bg-white/50 text-gray-800 border-black/5'
                          }`}
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* PRICE & CTA SECTION */}
              <div className="p-7 pt-0 mt-auto">
                <div className={`flex items-end justify-between border-t pt-6 ${plan.active ? 'border-black/10 group-hover:border-white/10' : 'border-gray-400/20'}`}>
                  <div>
                    <span className={`line-through text-xs font-bold block mb-1 ${plan.active ? 'text-gray-700 group-hover:text-gray-400' : 'text-gray-600'}`}>
                      ₹{plan.oldPrice}
                    </span>
                    <span className={`text-3xl font-black ${plan.active ? 'text-gray-900 group-hover:text-white' : 'text-gray-900'}`}>
                      ₹{plan.price}
                    </span>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-orange-600 mt-1">
                      Launch Offer 50% Off
                    </p>
                  </div>

                  <a
                    href="https://wa.me/919870263399"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-colors
                      ${plan.active
                        ? 'bg-gray-900 text-white  hover:bg-[#C5D82D] hover:text-gray-900'
                        : 'bg-gray-900 text-white hover:bg-black '
                      }`}
                  >
                    {plan.button}
                  </a>
                </div>
              </div>

              {/* Subtle Corner Dot */}
              <div className="absolute bottom-4 left-4 h-1.5 w-1.5 rounded-full bg-black/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}