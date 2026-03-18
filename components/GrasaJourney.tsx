"use client"

import { ArrowRight } from "lucide-react"

const steps = [
  {
    step: "STEP 1",
    title: "Take the Gut Test",
    description:
      "An online test that assesses the root cause of your gut health issues",
    time: "Takes 2–4 mins",
  },
  {
    step: "STEP 2",
    title: "Get Your Plan",
    description:
      "Based on your responses, our nutrition experts recommend a customized plan.",
    time: "Takes 5 mins",
  },
  {
    step: "STEP 3",
    title: "Get Nutrition Coach Guidance",
    description:
      "After you get the plan, GRASA's expert Nutrition Coaches assist you on your gut health journey.",
    time: "Takes 3–5 months",
  },
]

export default function GrasaJourney() {
  return (
    <section className="w-full bg-[#f6f6f6] py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Title */}
        <p className="text-lime-700 font-semibold tracking-wide mb-8">
          The GRASA Journey
        </p>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {steps.map((item, index) => (
            <div
              key={index}
              className="group bg-[#eceae6] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:bg-white"
            >

              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-semibold tracking-wider text-xs">
                  {item.step}
                </span>

                <ArrowRight
                  size={20}
                  className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
                />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              {/* Time Badge */}
              <span className="inline-block bg-lime-200 text-lime-800 text-xs px-3 py-1.5 rounded-full font-medium">
                {item.time}
              </span>

            </div>
          ))}

        </div>
      </div>
    </section>
  )
}