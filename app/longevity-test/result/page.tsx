// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { StoredResult } from '@/types/longevity';
// import { Toaster } from "react-hot-toast";

// // Local interface for the new API response to ensure type safety
// interface ProfileApiResult {
//   dominant_profile: string;
//   mapped_programme: string;
//   secondary_profile: string;
//   flag_for_nutritionist_review: boolean;
// }

// export default function LongevityResultPage() {
//   const router = useRouter();
  
//   const [apiResult, setApiResult] = useState<ProfileApiResult | null>(null);
//   const [age, setAge] = useState<number | null>(null);
//   const [scores, setScores] = useState<Record<string, number>>({});
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const saved = localStorage.getItem('grasa_longevity_result');
//     if (saved) {
//       try {
//         const parsed: StoredResult = JSON.parse(saved);
//         const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
//         if (Date.now() - parsed.timestamp < oneMonthInMs) {
//           setApiResult(parsed.result as ProfileApiResult);
//           setAge(parsed.age);
//           setScores(parsed.scores || {});
//           setIsLoading(false);
//         } else {
//           localStorage.removeItem('grasa_longevity_result');
//           router.push('/longevity-test');
//         }
//       } catch (err) {
//         router.push('/longevity-test');
//       }
//     } else {
//       router.push('/longevity-test');
//     }
//   }, [router]);

//   const openWA = () => {
//     const msg = encodeURIComponent(`Hi GRASA, I just completed my health check. My dominant profile is the "${apiResult?.dominant_profile}" and my recommended path is the "${apiResult?.mapped_programme}". I'd like to discuss my full report with your doctor.`);
//     window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
//   };

//   // Static content array to always display these specific action steps
//   const staticActionCards = [
//     { 
//       icon: '⚡', 
//       title: 'Start with your meal timing', 
//       desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' 
//     },
//     { 
//       icon: '🌾', 
//       title: 'Change your daily atta and grains', 
//       desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' 
//     },
//     { 
//       icon: '🌙', 
//       title: 'Your sleep is undermining everything else', 
//       desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' 
//     },
//     { 
//       icon: '📞', 
//       title: 'Talk to us — before spending anything', 
//       desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' 
//     }
//   ];

//   if (isLoading || !apiResult) {
//     return (
//       <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
//         <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{__html: `
//         @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
//         .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
//       `}} />
//       <Toaster 
//         position="bottom-right"
//         toastOptions={{ duration: 3500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} 
//       />
//       <div className="font-sans bg-[#0f1114] text-white w-full min-h-screen overflow-x-hidden relative leading-[1.6]">
        
//         <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
//         <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

//         <div className="max-w-3xl mx-auto px-5 pt-10 pb-32 md:px-4 md:pt-14 relative z-10">
//           <div className="animate-fadeUp relative">
            
//             {/* Top Result Band */}
//             <div className="relative rounded-xl p-6 md:p-8 mb-6 border-[1.5px] border-[#C5D82D]/30 bg-[#C5D82D]/5 backdrop-blur-sm shadow-[0_0_30px_rgba(197,216,45,0.05)] overflow-hidden">
//               <div className="flex flex-col gap-6">
//                 <div>
//                   <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Your Primary Metabolic Profile</div>
//                   <div className="font-sans text-[2.2rem] md:text-[2.8rem] font-black leading-tight mb-2 text-[#C5D82D]">
//                     {apiResult.dominant_profile}
//                   </div>
                  
//                   {apiResult.flag_for_nutritionist_review && (
//                     <div className="inline-flex items-center gap-2 mt-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-md">
//                       <span className="text-red-500 text-[0.8rem]">⚠️</span>
//                       <span className="text-red-400 text-[0.75rem] font-bold tracking-wide uppercase">Priority Review Recommended</span>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-white/10">
//                   <div className="bg-white/5 rounded-lg p-4 border border-white/5">
//                     <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-gray-500 mb-1">Secondary Profile</div>
//                     <div className="text-[1rem] font-semibold text-gray-200">
//                       {apiResult.secondary_profile || 'None Detected'}
//                     </div>
//                   </div>
                  
//                   <div className="bg-[#C5D82D]/10 rounded-lg p-4 border border-[#C5D82D]/20">
//                     <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#C5D82D]/80 mb-1">Recommended Path</div>
//                     {/* <div className="text-[1rem] font-bold text-[#C5D82D]">
//                       {apiResult.mapped_programme}
//                     </div> */}

//                     <div
//                       className="text-[1rem] font-bold text-[#C5D82D] cursor-pointer hover:underline"
//                       onClick={() => {
//                         router.push(`/?plan=${encodeURIComponent(apiResult.mapped_programme)}`);
//                       }}
//                     >
//                       {apiResult.mapped_programme}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Full Result Content */}
//             <div className="animate-fadeUp mt-10">
//               <div className="text-center mb-8">
//                 <h2 className="font-sans text-[1.8rem] font-bold text-white mb-2">Your personalised action plan</h2>
//                 <p className="text-[0.95rem] text-gray-400">Based on your answers — here is what matters most for your body right now.</p>
//               </div>
              
//               {/* Render Static Action Cards */}
//               <div className="flex flex-col gap-4 mb-10">
//                 {staticActionCards.map((a, i) => (
//                   <div key={i} className="bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-6 flex gap-5 items-start transition-all hover:bg-white/5 hover:border-white/20">
//                     <div className="text-[1.8rem] shrink-0 leading-none">{a.icon}</div>
//                     <div>
//                       <div className="text-[1.05rem] font-bold text-white mb-2">{a.title}</div>
//                       <div className="text-[0.9rem] text-gray-400 leading-relaxed">{a.desc}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Doctor Call CTA */}
//               <div className="bg-white/5 border-[1.5px] border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-4">
//                 <h3 className="font-sans text-[1.4rem] font-bold text-white mb-3">Talk to our doctor — it's free.</h3>
//                 <p className="text-[0.9rem] text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">Your profile mapping and answers are already saved. Our doctor will look at your full file before the call — so you're not starting from scratch.</p>
//                 <div className="flex flex-col gap-3 max-w-sm mx-auto">
//                   <button onClick={() => window.open('tel:+919870263399')} className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(197,216,45,0.3)]">
//                     <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//                       <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
//                     </svg>
//                     <span>Call Us Now — +91 98702 63399</span>
//                   </button>
//                   <button onClick={openWA} className="py-3.5 px-6 bg-[#25D366] text-white font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#1fa855] hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]">
//                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                     </svg>
//                     <span>Continue on WhatsApp</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
            
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }










"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoredResult } from '@/types/longevity';
import { Toaster } from "react-hot-toast";

interface ProfileApiResult {
  dominant_profile: string;
  mapped_programme: string;
  secondary_profile: string;
  flag_for_nutritionist_review: boolean;
}

export default function LongevityResultPage() {
  const router = useRouter();
  
  const [apiResult, setApiResult] = useState<ProfileApiResult | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('grasa_longevity_result');
    if (saved) {
      try {
        const parsed: StoredResult = JSON.parse(saved);
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - parsed.timestamp < oneMonthInMs) {
          setApiResult(parsed.result as ProfileApiResult);
          setAge(parsed.age);
          setScores(parsed.scores || {});
          setIsLoading(false);
        } else {
          localStorage.removeItem('grasa_longevity_result');
          router.push('/longevity-test');
        }
      } catch (err) {
        router.push('/longevity-test');
      }
    } else {
      router.push('/longevity-test');
    }
  }, [router]);

  const openWA = () => {
    const msg = encodeURIComponent(`Hi GRASA, I just completed my health check. My dominant profile is the "${apiResult?.dominant_profile}" and my recommended path is the "${apiResult?.mapped_programme}". I'd like to discuss my full report with your doctor.`);
    window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
  };

  // Navigate to homepage regimen-plans section with the matched programme highlighted
  const handleRecommendedPathClick = () => {
    if (!apiResult?.mapped_programme) return;
    const encoded = encodeURIComponent(apiResult.mapped_programme);
    // Navigate to homepage with query param; RegimenPlans will pick it up
    window.location.href = `/?highlight=${encoded}#regimen-plans`;
  };

  const staticActionCards = [
    { 
      icon: '⚡', 
      title: 'Start with your meal timing', 
      desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' 
    },
    { 
      icon: '🌾', 
      title: 'Change your daily atta and grains', 
      desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' 
    },
    { 
      icon: '🌙', 
      title: 'Your sleep is undermining everything else', 
      desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' 
    },
    { 
      icon: '📞', 
      title: 'Talk to us — before spending anything', 
      desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' 
    }
  ];

  if (isLoading || !apiResult) {
    return (
      <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
        .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .recommended-path-btn { transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .recommended-path-btn:hover { background: rgba(197,216,45,0.22) !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(197,216,45,0.15); }
        .recommended-path-btn:active { transform: translateY(0px); }
        .arrow-icon { display: inline-block; transition: transform 0.2s; }
        .recommended-path-btn:hover .arrow-icon { transform: translateX(4px); }
      `}} />
      <Toaster 
        position="bottom-right"
        toastOptions={{ duration: 3500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} 
      />
      <div className="font-sans bg-[#0f1114] text-white w-full min-h-screen overflow-x-hidden relative leading-[1.6]">
        
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

        <div className="max-w-3xl mx-auto px-5 pt-10 pb-32 md:px-4 md:pt-14 relative z-10">
          <div className="animate-fadeUp relative">
            
            {/* Top Result Band */}
            <div className="relative rounded-xl p-6 md:p-8 mb-6 border-[1.5px] border-[#C5D82D]/30 bg-[#C5D82D]/5 backdrop-blur-sm shadow-[0_0_30px_rgba(197,216,45,0.05)] overflow-hidden">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Your Primary Metabolic Profile</div>
                  <div className="font-sans text-[2.2rem] md:text-[2.8rem] font-black leading-tight mb-2 text-[#C5D82D]">
                    {apiResult.dominant_profile}
                  </div>
                  
                  {apiResult.flag_for_nutritionist_review && (
                    <div className="inline-flex items-center gap-2 mt-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-md">
                      <span className="text-red-500 text-[0.8rem]">⚠️</span>
                      <span className="text-red-400 text-[0.75rem] font-bold tracking-wide uppercase">Priority Review Recommended</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-white/10">
                  {/* Secondary Profile — static */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-gray-500 mb-1">Secondary Profile</div>
                    <div className="text-[1rem] font-semibold text-gray-200">
                      {apiResult.secondary_profile || 'None Detected'}
                    </div>
                  </div>
                  
                  {/* Recommended Path — CLICKABLE */}
                  <button
                    onClick={handleRecommendedPathClick}
                    className="recommended-path-btn bg-[#C5D82D]/10 rounded-lg p-4 border border-[#C5D82D]/20 text-left cursor-pointer w-full group"
                    title="Click to view your recommended plan"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#C5D82D]/80">
                        Recommended Path
                      </div>
                      <span className="arrow-icon text-[#C5D82D]/60 text-[0.85rem]">→</span>
                    </div>
                    <div className="text-[1rem] font-bold text-[#C5D82D] leading-snug">
                      {apiResult.mapped_programme}
                    </div>
                    <div className="text-[0.68rem] text-[#C5D82D]/50 mt-1.5 font-medium">
                      Tap to view your matched plan ↗
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Full Result Content */}
            <div className="animate-fadeUp mt-10">
              <div className="text-center mb-8">
                <h2 className="font-sans text-[1.8rem] font-bold text-white mb-2">Your personalised action plan</h2>
                <p className="text-[0.95rem] text-gray-400">Based on your answers — here is what matters most for your body right now.</p>
              </div>
              
              {/* Static Action Cards */}
              <div className="flex flex-col gap-4 mb-10">
                {staticActionCards.map((a, i) => (
                  <div key={i} className="bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-6 flex gap-5 items-start transition-all hover:bg-white/5 hover:border-white/20">
                    <div className="text-[1.8rem] shrink-0 leading-none">{a.icon}</div>
                    <div>
                      <div className="text-[1.05rem] font-bold text-white mb-2">{a.title}</div>
                      <div className="text-[0.9rem] text-gray-400 leading-relaxed">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* View Recommended Plan CTA Banner */}
              <div
                onClick={handleRecommendedPathClick}
                className="cursor-pointer mb-6 rounded-xl border-[1.5px] border-[#C5D82D]/40 bg-[#C5D82D]/8 p-5 flex items-center justify-between gap-4 transition-all hover:bg-[#C5D82D]/15 hover:border-[#C5D82D]/60 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(197,216,45,0.12)] group"
              >
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[0.15em] uppercase text-[#C5D82D]/70 mb-1">Your recommended plan</div>
                  <div className="text-[1.05rem] font-bold text-[#C5D82D]">{apiResult.mapped_programme}</div>
                  <div className="text-[0.8rem] text-gray-400 mt-0.5">See features, pricing and what's included</div>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-full border border-[#C5D82D]/30 flex items-center justify-center text-[#C5D82D] group-hover:bg-[#C5D82D]/20 transition-all">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>

              {/* Doctor Call CTA */}
              <div className="bg-white/5 border-[1.5px] border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-4">
                <h3 className="font-sans text-[1.4rem] font-bold text-white mb-3">Talk to our doctor — it's free.</h3>
                <p className="text-[0.9rem] text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">Your profile mapping and answers are already saved. Our doctor will look at your full file before the call — so you're not starting from scratch.</p>
                <div className="flex flex-col gap-3 max-w-sm mx-auto">
                  <button onClick={() => window.open('tel:+919870263399')} className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(197,216,45,0.3)]">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    <span>Call Us Now — +91 98702 63399</span>
                  </button>
                  <button onClick={openWA} className="py-3.5 px-6 bg-[#25D366] text-white font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#1fa855] hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Continue on WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}