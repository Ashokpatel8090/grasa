"use client";
 
export default function HolisticPlan() {
  return (
    <section className="px-[80px] py-24 bg-[#ebecdf] text-center">
 
      {/* Small Heading */}
      <p className="text-[#8ca21f] font-medium mb-4">
        The Threefold Way
      </p>
 
      {/* Main Heading */}
      <h2 className="text-[42px] font-bold text-[#0f172a]">
        GRASA'S HOLISTIC PLAN FOR GUT HEALTH
      </h2>
 
      {/* Sub heading */}
      <p className="text-[#8ca21f] text-[20px] font-medium mt-4">
        FERMENTATION + FUNCTIONAL NUTRITION + PRECISION HEALTH
      </p>
 
      {/* Description */}
      <p className="max-w-[760px] mx-auto text-gray-600 mt-6 text-[16px] leading-relaxed">
        GRASA combines Fermentation Science, Functional Nutrition R&D, and
        Precision Health Integration to create customised gut health plans
        that target the root cause, delivering assured results.
      </p>
 
      {/* Cards */}
      <div className="grid grid-cols-3 gap-8 mt-16">
 
        {/* Card 1 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden text-left">
          <img
            src="/fermentation.jpg"
            className="w-full h-[200px] object-cover"
          />
 
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#0f172a]">
              Fermentation
            </h3>
 
            <p className="text-gray-600 mt-2">
              Unlocking bioactive compounds through advanced fermentation technologies.
            </p>
          </div>
        </div>
 
        {/* Card 2 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden text-left">
          <img
            src="/nutrition.jpg"
            className="w-full h-[200px] object-cover"
          />
 
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#0f172a]">
              Functional Nutrition
            </h3>
 
            <p className="text-gray-600 mt-2">
              Evidence-based food science & metabolism research for optimal health.
            </p>
          </div>
        </div>
 
        {/* Card 3 */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden text-left">
          <img
            src="/Fermentation.webp"
            className="w-full h-[200px] object-cover"
          />
 
          <div className="p-6">
            <h3 className="text-xl font-semibold text-[#0f172a]">
              Precision Health
            </h3>
 
            <p className="text-gray-600 mt-2">
              Designed to align with personalized protocols & biomarkers.
            </p>
          </div>
        </div>
 
      </div>
 
      {/* Button */}
      <div className="mt-16">
        <button className="bg-[#C5D82D] px-10 py-4 rounded-xl font-semibold text-black">
          Take The Gut Test ™
        </button>
      </div>
 
    </section>
  );
}