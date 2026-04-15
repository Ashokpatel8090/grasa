
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LongevityIntro() {
  const router = useRouter();
  const [hasStoredResult, setHasStoredResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if there is an unexpired test result in localStorage
    const saved = localStorage.getItem("grasa_longevity_result");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

        if (Date.now() - parsed.timestamp < oneMonthInMs) {
          setHasStoredResult(true);
        } else {
          localStorage.removeItem("grasa_longevity_result");
        }
      } catch (err) {
        console.error("Failed to parse local storage:", err);
      }
    }
  }, []);

  const startTest = () => {
    router.push("/longevity-test");
  };

  const retakeTest = () => {
    // Clear the old result and start fresh
    localStorage.removeItem("grasa_longevity_result");
    router.push("/longevity-test");
  };

  const viewResult = () => {
    router.push("/longevity-test/result");
  };

  return (
    <section className="w-full bg-[#0f1114] text-white py-16 px-6 lg:px-12 relative overflow-hidden">
      
      {/* Subtle Glow Backgrounds */}

          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />

          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none" />
      {/* Main Container */}
      <div className="max-w-5xl mx-auto relative z-10 w-full flex flex-col gap-10">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-[60%] text-left">
            {/* Badge */}
            <div className="inline-block px-4 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 text-[#C5D82D] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-6">
              Free Longevity Check
            </div>

            {/* Heading - Matched to RegimenSection */}
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] mb-6">
              How old is your body <br className="hidden lg:block"/>
              <span className="text-[#C5D82D] italic">really?</span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-[540px]">
              This 8-question check gives you an honest picture of your biological age in 2 minutes.
            </p>
          </div>

          {/* Right Column: Stats & Actions Card */}
          <div className="w-full lg:w-[40%]  p-8 md:p-10 ">
            
            {/* Stats Row */}
            <div className="flex justify-between items-center mb-10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#C5D82D] mb-1">8</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Questions</div>
              </div>
              <div className="w-[1px] h-10 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#C5D82D] mb-1">2 min</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">To complete</div>
              </div>
              <div className="w-[1px] h-10 bg-white/20"></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[#C5D82D] mb-1">Free</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Always</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-4">
              {!mounted ? (
                <div className="w-full h-[52px] opacity-0"></div>
              ) : hasStoredResult ? (
                <>
                  <button
                    onClick={viewResult}
                    className="group relative w-full py-5 bg-[#C5D82D] text-black font-bold text-sm rounded-full transition-all hover:bg-[#d9ed3d] hover:-translate-y-1 active:scale-95 shadow-[0_10px_30px_rgba(197,216,45,0.2)] uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    View Your Test Result <span>→</span>
                  </button>
                  <button
                    onClick={retakeTest}
                    className="w-full py-5 bg-transparent border border-white/30 text-white font-bold text-sm rounded-full transition-all hover:bg-white/10 hover:border-white hover:-translate-y-1 active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3"
                  >
                    Retake Longevity Check
                  </button>
                </>
              ) : (
                <button
                  onClick={startTest}
                  className="group relative w-full py-5 bg-[#C5D82D] text-black font-bold text-sm rounded-full transition-all hover:bg-[#d9ed3d] hover:-translate-y-1 active:scale-95 shadow-[0_10px_30px_rgba(197,216,45,0.2)] uppercase tracking-widest flex items-center justify-center gap-3"
                >
                  Start My Longevity Check <span>→</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[11px] text-gray-500 bg-white/5 border border-white/10 rounded-[1.5rem] p-6 flex items-start gap-4">
          <div className="text-[#C5D82D] shrink-0 font-bold">INFO</div>
          <p className="leading-relaxed">
            <strong className="text-white">Important:</strong> This is a wellness screener — not a medical diagnosis. It is designed to give you a useful starting picture based on well-established Indian health research. If you have existing health conditions, always consult your doctor. GRASA will never use your answers to sell you anything — only to have an honest conversation.
          </p>
        </div>
        
      </div>
    </section>
  );
}