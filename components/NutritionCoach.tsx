"use client";

import { FiPhone } from "react-icons/fi";


export default function NutritionCoach() {
  return (
    <section className="w-full py-12">
      <div className="max-w-[1400px] mx-auto px-6">

        <div className="bg-[#efefec] rounded-[30px] overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center">

          {/* LEFT SIDE */}
          <div className="p-8 md:p-10">

            <h2 className="text-[34px] md:text-[40px] leading-[44px] font-bold text-[#111827]">
              Not sure if this is right for you? 
              <span className="text-[#7a9a01]">  Just ask.</span>
            </h2>

            <p className="mt-4 text-gray-600 text-[16px] leading-[26px] max-w-[500px]">
              Our clinical team answers every question before you start. About your
              reports. About your medicines. About whether GRASA makes sense for
              your situation.
            </p>

            {/* <button className="mt-6 flex items-center gap-3 bg-[#0f172a] text-white px-7 py-3 rounded-xl font-semibold hover:opacity-90 transition">
              <FiPhone size={18} />
              BOOK A CALL
            </button> */}

            <button
  onClick={() =>
    document
      .getElementById("consultation-form")
      ?.scrollIntoView({ behavior: "smooth" })
  }
  className="mt-6 flex items-center gap-3 cursor-pointer bg-[#0f172a] text-white px-7 py-3 rounded-xl font-semibold hover:opacity-90 transition"
>
  <FiPhone size={18} />
  BOOK A CALL
</button>

          </div>

          {/* RIGHT IMAGE */}
          <div className="h-[320px] md:h-full">
           <img
  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
  alt="Nutritionist consultation"
  className="w-full h-full object-cover"
/>
          </div>

        </div>

      </div>
    </section>
  );
}