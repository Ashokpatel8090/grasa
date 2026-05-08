

// "use client"
// import React, { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"

// const HeroSection = () => {
//   const router = useRouter();
//   const [hasStoredResult, setHasStoredResult] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     // Check if there is an unexpired test result in localStorage
//     const saved = localStorage.getItem('grasa_longevity_result');
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
//         if (Date.now() - parsed.timestamp < oneMonthInMs) {
//           setHasStoredResult(true);
//         }
//       } catch (err) {
//         console.error("Failed to parse local storage in Hero:", err);
//       }
//     }
//   }, []);

//   const handleStartTest = () => {
//     router.push('/longevity-test');
//   };

//   const handleRetakeTest = () => {
//     localStorage.removeItem('grasa_longevity_result');
//     router.push('/longevity-test');
//   };

//   const handleViewResult = () => {
//     router.push('/longevity-test/result');
//   };

//   return (
//     <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10 ">
//       <div className="max-w-[100%] mx-auto">

//         {/* Hero Container */}
//         <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex items-start pt-16 sm:pt-24 md:pt-32 lg:pt-36 px-6 sm:px-10 md:px-14 lg:px-20 shadow-xl">

//           {/* Background Image */}
//           <div
//             className="absolute inset-0 bg-cover bg-center z-0"
//             style={{
//               backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('/bg2.png')`,
//             }}
//           />

//           {/* Content */}
//               <div className="relative z-10 max-w-xl lg:max-w-2xl text-white">
//                 {/* Award Strip */}
//           <div className="mt-16 bg-gradient-to-r from-[#1C3A2A] via-[#2D5A3D] to-[#1C3A2A] py-3.5 px-10 flex items-center justify-center gap-4 relative overflow-hidden">
//             <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_120px,rgba(196,151,42,0.08)_120px,rgba(196,151,42,0.08)_121px)]"></div>
//             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8C96A] to-[#C4972A] flex items-center justify-center text-lg flex-shrink-0 relative z-10 shadow-[0_0_0_3px_rgba(196,151,42,0.3)]">
//               🏅
//             </div>
//             <p className="text-[#F5F0E8] text-xs font-normal tracking-wider relative z-10">
//               <strong className="text-[#E8C96A]">Rashtriya Ratna Samman 2026</strong> — Emerging Health Tech & Nutrition Innovation Startup of the Year
//             </p>
//         </div>

//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.1] mb-6 md:mb-8 tracking-tight">
//               Know the root cause <br className="hidden sm:block"/>
//               of your digestive problems.
//             </h1>

//             {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight md:leading-[1.15] mb-8 md:mb-12 tracking-tighter text-balance">
//               Know the root cause<br className="hidden sm:block"/>
//               <span className="bg-gradient-to-r from-accent via-[#C5D82D] to-accent bg-clip-text text-transparent">
//                 of your digestive problems 
//               </span>
//             </h1> */}

//             {/* Dynamic Buttons */}
//             <div className="min-h-[60px]">
//               {!mounted ? (
//                 // Fallback for SSR to prevent hydration mismatch
//                 <button
//                   className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg opacity-0 pointer-events-none uppercase tracking-tight shadow-md"
//                 >
//                   TAKE THE LONGEVITY TEST ™
//                 </button>
//               ) : hasStoredResult ? (
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <button
//                     onClick={handleViewResult}
//                     className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight shadow-md flex items-center justify-center gap-2"
//                   >
//                     VIEW YOUR TEST RESULT <i className="fas fa-file-medical text-[0.9rem]"></i>
//                   </button>
//                   <button
//                     onClick={handleRetakeTest}
//                     className="bg-transparent border-2 border-white text-white font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:bg-white/10 hover:scale-105 transition-all uppercase tracking-tight flex items-center justify-center gap-2"
//                   >
//                     RETAKE LONGEVITY TEST <i className="fas fa-redo text-[0.8rem]"></i>
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={handleStartTest}
//                   className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight shadow-md"
//                 >
//                   TAKE THE LONGEVITY TEST ™
//                 </button>
//               )}
//             </div>

//           </div>
//         </div>

//         {/* Floating Stats Cards */}
//         <div className="relative z-20 -mt-10 sm:-mt-12 px-2 sm:px-4 md:px-10">
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">

//             {/* Card 1: 500+ */}
//             <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//                 <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
//                   500+
//                 </h3>
//               </div>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-relaxed">
//                 People helped in Delhi NCR
//               </p>
//             </div>

//             {/* Card 2: 87% */}
//             <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//                 <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
//                   87%
//                 </h3>
//               </div>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-relaxed">
//                 Feel more energetic within month 1
//               </p>
//             </div>

//             {/* Card 3: FSSAI */}
//             <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//                 <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
//                   FSSAI
//                 </h3>
//               </div>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-relaxed">
//                 Licensed & certified food
//               </p>
//             </div>

//             {/* Card 4: Fresh */}
//             <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M16 8h2a2 2 0 012 2v6m-6-8v8m-4-8v8" />
//                   <path d="M14 16h-2m-4 0H6m8 0h2m-6-4h4" />
//                   <circle cx="7.5" cy="17.5" r="2.5" />
//                   <circle cx="17.5" cy="17.5" r="2.5" />
//                 </svg>
//                 <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
//                   Fresh
//                 </h3>
//               </div>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-tight">
//                 Home delivered Delhi NCR
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   )
// }

// export default HeroSection;


"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Award } from "lucide-react";

const HeroSection = () => {
  const router = useRouter();
  const [hasStoredResult, setHasStoredResult] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if there is an unexpired test result in localStorage
    const saved = localStorage.getItem('grasa_longevity_result');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - parsed.timestamp < oneMonthInMs) {
          setHasStoredResult(true);
        }
      } catch (err) {
        console.error("Failed to parse local storage in Hero:", err);
      }
    }
  }, []);

  const handleStartTest = () => {
    router.push('/longevity-test');
  };

  const handleRetakeTest = () => {
    localStorage.removeItem('grasa_longevity_result');
    router.push('/longevity-test');
  };

  const handleViewResult = () => {
    router.push('/longevity-test/result');
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="max-w-[100%] mx-auto">

        {/* Hero Container */}
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex items-center md:items-start pt-16 sm:pt-24 md:pt-32 lg:pt-36 px-6 sm:px-10 md:px-14 lg:px-20 shadow-xl">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('/bg2.png')`,
            }}
          />

          {/* Floating Award Button/Badge (Top of Image) */}
          {/* <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20 pr-6">
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#1C3A2A]/90 to-[#2D5A3D]/90 backdrop-blur-md border border-[#E8C96A]/40 py-2 px-3  rounded-full shadow-lg hover:scale-105 hover:bg-[#1C3A2A] transition-all cursor-default w-fit max-w-full">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#E8C96A] to-[#C4972A] flex items-center justify-center text-sm sm:text-base flex-shrink-0 shadow-[0_0_0_2px_rgba(196,151,42,0.3)]">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </div>
              <p className="text-[#F5F0E8] text-[10px] sm:text-sm font-normal tracking-wide truncate sm:whitespace-normal">
                <strong className="text-[#E8C96A] ">RASHTRIYA RATNA SAMMAN 2026</strong> 
                <span className="hidden sm:inline"> — Emerging Health Tech & Nutrition Innovation</span>
              </p>
            </div>
          </div> */}


  <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20 pr-6">
  <div
    onClick={() => {
      document.getElementById('award-section')?.scrollIntoView({ behavior: 'smooth' });
    }}
    className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#E8C96A] to-[#C4972A] text-blackbackdrop-blur-md border border-[#E8C96A]/40 py-2 px-3 rounded-full shadow-lg hover:scale-105 hover:bg-[#1C3A2A] transition-all cursor-pointer w-fit max-w-full">
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#E8C96A] to-[#C4972A] flex items-center justify-center text-sm sm:text-base flex-shrink-0 shadow-[0_0_0_2px_rgba(196,151,42,0.3)]">
      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
    </div>
    <p className="text-[#F5F0E8] text-[10px] sm:text-sm font-normal tracking-wide truncate sm:whitespace-normal">
      <strong className="text-[#000000]">RASHTRIYA RATNA SAMMAN 2026</strong>
      <span className="hidden sm:inline"> — Emerging Health Tech & Nutrition Innovation</span>
    </p>
  </div>
</div>

          {/* Content */}
          <div className="relative z-10 max-w-xl lg:max-w-2xl text-white mt-10 sm:mt-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.1] mb-6 md:mb-8 tracking-tight">
              Know the root cause <br className="hidden sm:block"/>
              of your digestive problems.
            </h1>

            {/* Dynamic Buttons */}
            <div className="min-h-[60px]">
              {!mounted ? (
                // Fallback for SSR to prevent hydration mismatch
                <button
                  className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg opacity-0 pointer-events-none uppercase tracking-tight shadow-md"
                >
                  TAKE THE LONGEVITY TEST ™
                </button>
              ) : hasStoredResult ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleViewResult}
                    className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight shadow-md flex items-center justify-center gap-2"
                  >
                    VIEW YOUR TEST RESULT <i className="fas fa-file-medical text-[0.9rem]"></i>
                  </button>
                  <button
                    onClick={handleRetakeTest}
                    className="bg-transparent border-2 border-white text-white font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:bg-white/10 hover:scale-105 transition-all uppercase tracking-tight flex items-center justify-center gap-2"
                  >
                    RETAKE LONGEVITY TEST <i className="fas fa-redo text-[0.8rem]"></i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartTest}
                  className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight shadow-md"
                >
                  TAKE THE LONGEVITY TEST ™
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Floating Stats Cards */}
        <div className="relative z-20 -mt-10 sm:-mt-12 px-2 sm:px-4 md:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">

            {/* Card 1: 500+ */}
            <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
              <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  500+
                </h3>
              </div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-relaxed">
                People helped in Delhi NCR
              </p>
            </div>

            {/* Card 2: 87% */}
            <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
              <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  87%
                </h3>
              </div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-relaxed">
                Feel more energetic within month 1
              </p>
            </div>

            {/* Card 3: FSSAI */}
            <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
              <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  FSSAI
                </h3>
              </div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-relaxed">
                Licensed & certified food
              </p>
            </div>

            {/* Card 4: Fresh */}
            <div className="bg-[#F8F7F2] p-5 md:p-6 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
              <div className="flex items-center space-x-3 mb-2 text-[#1d5c46]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 8h2a2 2 0 012 2v6m-6-8v8m-4-8v8" />
                  <path d="M14 16h-2m-4 0H6m8 0h2m-6-4h4" />
                  <circle cx="7.5" cy="17.5" r="2.5" />
                  <circle cx="17.5" cy="17.5" r="2.5" />
                </svg>
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Fresh
                </h3>
              </div>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.15em] text-center md:text-left leading-tight">
                Home delivered Delhi NCR
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default HeroSection