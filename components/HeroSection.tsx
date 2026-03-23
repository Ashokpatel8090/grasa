
// "use client"
// import React from "react"

// const HeroSection = () => {
//   return (
//     <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10 ">
//       <div className="max-w-7xl mx-auto">

//         {/* Hero Container */}
//         {/* CHANGED: Replaced 'items-center' with 'items-start pt-16 sm:pt-24 md:pt-32 lg:pt-36' to move content higher */}
//         <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex items-start pt-16 sm:pt-24 md:pt-32 lg:pt-36 px-6 sm:px-10 md:px-14 lg:px-20 shadow-xl">

//           {/* Background Image */}
//           <div
//             className="absolute inset-0 bg-cover bg-center z-0"
//             style={{
//               // backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=2000')`,
//               backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('/bg2.png')`,

//             }}
//           />

//           {/* Content */}
//           <div className="relative z-10 max-w-xl lg:max-w-2xl text-white">

//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.1] mb-6 md:mb-8 tracking-tight">
//               Know the root cause <br className="hidden sm:block"/>
//               of your digestive problems.
//             </h1>

//             <button
//               onClick={() =>
//                 document
//                   .getElementById("longevity-assessment")
//                   ?.scrollIntoView({ behavior: "smooth" })
//               }
//               className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight shadow-md"
//             >
//               TAKE THE LONGEVITY TEST ™
//             </button>

//           </div>
//         </div>

//         {/* Floating Stats Cards */}
//         <div className="relative z-20 -mt-10 sm:-mt-12 px-2 sm:px-4 md:px-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">

//             {/* Card 1 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
//                 10K+
//               </h3>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                 Happy Customers
//               </p>
//             </div>

//             {/* Card 2 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
//                 95%
//               </h3>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                 Saw Results*
//               </p>
//             </div>

//             {/* Card 3 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">

//               <div className="flex items-center space-x-2">
//                 <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
//                   4.8
//                 </h3>

//                 <div className="flex text-black">
//                   <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20">
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 </div>
//               </div>

//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                  Rating
//               </p>

//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   )
// }

// export default HeroSection







// "use client"
// import React, { useState, useEffect } from "react"

// const HeroSection = () => {
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

//   const scrollToAssessment = () => {
//     document.getElementById("longevity-assessment")?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   return (
//     <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10 ">
//       <div className="max-w-7xl mx-auto">

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
//           <div className="relative z-10 max-w-xl lg:max-w-2xl text-white">

//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-[1.1] mb-6 md:mb-8 tracking-tight">
//               Know the root cause <br className="hidden sm:block"/>
//               of your digestive problems.
//             </h1>

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
//                     onClick={scrollToAssessment}
//                     className="bg-[#C5D82D] text-black font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:scale-105 transition-transform uppercase tracking-tight shadow-md flex items-center justify-center gap-2"
//                   >
//                     VIEW YOUR TEST RESULT <i className="fas fa-file-medical text-[0.9rem]"></i>
//                   </button>
//                   <button
//                     onClick={scrollToAssessment}
//                     className="bg-transparent border-2 border-white text-white font-bold px-6 sm:px-7 py-3 rounded-xl text-sm sm:text-base md:text-lg hover:bg-white/10 hover:scale-105 transition-all uppercase tracking-tight flex items-center justify-center gap-2"
//                   >
//                     RETAKE LONGEVITY TEST <i className="fas fa-redo text-[0.8rem]"></i>
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={scrollToAssessment}
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
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">

//             {/* Card 1 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
//                 10K+
//               </h3>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                 Happy Customers
//               </p>
//             </div>

//             {/* Card 2 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">
//               <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-1">
//                 95%
//               </h3>
//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                 Saw Results*
//               </p>
//             </div>

//             {/* Card 3 */}
//             <div className="bg-[#F8F7F2] p-6 md:p-7 rounded-[1.2rem] shadow-sm border border-white flex flex-col items-center md:items-start transition-all hover:shadow-md">

//               <div className="flex items-center space-x-2">
//                 <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
//                   4.8
//                 </h3>

//                 <div className="flex text-black">
//                   <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 20 20">
//                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                   </svg>
//                 </div>
//               </div>

//               <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center md:text-left">
//                  Rating
//               </p>

//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   )
// }

// export default HeroSection







// "use client"
// import React, { useState, useEffect } from "react"

// const HeroSection = () => {
//   const [hasStoredResult, setHasStoredResult] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
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

//   const scrollToAssessment = () => {
//     document.getElementById("longevity-assessment")?.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   return (
//     <section className="relative bg-[#F4F4F4] pt-4 pb-16 lg:pb-24 font-sans">
//       <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Hero Container */}
//         <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[680px] flex items-center px-6 sm:px-12 md:px-16 lg:px-24 shadow-2xl">

//           {/* Background Image with Improved Gradient Overlay */}
//           <div
//             className="absolute inset-0 bg-cover bg-center z-0"
//             style={{
//               backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url('/bg2.png')`,
//             }}
//           />

//           {/* Hero Content */}
//           <div className="relative z-10 max-w-2xl text-white transform -translate-y-8 lg:-translate-y-12">
            
//             <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wider uppercase">
//               Transform Your Gut Health
//             </div>

//             <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tight drop-shadow-lg">
//               Know the root cause <br className="hidden sm:block"/>
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5D82D] to-[#e4f64d]">
//                 of your digestive problems.
//               </span>
//             </h1>

//             {/* Dynamic Buttons */}
//             <div className="min-h-[64px]">
//               {!mounted ? (
//                 <button className="bg-[#C5D82D] text-black font-bold px-8 py-4 rounded-xl text-base md:text-lg opacity-0 pointer-events-none uppercase tracking-wide shadow-lg">
//                   TAKE THE LONGEVITY TEST ™
//                 </button>
//               ) : hasStoredResult ? (
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <button
//                     onClick={scrollToAssessment}
//                     className="bg-[#C5D82D] text-black font-bold px-8 py-4 rounded-xl text-sm md:text-base hover:bg-[#d4e830] hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide shadow-[0_0_20px_rgba(197,216,45,0.4)] flex items-center justify-center gap-3"
//                   >
//                     VIEW YOUR TEST RESULT 
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
//                   </button>
//                   <button
//                     onClick={scrollToAssessment}
//                     className="bg-black/30 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-xl text-sm md:text-base hover:bg-white/20 hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide flex items-center justify-center gap-3"
//                   >
//                     RETAKE LONGEVITY TEST 
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
//                   </button>
//                 </div>
//               ) : (
//                 <button
//                   onClick={scrollToAssessment}
//                   className="bg-[#C5D82D] text-black font-bold px-8 py-4 rounded-xl text-base md:text-lg hover:bg-[#d4e830] hover:-translate-y-1 transition-all duration-300 uppercase tracking-wide shadow-[0_0_20px_rgba(197,216,45,0.4)] flex items-center justify-center gap-2 group"
//                 >
//                   TAKE THE LONGEVITY TEST ™
//                   <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
//                 </button>
//               )}
//             </div>

//           </div>
//         </div>

//         {/* Floating Stats Cards */}
//         <div className="relative z-20 -mt-20 sm:-mt-24 md:-mt-16 lg:-mt-20 px-4 sm:px-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5 max-w-7xl mx-auto">

//             {/* Card 1 */}
//             <div className="bg-white p-4 rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col justify-center md:justify-start gap-2">
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#f4f7d5] p-3 rounded-full text-[#9ba820]">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
//                 </div>
//                 <h3 className="text-xl  font-bold text-gray-900">500+</h3>
//               </div>
//               <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest  mt-1">
//                 People helped <br className="hidden md:block lg:hidden xl:block" /> in Delhi NCR
//               </p>
//             </div>

//             {/* Card 2 */}
//             <div className="bg-white p-4 rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col justify-center md:justify-start gap-2">
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#f4f7d5] p-3 rounded-full text-[#9ba820]">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
//                 </div>
//                 <h3 className="text-2xl  font-bold text-gray-900">87%</h3>
//               </div>
//               <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest leading-relaxed mt-1">
//                 Feel more energetic <br className="hidden md:block lg:hidden xl:block" /> within month 1
//               </p>
//             </div>

//             {/* Card 3 */}
//             <div className="bg-white p-4 rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col justify-center md:justify-start gap-2">
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#f4f7d5] p-3 rounded-full text-[#9ba820]">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
//                 </div>
//                 <h3 className="text-2xl  font-bold text-gray-900 whitespace-nowrap">3 Plans</h3>
//               </div>
//               <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest leading-relaxed mt-1">
//                 For every <br className="hidden md:block lg:hidden xl:block" /> health stage
//               </p>
//             </div>

//             {/* Card 4 */}
//             <div className="bg-white p-4 rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col justify-center md:justify-start gap-2">
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#f4f7d5] p-3 rounded-full text-[#9ba820]">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
//                 </div>
//                 <h3 className="text-2xl  font-bold text-gray-900">FSSAI</h3>
//               </div>
//               <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest leading-relaxed mt-1">
//                 Licensed & <br className="hidden md:block lg:hidden xl:block" /> certified food
//               </p>
//             </div>

//             {/* Card 5 */}
//             <div className="bg-white p-4 rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col justify-center md:justify-start gap-2">
//               <div className="flex items-center gap-3">
//                 <div className="bg-[#f4f7d5] p-3 rounded-full text-[#9ba820]">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
//                 </div>
//                 <h3 className="text-2xl  font-bold text-gray-900">Fresh</h3>
//               </div>
//               <p className="text-gray-500 font-semibold text-xs uppercase tracking-widest leading-relaxed mt-1">
//                 Home delivered <br className="hidden md:block lg:hidden xl:block" /> Delhi NCR
//               </p>
//             </div>

//           </div>
//         </div>

//       </div>
//     </section>
//   )
// }

// export default HeroSection







"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
    <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-10 ">
      <div className="max-w-[100%] mx-auto">

        {/* Hero Container */}
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px] flex items-start pt-16 sm:pt-24 md:pt-32 lg:pt-36 px-6 sm:px-10 md:px-14 lg:px-20 shadow-xl">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.35)), url('/bg2.png')`,
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-xl lg:max-w-2xl text-white">

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