

"use client";

import React from 'react';

export default function RegimenSection() {
  
  // Function to handle smooth scrolling to the longevity check section
  const scrollToLongevityCheck = () => {
    const longevitySection = document.getElementById('longevity-assessment');
    if (longevitySection) {
      longevitySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="w-full bg-[#faf8f3] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Container updated: removed md:gap-16, letting the 55/45 split handle the layout naturally */}
        <div className="relative w-full bg-[#0f1114] rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:justify-between gap-10 md:gap-0 overflow-hidden shadow-2xl">
          
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24" />

          {/* LEFT SIDE: Copy (55% Width) */}
          <div className="relative z-10 w-full md:w-[55%] text-white pr-0 md:pr-8">
            <div className="inline-block px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/5 text-lime-400 text-[10px] uppercase tracking-widest font-bold mb-6">
              The GRASA Method
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6 font-serif">
              You don’t need a diagnosis <span className="text-lime-400 italic">to start.</span>
            </h2>

            <p className="text-gray-400 text-lg mb-0 leading-relaxed max-w-lg">
              Healthy people use GRASA to stay that way. People with health concerns use it to turn things around. <span className="text-white">Both are welcome.</span>
            </p>
          </div>

          {/* RIGHT SIDE: Button (45% Width) */}
          <div className="relative z-10 w-full md:w-[45%] flex justify-start md:justify-end">
            <button 
              onClick={scrollToLongevityCheck}
              className="group relative inline-flex items-center justify-center gap-3 bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-sm transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.3)] w-full md:w-auto"
            >
              Take the Longevity Check — Free
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}