"use client"

import { Utensils, Brain, Activity, ShieldOff, Flame } from "lucide-react"

const scienceData = [
  {
    title: "Poor Diet",
    description:
      "Eating too many processed foods and sugary snacks can disturb your digestive system and reduce your body's ability to absorb nutrients properly.",
    icon: Utensils,
  },
  {
    title: "Stress",
    description:
      "Long-term stress can upset the balance of healthy bacteria in your digestive system and lead to common stomach problems.",
    icon: Brain,
  },
  {
    title: "Hormones",
    description:
      "Hormone changes can affect how your digestive system works and may disturb the balance of helpful bacteria.",
    icon: Activity,
  },
  {
    title: "Toxins",
    description:
      "Chemicals from polluted air, pesticides, and unhealthy foods can harm your digestive lining and reduce good bacteria.",
    icon: ShieldOff,
  },
  {
    title: "Inflammation",
    description:
      "Constant internal inflammation can disturb digestion and may lead to many long-term health problems.",
    icon: Flame,
  },
]

export default function ScienceSection() {
  return (
    // Background color updated to match the clean off-white/gray in the SS
    <section className="w-full bg-[#fbfbfb] py-10" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Heading Section - Matched to SS inspection */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 leading-tight max-w-lg">
            Digestive problems have
            <br />
            multiple root causes
          </h2>
        </div>

        {/* Cards Grid - Matched to hidden md:grid md:grid-cols-5 */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">

          {scienceData.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="group relative rounded-2xl px-4 py-5  transition-all duration-300 bg-[#f3f3ee] hover:bg-[#C5D82D] border border-gray-300 hover:border-gray-200 hover:scale-105"
              >
                {/* Icon Container */}
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition-all duration-300 group-hover:scale-110">
                  <Icon
                    size={24}
                    className="text-gray-800"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-[14px]">
                  {item.description}
                </p>

                {/* Subtle Glow/Hover Indicator */}
                <div className="absolute bottom-4 right-4 h-1 w-1 rounded-full bg-lime-400 opacity-0 transition-opacity group-hover:opacity-100"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}