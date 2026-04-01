
// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { ApiResultData, StoredResult } from '@/types/longevity';

// export default function LongevityResultPage() {
//   const router = useRouter();
  
//   const [apiResult, setApiResult] = useState<ApiResultData | null>(null);
//   const [isUnlocked, setIsUnlocked] = useState(false);
//   const [age, setAge] = useState<number | null>(null);
//   const [scores, setScores] = useState<Record<string, number>>({});
//   const [payload, setPayload] = useState<any>(null); // Save original answers for WA re-submit
  
//   const [waNumber, setWaNumber] = useState('');
//   const [isUnlocking, setIsUnlocking] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const saved = localStorage.getItem('grasa_longevity_result');
//     if (saved) {
//       try {
//         const parsed: StoredResult = JSON.parse(saved);
//         const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
//         if (Date.now() - parsed.timestamp < oneMonthInMs) {
//           setApiResult(parsed.result);
//           setIsUnlocked(parsed.isUnlocked);
//           setAge(parsed.age);
//           setScores(parsed.scores || {});
//           setPayload(parsed.payload);
//           setIsLoading(false);
//         } else {
//           // Expired
//           localStorage.removeItem('grasa_longevity_result');
//           router.push('/longevity-test');
//         }
//       } catch (err) {
//         router.push('/longevity-test');
//       }
//     } else {
//       // No data found, redirect to start
//       router.push('/longevity-test');
//     }
//   }, [router]);

//   const unlockResult = async () => {
//     const num = waNumber.trim().replace(/\D/g, '');
//     if (num.length < 10) {
//       alert("Please enter a valid 10-digit number.");
//       return;
//     }
    
//     setIsUnlocking(true);
//     try {
//       // Re-submit original payload but attach the whatsapp number
//       const updatedPayload = { ...payload, whatsapp_number: waNumber };

//       const res = await fetch("https://medicaps.cloud/api/questionnaire/longevity/submit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedPayload)
//       });

//       if (!res.ok) throw new Error("API Submission failed");
//       const finalResult: ApiResultData = await res.json();
      
//       setApiResult(finalResult);
//       setIsUnlocked(true);

//       // Save unlocked state to local storage
//       const newStoredData: StoredResult = {
//         result: finalResult,
//         isUnlocked: true,
//         age: age,
//         scores: scores,
//         payload: payload,
//         timestamp: Date.now()
//       };
//       localStorage.setItem('grasa_longevity_result', JSON.stringify(newStoredData));

//       window.scrollTo({ top: 0, behavior: "smooth" });
//     } catch (err) {
//       console.error("Failed to unlock report:", err);
//       alert("Something went wrong processing your request.");
//     } finally {
//       setIsUnlocking(false);
//     }
//   };

//   const openWA = () => {
//     const msg = encodeURIComponent(`Hi GRASA, I just completed the Longevity Check. My longevity score is ${apiResult?.longevity_score || 0}/100 and my estimated biological age is ${apiResult?.biological_age || age}. I'd like to discuss my full report with your doctor.`);
//     window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
//   };

//   const getLocalDummyFlags = () => {
//     return [
//       { icon: '⚖️', title: 'Body composition', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//       { icon: '🩸', title: 'Blood report markers', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//       { icon: '🧬', title: 'Family history', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//       { icon: '🍽️', title: 'Dietary foundation', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' }
//     ];
//   };

//   const getActionCards = () => {
//     const actions = [];
//     const s = scores;
//     if ((s.q2 || 0) + (s.q3 || 0) >= 3) actions.push({ icon: '⚡', title: 'Start with your meal timing', desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' });
//     if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' });
//     if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: 'Given your family history, a comprehensive metabolic panel gives you a true picture of where you are. Don\'t wait for symptoms.' });
//     if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' });
//     actions.push({ icon: '📞', title: 'Talk to us — before spending anything', desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' });
//     return actions;
//   };

//   if (isLoading || !apiResult) {
//     return (
//       <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
//          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
//       </div>
//     );
//   }

//   // Adjusted colors for dark theme visibility
//   let bandColor = '#C5D82D'; // Default to the lime accent
//   const band = apiResult.result_band?.toLowerCase();
//   if (band === 'excellent') bandColor = '#4ade80'; // Tailwind green-400
//   else if (band === 'good') bandColor = '#C5D82D'; // Theme lime
//   else if (band === 'moderate') bandColor = '#facc15'; // Tailwind yellow-400
//   else if (band === 'elevated') bandColor = '#fb923c'; // Tailwind orange-400
//   else if (band === 'high') bandColor = '#ef4444'; // Tailwind red-500

//   const apiFlags = apiResult.flags || [];
//   const displayFlags = isUnlocked ? apiFlags : [...apiFlags, ...getLocalDummyFlags().slice(0, 6 - apiFlags.length)];

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{__html: `
//         @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
//         .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
//       `}} />
//       <div className="font-sans bg-[#0f1114] text-white w-full min-h-screen overflow-x-hidden relative leading-[1.6]">
        
//         {/* Background Glows to match Test Page */}
//         <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
//         <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

//         {/* Dynamically adjust padding-bottom so the sticky bar doesn't overlap content */}
//         <div className={`max-w-3xl mx-auto px-5 pt-10 md:px-4 md:pt-14 relative z-10 ${!isUnlocked ? 'pb-40 md:pb-48' : 'pb-32'}`}>
//           <div className="animate-fadeUp relative">
            
//             {/* Top Result Band */}
//             {/* Top Result Band */}
//             <div className="relative rounded-xl p-6 mb-6 border-[1.5px] border-white/10 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
              
//               {/* Overlay Message when locked */}
//               {/* {!isUnlocked && (
//                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f1114]/20 backdrop-blur-[2px]">
//                    <div className="bg-black/80 border border-[#C5D82D]/40 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(197,216,45,0.15)] animate-pulse">
//                      <span className="text-[1.1rem]">🔒</span>
//                      <span className="text-[0.9rem] font-bold text-white tracking-wide">Enter WhatsApp below to unlock</span>
//                    </div>
//                 </div>
//               )} */}


//               {/* Overlay Message when locked */}
// {/* Overlay Message when locked */}
// {!isUnlocked && (
//   <div 
//     onClick={() => {
//       const unlockCard = document.getElementById('wa-number');
//       const inputField = document.getElementById('wa-input');
//       if (unlockCard) {
//         // Scroll to the section smoothly
//         unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         // Focus the input field after a tiny delay so the scroll happens first
//         setTimeout(() => inputField?.focus(), 500);
//       }
//     }}
//     className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f1114]/20 backdrop-blur-[2px] cursor-pointer group"
//   >
//      <div className="bg-black/80 border border-[#C5D82D]/40 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(197,216,45,0.15)] animate-pulse group-hover:scale-105 transition-transform duration-200">
       
//        {/* Replaced Lock Emoji with WhatsApp Icon */}
//        <svg 
//          viewBox="0 0 24 24" 
//          width="20" 
//          height="20" 
//          fill="currentColor"
//          className="text-[#25D366]" 
//        >
//          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//        </svg>

//        <span className="text-[1.1rem] font-bold text-white tracking-wide">Enter WhatsApp below to unlock</span>
//      </div>
//   </div>
// )}

//               <div className="flex items-start justify-between gap-4 mb-4">
//                 <div>
//                   <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Your estimated biological age</div>
                  
//                   {/* HIDDEN BIOLOGICAL AGE */}
//                   <div 
//                     className={`font-sans text-[3.5rem] font-black leading-none ${!isUnlocked ? 'filter blur-[10px] opacity-40 select-none text-white' : ''}`} 
//                     style={{ color: isUnlocked ? bandColor : undefined }}
//                   >
//                     {isUnlocked ? apiResult.biological_age : '45'}
//                   </div>
                  
//                   {/* HIDDEN ACTUAL AGE & DELTA */}
//                   <div className="flex items-center gap-2 mt-4 text-[0.85rem] text-gray-400">
//                     <span>Your actual age: <strong className={`font-bold text-white ${!isUnlocked ? 'filter blur-[5px] opacity-40 select-none' : ''}`}>{isUnlocked ? (apiResult.calendar_age || age || 35) : 'XX'}</strong></span>
//                     {isUnlocked ? (
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border ${apiResult.bio_delta > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : apiResult.bio_delta < 0 ? 'bg-lime-500/10 text-[#C5D82D] border-lime-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
//                         {apiResult.bio_delta > 0 ? `+${apiResult.bio_delta} yrs older` : apiResult.bio_delta < 0 ? `${Math.abs(apiResult.bio_delta)} yrs younger` : 'On track'}
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border bg-white/5 text-gray-400 border-white/10">
//                         Locked
//                       </span>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* HIDDEN SCORE CIRCLE */}
//                 <div className="shrink-0 relative w-[90px] h-[90px]">
//                   <svg viewBox="0 0 80 80" className="w-[90px] h-[90px] -rotate-90">
//                     <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
//                     <circle 
//                       cx="40" cy="40" r="35" fill="none" 
//                       stroke={isUnlocked ? bandColor : 'rgba(255,255,255,0.2)'} 
//                       strokeWidth="6" 
//                       strokeDasharray="220" 
//                       strokeDashoffset={isUnlocked ? (220 - (220 * apiResult.longevity_score / 100)) : 220} 
//                       strokeLinecap="round" 
//                       className="transition-all duration-1000 ease-out" 
//                     />
//                   </svg>
//                   <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-sans text-[1.2rem] font-bold text-white">
//                     {isUnlocked ? apiResult.longevity_score : '🔒'}
//                   </div>
//                 </div>
//               </div>
              
//               {/* HIDDEN RESULT MESSAGE */}
//               <div className={`text-[0.95rem] text-gray-300 leading-relaxed pt-5 border-t border-white/10 ${!isUnlocked ? 'filter blur-[6px] opacity-40 select-none' : ''}`}>
//                 {isUnlocked ? apiResult.result_message : 'This is a blurred placeholder text to keep your personalised analysis hidden until you unlock the full report below.'}
//               </div>
//             </div>

//             {/* Flag Cards */}
//             <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4 ml-1">Your personal health snapshot</div>
//             <div className="flex flex-col gap-3 mb-8">
//               {displayFlags.map((f, i) => (
//                 <div key={i} className={`flex items-start gap-4 bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-5 transition-colors duration-200 hover:bg-white/5 ${!isUnlocked && i >= apiFlags.length ? 'filter blur-[4px] select-none pointer-events-none opacity-50' : ''}`}>
//                   <div className="text-[1.5rem] shrink-0">{f.icon}</div>
//                   <div>
//                     <div className="text-[1rem] font-bold text-white mb-1">{f.title}</div>
//                     {f.desc && <div className="text-[0.85rem] text-gray-400 leading-relaxed">{f.desc}</div>}
//                     <span className={`inline-block mt-3 text-[0.6rem] font-bold tracking-wider uppercase px-2 py-1 rounded-[4px] border ${f.severity === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : f.severity === 'amber' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : f.severity === 'gray' ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-lime-500/10 text-[#C5D82D] border-lime-500/20'}`}>
//                       {f.tag}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Unlock Section */}
//             {!isUnlocked && (
//               <div id="wa-number" className="bg-[#C5D82D]/10 border-[1.5px] border-[#C5D82D]/30 backdrop-blur-md rounded-2xl p-7 text-center relative overflow-hidden shadow-[0_0_30px_rgba(197,216,45,0.05)]">
//                 <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-[#C5D82D]/20 blur-[60px] pointer-events-none"></div>
//                 <div className="inline-flex items-center gap-2 bg-black/30 border border-[#C5D82D]/20 px-4 py-1.5 rounded-full text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#C5D82D] mb-5">🔒 Full Report Locked</div>
//                 <div className="font-sans text-[1.6rem] font-semibold text-white mb-3 leading-tight">Your full breakdown is ready.<br/>Get it free — takes 10 seconds.</div>
//                 <div className="text-[0.9rem] text-gray-300 mb-6 leading-relaxed">Enter your WhatsApp number. We'll send your complete report and offer a free 20-minute call with our doctor — no obligation.</div>
                
//                 <div className="flex flex-col gap-3 mb-7 text-left max-w-sm mx-auto">
//                   {["Full breakdown of all 6 health areas", "What GRASA can specifically do for your profile", "Free 20-min call with our doctor — yours to book"].map((perk, i) => (
//                     <div key={i} className="flex items-center gap-3 text-[0.85rem] text-gray-300">
//                       <div className="w-5 h-5 rounded-full bg-[#C5D82D]/20 flex items-center justify-center text-[0.6rem] text-[#C5D82D] shrink-0 border border-[#C5D82D]/30"><i className="fas fa-check"></i></div>
//                       {perk}
//                     </div>
//                   ))}
//                 </div>
                
//                 <input 
//                 id="wa-input"
//                   type="tel" 
//                   placeholder="Your WhatsApp number (e.g. 98XXX XXXXX)" 
//                   maxLength={15} 
//                   value={waNumber} 
//                   onChange={(e) => setWaNumber(e.target.value)} 
//                   className="w-full py-4 px-5 bg-black/40 border-[1.5px] border-white/20 rounded-xl font-sans text-[1rem] text-white outline-none transition-all duration-200 mb-4 placeholder:text-gray-500 focus:border-[#C5D82D] focus:shadow-[0_0_15px_rgba(197,216,45,0.15)]" 
//                 />

//                   <button 
//   onClick={unlockResult} 
//   disabled={isUnlocking} 
//   className="w-full py-4 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:not(:disabled):bg-white hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):shadow-[0_0_20px_rgba(163,230,53,0.3)]"
// >
//   {isUnlocking ? (
//     <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin"></div>
//   ) : (
//     <svg 
//       viewBox="0 0 24 24" 
//       width="20" 
//       height="20" 
//       fill="currentColor"
//     >
//       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//     </svg>
//   )}
//   <span>{isUnlocking ? "Processing..." : "Send My Full Report on WhatsApp"}</span>
// </button>

//                 <div className="text-[0.7rem] text-gray-500 mt-4 tracking-wide">We never share your number. No spam — ever.</div>
//               </div>
//             )}

//             {/* Full Result Content (Post-Unlock) */}
//             {isUnlocked && (
//               <div className="animate-fadeUp mt-8">
//                 <div className="text-center mb-8">
//                   <h2 className="font-sans text-[1.8rem] font-bold text-white mb-2">Your personalised action plan</h2>
//                   <p className="text-[0.95rem] text-gray-400">Based on your answers — here is what matters most for your body right now.</p>
//                 </div>
                
//                 <div className="flex flex-col gap-4 mb-10">
//                   {getActionCards().map((a, i) => (
//                     <div key={i} className="bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-6 flex gap-5 items-start transition-all hover:bg-white/5 hover:border-white/20">
//                       <div className="text-[1.8rem] shrink-0 leading-none">{a.icon}</div>
//                       <div>
//                         <div className="text-[1.05rem] font-bold text-white mb-2">{a.title}</div>
//                         <div className="text-[0.9rem] text-gray-400 leading-relaxed">{a.desc}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="bg-white/5 border-[1.5px] border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-4">
//                   <h3 className="font-sans text-[1.4rem] font-bold text-white mb-3">Talk to our doctor — it's free.</h3>
//                   <p className="text-[0.9rem] text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">Your score and answers are already saved. Our doctor will look at your full profile before the call — so you're not starting from scratch.</p>
//                   <div className="flex flex-col gap-3 max-w-sm mx-auto">
//   {/* Call Button */}
//   <button 
//     onClick={() => window.open('tel:+919870263399')} 
//     className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(197,216,45,0.3)]"
//   >
//     <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//       <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
//     </svg>
//     <span>Call Us Now — +91 98702 63399</span>
//   </button>

//   {/* WhatsApp Button */}
//   <button 
//     onClick={openWA} 
//     className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#25D366] hover:text-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] group"
//   >
//     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//     </svg>
//     <span>Continue on WhatsApp</span>
//   </button>
// </div>
//                 </div>
//               </div>
//             )}
            
//           </div>
//         </div>

//         {/* Sticky Bar for partial result - Moved OUTSIDE the main container */}
//         {!isUnlocked && (
//           <div className="fixed bottom-0 left-0 right-0 bg-[#0f1114]/90 backdrop-blur-md border-t border-white/10 py-4 px-5 flex items-center justify-between gap-4 z-40 animate-fadeUp">
//             <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-4">
//               <div>
//                 <p className="font-sans text-[1rem] font-bold text-white m-0 leading-tight">Your biological age and score are ready</p>
//                 <span className="text-[0.75rem] text-gray-400">20 min call · No pressure · No selling</span>
//               </div>
//               <button onClick={() => {
//                 const unlockCard = document.getElementById('wa-number');
//                 if (unlockCard) unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//               }} className="bg-[#C5D82D] text-black font-bold text-[0.85rem] py-2.5 px-5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-white hover:-translate-y-[1px] shadow-[0_0_10px_rgba(197,216,45,0.2)]">
//                 Get Full Report →
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </>
//   );
// }













// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { ApiResultData, StoredResult } from '@/types/longevity';

// export default function LongevityResultPage() {
//   const router = useRouter();
  
//   const [apiResult, setApiResult] = useState<ApiResultData | null>(null);
//   const [isUnlocked, setIsUnlocked] = useState(false);
//   const [age, setAge] = useState<number | null>(null);
//   const [scores, setScores] = useState<Record<string, number>>({});
//   const [payload, setPayload] = useState<any>(null); // Save original answers for WA re-submit
  
//   const [waNumber, setWaNumber] = useState('');
//   const [isUnlocking, setIsUnlocking] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [email, setEmail] = useState('');
//   const [isEmailVerified, setIsEmailVerified] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem('grasa_longevity_result');
//     if (saved) {
//       try {
//         const parsed: StoredResult = JSON.parse(saved);
//         const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
//         if (Date.now() - parsed.timestamp < oneMonthInMs) {
//           setApiResult(parsed.result);
//           setIsUnlocked(parsed.isUnlocked);
//           setAge(parsed.age);
//           setScores(parsed.scores || {});
//           setPayload(parsed.payload);
//           setIsLoading(false);
//         } else {
//           // Expired
//           localStorage.removeItem('grasa_longevity_result');
//           router.push('/longevity-test');
//         }
//       } catch (err) {
//         router.push('/longevity-test');
//       }
//     } else {
//       // No data found, redirect to start
//       router.push('/longevity-test');
//     }
//   }, [router]);



  



//   const unlockResult = async () => {
//   // Only email validation
//   if (!email || !isEmailVerified) {
//     alert("Please verify your email first.");
//     return;
//   }

//   setIsUnlocking(true);

//   try {
//     const updatedPayload = {
//       ...payload,
//       email: email,
//       html_content: generateHtmlContent()
//     };

//     const res = await fetch(
//       "https://medicaps.cloud/api/questionnaire/longevity/submit",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(updatedPayload)
//       }
//     );

//     if (!res.ok) throw new Error("API Submission failed");

//     const finalResult: ApiResultData = await res.json();

//     setApiResult(finalResult);
//     setIsUnlocked(true);

//     const newStoredData: StoredResult = {
//       result: finalResult,
//       isUnlocked: true,
//       age: age,
//       scores: scores,
//       payload: payload,
//       timestamp: Date.now()
//     };

//     localStorage.setItem(
//       "grasa_longevity_result",
//       JSON.stringify(newStoredData)
//     );

//     window.scrollTo({ top: 0, behavior: "smooth" });

//   } catch (err) {
//     console.error("Failed to unlock report:", err);
//     alert("Something went wrong processing your request.");
//   } finally {
//     setIsUnlocking(false);
//   }
// };




//   const handleEmailVerify = () => {
//   const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   if (!isValid) {
//     alert("Please enter a valid email address.");
//     return;
//   }
//   setIsEmailVerified(true);
// };





// const generateHtmlContent = () => {
//   const baseUrl = "https://www.grasamillets.com"; // 🔴 replace with your real domain

//   const flagsHtml = (apiResult?.flags || [])
//     .map(
//       (f: any) => `
//         <div style="margin-bottom:12px; padding:12px; background:#ffffff; border-radius:8px; border:1px solid #e5e5e5;">
//           <strong style="color:#1b1b1b;">${f.title}</strong>
//           <p style="margin:6px 0 0; color:#5c5c5c; font-size:14px;">
//             ${f.desc || ""}
//           </p>
//         </div>
//       `
//     )
//     .join("");

//   const actionsHtml = getActionCards()
//     .map(
//       (a: any) => `
//         <div style="margin-bottom:12px; padding:12px; background:#ffffff; border-radius:8px; border:1px solid #e5e5e5;">
//           <strong style="color:#1b1b1b;">${a.title}</strong>
//           <p style="margin:6px 0 0; color:#5c5c5c; font-size:14px;">
//             ${a.desc}
//           </p>
//         </div>
//       `
//     )
//     .join("");

//   return `
//   <div style="font-family: Arial, sans-serif; background:#ebecdf; padding:20px;">

//     <div style="max-width:600px; margin:0 auto;">

//       <!-- HEADER WITH LOGO -->
//       <!-- HEADER WITH LOGO -->
// <div style="text-align:center; margin-bottom:20px;">

//   <!-- LOGO BOX -->
//   <div style="display:inline-block; background:#ffffff; padding:10px 18px; border-radius:10px; margin-bottom:12px;">
//     <img src="https://www.grasamillets.com/_next/image?url=%2Flogo.png&w=256&q=75" 
//          alt="GRASA Logo" 
//          style="width:110px; display:block; bg:white" />
//   </div>

//   <h1 style="color:#1b1b1b; margin:0; font-size:26px;">
//     GRASA Longevity Report
//   </h1>

//   <p style="color:#5c5c5c; font-size:14px; margin-top:6px;">
//     Your Personalized Health Analysis
//   </p>
// </div>
//       <!-- SCORE CARD -->
//       <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//         <h2 style="margin-bottom:12px; color:#1b1b1b;">Your Results</h2>

//         <p><strong>Longevity Score:</strong> 
//           <span style="color:#C5D82D; font-weight:bold;">
//             ${apiResult?.longevity_score}/100
//           </span>
//         </p>

//         <p><strong>Biological Age:</strong> ${apiResult?.biological_age}</p>
//         <p><strong>Actual Age:</strong> ${apiResult?.calendar_age || age}</p>
//         <p><strong>Difference:</strong> ${apiResult?.bio_delta}</p>
//       </div>

//       <!-- SUMMARY -->
//       <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//         <h2 style="color:#1b1b1b;">Summary</h2>
//         <p style="color:#5c5c5c; font-size:14px; line-height:1.6;">
//           ${apiResult?.result_message}
//         </p>
//       </div>

//       <!-- HEALTH INSIGHTS -->
//       <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//         <h2 style="color:#1b1b1b;">Health Insights</h2>
//         ${flagsHtml || `<p style="color:#5c5c5c;">No major flags detected</p>`}
//       </div>

//       <!-- ACTION PLAN -->
//       <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//         <h2 style="color:#1b1b1b;">Your Action Plan</h2>
//         ${actionsHtml}
//       </div>

//       <!-- CTA -->
//       <div style="text-align:center; margin:30px 0;">
//         <a href="https://wa.me/919870263399"
//            style="display:inline-block; background:#C5D82D; color:#1b1b1b; padding:14px 22px; border-radius:8px; font-weight:bold; text-decoration:none;">
//            💬 Talk to Expert on WhatsApp
//         </a>
//       </div>

//       <!-- FOOTER WITH LINKS -->
//       <div style="text-align:center; font-size:12px; color:#5c5c5c; margin-top:20px;">

//         <p style="margin-bottom:10px;">Powered by GRASA</p>

//         <!-- LINKS -->
//         <div style="margin-bottom:10px;">
//           <a href="${baseUrl}/privacy-policy" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">
//             Privacy Policy
//           </a> |
//           <a href="${baseUrl}/terms-condition" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">
//             Terms & Conditions
//           </a> |
//           <a href="${baseUrl}/contact" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">
//             Contact Us
//           </a>
//         </div>

//         <p style="margin:4px 0;">📞 +91 98702 63399</p>
//         <p style="margin:4px 0;">🌐 https://www.grasamillets.com</p>

//       </div>

//     </div>
//   </div>
//   `;
// };


//   const openWA = () => {
//     const msg = encodeURIComponent(`Hi GRASA, I just completed the Longevity Check. My longevity score is ${apiResult?.longevity_score || 0}/100 and my estimated biological age is ${apiResult?.biological_age || age}. I'd like to discuss my full report with your doctor.`);
//     window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
//   };

//   const getLocalDummyFlags = () => {
//     return [
//       { icon: '⚖️', title: 'Body composition', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//       { icon: '🩸', title: 'Blood report markers', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//       { icon: '🧬', title: 'Family history', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//       { icon: '🍽️', title: 'Dietary foundation', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' }
//     ];
//   };

//   const getActionCards = () => {
//     const actions = [];
//     const s = scores;
//     if ((s.q2 || 0) + (s.q3 || 0) >= 3) actions.push({ icon: '⚡', title: 'Start with your meal timing', desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' });
//     if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' });
//     if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: 'Given your family history, a comprehensive metabolic panel gives you a true picture of where you are. Don\'t wait for symptoms.' });
//     if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' });
//     actions.push({ icon: '📞', title: 'Talk to us — before spending anything', desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' });
//     return actions;
//   };

//   if (isLoading || !apiResult) {
//     return (
//       <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
//          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
//       </div>
//     );
//   }

//   // Adjusted colors for dark theme visibility
//   let bandColor = '#C5D82D'; // Default to the lime accent
//   const band = apiResult.result_band?.toLowerCase();
//   if (band === 'excellent') bandColor = '#4ade80'; // Tailwind green-400
//   else if (band === 'good') bandColor = '#C5D82D'; // Theme lime
//   else if (band === 'moderate') bandColor = '#facc15'; // Tailwind yellow-400
//   else if (band === 'elevated') bandColor = '#fb923c'; // Tailwind orange-400
//   else if (band === 'high') bandColor = '#ef4444'; // Tailwind red-500

//   const apiFlags = apiResult.flags || [];
//   const displayFlags = isUnlocked ? apiFlags : [...apiFlags, ...getLocalDummyFlags().slice(0, 6 - apiFlags.length)];

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{__html: `
//         @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
//         .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
//       `}} />
//       <div className="font-sans bg-[#0f1114] text-white w-full min-h-screen overflow-x-hidden relative leading-[1.6]">
        
//         {/* Background Glows to match Test Page */}
//         <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
//         <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

//         {/* Dynamically adjust padding-bottom so the sticky bar doesn't overlap content */}
//         <div className={`max-w-3xl mx-auto px-5 pt-10 md:px-4 md:pt-14 relative z-10 ${!isUnlocked ? 'pb-40 md:pb-48' : 'pb-32'}`}>
//           <div className="animate-fadeUp relative">
            
//             {/* Top Result Band */}
//             {/* Top Result Band */}
//             <div className="relative rounded-xl p-6 mb-6 border-[1.5px] border-white/10 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
              
          


//               {/* Overlay Message when locked */}
// {/* Overlay Message when locked */}
// {!isUnlocked && (
//   <div 
//     onClick={() => {
//       const unlockCard = document.getElementById('wa-number');
//       const inputField = document.getElementById('wa-input');
//       if (unlockCard) {
//         // Scroll to the section smoothly
//         unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         // Focus the input field after a tiny delay so the scroll happens first
//         setTimeout(() => inputField?.focus(), 500);
//       }
//     }}
//     className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f1114]/20 backdrop-blur-[2px] cursor-pointer group"
//   >
//      <div className="bg-black/80 border border-[#C5D82D]/40 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(197,216,45,0.15)] animate-pulse group-hover:scale-105 transition-transform duration-200">
       
//        {/* Replaced Lock Emoji with WhatsApp Icon */}
//        <svg 
//          viewBox="0 0 24 24" 
//          width="20" 
//          height="20" 
//          fill="currentColor"
//          className="text-[#25D366]" 
//        >
//          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//        </svg>

//        <span className="text-[1.1rem] font-bold text-white tracking-wide">Enter WhatsApp below to unlock</span>
//      </div>
//   </div>
// )}

//               <div className="flex items-start justify-between gap-4 mb-4">
//                 <div>
//                   <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Your estimated biological age</div>
                  
//                   {/* HIDDEN BIOLOGICAL AGE */}
//                   <div 
//                     className={`font-sans text-[3.5rem] font-black leading-none ${!isUnlocked ? 'filter blur-[10px] opacity-40 select-none text-white' : ''}`} 
//                     style={{ color: isUnlocked ? bandColor : undefined }}
//                   >
//                     {isUnlocked ? apiResult.biological_age : '45'}
//                   </div>
                  
//                   {/* HIDDEN ACTUAL AGE & DELTA */}
//                   <div className="flex items-center gap-2 mt-4 text-[0.85rem] text-gray-400">
//                     <span>Your actual age: <strong className={`font-bold text-white ${!isUnlocked ? 'filter blur-[5px] opacity-40 select-none' : ''}`}>{isUnlocked ? (apiResult.calendar_age || age || 35) : 'XX'}</strong></span>
//                     {isUnlocked ? (
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border ${apiResult.bio_delta > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : apiResult.bio_delta < 0 ? 'bg-lime-500/10 text-[#C5D82D] border-lime-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
//                         {apiResult.bio_delta > 0 ? `+${apiResult.bio_delta} yrs older` : apiResult.bio_delta < 0 ? `${Math.abs(apiResult.bio_delta)} yrs younger` : 'On track'}
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border bg-white/5 text-gray-400 border-white/10">
//                         Locked
//                       </span>
//                     )}
//                   </div>
//                 </div>
                
//                 {/* HIDDEN SCORE CIRCLE */}
//                 <div className="shrink-0 relative w-[90px] h-[90px]">
//                   <svg viewBox="0 0 80 80" className="w-[90px] h-[90px] -rotate-90">
//                     <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
//                     <circle 
//                       cx="40" cy="40" r="35" fill="none" 
//                       stroke={isUnlocked ? bandColor : 'rgba(255,255,255,0.2)'} 
//                       strokeWidth="6" 
//                       strokeDasharray="220" 
//                       strokeDashoffset={isUnlocked ? (220 - (220 * apiResult.longevity_score / 100)) : 220} 
//                       strokeLinecap="round" 
//                       className="transition-all duration-1000 ease-out" 
//                     />
//                   </svg>
//                   <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-sans text-[1.2rem] font-bold text-white">
//                     {isUnlocked ? apiResult.longevity_score : '🔒'}
//                   </div>
//                 </div>
//               </div>
              
//               {/* HIDDEN RESULT MESSAGE */}
//               <div className={`text-[0.95rem] text-gray-300 leading-relaxed pt-5 border-t border-white/10 ${!isUnlocked ? 'filter blur-[6px] opacity-40 select-none' : ''}`}>
//                 {isUnlocked ? apiResult.result_message : 'This is a blurred placeholder text to keep your personalised analysis hidden until you unlock the full report below.'}
//               </div>
//             </div>

//             {/* Flag Cards */}
//             <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4 ml-1">Your personal health snapshot</div>
//             <div className="flex flex-col gap-3 mb-8">
//               {displayFlags.map((f, i) => (
//                 <div key={i} className={`flex items-start gap-4 bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-5 transition-colors duration-200 hover:bg-white/5 ${!isUnlocked && i >= apiFlags.length ? 'filter blur-[4px] select-none pointer-events-none opacity-50' : ''}`}>
//                   <div className="text-[1.5rem] shrink-0">{f.icon}</div>
//                   <div>
//                     <div className="text-[1rem] font-bold text-white mb-1">{f.title}</div>
//                     {f.desc && <div className="text-[0.85rem] text-gray-400 leading-relaxed">{f.desc}</div>}
//                     <span className={`inline-block mt-3 text-[0.6rem] font-bold tracking-wider uppercase px-2 py-1 rounded-[4px] border ${f.severity === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : f.severity === 'amber' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : f.severity === 'gray' ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-lime-500/10 text-[#C5D82D] border-lime-500/20'}`}>
//                       {f.tag}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Unlock Section */}
//             {!isUnlocked && (
//               <div id="wa-number" className="bg-[#C5D82D]/10 border-[1.5px] border-[#C5D82D]/30 backdrop-blur-md rounded-2xl p-7 text-center relative overflow-hidden shadow-[0_0_30px_rgba(197,216,45,0.05)]">
//                 <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-[#C5D82D]/20 blur-[60px] pointer-events-none"></div>
//                 <div className="inline-flex items-center gap-2 bg-black/30 border border-[#C5D82D]/20 px-4 py-1.5 rounded-full text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#C5D82D] mb-5">🔒 Full Report Locked</div>
//                 <div className="font-sans text-[1.6rem] font-semibold text-white mb-3 leading-tight">Your full breakdown is ready.<br/>Get it free — takes 10 seconds.</div>
//                 <div className="text-[0.9rem] text-gray-300 mb-6 leading-relaxed">Enter your WhatsApp number. We'll send your complete report and offer a free 20-minute call with our doctor — no obligation.</div>
                
//                 <div className="flex flex-col gap-3 mb-7 text-left max-w-sm mx-auto">
//                   {["Full breakdown of all 6 health areas", "What GRASA can specifically do for your profile", "Free 20-min call with our doctor — yours to book"].map((perk, i) => (
//                     <div key={i} className="flex items-center gap-3 text-[0.85rem] text-gray-300">
//                       <div className="w-5 h-5 rounded-full bg-[#C5D82D]/20 flex items-center justify-center text-[0.6rem] text-[#C5D82D] shrink-0 border border-[#C5D82D]/30"><i className="fas fa-check"></i></div>
//                       {perk}
//                     </div>
//                   ))}
//                 </div>

//                 {/* Email Input */}
//                   <div className="space-y-4">

//   {/* Email Input */}
//   <input
//     type="email"
//     placeholder="Enter your Gmail"
//     value={email}
//     onChange={(e) => setEmail(e.target.value)}
//     className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-green-400"
//   />

//   {/* Verify Email Button */}
//   <button
//     onClick={handleEmailVerify}
//     className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
//   >
//     Verify Email
//   </button>

//   {/* Final Submit Button */}
//   <button
//     onClick={unlockResult}
//     disabled={!isEmailVerified || isUnlocking}
//     className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl disabled:opacity-50"
//   >
//     {isUnlocking
//       ? "Sending Report..."
//       : "Send My Full Report on Email"}
//   </button>

// </div>

//                 <div className="text-[0.7rem] text-gray-500 mt-4 tracking-wide">We never share your number. No spam — ever.</div>
//               </div>
//             )}

//             {/* Full Result Content (Post-Unlock) */}
//             {isUnlocked && (
//               <div className="animate-fadeUp mt-8">
//                 <div className="text-center mb-8">
//                   <h2 className="font-sans text-[1.8rem] font-bold text-white mb-2">Your personalised action plan</h2>
//                   <p className="text-[0.95rem] text-gray-400">Based on your answers — here is what matters most for your body right now.</p>
//                 </div>
                
//                 <div className="flex flex-col gap-4 mb-10">
//                   {getActionCards().map((a, i) => (
//                     <div key={i} className="bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-6 flex gap-5 items-start transition-all hover:bg-white/5 hover:border-white/20">
//                       <div className="text-[1.8rem] shrink-0 leading-none">{a.icon}</div>
//                       <div>
//                         <div className="text-[1.05rem] font-bold text-white mb-2">{a.title}</div>
//                         <div className="text-[0.9rem] text-gray-400 leading-relaxed">{a.desc}</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="bg-white/5 border-[1.5px] border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-4">
//                   <h3 className="font-sans text-[1.4rem] font-bold text-white mb-3">Talk to our doctor — it's free.</h3>
//                   <p className="text-[0.9rem] text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">Your score and answers are already saved. Our doctor will look at your full profile before the call — so you're not starting from scratch.</p>
//                   <div className="flex flex-col gap-3 max-w-sm mx-auto">
//   {/* Call Button */}
//   <button 
//     onClick={() => window.open('tel:+919870263399')} 
//     className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(197,216,45,0.3)]"
//   >
//     <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//       <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
//     </svg>
//     <span>Call Us Now — +91 98702 63399</span>
//   </button>

//   {/* WhatsApp Button */}
//   <button 
//     onClick={openWA} 
//     className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#25D366] hover:text-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)] group"
//   >
//     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//     </svg>
//     <span>Continue on WhatsApp</span>
//   </button>
// </div>
//                 </div>
//               </div>
//             )}
            
//           </div>
//         </div>

//         {/* Sticky Bar for partial result - Moved OUTSIDE the main container */}
//         {!isUnlocked && (
//           <div className="fixed bottom-0 left-0 right-0 bg-[#0f1114]/90 backdrop-blur-md border-t border-white/10 py-4 px-5 flex items-center justify-between gap-4 z-40 animate-fadeUp">
//             <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-4">
//               <div>
//                 <p className="font-sans text-[1rem] font-bold text-white m-0 leading-tight">Your biological age and score are ready</p>
//                 <span className="text-[0.75rem] text-gray-400">20 min call · No pressure · No selling</span>
//               </div>
//               <button onClick={() => {
//                 const unlockCard = document.getElementById('wa-number');
//                 if (unlockCard) unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//               }} className="bg-[#C5D82D] text-black font-bold text-[0.85rem] py-2.5 px-5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-white hover:-translate-y-[1px] shadow-[0_0_10px_rgba(197,216,45,0.2)]">
//                 Get Full Report →
//               </button>
//             </div>
//           </div>
//         )}

//       </div>
//     </>
//   );
// }







"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ApiResultData, StoredResult } from '@/types/longevity';

export default function LongevityResultPage() {
  const router = useRouter();
  
  const [apiResult, setApiResult] = useState<ApiResultData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [payload, setPayload] = useState<any>(null); // Save original answers for WA re-submit
  
  const [waNumber, setWaNumber] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('grasa_longevity_result');
    if (saved) {
      try {
        const parsed: StoredResult = JSON.parse(saved);
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - parsed.timestamp < oneMonthInMs) {
          setApiResult(parsed.result);
          setIsUnlocked(parsed.isUnlocked);
          setAge(parsed.age);
          setScores(parsed.scores || {});
          setPayload(parsed.payload);
          setIsLoading(false);
          
          // Check if user is logged in and fetch email
          const storedUserId = localStorage.getItem('user_id');
          if (storedUserId) {
            setUserId(storedUserId);
            fetchUserEmail(storedUserId);
          }
        } else {
          // Expired
          localStorage.removeItem('grasa_longevity_result');
          router.push('/longevity-test');
        }
      } catch (err) {
        router.push('/longevity-test');
      }
    } else {
      // No data found, redirect to start
      router.push('/longevity-test');
    }
  }, [router]);

  // Fetch user email from the patient profile API
  const fetchUserEmail = async (userId: string) => {
    try {
      const res = await fetch(`https://medicaps.cloud/api/patients/${userId}`);
      console.log(userId)
      if (!res.ok) throw new Error('Failed to fetch user profile');
      
      const data = await res.json();
      const userEmail = data?.patient_profile?.user?.email;
      
      if (userEmail) {
        setEmail(userEmail);
      }
    } catch (err) {
      console.error('Error fetching user email:', err);
      // Continue without pre-filled email if API fails
    }
  };

  const unlockResult = async () => {
    // Validate email
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsUnlocking(true);

    try {
      const updatedPayload = {
        ...payload,
        email: email,
        html_content: generateHtmlContent()
      };

      console.log(updatedPayload)

      const res = await fetch(
        "https://medicaps.cloud/api/questionnaire/longevity/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedPayload)
        }
      );

      if (!res.ok) throw new Error("API Submission failed");

      const finalResult: ApiResultData = await res.json();

      setApiResult(finalResult);
      setIsUnlocked(true);

      const newStoredData: StoredResult = {
        result: finalResult,
        isUnlocked: true,
        age: age,
        scores: scores,
        payload: payload,
        timestamp: Date.now()
      };

      localStorage.setItem(
        "grasa_longevity_result",
        JSON.stringify(newStoredData)
      );

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      console.error("Failed to unlock report:", err);
      alert("Something went wrong processing your request.");
    } finally {
      setIsUnlocking(false);
    }
  };

  const generateHtmlContent = () => {
    const baseUrl = "https://www.grasamillets.com"; // 🔴 replace with your real domain

    const flagsHtml = (apiResult?.flags || [])
      .map(
        (f: any) => `
          <div style="margin-bottom:12px; padding:12px; background:#ffffff; border-radius:8px; border:1px solid #e5e5e5;">
            <strong style="color:#1b1b1b;">${f.title}</strong>
            <p style="margin:6px 0 0; color:#5c5c5c; font-size:14px;">
              ${f.desc || ""}
            </p>
          </div>
        `
      )
      .join("");

    const actionsHtml = getActionCards()
      .map(
        (a: any) => `
          <div style="margin-bottom:12px; padding:12px; background:#ffffff; border-radius:8px; border:1px solid #e5e5e5;">
            <strong style="color:#1b1b1b;">${a.title}</strong>
            <p style="margin:6px 0 0; color:#5c5c5c; font-size:14px;">
              ${a.desc}
            </p>
          </div>
        `
      )
      .join("");

    return `
    <div style="font-family: Arial, sans-serif; background:#ebecdf; padding:20px;">

      <div style="max-width:600px; margin:0 auto;">

        <!-- HEADER WITH LOGO -->
        <div style="text-align:center; margin-bottom:20px;">

          <!-- LOGO BOX -->
          <div style="display:inline-block; background:#ffffff; padding:10px 18px; border-radius:10px; margin-bottom:12px;">
            <img src="https://www.grasamillets.com/_next/image?url=%2Flogo.png&w=256&q=75" 
                 alt="GRASA Logo" 
                 style="width:110px; display:block; bg:white" />
          </div>

          <h1 style="color:#1b1b1b; margin:0; font-size:26px;">
            GRASA Longevity Report
          </h1>

          <p style="color:#5c5c5c; font-size:14px; margin-top:6px;">
            Your Personalized Health Analysis
          </p>
        </div>

        

        <!-- SCORE CARD -->
        <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
          <h2 style="margin-bottom:12px; color:#1b1b1b;">Your Results</h2>

          <p><strong>Longevity Score:</strong> 
            <span style="color:#C5D82D; font-weight:bold;">
              ${apiResult?.longevity_score}/100
            </span>
          </p>

          <p><strong>Biological Age:</strong> ${apiResult?.biological_age}</p>
          <p><strong>Actual Age:</strong> ${apiResult?.calendar_age || age}</p>
          <p><strong>Difference:</strong> ${apiResult?.bio_delta}</p>
        </div>

        <!-- SUMMARY -->
        <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
          <h2 style="color:#1b1b1b;">Summary</h2>
          <p style="color:#5c5c5c; font-size:14px; line-height:1.6;">
            ${apiResult?.result_message}
          </p>
        </div>

        <!-- HEALTH INSIGHTS -->
        <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
          <h2 style="color:#1b1b1b;">Health Insights</h2>
          ${flagsHtml || `<p style="color:#5c5c5c;">No major flags detected</p>`}
        </div>

        <!-- ACTION PLAN -->
        <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
          <h2 style="color:#1b1b1b;">Your Action Plan</h2>
          ${actionsHtml}
        </div>

        <!-- CTA -->
        <div style="text-align:center; margin:30px 0;">
          <a href="https://wa.me/919870263399"
             style="display:inline-block; background:#C5D82D; color:#1b1b1b; padding:14px 22px; border-radius:8px; font-weight:bold; text-decoration:none;">
             💬 Talk to Expert on WhatsApp
          </a>
        </div>

        <!-- FOOTER WITH LINKS -->
        <div style="text-align:center; font-size:12px; color:#5c5c5c; margin-top:20px;">

          

          <!-- LINKS -->
          <div style="margin-bottom:10px;">
            <a href="${baseUrl}/privacy-policy" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">
              Privacy Policy
            </a> |
            <a href="${baseUrl}/terms-condition" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">
              Terms & Conditions
            </a> |
            <a href="${baseUrl}/contact" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">
              Contact Us
            </a>
          </div>

          <p style="margin:4px 0;">📞 +91 98702 63399</p>
          <p style="margin:4px 0;">🌐 https://www.grasamillets.com</p>

        </div>

      </div>
    </div>
    `;
  };

  const openWA = () => {
    const msg = encodeURIComponent(`Hi GRASA, I just completed the Longevity Check. My longevity score is ${apiResult?.longevity_score || 0}/100 and my estimated biological age is ${apiResult?.biological_age || age}. I'd like to discuss my full report with your doctor.`);
    window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
  };

  const getLocalDummyFlags = () => {
    return [
      { icon: '⚖️', title: 'Body composition', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
      { icon: '🩸', title: 'Blood report markers', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
      { icon: '🧬', title: 'Family history', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
      { icon: '🍽️', title: 'Dietary foundation', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' }
    ];
  };

  const getActionCards = () => {
    const actions = [];
    const s = scores;
    if ((s.q2 || 0) + (s.q3 || 0) >= 3) actions.push({ icon: '⚡', title: 'Start with your meal timing', desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' });
    if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' });
    if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: 'Given your family history, a comprehensive metabolic panel gives you a true picture of where you are. Don\'t wait for symptoms.' });
    if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' });
    actions.push({ icon: '📞', title: 'Talk to us — before spending anything', desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' });
    return actions;
  };

  if (isLoading || !apiResult) {
    return (
      <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
         <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
      </div>
    );
  }

  // Adjusted colors for dark theme visibility
  let bandColor = '#C5D82D'; // Default to the lime accent
  const band = apiResult.result_band?.toLowerCase();
  if (band === 'excellent') bandColor = '#4ade80'; // Tailwind green-400
  else if (band === 'good') bandColor = '#C5D82D'; // Theme lime
  else if (band === 'moderate') bandColor = '#facc15'; // Tailwind yellow-400
  else if (band === 'elevated') bandColor = '#fb923c'; // Tailwind orange-400
  else if (band === 'high') bandColor = '#ef4444'; // Tailwind red-500

  const apiFlags = apiResult.flags || [];
  const displayFlags = isUnlocked ? apiFlags : [...apiFlags, ...getLocalDummyFlags().slice(0, 6 - apiFlags.length)];

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
        .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}} />
      <div className="font-sans bg-[#0f1114] text-white w-full min-h-screen overflow-x-hidden relative leading-[1.6]">
        
        {/* Background Glows to match Test Page */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

        {/* Dynamically adjust padding-bottom so the sticky bar doesn't overlap content */}
        <div className={`max-w-3xl mx-auto px-5 pt-10 md:px-4 md:pt-14 relative z-10 ${!isUnlocked ? 'pb-40 md:pb-48' : 'pb-32'}`}>
          <div className="animate-fadeUp relative">
            
            {/* Top Result Band */}
            <div className="relative rounded-xl p-6 mb-6 border-[1.5px] border-white/10 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Overlay Message when locked */}
              {!isUnlocked && (
                <div 
                  onClick={() => {
                    const unlockCard = document.getElementById('wa-number');
                    const inputField = document.getElementById('email-input');
                    if (unlockCard) {
                      unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      setTimeout(() => inputField?.focus(), 500);
                    }
                  }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f1114]/20 backdrop-blur-[2px] cursor-pointer group"
                >
                   <div className="bg-black/80 border border-[#C5D82D]/40 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(197,216,45,0.15)] animate-pulse group-hover:scale-105 transition-transform duration-200">
                     
                     {/* WhatsApp Icon */}
                     <svg 
                       viewBox="0 0 24 24" 
                       width="20" 
                       height="20" 
                       fill="currentColor"
                       className="text-[#C5D82D]" 
                     >
                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                     </svg>

                     <span className="text-[1.1rem] font-bold text-white tracking-wide">Enter email below to unlock</span>
                   </div>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Your estimated biological age</div>
                  
                  {/* HIDDEN BIOLOGICAL AGE */}
                  <div 
                    className={`font-sans text-[3.5rem] font-black leading-none ${!isUnlocked ? 'filter blur-[10px] opacity-40 select-none text-white' : ''}`} 
                    style={{ color: isUnlocked ? bandColor : undefined }}
                  >
                    {isUnlocked ? apiResult.biological_age : '45'}
                  </div>
                  
                  {/* HIDDEN ACTUAL AGE & DELTA */}
                  <div className="flex items-center gap-2 mt-4 text-[0.85rem] text-gray-400">
                    <span>Your actual age: <strong className={`font-bold text-white ${!isUnlocked ? 'filter blur-[5px] opacity-40 select-none' : ''}`}>{isUnlocked ? (apiResult.calendar_age || age || 35) : 'XX'}</strong></span>
                    {isUnlocked ? (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border ${apiResult.bio_delta > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : apiResult.bio_delta < 0 ? 'bg-lime-500/10 text-[#C5D82D] border-lime-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {apiResult.bio_delta > 0 ? `+${apiResult.bio_delta} yrs older` : apiResult.bio_delta < 0 ? `${Math.abs(apiResult.bio_delta)} yrs younger` : 'On track'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border bg-white/5 text-gray-400 border-white/10">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
                
                {/* HIDDEN SCORE CIRCLE */}
                <div className="shrink-0 relative w-[90px] h-[90px]">
                  <svg viewBox="0 0 80 80" className="w-[90px] h-[90px] -rotate-90">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <circle 
                      cx="40" cy="40" r="35" fill="none" 
                      stroke={isUnlocked ? bandColor : 'rgba(255,255,255,0.2)'} 
                      strokeWidth="6" 
                      strokeDasharray="220" 
                      strokeDashoffset={isUnlocked ? (220 - (220 * apiResult.longevity_score / 100)) : 220} 
                      strokeLinecap="round" 
                      className="transition-all duration-1000 ease-out" 
                    />
                  </svg>
                  <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-sans text-[1.2rem] font-bold text-white">
                    {isUnlocked ? apiResult.longevity_score : '🔒'}
                  </div>
                </div>
              </div>
              
              {/* HIDDEN RESULT MESSAGE */}
              <div className={`text-[0.95rem] text-gray-300 leading-relaxed pt-5 border-t border-white/10 ${!isUnlocked ? 'filter blur-[6px] opacity-40 select-none' : ''}`}>
                {isUnlocked ? apiResult.result_message : 'This is a blurred placeholder text to keep your personalised analysis hidden until you unlock the full report below.'}
              </div>
            </div>

            {/* Flag Cards */}
            <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4 ml-1">Your personal health snapshot</div>
            <div className="flex flex-col gap-3 mb-8">
              {displayFlags.map((f, i) => (
                <div key={i} className={`flex items-start gap-4 bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-5 transition-colors duration-200 hover:bg-white/5 ${!isUnlocked && i >= apiFlags.length ? 'filter blur-[4px] select-none pointer-events-none opacity-50' : ''}`}>
                  <div className="text-[1.5rem] shrink-0">{f.icon}</div>
                  <div>
                    <div className="text-[1rem] font-bold text-white mb-1">{f.title}</div>
                    {f.desc && <div className="text-[0.85rem] text-gray-400 leading-relaxed">{f.desc}</div>}
                    <span className={`inline-block mt-3 text-[0.6rem] font-bold tracking-wider uppercase px-2 py-1 rounded-[4px] border ${f.severity === 'red' ? 'bg-red-500/10 text-red-400 border-red-500/20' : f.severity === 'amber' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : f.severity === 'gray' ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-lime-500/10 text-[#C5D82D] border-lime-500/20'}`}>
                      {f.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Unlock Section */}
            {!isUnlocked && (
              <div id="wa-number" className="bg-[#C5D82D]/10 border-[1.5px] border-[#C5D82D]/30 backdrop-blur-md rounded-2xl p-7 text-center relative overflow-hidden shadow-[0_0_30px_rgba(197,216,45,0.05)]">
                <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-[#C5D82D]/20 blur-[60px] pointer-events-none"></div>
                <div className="inline-flex items-center gap-2 bg-black/30 border border-[#C5D82D]/20 px-4 py-1.5 rounded-full text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#C5D82D] mb-5">🔒 Full Report Locked</div>
                <div className="font-sans text-[1.6rem] font-semibold text-white mb-3 leading-tight">Your full breakdown is ready.<br/>Get it free — takes 10 seconds.</div>
                <div className="text-[0.9rem] text-gray-300 mb-6 leading-relaxed">Enter your email address. We'll send your complete report and offer a free 20-minute call with our doctor — no obligation.</div>
                
                <div className="flex flex-col gap-3 mb-7 text-left max-w-sm mx-auto">
                  {["Full breakdown of all 6 health areas", "What GRASA can specifically do for your profile", "Free 20-min call with our doctor — yours to book"].map((perk, i) => (
                    <div key={i} className="flex items-center gap-3 text-[0.85rem] text-gray-300">
                      <div className="w-5 h-5 rounded-full bg-[#C5D82D]/20 flex items-center justify-center text-[0.6rem] text-[#C5D82D] shrink-0 border border-[#C5D82D]/30"><i className="fas fa-check"></i></div>
                      {perk}
                    </div>
                  ))}
                </div>

                {/* Email Input & Submit Button */}
                <div className="space-y-4">
                  <input
                    id="email-input"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-[#C5D82D] focus:ring-1 focus:ring-[#C5D82D]/30"
                  />

                  {/* Single Submit Button */}
                  <button
                    onClick={unlockResult}
                    disabled={isUnlocking || !email}
                    className="w-full bg-[#C5D82D] hover:bg-white text-black font-sans font-bold text-[1rem] py-4 rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(197,216,45,0.3)]"
                  >
                    {isUnlocking ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></div>
                        <span>Sending Report...</span>
                      </>
                    ) : (
                      <>
                        <span>🎯 Send My Full Report</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[0.7rem] text-gray-500 mt-4 tracking-wide">We never share your email. No spam — ever.</div>
              </div>
            )}

            {/* Full Result Content (Post-Unlock) */}
            {isUnlocked && (
              <div className="animate-fadeUp mt-8">
                <div className="text-center mb-8">
                  <h2 className="font-sans text-[1.8rem] font-bold text-white mb-2">Your personalised action plan</h2>
                  <p className="text-[0.95rem] text-gray-400">Based on your answers — here is what matters most for your body right now.</p>
                </div>
                
                <div className="flex flex-col gap-4 mb-10">
                  {getActionCards().map((a, i) => (
                    <div key={i} className="bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-6 flex gap-5 items-start transition-all hover:bg-white/5 hover:border-white/20">
                      <div className="text-[1.8rem] shrink-0 leading-none">{a.icon}</div>
                      <div>
                        <div className="text-[1.05rem] font-bold text-white mb-2">{a.title}</div>
                        <div className="text-[0.9rem] text-gray-400 leading-relaxed">{a.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border-[1.5px] border-white/10 backdrop-blur-sm rounded-2xl p-8 text-center mb-4">
                  <h3 className="font-sans text-[1.4rem] font-bold text-white mb-3">Talk to our doctor — it's free.</h3>
                  <p className="text-[0.9rem] text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">Your score and answers are already saved. Our doctor will look at your full profile before the call — so you're not starting from scratch.</p>
                  <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    {/* Call Button */}
                    <button 
                      onClick={() => window.open('tel:+919870263399')} 
                      className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(197,216,45,0.3)]"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                      <span>Call Us Now — +91 98702 63399</span>
                    </button>

                    {/* WhatsApp Button */}
                    <button 
                      onClick={openWA} 
                      className="py-3.5 px-6 bg-[#25D366] text-white font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#1fa855] hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]"
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>Continue on WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Sticky Bar for partial result */}
        {!isUnlocked && (
          <div className="fixed bottom-0 left-0 right-0 bg-[#0f1114]/90 backdrop-blur-md border-t border-white/10 py-4 px-5 flex items-center justify-between gap-4 z-40 animate-fadeUp">
            <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-4">
              <div>
                <p className="font-sans text-[1rem] font-bold text-white m-0 leading-tight">Your biological age and score are ready</p>
                <span className="text-[0.75rem] text-gray-400">20 min call · No pressure · No selling</span>
              </div>
              <button onClick={() => {
                const unlockCard = document.getElementById('wa-number');
                if (unlockCard) unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }} className="bg-[#C5D82D] text-black font-bold text-[0.85rem] py-2.5 px-5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-white hover:-translate-y-[1px] shadow-[0_0_10px_rgba(197,216,45,0.2)]">
                Get Full Report →
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}