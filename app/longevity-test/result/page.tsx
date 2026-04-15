
// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { ApiResultData, StoredResult } from '@/types/longevity';
// import { BASE_URL } from "@/components/config/api";
// import toast, { Toaster } from "react-hot-toast";



// export default function LongevityResultPage() {
//   const router = useRouter();
  
//   const [apiResult, setApiResult] = useState<ApiResultData | null>(null);
//   const [isUnlocked, setIsUnlocked] = useState(false);
//   const [age, setAge] = useState<number | null>(null);
//   const [scores, setScores] = useState<Record<string, number>>({});
//   const [payload, setPayload] = useState<any>(null);
  
//   const [waNumber, setWaNumber] = useState('');
//   const [isUnlocking, setIsUnlocking] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);

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
          
//           const storedUserId = localStorage.getItem('user_id');
//           if (storedUserId) {
//             setUserId(storedUserId);
//             fetchUserWhatsApp(storedUserId);
//           }
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

//   // Fetch user WhatsApp from patient profile API
//   const fetchUserWhatsApp = async (userId: string) => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/patients/${userId}`);
//       if (!res.ok) throw new Error('Failed to fetch user profile');
//       const data = await res.json();
//       // Try to prefill whatsapp/phone if available
//       const phone = data?.patient_profile?.user?.phone || data?.patient_profile?.user?.whatsapp;
//       if (phone) {
//         // Strip +91 or 91 prefix if present, store only 10-digit number
//         const cleaned = phone.replace(/^\+?91/, '').replace(/\D/g, '').slice(-10);
//         setWaNumber(cleaned);
//       }
//     } catch (err) {
//       console.error('Error fetching user profile:', err);
//     }
//   };

//   const unlockResult = async () => {
//     // Validate WhatsApp number
//     if (!waNumber) {
//       toast.error("Please enter your WhatsApp number.");
//       return;
//     }
    
//     const digitsOnly = waNumber.replace(/\D/g, '');
//     if (digitsOnly.length !== 10) {
//       toast.error("Please enter a valid 10-digit WhatsApp number.");
//       return;
//     }

//     setIsUnlocking(true);

//     try {
//       const fullWaNumber = `+91${digitsOnly}`;

//       const updatedPayload = {
//         ...payload,
//         whatsapp_number: fullWaNumber,
//         email: payload?.email || '',
//         html_content: generateHtmlContent()
//       };

//       console.log(updatedPayload);

//       const res = await fetch(
//         `${BASE_URL}/api/questionnaire/longevity/submit`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedPayload)
//         }
//       );

//       if (!res.ok) throw new Error("API Submission failed");

//       const finalResult: ApiResultData = await res.json();

//       setApiResult(finalResult);
//       setIsUnlocked(true);

//       const newStoredData: StoredResult = {
//         result: finalResult,
//         isUnlocked: true,
//         age: age,
//         scores: scores,
//         payload: payload,
//         timestamp: Date.now()
//       };

//       localStorage.setItem("grasa_longevity_result", JSON.stringify(newStoredData));
//       window.scrollTo({ top: 0, behavior: "smooth" });

//     } catch (err) {
//       console.error("Failed to unlock report:", err);
//       toast.error("Something went wrong processing your request.");
//     } finally {
//       setIsUnlocking(false);
//     }
//   };

//   const generateHtmlContent = () => {
//     const baseUrl = "https://www.grasamillets.com";

//     const flagsHtml = (apiResult?.flags || [])
//       .map((f: any) => `
//         <div style="margin-bottom:12px; padding:12px; background:#ffffff; border-radius:8px; border:1px solid #e5e5e5;">
//           <strong style="color:#1b1b1b;">${f.title}</strong>
//           <p style="margin:6px 0 0; color:#5c5c5c; font-size:14px;">${f.desc || ""}</p>
//         </div>
//       `).join("");

//     const actionsHtml = getActionCards()
//       .map((a: any) => `
//         <div style="margin-bottom:12px; padding:12px; background:#ffffff; border-radius:8px; border:1px solid #e5e5e5;">
//           <strong style="color:#1b1b1b;">${a.title}</strong>
//           <p style="margin:6px 0 0; color:#5c5c5c; font-size:14px;">${a.desc}</p>
//         </div>
//       `).join("");

//     return `
//     <div style="font-family: Arial, sans-serif; background:#ebecdf; padding:20px;">
//       <div style="max-width:600px; margin:0 auto;">
//         <div style="text-align:center; margin-bottom:20px;">
//           <div style="display:inline-block; background:#ffffff; padding:10px 18px; border-radius:10px; margin-bottom:12px;">
//             <img src="https://www.grasamillets.com/_next/image?url=%2Flogo.png&w=256&q=75" alt="GRASA Logo" style="width:110px; display:block;" />
//           </div>
//           <h1 style="color:#1b1b1b; margin:0; font-size:26px;">GRASA Longevity Report</h1>
//           <p style="color:#5c5c5c; font-size:14px; margin-top:6px;">Your Personalized Health Analysis</p>
//         </div>
//         <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//           <h2 style="margin-bottom:12px; color:#1b1b1b;">Your Results</h2>
//           <p><strong>Longevity Score:</strong> <span style="color:#C5D82D; font-weight:bold;">${apiResult?.longevity_score}/100</span></p>
//           <p><strong>Biological Age:</strong> ${apiResult?.biological_age}</p>
//           <p><strong>Actual Age:</strong> ${apiResult?.calendar_age || age}</p>
//           <p><strong>Difference:</strong> ${apiResult?.bio_delta}</p>
//         </div>
//         <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//           <h2 style="color:#1b1b1b;">Summary</h2>
//           <p style="color:#5c5c5c; font-size:14px; line-height:1.6;">${apiResult?.result_message}</p>
//         </div>
//         <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//           <h2 style="color:#1b1b1b;">Health Insights</h2>
//           ${flagsHtml || `<p style="color:#5c5c5c;">No major flags detected</p>`}
//         </div>
//         <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//           <h2 style="color:#1b1b1b;">Your Action Plan</h2>
//           ${actionsHtml}
//         </div>
//         <div style="text-align:center; margin:30px 0;">
//           <a href="https://wa.me/919870263399" style="display:inline-block; background:#C5D82D; color:#1b1b1b; padding:14px 22px; border-radius:8px; font-weight:bold; text-decoration:none;">💬 Talk to Expert on WhatsApp</a>
//         </div>
//         <div style="text-align:center; font-size:12px; color:#5c5c5c; margin-top:20px;">
//           <div style="margin-bottom:10px;">
//             <a href="${baseUrl}/privacy-policy" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">Privacy Policy</a> |
//             <a href="${baseUrl}/terms-condition" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">Terms & Conditions</a> |
//             <a href="${baseUrl}/contact" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">Contact Us</a>
//           </div>
//           <p style="margin:4px 0;">📞 +91 98702 63399</p>
//           <p style="margin:4px 0;">🌐 https://www.grasamillets.com</p>
//         </div>
//       </div>
//     </div>
//     `;
//   };

//   const openWA = () => {
//     const msg = encodeURIComponent(`Hi GRASA, I just completed the Longevity Check. My longevity score is ${apiResult?.longevity_score || 0}/100 and my estimated biological age is ${apiResult?.biological_age || age}. I'd like to discuss my full report with your doctor.`);
//     window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
//   };

//   const getLocalDummyFlags = () => [
//     { icon: '⚖️', title: 'Body composition', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//     { icon: '🩸', title: 'Blood report markers', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//     { icon: '🧬', title: 'Family history', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//     { icon: '🍽️', title: 'Dietary foundation', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' }
//   ];

//   const getActionCards = () => {
//     const actions = [];
//     const s = scores;
//     if ((s.q2 || 0) + (s.q3 || 0) >= 3) actions.push({ icon: '⚡', title: 'Start with your meal timing', desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' });
//     if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' });
//     if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: "Given your family history, a comprehensive metabolic panel gives you a true picture of where you are. Don't wait for symptoms." });
//     if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' });
//     actions.push({ icon: '📞', title: 'Talk to us — before spending anything', desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' });
//     return actions;
//   };

//   if (isLoading || !apiResult) {
//     return (
//       <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
//         <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
//       </div>
//     );
//   }

//   let bandColor = '#C5D82D';
//   const band = apiResult.result_band?.toLowerCase();
//   if (band === 'excellent') bandColor = '#4ade80';
//   else if (band === 'good') bandColor = '#C5D82D';
//   else if (band === 'moderate') bandColor = '#facc15';
//   else if (band === 'elevated') bandColor = '#fb923c';
//   else if (band === 'high') bandColor = '#ef4444';

//   const apiFlags = apiResult.flags || [];
//   const displayFlags = isUnlocked ? apiFlags : [...apiFlags, ...getLocalDummyFlags().slice(0, 6 - apiFlags.length)];

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

//         <div className={`max-w-3xl mx-auto px-5 pt-10 md:px-4 md:pt-14 relative z-10 ${!isUnlocked ? 'pb-40 md:pb-48' : 'pb-32'}`}>
//           <div className="animate-fadeUp relative">
            
//             {/* Top Result Band */}
//             <div className="relative rounded-xl p-6 mb-6 border-[1.5px] border-white/10 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
              
//               {!isUnlocked && (
//                 <div 
//                   onClick={() => {
//                     const unlockCard = document.getElementById('wa-number');
//                     const inputField = document.getElementById('wa-input');
//                     if (unlockCard) {
//                       unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                       setTimeout(() => inputField?.focus(), 500);
//                     }
//                   }}
//                   className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f1114]/20 backdrop-blur-[2px] cursor-pointer group"
//                 >
//                   <div className="bg-black/80 border border-[#C5D82D]/40 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(197,216,45,0.15)] animate-pulse group-hover:scale-105 transition-transform duration-200">
//                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-[#C5D82D]">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                     </svg>
//                     <span className="text-[1.1rem] font-bold text-white tracking-wide">Enter WhatsApp number to unlock</span>
//                   </div>
//                 </div>
//               )}

//               <div className="flex items-start justify-between gap-4 mb-4">
//                 <div>
//                   <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Your estimated biological age</div>
//                   <div 
//                     className={`font-sans text-[3.5rem] font-black leading-none ${!isUnlocked ? 'filter blur-[10px] opacity-40 select-none text-white' : ''}`} 
//                     style={{ color: isUnlocked ? bandColor : undefined }}
//                   >
//                     {isUnlocked ? apiResult.biological_age : '45'}
//                   </div>
//                   <div className="flex items-center gap-2 mt-4 text-[0.85rem] text-gray-400">
//                     <span>Your actual age: <strong className={`font-bold text-white ${!isUnlocked ? 'filter blur-[5px] opacity-40 select-none' : ''}`}>{isUnlocked ? (apiResult.calendar_age || age || 35) : 'XX'}</strong></span>
//                     {isUnlocked ? (
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border ${apiResult.bio_delta > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : apiResult.bio_delta < 0 ? 'bg-lime-500/10 text-[#C5D82D] border-lime-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
//                         {apiResult.bio_delta > 0 ? `+${apiResult.bio_delta} yrs older` : apiResult.bio_delta < 0 ? `${Math.abs(apiResult.bio_delta)} yrs younger` : 'On track'}
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.72rem] font-bold border bg-white/5 text-gray-400 border-white/10">Locked</span>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="shrink-0 relative w-[90px] h-[90px]">
//                   <svg viewBox="0 0 80 80" className="w-[90px] h-[90px] -rotate-90">
//                     <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
//                     <circle cx="40" cy="40" r="35" fill="none" stroke={isUnlocked ? bandColor : 'rgba(255,255,255,0.2)'} strokeWidth="6" strokeDasharray="220" strokeDashoffset={isUnlocked ? (220 - (220 * apiResult.longevity_score / 100)) : 220} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
//                   </svg>
//                   <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-sans text-[1.2rem] font-bold text-white">
//                     {isUnlocked ? apiResult.longevity_score : '🔒'}
//                   </div>
//                 </div>
//               </div>
              
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

//             {/* Unlock Section — WhatsApp */}
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

//                 {/* WhatsApp Input with +91 prefix */}
//                 <div className="space-y-4 max-w-sm mx-auto">
//                   <div className="flex items-center rounded-lg border border-gray-600 bg-transparent overflow-hidden focus-within:border-[#C5D82D] focus-within:ring-1 focus-within:ring-[#C5D82D]/30 transition-all">
//                     {/* +91 Prefix */}
//                     <div className="flex items-center gap-2 px-3 py-3 border-r border-gray-600 bg-white/5 shrink-0">
//                       <span className="text-lg leading-none">🇮🇳</span>
//                       <span className="text-white font-semibold text-sm">+91</span>
//                     </div>
//                     <input
//                       id="wa-input"
//                       type="tel"
//                       inputMode="numeric"
//                       placeholder="Enter 10-digit number"
//                       value={waNumber}
//                       maxLength={10}
//                       onChange={(e) => {
//                         const val = e.target.value.replace(/\D/g, '').slice(0, 10);
//                         setWaNumber(val);
//                       }}
//                       className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
//                     />
//                     {/* Live digit counter */}
//                     <div className={`px-3 text-xs font-bold shrink-0 ${waNumber.length === 10 ? 'text-[#C5D82D]' : 'text-gray-500'}`}>
//                       {waNumber.length}/10
//                     </div>
//                   </div>

//                   <button
//                     onClick={unlockResult}
//                     disabled={isUnlocking || waNumber.length !== 10}
//                     className="w-full bg-[#C5D82D] hover:bg-white text-black font-sans font-bold text-[1rem] py-4 rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(197,216,45,0.3)]"
//                   >
//                     {isUnlocking ? (
//                       <>
//                         <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></div>
//                         <span>Sending Report...</span>
//                       </>
//                     ) : (
//                       <>
//                         {/* WhatsApp icon */}
//                         <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                         </svg>
//                         <span>Send My Full Report on WhatsApp</span>
//                       </>
//                     )}
//                   </button>
//                 </div>

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
//                     <button onClick={() => window.open('tel:+919870263399')} className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(197,216,45,0.3)]">
//                       <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//                         <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
//                       </svg>
//                       <span>Call Us Now — +91 98702 63399</span>
//                     </button>
//                     <button onClick={openWA} className="py-3.5 px-6 bg-[#25D366] text-white font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#1fa855] hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]">
//                       <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                       </svg>
//                       <span>Continue on WhatsApp</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//           </div>
//         </div>

//         {/* Sticky Bar */}
//         {!isUnlocked && (
//           <div className="fixed bottom-0 left-0 right-0 bg-[#0f1114]/90 backdrop-blur-md border-t border-white/10 py-4 px-5 flex items-center justify-between gap-4 z-40 animate-fadeUp">
//             <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-4">
//               <div>
//                 <p className="font-sans text-[1rem] font-bold text-white m-0 leading-tight">Your biological age and score are ready</p>
//                 <span className="text-[0.75rem] text-gray-400">20 min call · No pressure · No selling</span>
//               </div>
//               <button
//                 onClick={() => {
//                   const unlockCard = document.getElementById('wa-number');
//                   if (unlockCard) unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                 }}
//                 className="bg-[#C5D82D] text-black font-bold text-[0.85rem] py-2.5 px-5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-white hover:-translate-y-[1px] shadow-[0_0_10px_rgba(197,216,45,0.2)]"
//               >
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
// import { StoredResult } from '@/types/longevity'; // Keeping your import, but we'll use a local type for the new API structure to prevent TS errors
// import { BASE_URL } from "@/components/config/api";
// import toast, { Toaster } from "react-hot-toast";

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
//   const [isUnlocked, setIsUnlocked] = useState(false);
//   const [age, setAge] = useState<number | null>(null);
//   const [scores, setScores] = useState<Record<string, number>>({});
//   const [payload, setPayload] = useState<any>(null);
  
//   const [waNumber, setWaNumber] = useState('');
//   const [isUnlocking, setIsUnlocking] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const saved = localStorage.getItem('grasa_longevity_result');
//     if (saved) {
//       try {
//         const parsed: StoredResult = JSON.parse(saved);
//         const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
//         if (Date.now() - parsed.timestamp < oneMonthInMs) {
//           setApiResult(parsed.result as ProfileApiResult);
//           setIsUnlocked(parsed.isUnlocked);
//           setAge(parsed.age);
//           setScores(parsed.scores || {});
//           setPayload(parsed.payload);
//           setIsLoading(false);
          
//           const storedUserId = localStorage.getItem('user_id');
//           if (storedUserId) {
//             setUserId(storedUserId);
//             fetchUserWhatsApp(storedUserId);
//           }
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

//   // Fetch user WhatsApp from patient profile API
//   const fetchUserWhatsApp = async (userId: string) => {
//     try {
//       const res = await fetch(`${BASE_URL}/api/patients/${userId}`);
//       if (!res.ok) throw new Error('Failed to fetch user profile');
//       const data = await res.json();
//       // Try to prefill whatsapp/phone if available
//       const phone = data?.patient_profile?.user?.phone || data?.patient_profile?.user?.whatsapp;
//       if (phone) {
//         // Strip +91 or 91 prefix if present, store only 10-digit number
//         const cleaned = phone.replace(/^\+?91/, '').replace(/\D/g, '').slice(-10);
//         setWaNumber(cleaned);
//       }
//     } catch (err) {
//       console.error('Error fetching user profile:', err);
//     }
//   };

//   const unlockResult = async () => {
//     // Validate WhatsApp number
//     if (!waNumber) {
//       toast.error("Please enter your WhatsApp number.");
//       return;
//     }
    
//     const digitsOnly = waNumber.replace(/\D/g, '');
//     if (digitsOnly.length !== 10) {
//       toast.error("Please enter a valid 10-digit WhatsApp number.");
//       return;
//     }

//     setIsUnlocking(true);

//     try {
//       const fullWaNumber = `+91${digitsOnly}`;

//       const updatedPayload = {
//         ...payload,
//         whatsapp_number: fullWaNumber,
//         email: payload?.email || '',
//         html_content: generateHtmlContent()
//       };

//       const res = await fetch(
//         `${BASE_URL}/api/questionnaire/longevity/submit`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updatedPayload)
//         }
//       );

//       if (!res.ok) throw new Error("API Submission failed");

//       const finalResult: ProfileApiResult = await res.json();

//       setApiResult(finalResult);
//       setIsUnlocked(true);

//       const newStoredData: any = {
//         result: finalResult,
//         isUnlocked: true,
//         age: age,
//         scores: scores,
//         payload: payload,
//         timestamp: Date.now()
//       };

//       localStorage.setItem("grasa_longevity_result", JSON.stringify(newStoredData));
//       window.scrollTo({ top: 0, behavior: "smooth" });

//     } catch (err) {
//       console.error("Failed to unlock report:", err);
//       toast.error("Something went wrong processing your request.");
//     } finally {
//       setIsUnlocking(false);
//     }
//   };

//   const generateHtmlContent = () => {
//     const baseUrl = "https://www.grasamillets.com";

//     const actionsHtml = getActionCards()
//       .map((a: any) => `
//         <div style="margin-bottom:12px; padding:12px; background:#ffffff; border-radius:8px; border:1px solid #e5e5e5;">
//           <strong style="color:#1b1b1b;">${a.title}</strong>
//           <p style="margin:6px 0 0; color:#5c5c5c; font-size:14px;">${a.desc}</p>
//         </div>
//       `).join("");

//     return `
//     <div style="font-family: Arial, sans-serif; background:#ebecdf; padding:20px;">
//       <div style="max-width:600px; margin:0 auto;">
//         <div style="text-align:center; margin-bottom:20px;">
//           <div style="display:inline-block; background:#ffffff; padding:10px 18px; border-radius:10px; margin-bottom:12px;">
//             <img src="https://www.grasamillets.com/_next/image?url=%2Flogo.png&w=256&q=75" alt="GRASA Logo" style="width:110px; display:block;" />
//           </div>
//           <h1 style="color:#1b1b1b; margin:0; font-size:26px;">GRASA Health Profile</h1>
//           <p style="color:#5c5c5c; font-size:14px; margin-top:6px;">Your Personalized Metabolic Analysis</p>
//         </div>
//         <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//           <h2 style="margin-bottom:12px; color:#1b1b1b;">Your Results</h2>
//           <p><strong>Dominant Profile:</strong> <span style="color:#8ca315; font-weight:bold;">${apiResult?.dominant_profile}</span></p>
//           <p><strong>Secondary Profile:</strong> ${apiResult?.secondary_profile || 'None Detected'}</p>
//           <p><strong>Recommended Plan:</strong> ${apiResult?.mapped_programme}</p>
//           ${apiResult?.flag_for_nutritionist_review ? `<p style="color:#ef4444; font-weight:bold; margin-top:10px;">⚠️ Flagged for priority nutritionist review based on your responses.</p>` : ''}
//         </div>
//         <div style="background:#f4f4f2; padding:20px; border-radius:12px; border:1px solid #d6d1c4; margin-bottom:20px;">
//           <h2 style="color:#1b1b1b;">Your Action Plan</h2>
//           ${actionsHtml}
//         </div>
//         <div style="text-align:center; margin:30px 0;">
//           <a href="https://wa.me/919870263399" style="display:inline-block; background:#C5D82D; color:#1b1b1b; padding:14px 22px; border-radius:8px; font-weight:bold; text-decoration:none;">💬 Talk to Expert on WhatsApp</a>
//         </div>
//         <div style="text-align:center; font-size:12px; color:#5c5c5c; margin-top:20px;">
//           <div style="margin-bottom:10px;">
//             <a href="${baseUrl}/privacy-policy" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">Privacy Policy</a> |
//             <a href="${baseUrl}/terms-condition" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">Terms & Conditions</a> |
//             <a href="${baseUrl}/contact" style="color:#1b1b1b; text-decoration:none; margin:0 8px;">Contact Us</a>
//           </div>
//           <p style="margin:4px 0;">📞 +91 98702 63399</p>
//           <p style="margin:4px 0;">🌐 https://www.grasamillets.com</p>
//         </div>
//       </div>
//     </div>
//     `;
//   };

//   const openWA = () => {
//     const msg = encodeURIComponent(`Hi GRASA, I just completed my health check. My dominant profile is the "${apiResult?.dominant_profile}" and my recommended path is the "${apiResult?.mapped_programme}". I'd like to discuss my full report with your doctor.`);
//     window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
//   };

//   const getLocalDummyFlags = () => [
//     { icon: '⚖️', title: 'Metabolic Balance', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//     { icon: '🦠', title: 'Gut Microbiome Health', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//     { icon: '🧬', title: 'Hormonal Response', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' },
//     { icon: '🍽️', title: 'Dietary Foundation', severity: 'gray', tag: 'Locked', desc: 'Unlock your full report to see your analysis.' }
//   ];

//   const getActionCards = () => {
//     const actions = [];
//     const s = scores;
//     if ((s.q2 || 0) + (s.q3 || 0) >= 3) actions.push({ icon: '⚡', title: 'Start with your meal timing', desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' });
//     if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' });
//     if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: "Given your family history, a comprehensive metabolic panel gives you a true picture of where you are. Don't wait for symptoms." });
//     if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' });
//     actions.push({ icon: '📞', title: 'Talk to us — before spending anything', desc: 'Your profile and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' });
//     return actions;
//   };

//   if (isLoading || !apiResult) {
//     return (
//       <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
//         <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
//       </div>
//     );
//   }

//   const displayFlags = isUnlocked ? [] : getLocalDummyFlags();

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

//         <div className={`max-w-3xl mx-auto px-5 pt-10 md:px-4 md:pt-14 relative z-10 ${!isUnlocked ? 'pb-40 md:pb-48' : 'pb-32'}`}>
//           <div className="animate-fadeUp relative">
            
//             {/* Top Result Band */}
//             <div className="relative rounded-xl p-6 md:p-8 mb-6 border-[1.5px] border-white/10 bg-black/40 backdrop-blur-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
              
//               {!isUnlocked && (
//                 <div 
//                   onClick={() => {
//                     const unlockCard = document.getElementById('wa-number');
//                     const inputField = document.getElementById('wa-input');
//                     if (unlockCard) {
//                       unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                       setTimeout(() => inputField?.focus(), 500);
//                     }
//                   }}
//                   className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0f1114]/20 backdrop-blur-[2px] cursor-pointer group"
//                 >
//                   <div className="bg-black/80 border border-[#C5D82D]/40 px-5 py-3 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(197,216,45,0.15)] animate-pulse group-hover:scale-105 transition-transform duration-200">
//                     <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-[#C5D82D]">
//                       <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                     </svg>
//                     <span className="text-[1.1rem] font-bold text-white tracking-wide">Enter WhatsApp number to unlock</span>
//                   </div>
//                 </div>
//               )}

//               <div className="flex flex-col gap-6">
//                 <div>
//                   <div className="text-[0.65rem] font-bold tracking-[0.18em] uppercase text-gray-400 mb-2">Your Primary Metabolic Profile</div>
//                   <div 
//                     className={`font-sans text-[2.2rem] md:text-[2.8rem] font-black leading-tight mb-2 ${!isUnlocked ? 'filter blur-[10px] opacity-40 select-none text-white' : 'text-[#C5D82D]'}`}
//                   >
//                     {isUnlocked ? apiResult.dominant_profile : 'Gut-Metabolic Profile'}
//                   </div>
                  
//                   {isUnlocked && apiResult.flag_for_nutritionist_review && (
//                     <div className="inline-flex items-center gap-2 mt-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-md">
//                       <span className="text-red-500 text-[0.8rem]">⚠️</span>
//                       <span className="text-red-400 text-[0.75rem] font-bold tracking-wide uppercase">Priority Review Recommended</span>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-white/10 ${!isUnlocked ? 'filter blur-[8px] opacity-40 select-none' : ''}`}>
//                   <div className="bg-white/5 rounded-lg p-4 border border-white/5">
//                     <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-gray-500 mb-1">Secondary Profile</div>
//                     <div className="text-[1rem] font-semibold text-gray-200">
//                       {isUnlocked ? apiResult.secondary_profile || 'None Detected' : 'Slow Metabolic Rate Profile'}
//                     </div>
//                   </div>
                  
//                   <div className="bg-[#C5D82D]/5 rounded-lg p-4 border border-[#C5D82D]/10">
//                     <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#C5D82D]/60 mb-1">Recommended Path</div>
//                     <div className="text-[1rem] font-bold text-[#C5D82D]">
//                       {isUnlocked ? apiResult.mapped_programme : 'Gut Metabolic Reset Programme'}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Locked Flag Cards (Only visible when locked to show a teaser) */}
//             {!isUnlocked && (
//               <>
//                 <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-gray-400 mb-4 ml-1">Your personal health snapshot</div>
//                 <div className="flex flex-col gap-3 mb-8">
//                   {displayFlags.map((f, i) => (
//                     <div key={i} className="flex items-start gap-4 bg-black/40 backdrop-blur-sm border-[1.5px] border-white/10 rounded-xl p-5 filter blur-[4px] select-none pointer-events-none opacity-50">
//                       <div className="text-[1.5rem] shrink-0">{f.icon}</div>
//                       <div>
//                         <div className="text-[1rem] font-bold text-white mb-1">{f.title}</div>
//                         {f.desc && <div className="text-[0.85rem] text-gray-400 leading-relaxed">{f.desc}</div>}
//                         <span className="inline-block mt-3 text-[0.6rem] font-bold tracking-wider uppercase px-2 py-1 rounded-[4px] border bg-white/5 text-gray-400 border-white/10">
//                           {f.tag}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {/* Unlock Section — WhatsApp */}
//             {!isUnlocked && (
//               <div id="wa-number" className="bg-[#C5D82D]/10 border-[1.5px] border-[#C5D82D]/30 backdrop-blur-md rounded-2xl p-7 text-center relative overflow-hidden shadow-[0_0_30px_rgba(197,216,45,0.05)]">
//                 <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-[#C5D82D]/20 blur-[60px] pointer-events-none"></div>
//                 <div className="inline-flex items-center gap-2 bg-black/30 border border-[#C5D82D]/20 px-4 py-1.5 rounded-full text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#C5D82D] mb-5">🔒 Full Profile Locked</div>
//                 <div className="font-sans text-[1.6rem] font-semibold text-white mb-3 leading-tight">Your full breakdown is ready.<br/>Get it free — takes 10 seconds.</div>
//                 <div className="text-[0.9rem] text-gray-300 mb-6 leading-relaxed">Enter your WhatsApp number. We'll send your complete profile analysis and offer a free 20-minute call with our doctor — no obligation.</div>
                
//                 <div className="flex flex-col gap-3 mb-7 text-left max-w-sm mx-auto">
//                   {["Your exact Metabolic Profile mapping", "The recommended Programme for you", "Free 20-min call with our doctor — yours to book"].map((perk, i) => (
//                     <div key={i} className="flex items-center gap-3 text-[0.85rem] text-gray-300">
//                       <div className="w-5 h-5 rounded-full bg-[#C5D82D]/20 flex items-center justify-center text-[0.6rem] text-[#C5D82D] shrink-0 border border-[#C5D82D]/30"><i className="fas fa-check"></i></div>
//                       {perk}
//                     </div>
//                   ))}
//                 </div>

//                 {/* WhatsApp Input with +91 prefix */}
//                 <div className="space-y-4 max-w-sm mx-auto">
//                   <div className="flex items-center rounded-lg border border-gray-600 bg-transparent overflow-hidden focus-within:border-[#C5D82D] focus-within:ring-1 focus-within:ring-[#C5D82D]/30 transition-all">
//                     {/* +91 Prefix */}
//                     <div className="flex items-center gap-2 px-3 py-3 border-r border-gray-600 bg-white/5 shrink-0">
//                       <span className="text-lg leading-none">🇮🇳</span>
//                       <span className="text-white font-semibold text-sm">+91</span>
//                     </div>
//                     <input
//                       id="wa-input"
//                       type="tel"
//                       inputMode="numeric"
//                       placeholder="Enter 10-digit number"
//                       value={waNumber}
//                       maxLength={10}
//                       onChange={(e) => {
//                         const val = e.target.value.replace(/\D/g, '').slice(0, 10);
//                         setWaNumber(val);
//                       }}
//                       className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm"
//                     />
//                     {/* Live digit counter */}
//                     <div className={`px-3 text-xs font-bold shrink-0 ${waNumber.length === 10 ? 'text-[#C5D82D]' : 'text-gray-500'}`}>
//                       {waNumber.length}/10
//                     </div>
//                   </div>

//                   <button
//                     onClick={unlockResult}
//                     disabled={isUnlocking || waNumber.length !== 10}
//                     className="w-full bg-[#C5D82D] hover:bg-white text-black font-sans font-bold text-[1rem] py-4 rounded-xl cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(197,216,45,0.3)]"
//                   >
//                     {isUnlocking ? (
//                       <>
//                         <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></div>
//                         <span>Sending Report...</span>
//                       </>
//                     ) : (
//                       <>
//                         {/* WhatsApp icon */}
//                         <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                         </svg>
//                         <span>Send My Full Profile on WhatsApp</span>
//                       </>
//                     )}
//                   </button>
//                 </div>

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
//                   <p className="text-[0.9rem] text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">Your profile mapping and answers are already saved. Our doctor will look at your full file before the call — so you're not starting from scratch.</p>
//                   <div className="flex flex-col gap-3 max-w-sm mx-auto">
//                     <button onClick={() => window.open('tel:+919870263399')} className="py-3.5 px-6 bg-[#C5D82D] text-black font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(197,216,45,0.3)]">
//                       <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
//                         <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
//                       </svg>
//                       <span>Call Us Now — +91 98702 63399</span>
//                     </button>
//                     <button onClick={openWA} className="py-3.5 px-6 bg-[#25D366] text-white font-sans font-bold text-[1rem] rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-[#1fa855] hover:-translate-y-[2px] hover:shadow-[0_0_15px_rgba(37,211,102,0.3)]">
//                       <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
//                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
//                       </svg>
//                       <span>Continue on WhatsApp</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//           </div>
//         </div>

//         {/* Sticky Bar */}
//         {!isUnlocked && (
//           <div className="fixed bottom-0 left-0 right-0 bg-[#0f1114]/90 backdrop-blur-md border-t border-white/10 py-4 px-5 flex items-center justify-between gap-4 z-40 animate-fadeUp">
//             <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-4">
//               <div>
//                 <p className="font-sans text-[1rem] font-bold text-white m-0 leading-tight">Your metabolic profile is ready</p>
//                 <span className="text-[0.75rem] text-gray-400">20 min call · No pressure · No selling</span>
//               </div>
//               <button
//                 onClick={() => {
//                   const unlockCard = document.getElementById('wa-number');
//                   if (unlockCard) unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                 }}
//                 className="bg-[#C5D82D] text-black font-bold text-[0.85rem] py-2.5 px-5 rounded-lg cursor-pointer whitespace-nowrap transition-all duration-200 hover:bg-white hover:-translate-y-[1px] shadow-[0_0_10px_rgba(197,216,45,0.2)]"
//               >
//                 Get Full Profile →
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

//   const getActionCards = () => {
//     const actions = [];
//     const s = scores;
//     if ((s.q2 || 0) + (s.q3 || 0) >= 3) actions.push({ icon: '⚡', title: 'Start with your meal timing', desc: 'Eating your largest meal before 2pm and keeping dinner light is the single fastest way to improve energy and reduce post-meal discomfort. It costs nothing and works within a week.' });
//     if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health.' });
//     if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: "Given your family history, a comprehensive metabolic panel gives you a true picture of where you are. Don't wait for symptoms." });
//     if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. This needs to be addressed alongside diet.' });
//     actions.push({ icon: '📞', title: 'Talk to us — before spending anything', desc: 'Your profile and answers are saved. Our doctor will review your full profile before the call. Free. 20 minutes. No obligation.' });
//     return actions;
//   };

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
//                     <div className="text-[1rem] font-bold text-[#C5D82D]">
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
              
//               <div className="flex flex-col gap-4 mb-10">
//                 {getActionCards().map((a, i) => (
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

// Local interface for the new API response to ensure type safety
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

  // Static content array to always display these specific action steps
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
                  <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                    <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-gray-500 mb-1">Secondary Profile</div>
                    <div className="text-[1rem] font-semibold text-gray-200">
                      {apiResult.secondary_profile || 'None Detected'}
                    </div>
                  </div>
                  
                  <div className="bg-[#C5D82D]/10 rounded-lg p-4 border border-[#C5D82D]/20">
                    <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[#C5D82D]/80 mb-1">Recommended Path</div>
                    <div className="text-[1rem] font-bold text-[#C5D82D]">
                      {apiResult.mapped_programme}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Result Content */}
            <div className="animate-fadeUp mt-10">
              <div className="text-center mb-8">
                <h2 className="font-sans text-[1.8rem] font-bold text-white mb-2">Your personalised action plan</h2>
                <p className="text-[0.95rem] text-gray-400">Based on your answers — here is what matters most for your body right now.</p>
              </div>
              
              {/* Render Static Action Cards */}
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
