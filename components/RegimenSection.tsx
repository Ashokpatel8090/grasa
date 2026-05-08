

// "use client";

// import React from 'react';

// export default function RegimenSection() {
  
//   // Function to handle smooth scrolling to the longevity check section
//   const scrollToLongevityCheck = () => {
//     const longevitySection = document.getElementById('longevity-assessment');
//     if (longevitySection) {
//       longevitySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   return (
//     <section className="w-full bg-[#faf8f3] overflow-hidden">
//       <div className="max-w-[1200px] mx-auto px-6">
//         {/* Container updated: removed md:gap-16, letting the 55/45 split handle the layout naturally */}
//         <div className="relative w-full bg-[#0f1114] rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center md:justify-between gap-10 md:gap-0 overflow-hidden shadow-2xl">
          
//           {/* Subtle Glow Background */}
//           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
//           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24" />

//           {/* LEFT SIDE: Copy (55% Width) */}
//           <div className="relative z-10 w-full md:w-[55%] text-white pr-0 md:pr-8">
//             <div className="inline-block px-3 py-1 rounded-full border border-lime-500/30 bg-lime-500/5 text-lime-400 text-[10px] uppercase tracking-widest font-bold mb-6">
//               The GRASA Method
//             </div>
            
//             <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6 font-serif">
//               You don’t need a diagnosis <span className="text-lime-400 italic">to start.</span>
//             </h2>

//             <p className="text-gray-400 text-lg mb-0 leading-relaxed max-w-lg">
//               Healthy people use GRASA to stay that way. People with health concerns use it to turn things around. <span className="text-white">Both are welcome.</span>
//             </p>
//           </div>

//           {/* RIGHT SIDE: Button (45% Width) */}
//           <div className="relative z-10 w-full md:w-[45%] flex justify-start md:justify-end">
//             <button 
//               onClick={scrollToLongevityCheck}
//               className="group relative inline-flex items-center justify-center gap-3 bg-lime-400 text-black px-8 py-4 rounded-full font-bold text-sm transition-all hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.3)] w-full md:w-auto"
//             >
//               Take the Longevity Check — Free
//               <span className="group-hover:translate-x-1 transition-transform">→</span>
//             </button>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }











// "use client";

// import React from 'react';
// import { useRouter } from 'next/navigation';

// export default function RegimenSection() {
//   const router = useRouter();

//   const handleStartTest = () => {
//     router.push('/longevity-test');
//   };

//   return (
//     <section className="w-full bg-[#faf8f3] overflow-hidden py-10">
//       <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
//         {/* Main Dark Container */}
//         <div className="relative w-full bg-[#0f1114] rounded-[2.5rem] p-8 sm:p-12 md:p-16 flex flex-col gap-12 overflow-hidden shadow-2xl">
          
//           {/* Subtle Glow Backgrounds */}
//           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
//           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none" />

//             <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
//   {/* Left Side */}
//               <div className="w-full md:w-[60%] text-white">
//                 <div className="inline-block px-4 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 text-[#C5D82D] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-6">
//                   The GRASA Method
//                 </div>
                
//                 <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] mb-6 font-serif">
//                   Not a diet. Not a supplement. <br className="hidden lg:block"/>
//                   <span className="text-[#C5D82D] italic font-normal">A longevity programme.</span>
//                 </h2>
//               </div>
              
//               {/* Right Side - Now centered vertically and horizontally */}
//               <div className="w-full md:w-[40%] flex items-center justify-center">
//                 <p className="text-gray-400 text-base sm:text-lg mb-0 leading-relaxed text-center md:text-left">
//                   Most health programmes tell you what <em className="text-white not-italic">not</em> to eat. GRASA sends food to your home and our nutritionist team guides every step — updating your plan as your body responds.
//                 </p>
//               </div>
//             </div>
//           {/* MIDDLE SECTION: 3 Steps */}
//           <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            
//             {/* Step 1 */}
//             <div className="flex flex-col gap-3 bg-white/5 p-6 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
//               <span className="text-[#C5D82D] font-serif text-3xl font-bold mb-1">01</span>
//               <h3 className="font-bold text-xl text-white">Food made for your body</h3>
//               <p className="text-gray-400 text-sm leading-relaxed">
//                 Fresh grain food — atta, flatbread, snacks — home delivered. Ancient Indian grains that digest slower and keep you fuller.
//               </p>
//             </div>

//             {/* Step 2 */}
//             <div className="flex flex-col gap-3 bg-white/5 p-6 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
//               <span className="text-[#C5D82D] font-serif text-3xl font-bold mb-1">02</span>
//               <h3 className="font-bold text-xl text-white">Guided by our nutritionist</h3>
//               <p className="text-gray-400 text-sm leading-relaxed">
//                 A personalised plan built for you. Ongoing consultations. Your plan updates as your body responds.
//               </p>
//             </div>

//             {/* Step 3 */}
//             <div className="flex flex-col gap-3 bg-white/5 p-6 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors">
//               <span className="text-[#C5D82D] font-serif text-3xl font-bold mb-1">03</span>
//               <h3 className="font-bold text-xl text-white">You feel the difference</h3>
//               <p className="text-gray-400 text-sm leading-relaxed">
//                 More energy, lighter digestion — most notice within weeks. By end of plan, changes are measurable and lasting.
//               </p>
//             </div>

//           </div>

//           {/* Divider */}
//           <div className="relative z-10 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

//           {/* BOTTOM SECTION: Stats & CTA */}
//           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            
//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto text-center lg:text-left">
//               <div>
//                 <div className="text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
//                 <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">People helped</div>
//               </div>
//               <div>
//                 <div className="text-2xl sm:text-3xl font-bold text-white mb-1">87%</div>
//                 <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Feel better month 1</div>
//               </div>
//               <div>
//                 <div className="text-2xl sm:text-3xl font-bold text-white mb-1">3</div>
//                 <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Plans available</div>
//               </div>
//               <div>
//                 <div className="text-2xl sm:text-3xl font-bold text-white mb-1">Zero</div>
//                 <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Medicine conflicts</div>
//               </div>
//             </div>

//             {/* CTA Button */}
//             <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end">
//               <button 
//                 onClick={handleStartTest}
//                 className="group relative inline-flex items-center justify-center gap-3 bg-[#C5D82D] text-black px-8 py-4 rounded-full font-bold text-sm transition-all hover:bg-[#b3c528] hover:-translate-y-1 active:scale-95 shadow-[0_0_24px_rgba(197,216,45,0.3)] w-full sm:w-auto uppercase tracking-wide"
//               >
//                 Take the Longevity Check — Free
//                 <span className="group-hover:translate-x-1 transition-transform">→</span>
//               </button>
//             </div>

//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }







"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function RegimenSection() {
  const router = useRouter();

  const handleStartTest = () => {
    router.push('/longevity-test');
  };

  return (
    <section className="w-full bg-[#faf8f3] overflow-hidden py-10">
      <div className="max-w-[100%] mx-auto md:px-4 lg:px-12">
        
        {/* Main Dark Container */}
        <div className="relative w-full bg-[#0f1114] md:rounded-[2.5rem] p-8 sm:p-12 md:p-16 flex flex-col gap-12 overflow-hidden shadow-2xl">
          
          {/* Subtle Glow Backgrounds */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Left Side */}
            <div className="w-full md:w-[60%] text-white">
              <div className="inline-block px-4 py-1.5 rounded-full border border-lime-500/30 bg-lime-500/10 text-[#C5D82D] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold mb-6">
                The GRASA Method
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] mb-6">
                Not a diet. Not a supplement. <br className="hidden lg:block"/>
                <span className="text-[#C5D82D]  italic">A longevity programme.</span>
              </h2>
            </div>
            
            {/* Right Side */}
            <div className="w-full md:w-[40%] flex items-center justify-center">
              <p className="text-gray-400 text-base sm:text-lg mb-0 leading-relaxed text-center md:text-left">
                Most health programmes tell you what <em className="text-white not-italic font-semibold">not</em> to eat. GRASA sends food to your home and our nutritionist team guides every step — updating your plan as your body responds.
              </p>
            </div>
          </div>

          {/* MIDDLE SECTION: 3 Steps */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            
            {/* Step 1 */}
            <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors group">
              <span className="text-[#C5D82D] text-4xl font-black mb-1 opacity-80 group-hover:opacity-100 transition-opacity">01</span>
              <h3 className="font-bold text-xl text-white">Food made for your body</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fresh grain food — atta, flatbread, snacks — home delivered. Ancient Indian grains that digest slower and keep you fuller.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors group">
              <span className="text-[#C5D82D] text-4xl font-black mb-1 opacity-80 group-hover:opacity-100 transition-opacity">02</span>
              <h3 className="font-bold text-xl text-white">Guided by our nutritionist</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A personalised plan built for you. Ongoing consultations. Your plan updates as your body responds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col gap-4 bg-white/5 p-8 rounded-[1.5rem] border border-white/10 hover:bg-white/10 transition-colors group">
              <span className="text-[#C5D82D] text-4xl font-black mb-1 opacity-80 group-hover:opacity-100 transition-opacity">03</span>
              <h3 className="font-bold text-xl text-white">You feel the difference</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                More energy, lighter digestion — most notice within weeks. By end of plan, changes are measurable and lasting.
              </p>
            </div>

          </div>

          {/* Divider */}
          <div className="relative z-10 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

          {/* BOTTOM SECTION: Stats & CTA */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full lg:w-auto text-center lg:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">People helped</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">87%</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Feel better month 1</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">3</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Plans available</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">Zero</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Medicine conflicts</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end">
              <button 
                onClick={handleStartTest}
                className="group relative inline-flex cursor-pointer items-center justify-center gap-3 bg-[#C5D82D] text-black px-10 py-5 rounded-full font-bold text-sm transition-all hover:bg-[#d9ed3d] hover:-translate-y-1 active:scale-95 shadow-[0_10px_30px_rgba(197,216,45,0.2)] w-full sm:w-auto uppercase tracking-widest"
              >
                TAKE THE LONGEVITY TEST ™
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}