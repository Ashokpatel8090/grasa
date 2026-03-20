// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Screen, Question, QuizMeta, ApiResultData, StoredResult 
// } from '@/types/longevity';

// export default function LongevityTestPage() {
//   const router = useRouter();
//   const componentRef = useRef<HTMLDivElement>(null);

//   // --- API DATA STATE ---
//   const [isLoading, setIsLoading] = useState(true);
//   const [quizMeta, setQuizMeta] = useState<QuizMeta | null>(null);
//   const [questionsData, setQuestionsData] = useState<Question[]>([]);

//   // --- USER INPUT STATE ---
//   const [currentScreen, setCurrentScreen] = useState<Screen>('q1');
//   const [age, setAge] = useState<number | null>(null);
//   const [gender, setGender] = useState<string>('');
  
//   const [singleSelections, setSingleSelections] = useState<Record<string, number>>({});
//   const [multiSelections, setMultiSelections] = useState<Record<string, Set<number>>>({
//     q6: new Set(),
//     q7: new Set()
//   });
  
//   const [scores, setScores] = useState<Record<string, number>>({});
//   const [calcProgress, setCalcProgress] = useState(0);
//   const [activeSteps, setActiveSteps] = useState<boolean[]>([false, false, false, false, false, false]);

//   const TOTAL_Q = quizMeta?.total_questions || 8;
//   const currentQNum = currentScreen.startsWith('q') ? parseInt(currentScreen.replace('q', '')) : 0;

//   useEffect(() => {
//     // 1. Fetch Questions
//     fetch('https://medicaps.cloud/api/questionnaire/longevity/questions')
//       .then(res => res.json())
//       .then(data => {
//         if (data.quiz && data.questions) {
//           setQuizMeta(data.quiz);
//           setQuestionsData(data.questions);
//         }
//         setIsLoading(false);
//       })
//       .catch(err => {
//         console.error("Failed to fetch questions:", err);
//         setIsLoading(false);
//       });

//     // 2. Check Local Storage
//     const saved = localStorage.getItem('grasa_longevity_result');
//     if (saved) {
//       try {
//         const parsed: StoredResult = JSON.parse(saved);
//         const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
//         if (Date.now() - parsed.timestamp < oneMonthInMs) {
//           router.push('/longevity-test/result');
//         } else {
//           localStorage.removeItem('grasa_longevity_result');
//         }
//       } catch (err) {
//         localStorage.removeItem('grasa_longevity_result');
//       }
//     }
//   }, [router]);

//   const saveToLocalAndRedirect = (res: ApiResultData, payload: any) => {
//     const data: StoredResult = {
//       result: res,
//       isUnlocked: false,
//       age: age,
//       scores: scores,
//       payload: payload,
//       timestamp: Date.now()
//     };
//     localStorage.setItem('grasa_longevity_result', JSON.stringify(data));
//     router.push('/longevity-test/result');
//   };

//   const scrollToTop = () => {
//     if (componentRef.current) {
//       const offset = 44;
//       const elementPosition = componentRef.current.getBoundingClientRect().top + window.scrollY;
//       window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
//     }
//   };

//   const goTo = (n: number) => {
//     setCurrentScreen(`q${n}` as Screen);
//     scrollToTop();
//   };

//   const checkNextDisabled = (qId: string) => {
//     const q = questionsData.find(x => x.id === qId);
//     if (!q) return true;
//     if (q.type === 'input') return !(age && age >= 18 && age <= 90 && gender);
//     if (q.type === 'single_select') return singleSelections[qId] === undefined;
//     if (q.type === 'multi_select') return !multiSelections[qId] || multiSelections[qId].size === 0;
//     return true;
//   };

//   const selectSingleOpt = (qId: string, idx: number, score: number) => {
//     setSingleSelections(prev => ({ ...prev, [qId]: idx }));
//     setScores(prev => ({ ...prev, [qId]: score }));
//   };

//   const toggleMultiOpt = (qId: string, idx: number, optScores: number[]) => {
//     setMultiSelections(prev => {
//       const newSet = new Set(prev[qId]);
//       if (idx === 0) {
//         newSet.clear();
//         newSet.add(0);
//       } else {
//         newSet.delete(0);
//         if (newSet.has(idx)) newSet.delete(idx);
//         else newSet.add(idx);
//       }
      
//       let totalScore = 0;
//       newSet.forEach(selectedIndex => { totalScore += optScores[selectedIndex] || 0; });
//       setScores(s => ({ ...s, [qId]: totalScore }));
//       return { ...prev, [qId]: newSet };
//     });
//   };

//   const calculate = async () => {
//     setCurrentScreen('calc');
//     scrollToTop();

//     setActiveSteps([false, false, false, false, false, false]);
//     setCalcProgress(0);

//     const payload = {
//       q1_age: age || 0,
//       q1_gender: gender || "",
//       q2_answer_index: singleSelections.q2 ?? 0,
//       q3_answer_index: singleSelections.q3 ?? 0,
//       q4_answer_index: singleSelections.q4 ?? 0,
//       q5_answer_index: singleSelections.q5 ?? 0,
//       q6_selected_indices: Array.from(multiSelections.q6 || []),
//       q7_selected_indices: Array.from(multiSelections.q7 || []),
//       q8_answer_index: singleSelections.q8 ?? 0,
//       whatsapp_number: ""
//     };

//     let fetchedResult: ApiResultData | null = null;
    
//     try {
//       const res = await fetch("https://medicaps.cloud/api/questionnaire/longevity/submit", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload)
//       });
//       if (res.ok) fetchedResult = await res.json();
//     } catch (err) {
//       console.error(err);
//     }

//     const steps = [0, 1, 2, 3, 4, 5];
//     steps.forEach((i) => {
//       setTimeout(() => {
//         setActiveSteps(prev => { const next = [...prev]; next[i] = true; return next; });
//         setCalcProgress(Math.round(((i + 1) / steps.length) * 100));
//       }, i * 350 + 200);
//     });

//     setTimeout(() => {
//       if (fetchedResult) {
//         saveToLocalAndRedirect(fetchedResult, payload);
//       } else {
//         alert("There was an error calculating your results. Please try again.");
//         setCurrentScreen('q1');
//       }
//     }, steps.length * 350 + 700);
//   };

//   const renderProgressBar = () => {
//     if (['calc'].includes(currentScreen)) return null;
//     const pct = Math.round(((currentQNum - 1) / TOTAL_Q) * 100);

//     return (
//       <div className="sticky top-0 z-40 border-b border-white/5 px-4 md:px-8 py-4 bg-[#0f1114]/90 backdrop-blur-md">
//         <div className="max-w-[620px] mx-auto flex justify-between items-center mb-2">
//           <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Question {currentQNum} of {TOTAL_Q}</span>
//           <span className="text-xs font-bold text-[#C5D82D]">{pct}%</span>
//         </div>
//         <div className="max-w-[620px] mx-auto h-[4px] bg-white/10 rounded-full overflow-hidden">
//           <div 
//             className="h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[#C5D82D] shadow-[0_0_10px_rgba(197,216,45,0.5)]" 
//             style={{ width: `${pct}%` }}
//           ></div>
//         </div>
//       </div>
//     );
//   };

//  const OptionBtn = ({ qId, idx, icon, label, sub, isSelected, onClick, isMulti = false }: any) => (
//   <button
//     onClick={onClick}
//     className={`group flex items-center gap-4 px-5 py-4 bg-black/40 backdrop-blur-sm border-[1.5px] rounded-xl cursor-pointer transition-all duration-200 text-left w-full h-full font-['DM_Sans',sans-serif] 
//     ${isSelected 
//       ? 'border-[#C5D82D] bg-[#C5D82D]/10 shadow-[0_0_15px_rgba(197,216,45,0.1)]' 
//       : 'border-white/10 hover:border-white/30 hover:bg-white/5'
//     }`}
//   >
//     <span className="text-2xl shrink-0 w-8 text-center">{icon}</span>
//     <span className="flex-1">
//       <span className="text-[1rem] font-bold text-white block leading-snug">{label}</span>
//       {sub && <span className="text-xs text-gray-400 mt-1 block leading-relaxed">{sub}</span>}
//     </span>
//     <span 
//       className={`w-5 h-5 border-[1.5px] shrink-0 flex items-center justify-center transition-all duration-200 text-[0.65rem] 
//       ${isMulti ? 'rounded-[4px]' : 'rounded-full'} 
//       ${isSelected ? 'bg-[#C5D82D] border-[#C5D82D] text-black' : 'border-gray-500 text-transparent'}`}
//     >
//       <i className="fas fa-check"></i>
//     </span>
//   </button>
// );

//   const renderDynamicQuestion = () => {
//     const q = questionsData.find(x => x.id === currentScreen);
//     if (!q) return null;
//     const isMulti = q.type === 'multi_select';
//     const isNextDisabled = checkNextDisabled(q.id);

//     return (
//       <div className="animate-fadeUp relative z-20 ">
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/20 bg-lime-500/10 text-[#C5D82D] text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
//           {q.category}
//         </div>
        
//         <div className="font-serif text-[clamp(1.5rem,3vw,2rem)] font-bold text-white leading-[1.2] mb-3">
//           {q.text}
//         </div>
        
//         {q.sub_text && (
//           <div className="text-[0.95rem] text-gray-400 mb-8 leading-[1.6]">
//             {q.sub_text}
//           </div>
//         )}
        
//         {q.type === 'input' && q.fields && (
//   <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 md:gap-4 mb-6">
//     {q.fields.map(field => (
//               <div key={field.id}>
//                 <label className="block text-[0.65rem] font-bold tracking-[0.15em] uppercase text-gray-400 mb-2">
//                   {field.label}
//                 </label>
//                 {field.type === 'number' ? (
//                   <input 
//                     type="number" 
//                     min={field.min} 
//                     max={field.max} 
//                     placeholder={field.placeholder} 
//                     value={age || ''} 
//                     onChange={(e) => setAge(parseInt(e.target.value) || null)} 
//                     className="w-full py-3 px-4 bg-black/40 border-[1.5px] border-white/10 text-white font-['DM_Sans',sans-serif] text-[1rem] rounded-lg outline-none transition-all duration-200 focus:border-[#C5D82D] focus:shadow-[0_0_10px_rgba(197,216,45,0.15)] placeholder-gray-600" 
//                   />
//                 ) : (
//                   <select 
//                     value={gender} 
//                     onChange={(e) => setGender(e.target.value)} 
//                     className="w-full py-3 px-4 bg-black/40 border-[1.5px] border-white/10 text-white font-['DM_Sans',sans-serif] text-[1rem] rounded-lg outline-none transition-all duration-200 focus:border-[#C5D82D] focus:shadow-[0_0_10px_rgba(197,216,45,0.15)] appearance-none cursor-pointer bg-no-repeat bg-[right_1rem_center] pr-10" 
//                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")` }}
//                   >
//                     <option value="" className="bg-[#0f1114] text-gray-400">Select</option>
//                     {field.options?.map(o => (
//                       <option key={o.value} value={o.value} className="bg-[#0f1114] text-white">
//                         {o.label}
//                       </option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {(q.type === 'single_select' || q.type === 'multi_select') && q.options && (
//   <div className="grid grid-cols-1 sm:grid-cols-2  gap-3 md:gap-4 ">
//     {q.options.map((opt) => (
//               <OptionBtn 
//                 key={opt.index} 
//                 qId={q.id} 
//                 idx={opt.index} 
//                 icon={opt.icon} 
//                 label={opt.label} 
//                 sub={opt.sub_label || undefined} 
//                 isMulti={isMulti} 
//                 isSelected={isMulti ? multiSelections[q.id]?.has(opt.index) : singleSelections[q.id] === opt.index} 
//                 onClick={() => { 
//                   if (isMulti) { 
//                     toggleMultiOpt(q.id, opt.index, q.options!.map(o => o.score)); 
//                   } else { 
//                     selectSingleOpt(q.id, opt.index, opt.score); 
//                   } 
//                 }} 
//               />
//             ))}
//           </div>
//         )}

//         <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8">
//   {q.order > 1 && (
//     <button 
//       onClick={() => goTo(q.order - 1)} 
//       className="w-full sm:w-auto py-3 px-6 bg-transparent border border-white/20 text-gray-300 font-bold text-[0.9rem] rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:bg-white/5 hover:text-white"
//     >
//       <i className="fas fa-arrow-left text-sm"></i> Back
//     </button>
//   )}
//   {q.order < TOTAL_Q ? (
//     <button 
//       disabled={isNextDisabled} 
//       onClick={() => goTo(q.order + 1)} 
//       className="w-full sm:w-64 py-3 px-6 bg-[#C5D82D] text-black font-bold text-[1rem] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:not(:disabled):bg-white hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):shadow-[0_0_20px_rgba(163,230,53,0.3)] uppercase tracking-wide"
//     >
//       Next <i className="fas fa-arrow-right text-sm"></i>
//     </button>
//   ) : (
//     <button 
//       disabled={isNextDisabled} 
//       onClick={calculate} 
//       className="w-full sm:w-64 py-3 px-6 bg-[#C5D82D] text-black font-bold text-[1rem] rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:not(:disabled):bg-white hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):shadow-[0_0_20px_rgba(163,230,53,0.3)] uppercase tracking-wide"
//     >
//       See My Result <i className="fas fa-arrow-right text-sm"></i>
//     </button>
//   )}
// </div>
//       </div>
//     );
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
//          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{__html: `
//         @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:none} }
//         .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
//       `}} />
      
//       {/* Changed to min-h-[100dvh] for better mobile viewport support */}
//       <div id="longevity-assessment" ref={componentRef} className="font-['DM_Sans',sans-serif] bg-[#0f1114] text-white w-full min-h-[100dvh] overflow-x-hidden relative leading-[1.6]">
        
//         {/* Changed absolute to fixed so the glow backgrounds stay put during scrolling */}
//         <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
//         <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

//         {renderProgressBar()}

//         <div className="max-w-5xl mx-auto px-5 pt-10 pb-24 md:px-4 md:pt-14 relative z-10">
          
//           {currentScreen.startsWith('q') && renderDynamicQuestion()}

//           {currentScreen === 'calc' && (
//             <div className="text-center py-16 px-4 animate-fadeUp">
//               <div className="w-[100px] h-[100px] mx-auto mb-8 relative">
//                 <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(197,216,45,0.2)]">
//                   <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
//                   <circle 
//                     cx="45" cy="45" r="40" fill="none" stroke="#C5D82D" strokeWidth="6" strokeDasharray="251" 
//                     strokeDashoffset={251 - (251 * calcProgress / 100)} strokeLinecap="round" 
//                     className="transition-[stroke-dashoffset] duration-500 ease" 
//                   />
//                 </svg>
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[1.4rem] font-bold text-white">
//                   {calcProgress}%
//                 </div>
//               </div>
              
//               <div className="font-serif text-[1.6rem] font-bold text-white mb-2 leading-tight">
//                 Calculating your longevity score…
//               </div>
//               <div className="text-[0.9rem] text-gray-400 mb-8">
//                 Analysing {TOTAL_Q} biological markers
//               </div>
              
//               <div className="flex flex-col gap-3 mt-6 mx-auto max-w-[300px] text-left">
//                 {[
//                   "Energy & recovery patterns", "Digestive health signals", "Visceral fat & body composition", 
//                   "Metabolic markers from reports", "Indian genetic risk profile", "Dietary pattern analysis"
//                 ].map((text, i) => (
//                   <div key={i} className={`flex items-center gap-3 text-[0.85rem] font-medium transition-all duration-300 ${activeSteps[i] ? 'opacity-100 text-gray-200' : 'opacity-40 text-gray-500 translate-y-2'}`}>
//                     <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${activeSteps[i] ? 'bg-[#C5D82D] shadow-[0_0_8px_rgba(197,216,45,0.6)]' : 'bg-gray-700'}`}></div>
//                     {text}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }






"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Screen, Question, QuizMeta, ApiResultData, StoredResult 
} from '@/types/longevity';

export default function LongevityTestPage() {
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  // --- API DATA STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [quizMeta, setQuizMeta] = useState<QuizMeta | null>(null);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);

  // --- USER INPUT STATE ---
  const [currentScreen, setCurrentScreen] = useState<Screen>('q1');
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string>('');
  
  const [singleSelections, setSingleSelections] = useState<Record<string, number>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, Set<number>>>({
    q6: new Set(),
    q7: new Set()
  });
  
  const [scores, setScores] = useState<Record<string, number>>({});
  const [calcProgress, setCalcProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<boolean[]>([false, false, false, false, false, false]);

  const TOTAL_Q = quizMeta?.total_questions || 8;
  const currentQNum = currentScreen.startsWith('q') ? parseInt(currentScreen.replace('q', '')) : 0;

  useEffect(() => {
    // 1. Fetch Questions
    fetch('https://medicaps.cloud/api/questionnaire/longevity/questions')
      .then(res => res.json())
      .then(data => {
        if (data.quiz && data.questions) {
          setQuizMeta(data.quiz);
          setQuestionsData(data.questions);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch questions:", err);
        setIsLoading(false);
      });

    // 2. Check Local Storage
    const saved = localStorage.getItem('grasa_longevity_result');
    if (saved) {
      try {
        const parsed: StoredResult = JSON.parse(saved);
        const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;
        
        if (Date.now() - parsed.timestamp < oneMonthInMs) {
          router.push('/longevity-test/result');
        } else {
          localStorage.removeItem('grasa_longevity_result');
        }
      } catch (err) {
        localStorage.removeItem('grasa_longevity_result');
      }
    }
  }, [router]);

  const saveToLocalAndRedirect = (res: ApiResultData, payload: any) => {
    const data: StoredResult = {
      result: res,
      isUnlocked: false,
      age: age,
      scores: scores,
      payload: payload,
      timestamp: Date.now()
    };
    localStorage.setItem('grasa_longevity_result', JSON.stringify(data));
    router.push('/longevity-test/result');
  };

  const scrollToTop = () => {
    if (componentRef.current) {
      const offset = 44;
      const elementPosition = componentRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  const goTo = (n: number) => {
    setCurrentScreen(`q${n}` as Screen);
    scrollToTop();
  };

  const checkNextDisabled = (qId: string) => {
    const q = questionsData.find(x => x.id === qId);
    if (!q) return true;
    if (q.type === 'input') return !(age && age >= 18 && age <= 90 && gender);
    if (q.type === 'single_select') return singleSelections[qId] === undefined;
    if (q.type === 'multi_select') return !multiSelections[qId] || multiSelections[qId].size === 0;
    return true;
  };

  const selectSingleOpt = (qId: string, idx: number, score: number) => {
    setSingleSelections(prev => ({ ...prev, [qId]: idx }));
    setScores(prev => ({ ...prev, [qId]: score }));
  };

  const toggleMultiOpt = (qId: string, idx: number, optScores: number[]) => {
    setMultiSelections(prev => {
      const newSet = new Set(prev[qId]);
      if (idx === 0) {
        newSet.clear();
        newSet.add(0);
      } else {
        newSet.delete(0);
        if (newSet.has(idx)) newSet.delete(idx);
        else newSet.add(idx);
      }
      
      let totalScore = 0;
      newSet.forEach(selectedIndex => { totalScore += optScores[selectedIndex] || 0; });
      setScores(s => ({ ...s, [qId]: totalScore }));
      return { ...prev, [qId]: newSet };
    });
  };

  const calculate = async () => {
    setCurrentScreen('calc');
    scrollToTop();

    setActiveSteps([false, false, false, false, false, false]);
    setCalcProgress(0);

    const payload = {
      q1_age: age || 0,
      q1_gender: gender || "",
      q2_answer_index: singleSelections.q2 ?? 0,
      q3_answer_index: singleSelections.q3 ?? 0,
      q4_answer_index: singleSelections.q4 ?? 0,
      q5_answer_index: singleSelections.q5 ?? 0,
      q6_selected_indices: Array.from(multiSelections.q6 || []),
      q7_selected_indices: Array.from(multiSelections.q7 || []),
      q8_answer_index: singleSelections.q8 ?? 0,
      whatsapp_number: ""
    };

    let fetchedResult: ApiResultData | null = null;
    
    try {
      const res = await fetch("https://medicaps.cloud/api/questionnaire/longevity/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) fetchedResult = await res.json();
    } catch (err) {
      console.error(err);
    }

    const steps = [0, 1, 2, 3, 4, 5];
    steps.forEach((i) => {
      setTimeout(() => {
        setActiveSteps(prev => { const next = [...prev]; next[i] = true; return next; });
        setCalcProgress(Math.round(((i + 1) / steps.length) * 100));
      }, i * 350 + 200);
    });

    setTimeout(() => {
      if (fetchedResult) {
        saveToLocalAndRedirect(fetchedResult, payload);
      } else {
        alert("There was an error calculating your results. Please try again.");
        setCurrentScreen('q1');
      }
    }, steps.length * 350 + 700);
  };

  const renderProgressBar = () => {
    if (['calc'].includes(currentScreen)) return null;
    const pct = Math.round(((currentQNum - 1) / TOTAL_Q) * 100);

    return (
      <div className="sticky top-0 z-40 border-b border-white/5 px-4 md:px-8 py-4 bg-[#0f1114]/90 backdrop-blur-md">
        <div className="max-w-[620px] mx-auto flex justify-between items-center mb-2">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Question {currentQNum} of {TOTAL_Q}</span>
          <span className="text-xs font-bold text-[#C5D82D]">{pct}%</span>
        </div>
        <div className="max-w-[620px] mx-auto h-[4px] bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-[#C5D82D] shadow-[0_0_10px_rgba(197,216,45,0.5)]" 
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const OptionBtn = ({ qId, idx, icon, label, sub, isSelected, onClick, isMulti = false }: any) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-4 px-5 py-4 bg-black/40 backdrop-blur-sm border-[1.5px] rounded-xl cursor-pointer transition-all duration-200 text-left w-full h-full 
    ${isSelected 
      ? 'border-[#C5D82D] bg-[#C5D82D]/10 shadow-[0_0_15px_rgba(197,216,45,0.1)]' 
      : 'border-white/10 hover:border-white/30 hover:bg-white/5'
    }`}
  >
    <span className="text-2xl shrink-0 w-8 text-center">{icon}</span>
    <span className="flex-1">
      <span className="text-base font-bold text-white block leading-snug">{label}</span>
      {sub && <span className="text-xs text-gray-400 mt-1 block leading-relaxed">{sub}</span>}
    </span>
    <span 
      className={`w-5 h-5 border-[1.5px] shrink-0 flex items-center justify-center transition-all duration-200 text-[0.65rem] 
      ${isMulti ? 'rounded-[4px]' : 'rounded-full'} 
      ${isSelected ? 'bg-[#C5D82D] border-[#C5D82D] text-black' : 'border-gray-500 text-transparent'}`}
    >
      <i className="fas fa-check"></i>
    </span>
  </button>
);

  const renderDynamicQuestion = () => {
    const q = questionsData.find(x => x.id === currentScreen);
    if (!q) return null;
    const isMulti = q.type === 'multi_select';
    const isNextDisabled = checkNextDisabled(q.id);

    return (
      <div className="animate-fadeUp relative z-20 ">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/20 bg-lime-500/10 text-[#C5D82D] text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
          {q.category}
        </div>
        
        <div className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white leading-[1.15] mb-4">
          {q.text}
        </div>
        
        {q.sub_text && (
          <div className="text-base sm:text-lg text-gray-400 mb-8 leading-relaxed">
            {q.sub_text}
          </div>
        )}
        
        {q.type === 'input' && q.fields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
            {q.fields.map(field => (
              <div key={field.id}>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">
                  {field.label}
                </label>
                {field.type === 'number' ? (
                  <input 
                    type="number" 
                    min={field.min} 
                    max={field.max} 
                    placeholder={field.placeholder} 
                    value={age || ''} 
                    onChange={(e) => setAge(parseInt(e.target.value) || null)} 
                    className="w-full py-4 px-5 bg-black/40 border-[1.5px] border-white/10 text-white text-base rounded-xl outline-none transition-all duration-200 focus:border-[#C5D82D] focus:shadow-[0_0_15px_rgba(197,216,45,0.1)] placeholder-gray-600" 
                  />
                ) : (
                  <select 
                    value={gender} 
                    onChange={(e) => setGender(e.target.value)} 
                    className="w-full py-4 px-5 bg-black/40 border-[1.5px] border-white/10 text-white text-base rounded-xl outline-none transition-all duration-200 focus:border-[#C5D82D] focus:shadow-[0_0_15px_rgba(197,216,45,0.1)] appearance-none cursor-pointer bg-no-repeat bg-[right_1rem_center] pr-10" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")` }}
                  >
                    <option value="" className="bg-[#0f1114] text-gray-400">Select</option>
                    {field.options?.map(o => (
                      <option key={o.value} value={o.value} className="bg-[#0f1114] text-white">
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        {(q.type === 'single_select' || q.type === 'multi_select') && q.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 ">
            {q.options.map((opt) => (
              <OptionBtn 
                key={opt.index} 
                qId={q.id} 
                idx={opt.index} 
                icon={opt.icon} 
                label={opt.label} 
                sub={opt.sub_label || undefined} 
                isMulti={isMulti} 
                isSelected={isMulti ? multiSelections[q.id]?.has(opt.index) : singleSelections[q.id] === opt.index} 
                onClick={() => { 
                  if (isMulti) { 
                    toggleMultiOpt(q.id, opt.index, q.options!.map(o => o.score)); 
                  } else { 
                    selectSingleOpt(q.id, opt.index, opt.score); 
                  } 
                }} 
              />
            ))}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-4 mt-10">
          {q.order > 1 && (
            <button 
              onClick={() => goTo(q.order - 1)} 
              className="w-full sm:w-auto py-4 px-8 bg-transparent border border-white/20 text-gray-300 font-bold text-sm rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white/5 hover:text-white uppercase tracking-widest"
            >
              <span>←</span> Back
            </button>
          )}
          {q.order < TOTAL_Q ? (
            <button 
              disabled={isNextDisabled} 
              onClick={() => goTo(q.order + 1)} 
              className="w-full sm:w-64 py-4 px-8 bg-[#C5D82D] text-black font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:not(:disabled):bg-[#d9ed3d] hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-[0_10px_30px_rgba(197,216,45,0.2)] uppercase tracking-widest"
            >
              Next <span>→</span>
            </button>
          ) : (
            <button 
              disabled={isNextDisabled} 
              onClick={calculate} 
              className="w-full sm:w-64 py-4 px-8 bg-[#C5D82D] text-black font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:not(:disabled):bg-[#d9ed3d] hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-[0_10px_30px_rgba(197,216,45,0.2)] uppercase tracking-widest"
            >
              See My Result <span>→</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
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
      
      <div id="longevity-assessment" ref={componentRef} className="bg-[#0f1114] text-white w-full min-h-[100dvh] overflow-x-hidden relative leading-relaxed">
        
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

        {renderProgressBar()}

        <div className="max-w-5xl mx-auto px-6 pt-10 pb-24 md:px-8 md:pt-14 relative z-10">
          
          {currentScreen.startsWith('q') && renderDynamicQuestion()}

          {currentScreen === 'calc' && (
            <div className="text-center py-16 px-4 animate-fadeUp">
              <div className="w-[100px] h-[100px] mx-auto mb-10 relative">
                <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(197,216,45,0.2)]">
                  <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle 
                    cx="45" cy="45" r="40" fill="none" stroke="#C5D82D" strokeWidth="6" strokeDasharray="251" 
                    strokeDashoffset={251 - (251 * calcProgress / 100)} strokeLinecap="round" 
                    className="transition-[stroke-dashoffset] duration-500 ease" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
                  {calcProgress}%
                </div>
              </div>
              
              <div className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                Calculating your <br className="sm:hidden"/> longevity score…
              </div>
              <div className="text-base text-gray-500 mb-10 uppercase tracking-widest font-bold">
                Analysing {TOTAL_Q} biological markers
              </div>
              
              <div className="flex flex-col gap-4 mt-6 mx-auto max-w-[320px] text-left">
                {[
                  "Energy & recovery patterns", "Digestive health signals", "Visceral fat & body composition", 
                  "Metabolic markers from reports", "Indian genetic risk profile", "Dietary pattern analysis"
                ].map((text, i) => (
                  <div key={i} className={`flex items-center gap-4 text-sm font-bold transition-all duration-300 ${activeSteps[i] ? 'opacity-100 text-gray-200' : 'opacity-20 text-gray-600'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${activeSteps[i] ? 'bg-[#C5D82D] shadow-[0_0_10px_rgba(197,216,45,0.6)]' : 'bg-gray-800'}`}></div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}