

// "use client";

// import React, { useState, useRef, useEffect } from 'react';
// import Head from 'next/head';

// type Screen = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'calc' | 'result';

// // --- API TYPES ---
// type QuestionOption = {
//   index: number;
//   icon: string;
//   label: string;
//   sub_label: string | null;
//   score: number;
// };

// type QuestionField = {
//   id: string;
//   label: string;
//   type: string;
//   placeholder?: string;
//   min?: number;
//   max?: number;
//   required: boolean;
//   options?: { value: string; label: string }[];
// };

// type Question = {
//   id: string;
//   order: number;
//   category: string;
//   type: 'input' | 'single_select' | 'multi_select';
//   text: string;
//   sub_text: string | null;
//   fields?: QuestionField[];
//   options?: QuestionOption[];
// };

// type QuizMeta = {
//   title: string;
//   description: string;
//   total_questions: number;
//   estimated_duration_minutes: number;
//   target_population: string;
// };

// type ApiFlag = {
//   id: string;
//   icon: string;
//   title: string;
//   severity: string;
//   tag: string;
//   desc?: string;
// };

// type ApiResultData = {
//   calendar_age: number;
//   biological_age: number;
//   longevity_score: number;
//   bio_delta: number;
//   result_band: string;
//   result_message: string;
//   flags: ApiFlag[];
// };

// export default function GrasaLongevityCheck() {
//   // --- REFS ---
//   const componentRef = useRef<HTMLDivElement>(null);

//   // --- API DATA STATE ---
//   const [isLoading, setIsLoading] = useState(true);
//   const [quizMeta, setQuizMeta] = useState<QuizMeta | null>(null);
//   const [questionsData, setQuestionsData] = useState<Question[]>([]);
//   const [apiResult, setApiResult] = useState<ApiResultData | null>(null);

//   // --- USER INPUT STATE ---
//   const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
//   const [age, setAge] = useState<number | null>(null);
//   const [gender, setGender] = useState<string>('');
  
//   // Selections
//   const [singleSelections, setSingleSelections] = useState<Record<string, number>>({});
//   const [multiSelections, setMultiSelections] = useState<Record<string, Set<number>>>({
//     q6: new Set(),
//     q7: new Set()
//   });
  
//   // Local score tracking for Action Cards (since API provides scores per option)
//   const [scores, setScores] = useState<Record<string, number>>({});

//   // Calculation & Results State
//   const [calcProgress, setCalcProgress] = useState(0);
//   const [activeSteps, setActiveSteps] = useState<boolean[]>([false, false, false, false, false, false]);
//   const [isUnlocked, setIsUnlocked] = useState(false);
//   const [waNumber, setWaNumber] = useState('');

//   const [isUnlocking, setIsUnlocking] = useState(false);

//   const TOTAL_Q = quizMeta?.total_questions || 8;
//   const currentQNum = currentScreen.startsWith('q') ? parseInt(currentScreen.replace('q', '')) : 0;

//   // --- FETCH QUESTIONS ON MOUNT ---
//   useEffect(() => {
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
//   }, []);

//   // --- SCROLL HELPER ---
//   const scrollToTop = () => {
//     if (componentRef.current) {
//       const offset = 74;
//       const elementPosition = componentRef.current.getBoundingClientRect().top + window.pageYOffset;
//       const offsetPosition = elementPosition - offset;

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: "smooth",
//       });
//     }
//   };

//   const startTest = () => {
//     setCurrentScreen('q1');
//     scrollToTop();
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
//       newSet.forEach(selectedIndex => {
//         totalScore += optScores[selectedIndex] || 0;
//       });
//       setScores(s => ({ ...s, [qId]: totalScore }));

//       return { ...prev, [qId]: newSet };
//     });
//   };

//   // --- SUBMISSION LOGIC ---
//   const submitToApi = async (phone: string = "") => {
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
//       whatsapp_number: phone
//     };

//     const res = await fetch("https://medicaps.cloud/api/questionnaire/longevity/submit", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload)
//     });

//     if (!res.ok) throw new Error("API Submission failed");
//     const data: ApiResultData = await res.json();
//     setApiResult(data);
//   };

//   const calculate = async () => {
//     setCurrentScreen('calc');
//     scrollToTop();

//     setActiveSteps([false, false, false, false, false, false]);
//     setCalcProgress(0);

//     // Call partial API submission
//     try {
//       await submitToApi("");
//     } catch (err) {
//       console.error(err);
//     }

//     const steps = [0, 1, 2, 3, 4, 5];
//     steps.forEach((i) => {
//       setTimeout(() => {
//         setActiveSteps(prev => {
//           const next = [...prev];
//           next[i] = true;
//           return next;
//         });
//         setCalcProgress(Math.round(((i + 1) / steps.length) * 100));
//       }, i * 350 + 200);
//     });

//     setTimeout(() => {
//       setCurrentScreen('result');
//       scrollToTop();
//     }, steps.length * 350 + 700);
//   };

//   // const unlockResult = async () => {
//   //   const num = waNumber.trim().replace(/\D/g, '');
//   //   if (num.length < 10) {
//   //     alert("Please enter a valid 10-digit number.");
//   //     return;
//   //   }
    
//   //   try {
//   //     // Re-submit with whatsapp number to get the full report
//   //     await submitToApi(waNumber);
//   //     setIsUnlocked(true);
//   //     scrollToTop();
//   //   } catch (err) {
//   //     console.error("Failed to unlock report:", err);
//   //     alert("Something went wrong processing your request.");
//   //   }
//   // };



//   const unlockResult = async () => {
//   const num = waNumber.trim().replace(/\D/g, '');
//   if (num.length < 10) {
//     alert("Please enter a valid 10-digit number.");
//     return;
//   }
  
//   setIsUnlocking(true); // Start Loader
//   try {
//     await submitToApi(waNumber);
//     setIsUnlocked(true);
//     scrollToTop();
//   } catch (err) {
//     console.error("Failed to unlock report:", err);
//     alert("Something went wrong processing your request.");
//   } finally {
//     setIsUnlocking(false); // Stop Loader
//   }
// };





//   const openWA = () => {
//     const msg = encodeURIComponent(`Hi GRASA, I just completed the Longevity Check. My longevity score is ${apiResult?.longevity_score || 0}/100 and my estimated biological age is ${apiResult?.biological_age || age}. I'd like to discuss my full report with your doctor.`);
//     window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
//   };

//   // --- FALLBACK LOGIC FOR BLURRED CARDS & ACTIONS ---
//   // If the API only returns 2 flags before unlocking, we pad it with local dummy flags to blur them out.
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
//     if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health. GRASA\'s specially made grain food is built specifically for this.' });
//     if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: 'Given your family history, a comprehensive metabolic panel — sugar, cholesterol, liver, thyroid — gives you a true picture of where you are. Don\'t wait for symptoms.' });
//     if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. No food programme or supplement can fully compensate for consistently poor sleep. This needs to be addressed alongside diet.' });
    
//     actions.push({ icon: '📞', title: 'Talk to our doctor — before spending anything', desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call — so the conversation starts with your actual picture, not from scratch. Free. 20 minutes. No obligation.' });

//     return actions;
//   };

//   // --- RENDER HELPERS ---
//   const renderProgressBar = () => {
//     if (['intro', 'calc', 'result'].includes(currentScreen)) return null;
//     const pct = Math.round(((currentQNum - 1) / TOTAL_Q) * 100);

//     return (
//       <div className="bg-[#faf8f3] border-b border-[#e3d9c9] px-[2rem] py-[0.5rem]">
//         <div className="max-w-[620px] mx-auto flex justify-between items-center mb-[0.4rem]">
//           <span className="text-[0.68rem] font-semibold text-[#7d7464]">Question {currentQNum} of {TOTAL_Q}</span>
//           <span className="text-[0.68rem] text-[#7d7464]">{pct}%</span>
//         </div>
//         <div className="max-w-[620px] mx-auto h-[4px] bg-[#e3d9c9] rounded-[2px] overflow-hidden">
//           <div 
//             className="h-full rounded-[2px] transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" 
//             style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1b5438, #226b45)' }}
//           ></div>
//         </div>
//       </div>
//     );
//   };

//   const OptionBtn = ({ 
//     qId, idx, icon, label, sub, isSelected, onClick, isMulti = false 
//   }: { qId: string, idx: number, icon: string, label: string, sub?: string, isSelected: boolean, onClick: () => void, isMulti?: boolean }) => (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-[0.9rem] px-[1.15rem] py-[0.95rem] bg-white border-[1.5px] rounded-[9px] cursor-pointer transition-all duration-[0.18s] text-left w-full font-['DM_Sans',sans-serif] hover:border-[#1b5438] hover:bg-[#eaf6ee] ${isSelected ? 'border-[#1b5438] bg-[#eaf6ee] shadow-[0_0_0_3px_rgba(27,84,56,.1)]' : 'border-[#e3d9c9]'}`}
//     >
//       <span className="text-[1.3rem] shrink-0 w-[32px] text-center">{icon}</span>
//       <span className="flex-1">
//         <span className="text-[0.9rem] font-semibold text-[#1a1710] block leading-[1.3]">{label}</span>
//         {sub && <span className="text-[0.72rem] text-[#7d7464] mt-[0.15rem] block">{sub}</span>}
//       </span>
//       <span className={`w-[20px] h-[20px] border-[1.5px] shrink-0 flex items-center justify-center transition-all duration-[0.18s] text-[0.65rem] text-white ${isMulti ? 'rounded-[4px]' : 'rounded-full'} ${isSelected ? 'bg-[#1b5438] border-[#1b5438]' : 'border-[#e3d9c9]'}`}>
//         <i className="fas fa-check"></i>
//       </span>
//     </button>
//   );

//   const renderDynamicQuestion = () => {
//     const q = questionsData.find(x => x.id === currentScreen);
//     if (!q) return null;

//     const isMulti = q.type === 'multi_select';
//     const isNextDisabled = checkNextDisabled(q.id);

//     return (
//       <div className="animate-fadeUp">
//         <span className="text-[0.55rem] font-bold tracking-[0.2em] uppercase text-[#1b5438] mb-[0.55rem] block">{q.category}</span>
//         <div className="font-['Fraunces',Georgia,serif] text-[clamp(1.1rem,2.5vw,1.45rem)] font-semibold text-[#1a1710] leading-[1.35] mb-[0.45rem]">{q.text}</div>
//         {q.sub_text && <div className="text-[0.82rem] text-[#7d7464] mb-[1.6rem] leading-[1.65]">{q.sub_text}</div>}
        
//         {/* INPUT FIELDS */}
//         {q.type === 'input' && q.fields && (
//           <div className="grid grid-cols-2 gap-[0.75rem] mb-[0.8rem] md:grid-cols-1">
//             {q.fields.map(field => (
//               <div key={field.id}>
//                 <label className="block text-[0.58rem] font-bold tracking-[0.14em] uppercase text-[#7d7464] mb-[0.3rem]">{field.label}</label>
//                 {field.type === 'number' ? (
//                   <input 
//                     type="number" 
//                     min={field.min} max={field.max} placeholder={field.placeholder}
//                     value={age || ''}
//                     onChange={(e) => setAge(parseInt(e.target.value) || null)}
//                     className="w-full py-[0.8rem] px-[1rem] border-[1.5px] border-[#e3d9c9] bg-white font-['DM_Sans',sans-serif] text-[0.95rem] text-[#1a1710] rounded-[7px] outline-none transition-[border-color] duration-[0.18s] focus:border-[#1b5438] focus:shadow-[0_0_0_3px_rgba(27,84,56,.08)]"
//                   />
//                 ) : (
//                   <select 
//                     value={gender}
//                     onChange={(e) => setGender(e.target.value)}
//                     className="w-full py-[0.8rem] px-[1rem] border-[1.5px] border-[#e3d9c9] bg-white font-['DM_Sans',sans-serif] text-[0.95rem] text-[#1a1710] rounded-[7px] outline-none transition-[border-color] duration-[0.18s] focus:border-[#1b5438] focus:shadow-[0_0_0_3px_rgba(27,84,56,.08)] appearance-none cursor-pointer bg-no-repeat bg-[right_0.9rem_center] pr-[2.5rem]"
//                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237d7464' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")` }}
//                   >
//                     <option value="">Select</option>
//                     {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//                   </select>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* OPTIONS */}
//         {(q.type === 'single_select' || q.type === 'multi_select') && q.options && (
//           <div className="flex flex-col gap-[0.65rem]">
//             {q.options.map((opt) => (
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

//         {/* NAVIGATION CONTROLS */}
//         <div className="flex gap-[0.75rem] mt-[1.8rem]">
//           {q.order > 1 && (
//             <button onClick={() => goTo(q.order - 1)} className="py-[0.8rem] px-[1.4rem] bg-transparent border-[1.5px] border-[#e3d9c9] text-[#7d7464] font-['DM_Sans',sans-serif] font-semibold text-[0.82rem] rounded-[7px] cursor-pointer transition-all duration-[0.18s] flex items-center gap-[0.4rem] hover:border-[#1a1710] hover:text-[#1a1710]"><i className="fas fa-arrow-left"></i> Back</button>
//           )}
//           {q.order < TOTAL_Q ? (
//             <button disabled={isNextDisabled} onClick={() => goTo(q.order + 1)} className="flex-1 py-[0.9rem] px-[1.4rem] bg-[#1b5438] text-white font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] transition-all duration-[0.2s] flex items-center justify-center gap-[0.45rem] disabled:opacity-35 disabled:cursor-not-allowed hover:not(:disabled):bg-[#226b45] hover:not(:disabled):-translate-y-[1px] hover:not(:disabled):shadow-[0_8px_20px_rgba(27,84,56,.25)]">Next <i className="fas fa-arrow-right"></i></button>
//           ) : (
//             <button disabled={isNextDisabled} onClick={calculate} className="flex-1 py-[0.9rem] px-[1.4rem] bg-[#1b5438] text-white font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] transition-all duration-[0.2s] flex items-center justify-center gap-[0.45rem] disabled:opacity-35 disabled:cursor-not-allowed hover:not(:disabled):bg-[#226b45] hover:not(:disabled):-translate-y-[1px] hover:not(:disabled):shadow-[0_8px_20px_rgba(27,84,56,.25)]">See My Result <i className="fas fa-arrow-right"></i></button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Derived styling for API Results
//   let bandColor = '#1b5438';
//   if (apiResult) {
//     const band = apiResult.result_band.toLowerCase();
//     if (band === 'excellent') bandColor = '#226b45';
//     else if (band === 'good') bandColor = '#2a7d5a';
//     else if (band === 'moderate') bandColor = '#d4700f';
//     else if (band === 'elevated') bandColor = '#c05a28';
//     else if (band === 'high') bandColor = '#c0392b';
//   }

//   const apiFlags = apiResult?.flags || [];
//   const displayFlags = isUnlocked ? apiFlags : [...apiFlags, ...getLocalDummyFlags().slice(0, 6 - apiFlags.length)];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#faf8f3] flex items-center justify-center">
//          <div className="w-[40px] h-[40px] rounded-full border-4 border-[#e3d9c9] border-t-[#1b5438] animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Head>
//         <title>{quizMeta?.title || "GRASA Longevity Check"}</title>
//         <meta name="viewport" content="width=device-width,initial-scale=1" />
//         <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
//         <style>{`
//           @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
//           @keyframes fadeUp { from{opacity:0; transform:translateY(18px)} to{opacity:1; transform:none} }
//           .animate-fadeUp { animation: fadeUp 0.4s ease both; }
//         `}</style>
//       </Head>

//       <div ref={componentRef} className="font-['DM_Sans',sans-serif] bg-[#faf8f3] text-[#1a1710] w-full overflow-x-hidden leading-[1.6]">
//         {renderProgressBar()}

//         <div className="max-w-[620px] mx-auto px-[1.5rem] pt-[2.5rem] pb-[5rem] md:px-[1rem] md:pt-[1.8rem] md:pb-[6rem]">
          
//           {/* INTRO SCREEN */}
//           {currentScreen === 'intro' && (
//             <div className="text-center animate-fadeUp">
//               <div className="inline-flex items-center gap-[0.4rem] bg-[#eaf6ee] border border-[#1b543826] py-[0.32rem] px-[0.9rem] rounded-[20px] text-[0.62rem] font-bold tracking-[0.1em] uppercase text-[#1b5438] mb-[1.4rem]">
//                 <i className="fas fa-seedling"></i> Free Longevity Check
//               </div>
//               <h1 className="font-['Fraunces',Georgia,serif] text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-[#1a1710] leading-[1.15] mb-[0.9rem]">
//                 How old is your body <br/><em className="text-[#1b5438] not-italic italic">really?</em>
//               </h1>
//               <p className="text-[0.95rem] text-[#7d7464] leading-[1.8] max-w-[480px] mx-auto mb-[1.8rem]">
//                 {quizMeta?.description || "Your calendar age is just a number. Your biological age — how well your body is actually working — can be very different. This 8-question check gives you an honest picture in 2 minutes."}
//               </p>
//               <div className="flex justify-center gap-[2rem] mb-[2rem] flex-wrap">
//                 <div className="text-center"><div className="font-['Fraunces',Georgia,serif] text-[1.7rem] font-bold text-[#1b5438]">{TOTAL_Q}</div><div className="text-[0.65rem] text-[#7d7464] mt-[0.1rem]">Questions</div></div>
//                 <div className="w-[1px] bg-[#e3d9c9] self-stretch"></div>
//                 <div className="text-center"><div className="font-['Fraunces',Georgia,serif] text-[1.7rem] font-bold text-[#1b5438]">{quizMeta?.estimated_duration_minutes || 2} min</div><div className="text-[0.65rem] text-[#7d7464] mt-[0.1rem]">To complete</div></div>
//                 <div className="w-[1px] bg-[#e3d9c9] self-stretch"></div>
//                 <div className="text-center"><div className="font-['Fraunces',Georgia,serif] text-[1.7rem] font-bold text-[#1b5438]">Free</div><div className="text-[0.65rem] text-[#7d7464] mt-[0.1rem]">Always</div></div>
//               </div>
//               <button 
//                 onClick={startTest}
//                 className="w-full p-[1.1rem] bg-[#1b5438] text-white font-['DM_Sans',sans-serif] font-bold text-[1rem] border-none rounded-[8px] cursor-pointer tracking-[0.02em] transition-all duration-[0.2s] mt-[1.2rem] flex items-center justify-center gap-[0.5rem] hover:bg-[#226b45] hover:-translate-y-[2px] hover:shadow-[0_10px_28px_rgba(27,84,56,.25)]"
//               >
//                 Start My Longevity Check <i className="fas fa-arrow-right text-[0.85rem]"></i>
//               </button>
//               <div className="text-[0.65rem] text-[#7d7464] bg-[#f4ede0] border border-[#e3d9c9] rounded-[6px] py-[0.6rem] px-[0.9rem] text-left mt-[1.5rem] leading-[1.7]">
//                 <strong className="text-[#1a1710]">Important:</strong> This is a wellness screener — not a medical diagnosis. It is designed to give you a useful starting picture based on well-established Indian health research. If you have existing health conditions, always consult your doctor. GRASA will never use your answers to sell you anything — only to have an honest conversation.
//               </div>
//             </div>
//           )}

//           {/* DYNAMIC QUESTIONS RENDERER */}
//           {currentScreen.startsWith('q') && renderDynamicQuestion()}

//           {/* CALCULATION SCREEN */}
//           {currentScreen === 'calc' && (
//             <div className="text-center py-[3rem] px-[1rem] animate-fadeUp">
//               <div className="w-[90px] h-[90px] mx-auto mb-[1.5rem] relative">
//                 <svg viewBox="0 0 90 90" className="w-[90px] h-[90px] -rotate-90">
//                   <circle cx="45" cy="45" r="40" fill="none" stroke="#e3d9c9" strokeWidth="6" />
//                   <circle cx="45" cy="45" r="40" fill="none" stroke="#1b5438" strokeWidth="6" strokeDasharray="251" strokeDashoffset={251 - (251 * calcProgress / 100)} strokeLinecap="round" className="transition-[stroke-dashoffset] duration-500 ease" />
//                 </svg>
//                 <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-['Fraunces',Georgia,serif] text-[1.2rem] font-bold text-[#1b5438]">{calcProgress}%</div>
//               </div>
//               <div className="font-['Fraunces',Georgia,serif] text-[1.3rem] font-semibold text-[#1a1710] mb-[0.4rem]">Calculating your longevity score…</div>
//               <div className="text-[0.8rem] text-[#7d7464]">Analysing {TOTAL_Q} biological markers</div>
              
//               <div className="flex flex-col gap-[0.5rem] mt-[1.5rem] mx-auto max-w-[280px] text-left">
//                 {[
//                   "Energy & recovery patterns",
//                   "Digestive health signals",
//                   "Visceral fat & body composition",
//                   "Metabolic markers from reports",
//                   "Indian genetic risk profile",
//                   "Dietary pattern analysis"
//                 ].map((text, i) => (
//                   <div key={i} className={`flex items-center gap-[0.65rem] text-[0.78rem] text-[#7d7464] transition-opacity duration-300 ${activeSteps[i] ? 'opacity-100' : 'opacity-0'}`}>
//                     <div className={`w-[8px] h-[8px] rounded-full shrink-0 transition-colors duration-300 ${activeSteps[i] ? 'bg-[#1b5438]' : 'bg-[#e3d9c9]'}`}></div>
//                     {text}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* RESULT SCREEN */}
//           {currentScreen === 'result' && apiResult && (
//             <div className="animate-fadeUp relative pb-[60px]">
              
//               {/* Top Result Band */}
//               <div className="rounded-[14px] p-[1.6rem_1.5rem] mb-[1.4rem] border-[1.5px] border-[#e3d9c9] bg-white">
//                 <div className="flex items-start justify-between gap-[1rem] mb-[1rem]">
//                   <div>
//                     <div className="text-[0.55rem] font-bold tracking-[0.18em] uppercase text-[#7d7464] mb-[0.25rem]">Your estimated biological age</div>
//                     <div className="font-['Fraunces',Georgia,serif] text-[3rem] font-black leading-none" style={{ color: bandColor }}>{apiResult.biological_age}</div>
//                     <div className="flex items-center gap-[0.5rem] mt-[0.6rem] text-[0.78rem] text-[#7d7464]">
//                       <span>Your actual age: <strong className="font-bold text-[#1a1710]">{apiResult.calendar_age || age || 35}</strong></span>
//                       <span className={`inline-flex items-center gap-[0.25rem] px-[0.6rem] py-[0.2rem] rounded-[20px] text-[0.72rem] font-bold ${apiResult.bio_delta > 0 ? 'bg-[#fdecea] text-[#c0392b]' : apiResult.bio_delta < 0 ? 'bg-[#cdeede] text-[#1b5438]' : 'bg-[#fef9ec] text-[#9a6700]'}`}>
//                         {apiResult.bio_delta > 0 ? `+${apiResult.bio_delta} yrs older` : apiResult.bio_delta < 0 ? `${Math.abs(apiResult.bio_delta)} yrs younger` : 'On track'}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="shrink-0 relative w-[80px] h-[80px]">
//                     <svg viewBox="0 0 80 80" className="w-[80px] h-[80px] -rotate-90">
//                       <circle cx="40" cy="40" r="35" fill="none" stroke="#e3d9c9" strokeWidth="6" />
//                       <circle cx="40" cy="40" r="35" fill="none" stroke={bandColor} strokeWidth="6" strokeDasharray="220" strokeDashoffset={220 - (220 * apiResult.longevity_score / 100)} strokeLinecap="round" />
//                     </svg>
//                     <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-['Fraunces',Georgia,serif] text-[1.1rem] font-bold">{apiResult.longevity_score}</div>
//                   </div>
//                 </div>
//                 <div className="text-[0.85rem] text-[#1a1710] leading-[1.72] pt-[0.9rem] border-t border-[#e3d9c9]">{apiResult.result_message}</div>
//               </div>

//               {/* Flag Cards (Using API data, mapped to pad strictly 6 UI cards) */}
//               <div className="text-[0.58rem] font-bold tracking-[0.16em] uppercase text-[#7d7464] mb-[0.75rem]">Your personal health snapshot</div>
//               <div className="flex flex-col gap-[0.6rem] mb-[1.4rem]">
//                 {displayFlags.map((f, i) => (
//                   <div key={i} className={`flex items-start gap-[0.85rem] bg-white border-[1.5px] border-[#e3d9c9] rounded-[10px] p-[1rem_1.1rem] transition-colors duration-200 ${!isUnlocked && i >= apiFlags.length ? 'filter blur-[5px] select-none pointer-events-none opacity-60' : ''}`}>
//                     <div className="text-[1.3rem] shrink-0 mt-[0.05rem]">{f.icon}</div>
//                     <div>
//                       <div className="text-[0.85rem] font-bold text-[#1a1710] mb-[0.2rem]">{f.title}</div>
//                       {f.desc && <div className="text-[0.75rem] text-[#7d7464] leading-[1.65]">{f.desc}</div>}
//                       <span className={`inline-block mt-[0.35rem] text-[0.55rem] font-bold tracking-[0.08em] uppercase px-[0.45rem] py-[0.15rem] rounded-[3px] ${f.severity === 'red' ? 'bg-[#fdecea] text-[#c0392b]' : f.severity === 'amber' ? 'bg-[#fef3e2] text-[#9a5700]' : f.severity === 'gray' ? 'bg-[#f4ede0] text-[#7d7464]' : 'bg-[#cdeede] text-[#1b5438]'}`}>
//                         {f.tag}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Unlock Section */}
//               {!isUnlocked && (
//                 <div id="wa-number" className="bg-gradient-to-br from-[#1b5438] to-[#0f3d27] rounded-[14px] p-[1.8rem_1.5rem] text-center mb-[1.2rem] relative overflow-hidden">
//                   <div className="absolute top-[-40px] right-[-40px] w-[150px] h-[150px] rounded-full bg-white/5 pointer-events-none"></div>
//                   <div className="inline-flex items-center gap-[0.35rem] bg-white/10 border border-white/20 px-[0.75rem] py-[0.25rem] rounded-[20px] text-[0.58rem] font-bold tracking-[0.12em] uppercase text-white/80 mb-[1rem]">
//                     🔒 Full Report Locked
//                   </div>
//                   <div className="font-['Fraunces',Georgia,serif] text-[1.2rem] font-bold text-white mb-[0.4rem] leading-[1.3]">Your full breakdown is ready.<br/>Get it free — takes 10 seconds.</div>
//                   <div className="text-[0.78rem] text-white/55 mb-[1.4rem] leading-[1.65]">Enter your WhatsApp number. We'll send your complete report and offer a free 20-minute call with our doctor — no obligation.</div>
//                   <div className="flex flex-col gap-[0.4rem] mb-[1.4rem] text-left">
//                     {["Full breakdown of all 6 health areas", "What GRASA can specifically do for your profile", "Free 20-min call with our doctor — yours to book"].map((perk, i) => (
//                       <div key={i} className="flex items-center gap-[0.6rem] text-[0.75rem] text-white/75">
//                         <div className="w-[18px] h-[18px] rounded-full bg-white/15 flex items-center justify-center text-[0.55rem] text-[#a8f0cc] shrink-0"><i className="fas fa-check"></i></div>
//                         {perk}
//                       </div>
//                     ))}
//                   </div>
//                   <input 
//                     type="tel" 
//                     placeholder="Your WhatsApp number (e.g. 98XXX XXXXX)" 
//                     maxLength={15}
//                     value={waNumber}
//                     onChange={(e) => setWaNumber(e.target.value)}
//                     className="w-full py-[0.9rem] px-[1rem] bg-white/10 border-[1.5px] border-white/20 rounded-[8px] font-['DM_Sans',sans-serif] text-[0.95rem] text-white outline-none transition-[border-color] duration-[0.18s] mb-[0.7rem] placeholder:text-white/35 focus:border-white/50 focus:bg-white/15"
//                   />
//                   {/* <button onClick={unlockResult} className="w-full p-[1rem] bg-white text-[#1b5438] font-['DM_Sans',sans-serif] font-bold text-[0.95rem] border-none rounded-[8px] cursor-pointer transition-all duration-[0.2s] flex items-center justify-center gap-[0.5rem] hover:bg-[#cdeede] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,.2)]">
//                     <i className="fab fa-whatsapp"></i> Send My Full Report on WhatsApp
//                   </button> */}

//                     <button 
//                       onClick={unlockResult} 
//                       disabled={isUnlocking}
//                       className="w-full p-[1rem] bg-white text-[#1b5438] font-['DM_Sans',sans-serif] font-bold text-[0.95rem] border-none rounded-[8px] cursor-pointer transition-all duration-[0.2s] flex items-center justify-center gap-[0.5rem] hover:bg-[#cdeede] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,.2)] disabled:opacity-70 disabled:cursor-not-allowed"
//                     >
//                       {isUnlocking ? (
//                         <div className="w-[18px] h-[18px] rounded-full border-2 border-[#1b543833] border-t-[#1b5438] animate-spin"></div>
//                       ) : (
//                         <i className="fab fa-whatsapp"></i>
//                       )}
//                       {isUnlocking ? "Processing..." : "Send My Full Report on WhatsApp"}
//                     </button>


//                   <div className="text-[0.6rem] text-white/30 mt-[0.65rem]">We never share your number. No spam — ever.</div>
//                 </div>
//               )}

//               {/* Full Result Content (Post-Unlock) */}
//               {isUnlocked && (
//                 <div className="animate-fadeUp mt-[1.4rem]">
//                   <div className="text-center mb-[1.4rem]">
//                     <h2 className="font-['Fraunces',Georgia,serif] text-[1.5rem] font-bold text-[#1a1710] mb-[0.35rem]">Your personalised action plan</h2>
//                     <p className="text-[0.82rem] text-[#7d7464]">Based on your answers — here is what matters most for your body right now.</p>
//                   </div>
                  
//                   <div className="flex flex-col gap-[0.8rem] mb-[1.4rem]">
//                     {getActionCards().map((a, i) => (
//                       <div key={i} className="bg-white border-[1.5px] border-[#e3d9c9] rounded-[10px] p-[1.1rem_1.2rem] flex gap-[0.9rem] items-start">
//                         <div className="text-[1.4rem] shrink-0">{a.icon}</div>
//                         <div>
//                           <div className="text-[0.88rem] font-bold text-[#1a1710] mb-[0.15rem]">{a.title}</div>
//                           <div className="text-[0.75rem] text-[#7d7464] leading-[1.6]">{a.desc}</div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   <div className="bg-[#f4ede0] border-[1.5px] border-[#e3d9c9] rounded-[12px] p-[1.5rem] text-center mb-[1rem]">
//                     <h3 className="font-['Fraunces',Georgia,serif] text-[1.15rem] font-bold text-[#1a1710] mb-[0.35rem]">Talk to our doctor — it's free.</h3>
//                     <p className="text-[0.78rem] text-[#7d7464] mb-[1.2rem] leading-[1.65]">Your score and answers are already saved. Our doctor will look at your full profile before the call — so you're not starting from scratch.</p>
//                     <div className="flex flex-col gap-[0.6rem]">
//                       <button onClick={() => window.open('tel:+919870263399')} className="p-[0.95rem] bg-[#d4700f] text-white font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] cursor-pointer transition-all duration-[0.2s] flex items-center justify-center gap-[0.5rem] hover:bg-[#e8832a] hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(212,112,15,.3)]">
//                         <i className="fas fa-phone"></i> Call Us Now — +91 98702 63399
//                       </button>
//                       <button onClick={openWA} className="p-[0.9rem] bg-[#25D366] text-white font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] cursor-pointer transition-all duration-[0.2s] flex items-center justify-center gap-[0.5rem] hover:bg-[#1ebc5a] hover:-translate-y-[1px]">
//                         <i className="fab fa-whatsapp"></i> Continue on WhatsApp
//                       </button>
//                     </div>
//                   </div>
//                   <div className="text-[0.63rem] text-[#7d7464] bg-[#f4ede0] border border-[#e3d9c9] rounded-[6px] p-[0.75rem_1rem] leading-[1.72] mt-[1.2rem]">
//                     <strong className="text-[#1a1710]">Note:</strong> This longevity check is a wellness screener based on published South Asian metabolic health research. Biological age is an estimate — not a clinical measurement. It is not a diagnosis, and it does not replace a consultation with your doctor. GRASA is a food programme — not a medicine. Always consult your physician before making changes to your health routine. FSSAI Reg. No. 23325011007087.
//                   </div>
//                 </div>
//               )}

//               {/* Sticky Bar for partial result */}
//               {!isUnlocked && (
//                 <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e3d9c9] py-[0.85rem] px-[1.5rem] flex items-center justify-between gap-[0.75rem] shadow-[0_-4px_24px_rgba(0,0,0,.08)] z-[200] animate-fadeUp">
//                   <div>
//                     <p className="font-['Fraunces',Georgia,serif] text-[0.9rem] font-semibold text-[#1a1710] m-0">{apiResult.bio_delta > 0 ? `Your body is ${apiResult.bio_delta} years older than you` : 'Your longevity score is ready'}</p>
//                     <span className="text-[0.65rem] text-[#7d7464]">20 min call · No pressure · No selling</span>
//                   </div>
//                   <button onClick={() => {
//                     if (componentRef.current) {
//                       const unlockCard = document.getElementById('wa-number');
//                       if (unlockCard) unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
//                     }
//                   }} className="bg-[#d4700f] text-white border-none text-[0.8rem] font-bold py-[0.65rem] px-[1.3rem] rounded-[6px] cursor-pointer whitespace-nowrap transition-all duration-[0.2s] hover:bg-[#e8832a]">
//                     Get Full Report →
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }





"use client";

import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

type Screen = 'intro' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'calc' | 'result';

// --- API TYPES ---
type QuestionOption = {
  index: number;
  icon: string;
  label: string;
  sub_label: string | null;
  score: number;
};

type QuestionField = {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  min?: number;
  max?: number;
  required: boolean;
  options?: { value: string; label: string }[];
};

type Question = {
  id: string;
  order: number;
  category: string;
  type: 'input' | 'single_select' | 'multi_select';
  text: string;
  sub_text: string | null;
  fields?: QuestionField[];
  options?: QuestionOption[];
};

type QuizMeta = {
  title: string;
  description: string;
  total_questions: number;
  estimated_duration_minutes: number;
  target_population: string;
};

type ApiFlag = {
  id: string;
  icon: string;
  title: string;
  severity: string;
  tag: string;
  desc?: string;
};

type ApiResultData = {
  calendar_age: number;
  biological_age: number;
  longevity_score: number;
  bio_delta: number;
  result_band: string;
  result_message: string;
  flags: ApiFlag[];
};

export default function GrasaLongevityCheck() {
  // --- REFS ---
  const componentRef = useRef<HTMLDivElement>(null);

  // --- API DATA STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [quizMeta, setQuizMeta] = useState<QuizMeta | null>(null);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [apiResult, setApiResult] = useState<ApiResultData | null>(null);

  // --- USER INPUT STATE ---
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
  const [age, setAge] = useState<number | null>(null);
  const [gender, setGender] = useState<string>('');
  
  // Selections
  const [singleSelections, setSingleSelections] = useState<Record<string, number>>({});
  const [multiSelections, setMultiSelections] = useState<Record<string, Set<number>>>({
    q6: new Set(),
    q7: new Set()
  });
  
  // Local score tracking for Action Cards (since API provides scores per option)
  const [scores, setScores] = useState<Record<string, number>>({});

  // Calculation & Results State
  const [calcProgress, setCalcProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<boolean[]>([false, false, false, false, false, false]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [waNumber, setWaNumber] = useState('');

  const [isUnlocking, setIsUnlocking] = useState(false);

  const TOTAL_Q = quizMeta?.total_questions || 8;
  const currentQNum = currentScreen.startsWith('q') ? parseInt(currentScreen.replace('q', '')) : 0;

  // --- FETCH QUESTIONS ON MOUNT ---
  useEffect(() => {
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
  }, []);

  // --- SCROLL HELPER ---
  const scrollToTop = () => {
    if (componentRef.current) {
      const offset = 74;
      const elementPosition = componentRef.current.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const startTest = () => {
    setCurrentScreen('q1');
    scrollToTop();
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
      newSet.forEach(selectedIndex => {
        totalScore += optScores[selectedIndex] || 0;
      });
      setScores(s => ({ ...s, [qId]: totalScore }));

      return { ...prev, [qId]: newSet };
    });
  };

  // --- SUBMISSION LOGIC ---
  const submitToApi = async (phone: string = "") => {
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
      whatsapp_number: phone
    };

    const res = await fetch("https://medicaps.cloud/api/questionnaire/longevity/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("API Submission failed");
    const data: ApiResultData = await res.json();
    setApiResult(data);
  };

  const calculate = async () => {
    setCurrentScreen('calc');
    scrollToTop();

    setActiveSteps([false, false, false, false, false, false]);
    setCalcProgress(0);

    // Call partial API submission
    try {
      await submitToApi("");
    } catch (err) {
      console.error(err);
    }

    const steps = [0, 1, 2, 3, 4, 5];
    steps.forEach((i) => {
      setTimeout(() => {
        setActiveSteps(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setCalcProgress(Math.round(((i + 1) / steps.length) * 100));
      }, i * 350 + 200);
    });

    setTimeout(() => {
      setCurrentScreen('result');
      scrollToTop();
    }, steps.length * 350 + 700);
  };

  const unlockResult = async () => {
    const num = waNumber.trim().replace(/\D/g, '');
    if (num.length < 10) {
      alert("Please enter a valid 10-digit number.");
      return;
    }
    
    setIsUnlocking(true); // Start Loader
    try {
      await submitToApi(waNumber);
      setIsUnlocked(true);
      scrollToTop();
    } catch (err) {
      console.error("Failed to unlock report:", err);
      alert("Something went wrong processing your request.");
    } finally {
      setIsUnlocking(false); // Stop Loader
    }
  };

  const openWA = () => {
    const msg = encodeURIComponent(`Hi GRASA, I just completed the Longevity Check. My longevity score is ${apiResult?.longevity_score || 0}/100 and my estimated biological age is ${apiResult?.biological_age || age}. I'd like to discuss my full report with your doctor.`);
    window.open(`https://api.whatsapp.com/send/?phone=919870263399&text=${msg}`, '_blank');
  };

  // --- FALLBACK LOGIC FOR BLURRED CARDS & ACTIONS ---
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
    if ((s.q5 || 0) >= 2 || (s.q6 || 0) >= 2) actions.push({ icon: '🌾', title: 'Change your daily atta and grains', desc: 'Replacing refined grains (maida, white rice in excess) with slower-digesting alternatives is the most evidence-backed dietary intervention for Indian metabolic health. GRASA\'s specially made grain food is built specifically for this.' });
    if ((s.q7 || 0) >= 2) actions.push({ icon: '🧬', title: 'Get a full blood panel done', desc: 'Given your family history, a comprehensive metabolic panel — sugar, cholesterol, liver, thyroid — gives you a true picture of where you are. Don\'t wait for symptoms.' });
    if ((s.q4 || 0) >= 2) actions.push({ icon: '🌙', title: 'Your sleep is undermining everything else', desc: 'Poor sleep raises cortisol, spikes blood sugar, and accelerates cellular ageing. No food programme or supplement can fully compensate for consistently poor sleep. This needs to be addressed alongside diet.' });
    
    actions.push({ icon: '📞', title: 'Talk to our doctor — before spending anything', desc: 'Your longevity score and answers are saved. Our doctor will review your full profile before the call — so the conversation starts with your actual picture, not from scratch. Free. 20 minutes. No obligation.' });

    return actions;
  };

  // --- RENDER HELPERS ---
  const renderProgressBar = () => {
    if (['intro', 'calc', 'result'].includes(currentScreen)) return null;
    const pct = Math.round(((currentQNum - 1) / TOTAL_Q) * 100);

    return (
      <div className="bg-[#ebecdf] border-b border-[#d6d1c4] px-[2rem] py-[0.5rem]">
        <div className="max-w-[620px] mx-auto flex justify-between items-center mb-[0.4rem]">
          <span className="text-[0.68rem] font-semibold text-[#5c5c5c]">Question {currentQNum} of {TOTAL_Q}</span>
          <span className="text-[0.68rem] text-[#5c5c5c]">{pct}%</span>
        </div>
        <div className="max-w-[620px] mx-auto h-[4px] bg-[#d6d1c4] rounded-[2px] overflow-hidden">
          <div 
            className="h-full rounded-[2px] transition-[width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" 
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #1d5c46, #164635)' }}
          ></div>
        </div>
      </div>
    );
  };

  const OptionBtn = ({ 
    qId, idx, icon, label, sub, isSelected, onClick, isMulti = false 
  }: { qId: string, idx: number, icon: string, label: string, sub?: string, isSelected: boolean, onClick: () => void, isMulti?: boolean }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-[0.9rem] px-[1.15rem] py-[0.95rem] bg-white border-[1.5px] rounded-[9px] cursor-pointer transition-all duration-[0.18s] text-left w-full font-['DM_Sans',sans-serif] hover:border-[#1d5c46] hover:bg-[#cde2d5] ${isSelected ? 'border-[#1d5c46] bg-[#cde2d5] shadow-[0_0_0_3px_rgba(29,92,70,.1)]' : 'border-[#d6d1c4]'}`}
    >
      <span className="text-[1.3rem] shrink-0 w-[32px] text-center">{icon}</span>
      <span className="flex-1">
        <span className="text-[0.9rem] font-semibold text-[#1b1b1b] block leading-[1.3]">{label}</span>
        {sub && <span className="text-[0.72rem] text-[#5c5c5c] mt-[0.15rem] block">{sub}</span>}
      </span>
      <span className={`w-[20px] h-[20px] border-[1.5px] shrink-0 flex items-center justify-center transition-all duration-[0.18s] text-[0.65rem] text-white ${isMulti ? 'rounded-[4px]' : 'rounded-full'} ${isSelected ? 'bg-[#1d5c46] border-[#1d5c46]' : 'border-[#d6d1c4]'}`}>
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
      <div className="animate-fadeUp">
        <span className="text-[0.55rem] font-bold tracking-[0.2em] uppercase text-green-900 mb-[0.55rem] block">{q.category}</span>
        <div className="font-['Fraunces',Georgia,serif] text-[clamp(1.1rem,2.5vw,1.45rem)] font-semibold text-[#1b1b1b] leading-[1.35] mb-[0.45rem]">{q.text}</div>
        {q.sub_text && <div className="text-[0.82rem] text-[#5c5c5c] mb-[1.6rem] leading-[1.65]">{q.sub_text}</div>}
        
        {/* INPUT FIELDS */}
        {q.type === 'input' && q.fields && (
          <div className="grid grid-cols-2 gap-[0.75rem] mb-[0.8rem] md:grid-cols-1">
            {q.fields.map(field => (
              <div key={field.id}>
                <label className="block text-[0.58rem] font-bold tracking-[0.14em] uppercase text-[#5c5c5c] mb-[0.3rem]">{field.label}</label>
                {field.type === 'number' ? (
                  <input 
                    type="number" 
                    min={field.min} max={field.max} placeholder={field.placeholder}
                    value={age || ''}
                    onChange={(e) => setAge(parseInt(e.target.value) || null)}
                    className="w-full py-[0.8rem] px-[1rem] border-[1.5px] border-[#d6d1c4] bg-white font-['DM_Sans',sans-serif] text-[0.95rem] text-[#1b1b1b] rounded-[7px] outline-none transition-[border-color] duration-[0.18s] focus:border-[#1d5c46] focus:shadow-[0_0_0_3px_rgba(29,92,70,.08)]"
                  />
                ) : (
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full py-[0.8rem] px-[1rem] border-[1.5px] border-[#d6d1c4] bg-white font-['DM_Sans',sans-serif] text-[0.95rem] text-[#1b1b1b] rounded-[7px] outline-none transition-[border-color] duration-[0.18s] focus:border-[#1d5c46] focus:shadow-[0_0_0_3px_rgba(29,92,70,.08)] appearance-none cursor-pointer bg-no-repeat bg-[right_0.9rem_center] pr-[2.5rem]"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%235c5c5c' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")` }}
                  >
                    <option value="">Select</option>
                    {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}

        {/* OPTIONS */}
        {(q.type === 'single_select' || q.type === 'multi_select') && q.options && (
          <div className="flex flex-col gap-[0.65rem]">
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

        {/* NAVIGATION CONTROLS */}
        <div className="flex gap-[0.75rem] mt-[1.8rem]">
          {q.order > 1 && (
            <button onClick={() => goTo(q.order - 1)} className="py-[0.8rem] px-[1.4rem] bg-transparent border-[1.5px] border-[#d6d1c4] text-[#5c5c5c] font-['DM_Sans',sans-serif] font-semibold text-[0.82rem] rounded-[7px] cursor-pointer transition-all duration-[0.18s] flex items-center gap-[0.4rem] hover:border-[#1b1b1b] hover:text-[#1b1b1b]"><i className="fas fa-arrow-left"></i> Back</button>
          )}
          {q.order < TOTAL_Q ? (
            <button disabled={isNextDisabled} onClick={() => goTo(q.order + 1)} className="flex-1 py-[0.9rem] px-[1.4rem] bg-[#C5D82D] text-[#1b1b1b] font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] transition-all duration-[0.2s] flex items-center justify-center gap-[0.45rem] disabled:opacity-35 disabled:cursor-not-allowed hover:not(:disabled):bg-[#b3c528] hover:not(:disabled):-translate-y-[1px] hover:not(:disabled):shadow-md">Next <i className="fas fa-arrow-right"></i></button>
          ) : (
            <button disabled={isNextDisabled} onClick={calculate} className="flex-1 py-[0.9rem] px-[1.4rem] bg-[#C5D82D] text-[#1b1b1b] font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] transition-all duration-[0.2s] flex items-center justify-center gap-[0.45rem] disabled:opacity-35 disabled:cursor-not-allowed hover:not(:disabled):bg-[#b3c528] hover:not(:disabled):-translate-y-[1px] hover:not(:disabled):shadow-md">See My Result <i className="fas fa-arrow-right"></i></button>
          )}
        </div>
      </div>
    );
  };

  // Derived styling for API Results
  let bandColor = '#1d5c46'; // Updated base color
  if (apiResult) {
    const band = apiResult.result_band.toLowerCase();
    if (band === 'excellent') bandColor = '#226b45';
    else if (band === 'good') bandColor = '#2a7d5a';
    else if (band === 'moderate') bandColor = '#d4700f';
    else if (band === 'elevated') bandColor = '#c05a28';
    else if (band === 'high') bandColor = '#c0392b';
  }

  const apiFlags = apiResult?.flags || [];
  const displayFlags = isUnlocked ? apiFlags : [...apiFlags, ...getLocalDummyFlags().slice(0, 6 - apiFlags.length)];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ebecdf] flex items-center justify-center">
         <div className="w-[40px] h-[40px] rounded-full border-4 border-[#d6d1c4] border-t-[#1d5c46] animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{quizMeta?.title || "GRASA Longevity Check"}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
        <style>{`
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
          @keyframes fadeUp { from{opacity:0; transform:translateY(18px)} to{opacity:1; transform:none} }
          .animate-fadeUp { animation: fadeUp 0.4s ease both; }
        `}</style>
      </Head>

      {/* ADDED ID: longevity-assessment HERE */}
      <div id="longevity-assessment" ref={componentRef} className="font-['DM_Sans',sans-serif] bg-[#ebecdf] text-[#1b1b1b] w-full overflow-x-hidden leading-[1.6]">
        {renderProgressBar()}

        <div className="max-w-[620px] mx-auto px-[1.5rem] pt-[2.5rem] pb-[5rem] md:px-[1rem] md:pt-[1.8rem] md:pb-[6rem]">
          
          {/* INTRO SCREEN */}
          {currentScreen === 'intro' && (
            <div className="text-center animate-fadeUp">
              {/* <div className="inline-flex items-center gap-[0.4rem] bg-[#cde2d5] border border-[#1d5c4626] py-[0.32rem] px-[0.9rem] rounded-[20px] text-[0.62rem] font-bold tracking-[0.1em] uppercase text-green-900 mb-[1.4rem]">
                <i className="fas fa-seedling"></i> Free Longevity Check
              </div> */}

                <div className="inline-flex items-center gap-2 bg-[#cde2d5] border border-[#1d5c4626] py-1 px-4 rounded-full text-xs font-semibold tracking-wide text-green-900 mb-6 hover:bg-[#bfe0cf] transition cursor-pointer">
                  <i className="fas fa-seedling text-sm"></i>
                Free Longevity Check
                </div>



              <h1 className="font-['Fraunces',Georgia,serif] text-[clamp(1.8rem,4vw,2.5rem)] font-bold text-[#1b1b1b] leading-[1.15] mb-[0.9rem]">
                How old is your body <br/><em className="text-green-900 not-italic italic">really?</em>
              </h1>
              <p className="text-[0.95rem] text-[#5c5c5c] leading-[1.8] max-w-[480px] mx-auto mb-[1.8rem]">
                {quizMeta?.description || "Your calendar age is just a number. Your biological age — how well your body is actually working — can be very different. This 8-question check gives you an honest picture in 2 minutes."}
              </p>
              <div className="flex justify-center gap-[2rem] mb-[2rem] flex-wrap">
                <div className="text-center"><div className="font-['Fraunces',Georgia,serif] text-[1.7rem] font-bold text-green-900">{TOTAL_Q}</div><div className="text-[0.65rem] text-[#5c5c5c] mt-[0.1rem]">Questions</div></div>
                <div className="w-[1px] bg-[#d6d1c4] self-stretch"></div>
                <div className="text-center"><div className="font-['Fraunces',Georgia,serif] text-[1.7rem] font-bold text-green-900">{quizMeta?.estimated_duration_minutes || 2} min</div><div className="text-[0.65rem] text-[#5c5c5c] mt-[0.1rem]">To complete</div></div>
                <div className="w-[1px] bg-[#d6d1c4] self-stretch"></div>
                <div className="text-center"><div className="font-['Fraunces',Georgia,serif] text-[1.7rem] font-bold text-green-900">Free</div><div className="text-[0.65rem] text-[#5c5c5c] mt-[0.1rem]">Always</div></div>
              </div>
              <button 
                onClick={startTest}
                className="w-full p-[1.1rem] bg-[#C5D82D] text-[#1b1b1b] font-['DM_Sans',sans-serif] font-bold text-[1rem] border-none rounded-[8px] cursor-pointer tracking-[0.02em] transition-all duration-[0.2s] mt-[1.2rem] flex items-center justify-center gap-[0.5rem] hover:bg-[#b3c528] hover:-translate-y-[2px] hover:shadow-lg"
              >
                Start My Longevity Check <i className="fas fa-arrow-right text-[0.85rem]"></i>
              </button>
              <div className="text-[0.65rem] text-[#5c5c5c] bg-[#f4f4f2] border border-[#d6d1c4] rounded-[6px] py-[0.6rem] px-[0.9rem] text-left mt-[1.5rem] leading-[1.7]">
                <strong className="text-[#1b1b1b]">Important:</strong> This is a wellness screener — not a medical diagnosis. It is designed to give you a useful starting picture based on well-established Indian health research. If you have existing health conditions, always consult your doctor. GRASA will never use your answers to sell you anything — only to have an honest conversation.
              </div>
            </div>
          )}

          {/* DYNAMIC QUESTIONS RENDERER */}
          {currentScreen.startsWith('q') && renderDynamicQuestion()}

          {/* CALCULATION SCREEN */}
          {currentScreen === 'calc' && (
            <div className="text-center py-[3rem] px-[1rem] animate-fadeUp">
              <div className="w-[90px] h-[90px] mx-auto mb-[1.5rem] relative">
                <svg viewBox="0 0 90 90" className="w-[90px] h-[90px] -rotate-90">
                  <circle cx="45" cy="45" r="40" fill="none" stroke="#d6d1c4" strokeWidth="6" />
                  <circle cx="45" cy="45" r="40" fill="none" stroke="#1d5c46" strokeWidth="6" strokeDasharray="251" strokeDashoffset={251 - (251 * calcProgress / 100)} strokeLinecap="round" className="transition-[stroke-dashoffset] duration-500 ease" />
                </svg>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-['Fraunces',Georgia,serif] text-[1.2rem] font-bold text-green-900">{calcProgress}%</div>
              </div>
              <div className="font-['Fraunces',Georgia,serif] text-[1.3rem] font-semibold text-[#1b1b1b] mb-[0.4rem]">Calculating your longevity score…</div>
              <div className="text-[0.8rem] text-[#5c5c5c]">Analysing {TOTAL_Q} biological markers</div>
              
              <div className="flex flex-col gap-[0.5rem] mt-[1.5rem] mx-auto max-w-[280px] text-left">
                {[
                  "Energy & recovery patterns",
                  "Digestive health signals",
                  "Visceral fat & body composition",
                  "Metabolic markers from reports",
                  "Indian genetic risk profile",
                  "Dietary pattern analysis"
                ].map((text, i) => (
                  <div key={i} className={`flex items-center gap-[0.65rem] text-[0.78rem] text-[#5c5c5c] transition-opacity duration-300 ${activeSteps[i] ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-[8px] h-[8px] rounded-full shrink-0 transition-colors duration-300 ${activeSteps[i] ? 'bg-[#1d5c46]' : 'bg-[#d6d1c4]'}`}></div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESULT SCREEN */}
          {currentScreen === 'result' && apiResult && (
            <div className="animate-fadeUp relative pb-[60px]">
              
              {/* Top Result Band */}
              <div className="rounded-[14px] p-[1.6rem_1.5rem] mb-[1.4rem] border-[1.5px] border-[#d6d1c4] bg-white shadow-sm">
                <div className="flex items-start justify-between gap-[1rem] mb-[1rem]">
                  <div>
                    <div className="text-[0.55rem] font-bold tracking-[0.18em] uppercase text-[#5c5c5c] mb-[0.25rem]">Your estimated biological age</div>
                    <div className="font-['Fraunces',Georgia,serif] text-[3rem] font-black leading-none" style={{ color: bandColor }}>{apiResult.biological_age}</div>
                    <div className="flex items-center gap-[0.5rem] mt-[0.6rem] text-[0.78rem] text-[#5c5c5c]">
                      <span>Your actual age: <strong className="font-bold text-[#1b1b1b]">{apiResult.calendar_age || age || 35}</strong></span>
                      <span className={`inline-flex items-center gap-[0.25rem] px-[0.6rem] py-[0.2rem] rounded-[20px] text-[0.72rem] font-bold ${apiResult.bio_delta > 0 ? 'bg-[#fdecea] text-[#c0392b]' : apiResult.bio_delta < 0 ? 'bg-[#cde2d5] text-green-900' : 'bg-[#fef9ec] text-[#9a6700]'}`}>
                        {apiResult.bio_delta > 0 ? `+${apiResult.bio_delta} yrs older` : apiResult.bio_delta < 0 ? `${Math.abs(apiResult.bio_delta)} yrs younger` : 'On track'}
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 relative w-[80px] h-[80px]">
                    <svg viewBox="0 0 80 80" className="w-[80px] h-[80px] -rotate-90">
                      <circle cx="40" cy="40" r="35" fill="none" stroke="#d6d1c4" strokeWidth="6" />
                      <circle cx="40" cy="40" r="35" fill="none" stroke={bandColor} strokeWidth="6" strokeDasharray="220" strokeDashoffset={220 - (220 * apiResult.longevity_score / 100)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 font-['Fraunces',Georgia,serif] text-[1.1rem] font-bold">{apiResult.longevity_score}</div>
                  </div>
                </div>
                <div className="text-[0.85rem] text-[#1b1b1b] leading-[1.72] pt-[0.9rem] border-t border-[#d6d1c4]">{apiResult.result_message}</div>
              </div>

              {/* Flag Cards (Using API data, mapped to pad strictly 6 UI cards) */}
              <div className="text-[0.58rem] font-bold tracking-[0.16em] uppercase text-[#5c5c5c] mb-[0.75rem]">Your personal health snapshot</div>
              <div className="flex flex-col gap-[0.6rem] mb-[1.4rem]">
                {displayFlags.map((f, i) => (
                  <div key={i} className={`flex items-start gap-[0.85rem] bg-white border-[1.5px] border-[#d6d1c4] rounded-[10px] p-[1rem_1.1rem] shadow-sm transition-colors duration-200 ${!isUnlocked && i >= apiFlags.length ? 'filter blur-[5px] select-none pointer-events-none opacity-60' : ''}`}>
                    <div className="text-[1.3rem] shrink-0 mt-[0.05rem]">{f.icon}</div>
                    <div>
                      <div className="text-[0.85rem] font-bold text-[#1b1b1b] mb-[0.2rem]">{f.title}</div>
                      {f.desc && <div className="text-[0.75rem] text-[#5c5c5c] leading-[1.65]">{f.desc}</div>}
                      <span className={`inline-block mt-[0.35rem] text-[0.55rem] font-bold tracking-[0.08em] uppercase px-[0.45rem] py-[0.15rem] rounded-[3px] ${f.severity === 'red' ? 'bg-[#fdecea] text-[#c0392b]' : f.severity === 'amber' ? 'bg-[#fef3e2] text-[#9a5700]' : f.severity === 'gray' ? 'bg-[#f4f4f2] text-[#5c5c5c]' : 'bg-[#cde2d5] text-green-900'}`}>
                        {f.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unlock Section */}
              {!isUnlocked && (
                <div id="wa-number" className="bg-gradient-to-br from-[#1d5c46] to-[#123a2c] rounded-[14px] p-[1.8rem_1.5rem] text-center mb-[1.2rem] relative overflow-hidden shadow-md">
                  <div className="absolute top-[-40px] right-[-40px] w-[150px] h-[150px] rounded-full bg-white/5 pointer-events-none"></div>
                  <div className="inline-flex items-center gap-[0.35rem] bg-white/10 border border-white/20 px-[0.75rem] py-[0.25rem] rounded-[20px] text-[0.58rem] font-bold tracking-[0.12em] uppercase text-white/80 mb-[1rem]">
                    🔒 Full Report Locked
                  </div>
                  <div className="font-['Fraunces',Georgia,serif] text-[1.2rem] font-bold text-white mb-[0.4rem] leading-[1.3]">Your full breakdown is ready.<br/>Get it free — takes 10 seconds.</div>
                  <div className="text-[0.78rem] text-white/55 mb-[1.4rem] leading-[1.65]">Enter your WhatsApp number. We'll send your complete report and offer a free 20-minute call with our doctor — no obligation.</div>
                  <div className="flex flex-col gap-[0.4rem] mb-[1.4rem] text-left">
                    {["Full breakdown of all 6 health areas", "What GRASA can specifically do for your profile", "Free 20-min call with our doctor — yours to book"].map((perk, i) => (
                      <div key={i} className="flex items-center gap-[0.6rem] text-[0.75rem] text-white/75">
                        <div className="w-[18px] h-[18px] rounded-full bg-white/15 flex items-center justify-center text-[0.55rem] text-[#cde2d5] shrink-0"><i className="fas fa-check"></i></div>
                        {perk}
                      </div>
                    ))}
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Your WhatsApp number (e.g. 98XXX XXXXX)" 
                    maxLength={15}
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="w-full py-[0.9rem] px-[1rem] bg-white/10 border-[1.5px] border-white/20 rounded-[8px] font-['DM_Sans',sans-serif] text-[0.95rem] text-white outline-none transition-[border-color] duration-[0.18s] mb-[0.7rem] placeholder:text-white/35 focus:border-white/50 focus:bg-white/15"
                  />
                    <button 
                      onClick={unlockResult} 
                      disabled={isUnlocking}
                      className="w-full p-[1rem] bg-white text-green-900 font-['DM_Sans',sans-serif] font-bold text-[0.95rem] border-none rounded-[8px] cursor-pointer transition-all duration-[0.2s] flex items-center justify-center gap-[0.5rem] hover:bg-[#cde2d5] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(0,0,0,.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isUnlocking ? (
                        <div className="w-[18px] h-[18px] rounded-full border-2 border-[#1d5c4633] border-t-[#1d5c46] animate-spin"></div>
                      ) : (
                        <i className="fab fa-whatsapp"></i>
                      )}
                      {isUnlocking ? "Processing..." : "Send My Full Report on WhatsApp"}
                    </button>
                  <div className="text-[0.6rem] text-white/30 mt-[0.65rem]">We never share your number. No spam — ever.</div>
                </div>
              )}

              {/* Full Result Content (Post-Unlock) */}
              {isUnlocked && (
                <div className="animate-fadeUp mt-[1.4rem]">
                  <div className="text-center mb-[1.4rem]">
                    <h2 className="font-['Fraunces',Georgia,serif] text-[1.5rem] font-bold text-[#1b1b1b] mb-[0.35rem]">Your personalised action plan</h2>
                    <p className="text-[0.82rem] text-[#5c5c5c]">Based on your answers — here is what matters most for your body right now.</p>
                  </div>
                  
                  <div className="flex flex-col gap-[0.8rem] mb-[1.4rem]">
                    {getActionCards().map((a, i) => (
                      <div key={i} className="bg-white border-[1.5px] border-[#d6d1c4] rounded-[10px] p-[1.1rem_1.2rem] flex gap-[0.9rem] items-start shadow-sm">
                        <div className="text-[1.4rem] shrink-0">{a.icon}</div>
                        <div>
                          <div className="text-[0.88rem] font-bold text-[#1b1b1b] mb-[0.15rem]">{a.title}</div>
                          <div className="text-[0.75rem] text-[#5c5c5c] leading-[1.6]">{a.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#f4f4f2] border-[1.5px] border-[#d6d1c4] rounded-[12px] p-[1.5rem] text-center mb-[1rem]">
                    <h3 className="font-['Fraunces',Georgia,serif] text-[1.15rem] font-bold text-[#1b1b1b] mb-[0.35rem]">Talk to our doctor — it's free.</h3>
                    <p className="text-[0.78rem] text-[#5c5c5c] mb-[1.2rem] leading-[1.65]">Your score and answers are already saved. Our doctor will look at your full profile before the call — so you're not starting from scratch.</p>
                    <div className="flex flex-col gap-[0.6rem]">
                      <button onClick={() => window.open('tel:+919870263399')} className="p-[0.95rem] bg-[#C5D82D] text-[#1b1b1b] font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] cursor-pointer transition-all duration-[0.2s] flex items-center justify-center gap-[0.5rem] hover:bg-[#b3c528] hover:-translate-y-[1px] hover:shadow-md">
                        <i className="fas fa-phone"></i> Call Us Now — +91 98702 63399
                      </button>
                      <button onClick={openWA} className="p-[0.9rem] bg-[#25D366] text-white font-['DM_Sans',sans-serif] font-bold text-[0.9rem] border-none rounded-[7px] cursor-pointer transition-all duration-[0.2s] flex items-center justify-center gap-[0.5rem] hover:bg-[#1ebc5a] hover:-translate-y-[1px]">
                        <i className="fab fa-whatsapp"></i> Continue on WhatsApp
                      </button>
                    </div>
                  </div>
                  <div className="text-[0.63rem] text-[#5c5c5c] bg-[#f4f4f2] border border-[#d6d1c4] rounded-[6px] p-[0.75rem_1rem] leading-[1.72] mt-[1.2rem]">
                    <strong className="text-[#1b1b1b]">Note:</strong> This longevity check is a wellness screener based on published South Asian metabolic health research. Biological age is an estimate — not a clinical measurement. It is not a diagnosis, and it does not replace a consultation with your doctor. GRASA is a food programme — not a medicine. Always consult your physician before making changes to your health routine. FSSAI Reg. No. 23325011007087.
                  </div>
                </div>
              )}

              {/* Sticky Bar for partial result */}
              {!isUnlocked && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#d6d1c4] py-[0.85rem] px-[1.5rem] flex items-center justify-between gap-[0.75rem] shadow-[0_-4px_24px_rgba(0,0,0,.08)] z-[200] animate-fadeUp">
                  <div>
                    <p className="font-['Fraunces',Georgia,serif] text-[0.9rem] font-semibold text-[#1b1b1b] m-0">{apiResult.bio_delta > 0 ? `Your body is ${apiResult.bio_delta} years older than you` : 'Your longevity score is ready'}</p>
                    <span className="text-[0.65rem] text-[#5c5c5c]">20 min call · No pressure · No selling</span>
                  </div>
                  <button onClick={() => {
                    if (componentRef.current) {
                      const unlockCard = document.getElementById('wa-number');
                      if (unlockCard) unlockCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }} className="bg-[#C5D82D] text-[#1b1b1b] border-none text-[0.8rem] font-bold py-[0.65rem] px-[1.3rem] rounded-[6px] cursor-pointer whitespace-nowrap transition-all duration-[0.2s] hover:bg-[#b3c528]">
                    Get Full Report →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}