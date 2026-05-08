
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Question, QuizMeta, ApiResultData, StoredResult } from '@/types/longevity';
import { BASE_URL } from "@/components/config/api";
import toast, { Toaster } from "react-hot-toast";

export default function LongevityTestPage() {
  const router = useRouter();
  const componentRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [quizMeta, setQuizMeta] = useState<QuizMeta | null>(null);
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  
  // Changed type to string to easily allow our custom "wa_capture" state
  const [currentScreen, setCurrentScreen] = useState<string>("q1");

  // answers: every question -> one integer  (q1_answer, q2_answer … qN_answer)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  // multi-select checked sets (for rendering only)
  const [multiSelections, setMultiSelections] = useState<Record<string, Set<number>>>({});
  // input-type raw field values
  const [inputValues, setInputValues] = useState<Record<string, Record<string, any>>>({});

  // WhatsApp Capture State
  const [waNumber, setWaNumber] = useState("");
  const [waName, setWaName] = useState("");

  const [calcProgress, setCalcProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<boolean[]>([]);

  const TOTAL_Q: number = quizMeta?.total_questions ?? questionsData.length;
  const currentQNum: number = currentScreen.startsWith("q")
    ? parseInt(currentScreen.replace("q", ""), 10)
    : 0;

  // ── FETCH QUESTIONS ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/api/questionnaire/longevity/questions`)
      .then(res => res.json())
      .then(data => {
        if (data.quiz && data.questions) {
          setQuizMeta(data.quiz);
          setQuestionsData(data.questions);
          const multiInit: Record<string, Set<number>> = {};
          (data.questions as Question[]).forEach(q => {
            if (q.type === "multi_select") multiInit[q.id] = new Set();
          });
          setMultiSelections(multiInit);
          const total = data.quiz?.total_questions ?? data.questions.length;
          setActiveSteps(new Array(total).fill(false));
        }
        setIsLoading(false);
      })
      .catch(err => { console.error("Failed to fetch questions:", err); setIsLoading(false); });

    const saved = localStorage.getItem("grasa_longevity_result");
    if (saved) {
      try {
        const parsed: StoredResult = JSON.parse(saved);
        if (Date.now() - parsed.timestamp < 30 * 24 * 60 * 60 * 1000) {
          router.push("/longevity-test/result");
        } else {
          localStorage.removeItem("grasa_longevity_result");
        }
      } catch { localStorage.removeItem("grasa_longevity_result"); }
    }
  }, [router]);

  // ── HELPERS ──────────────────────────────────────────────────────────────────
  const saveToLocalAndRedirect = (res: ApiResultData, payload: Record<string, any>) => {
    const data: StoredResult = {
      result: res, isUnlocked: false,
      age: inputValues["q1"]?.age ?? answers["q1"] ?? null,
      scores: answers, payload, timestamp: Date.now(),
    };
    localStorage.setItem("grasa_longevity_result", JSON.stringify(data));
    router.push("/longevity-test/result");
  };

  const scrollToTop = () => {
    if (componentRef.current) {
      const top = componentRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 80, behavior: "smooth" });
    }
  };

  const goTo = (n: number | string) => { 
    setCurrentScreen(typeof n === "number" ? `q${n}` : n); 
    scrollToTop(); 
  };

  // ── VALIDATION ───────────────────────────────────────────────────────────────
  const checkNextDisabled = (qId: string): boolean => {
    const q = questionsData.find(x => x.id === qId);
    if (!q) return true;
    if (q.type === "input") {
      if (!q.fields || q.fields.length === 0) return false;
      return q.fields.some(field => {
        const val = inputValues[qId]?.[field.id];
        if (field.type === "number") {
          const num = Number(val);
          return !val || isNaN(num) || num < (field.min ?? 0) || num > (field.max ?? Infinity);
        }
        return !val || val === "";
      });
    }
    if (q.type === "single_select") return answers[qId] === undefined;
    if (q.type === "multi_select") return !multiSelections[qId] || multiSelections[qId].size === 0;
    return true;
  };

  // ── HANDLERS ─────────────────────────────────────────────────────────────────
  
  // Updated selectSingleOpt to auto-advance to the next screen after selection
  const selectSingleOpt = (qId: string, optionIndex: number, qOrder: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
    
    // Add a slight delay for better UX so the user sees their selection highlighted
    setTimeout(() => {
      if (qOrder < TOTAL_Q) {
        goTo(qOrder + 1);
      } else {
        goTo("wa_capture");
      }
    }, 400); 
  };

  const toggleMultiOpt = (qId: string, idx: number, optScores: number[]) => {
    setMultiSelections(prev => {
      const newSet = new Set(prev[qId]);
      if (idx === 0) { newSet.clear(); newSet.add(0); }
      else { newSet.delete(0); if (newSet.has(idx)) newSet.delete(idx); else newSet.add(idx); }
      let total = 0;
      newSet.forEach(i => { total += optScores[i] ?? 0; });
      setAnswers(s => ({ ...s, [qId]: total }));
      return { ...prev, [qId]: newSet };
    });
  };

  const setInputField = (qId: string, fieldId: string, value: any) => {
    setInputValues(prev => ({ ...prev, [qId]: { ...(prev[qId] || {}), [fieldId]: value } }));
    const n = parseInt(value, 10);
    if (!isNaN(n)) setAnswers(prev => ({ ...prev, [qId]: n }));
  };

  // ── BUILD PAYLOAD ─────────────────────────────────────────────────────────────
  // Output: { whatsapp_number: "+91XXXXXXXXXX", q1_answer: 0, q2_answer: 0, … qN_answer: 0 }
  const buildPayload = (): Record<string, any> => {
    const digitsOnly = waNumber.replace(/\D/g, '');
    const fullWaNumber = digitsOnly.length === 10 ? `+91${digitsOnly}` : digitsOnly;
    const payload: Record<string, any> = { 
      whatsapp_number: fullWaNumber,
      name: waName
    };
    
    // const payload: Record<string, any> = { whatsapp_number: fullWaNumber };
    questionsData.forEach(q => { payload[`${q.id}_answer`] = answers[q.id] ?? 0; });
    return payload;
  };

  // ── CALCULATE & SUBMIT ───────────────────────────────────────────────────────
  const calculate = async () => {
    setCurrentScreen("calc");
    scrollToTop();
    setActiveSteps(new Array(TOTAL_Q).fill(false));
    setCalcProgress(0);

    const payload = buildPayload();
    console.log("Submitting payload:", JSON.stringify(payload, null, 2));

    let fetchedResult: ApiResultData | null = null;
    try {
      const res = await fetch(`${BASE_URL}/api/questionnaire/longevity/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        fetchedResult = await res.json();
      } else {
        console.error(`Submit failed [${res.status}]:`, await res.text());
      }
    } catch (err) { console.error("Network error:", err); }

    Array.from({ length: TOTAL_Q }).forEach((_, i) => {
      setTimeout(() => {
        setActiveSteps(prev => { const n = [...prev]; n[i] = true; return n; });
        setCalcProgress(Math.round(((i + 1) / TOTAL_Q) * 100));
      }, i * 350 + 200);
    });

    setTimeout(() => {
      if (fetchedResult) {
        saveToLocalAndRedirect(fetchedResult, payload);
      } else {
        toast.error("There was an error calculating your results. Please try again.");
        setCurrentScreen("wa_capture");
      }
    }, TOTAL_Q * 350 + 700);
  };

  // ── PROGRESS BAR ─────────────────────────────────────────────────────────────
  const renderProgressBar = () => {
    if (currentScreen === "calc") return null;
    
    let pct = 0;
    let title = "";

    if (currentScreen === "wa_capture") {
      pct = 100;
      title = "Final Step";
    } else {
      pct = TOTAL_Q > 0 ? Math.round(((currentQNum - 1) / TOTAL_Q) * 100) : 0;
      title = `Question ${currentQNum} of ${TOTAL_Q}`;
    }

    return (
      <div className="sticky top-0 z-40 border-b border-white/5 px-4 md:px-8 py-2 bg-[#0f1114]/90 backdrop-blur-md">
        <div className="max-w-[620px] mx-auto flex justify-between items-center mb-2">
          <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{title}</span>
          <span className="text-xs font-bold text-[#C5D82D]">{pct}%</span>
        </div>
        <div className="max-w-[620px] mx-auto h-[8px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 bg-[#C5D82D] shadow-[0_0_10px_rgba(197,216,45,0.5)]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  // ── OPTION BUTTON ─────────────────────────────────────────────────────────────
  const OptionBtn = ({ icon, label, sub, isSelected, onClick, isMulti = false }: {
    icon: string; label: string; sub?: string; isSelected: boolean; onClick: () => void; isMulti?: boolean;
  }) => (
    <button onClick={onClick}
      className={`group flex items-center gap-4 px-5 py-4 bg-black/40 backdrop-blur-sm border-[1.5px] rounded-xl cursor-pointer transition-all duration-200 text-left w-full h-full ${isSelected ? "border-[#C5D82D] bg-[#C5D82D]/10 shadow-[0_0_15px_rgba(197,216,45,0.1)]" : "border-white/10 hover:border-white/30 hover:bg-white/5"}`}>
      <span className="text-2xl shrink-0 w-8 text-center">{icon}</span>
      <span className="flex-1">
        <span className="text-base font-bold text-white block leading-snug">{label}</span>
        {sub && <span className="text-xs text-gray-400 mt-1 block leading-relaxed">{sub}</span>}
      </span>
      <span className={`w-5 h-5 border-[1.5px] shrink-0 flex items-center justify-center transition-all duration-200 text-[0.65rem] ${isMulti ? "rounded-[4px]" : "rounded-full"} ${isSelected ? "bg-[#C5D82D] border-[#C5D82D] text-black" : "border-gray-500 text-transparent"}`}>
        <i className="fas fa-check" />
      </span>
    </button>
  );

  // ── QUESTION RENDERER ─────────────────────────────────────────────────────────
  const renderDynamicQuestion = () => {
    const q = questionsData.find(x => x.id === currentScreen);
    if (!q) return null;
    const isMulti = q.type === "multi_select";
    const isNextDisabled = checkNextDisabled(q.id);
    const isLastQuestion = q.order === TOTAL_Q;

    return (
      <div className="animate-fadeUp relative z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/20 bg-lime-500/10 text-[#C5D82D] text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
          {q.category}
        </div>
<div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug sm:leading-tight md:leading-[1.15] mb-3 sm:mb-4 md:mb-5">
  {q.text}
</div>        {q.sub_text && <div className="text-base sm:text-lg text-gray-400 mb-8 leading-relaxed">{q.sub_text}</div>}

        {q.type === "input" && q.fields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
            {q.fields.map(field => (
              <div key={field.id}>
                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">{field.label}</label>
                {field.type === "number" ? (
                  <input type="number" min={field.min} max={field.max} placeholder={field.placeholder}
                    value={inputValues[q.id]?.[field.id] ?? ""}
                    onChange={e => setInputField(q.id, field.id, e.target.value)}
                    className="w-full py-3 px-5 bg-black/40 border-[1.5px] border-white/10 text-white text-base rounded-xl outline-none transition-all duration-200 focus:border-[#C5D82D] focus:shadow-[0_0_15px_rgba(197,216,45,0.1)] placeholder-gray-600" />
                ) : field.options ? (
                  <select value={inputValues[q.id]?.[field.id] ?? ""}
                    onChange={e => setInputField(q.id, field.id, e.target.value)}
                    className="w-full py-4 px-5 bg-black/40 border-[1.5px] border-white/10 text-white text-base rounded-xl outline-none transition-all duration-200 focus:border-[#C5D82D] focus:shadow-[0_0_15px_rgba(197,216,45,0.1)] appearance-none cursor-pointer bg-no-repeat bg-[right_1rem_center] pr-10"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")` }}>
                    <option value="" className="bg-[#0f1114] text-gray-400">Select</option>
                    {field.options.map(o => <option key={o.value} value={o.value} className="bg-[#0f1114] text-white">{o.label}</option>)}
                  </select>
                ) : (
                  <input type="text" placeholder={field.placeholder} value={inputValues[q.id]?.[field.id] ?? ""}
                    onChange={e => setInputField(q.id, field.id, e.target.value)}
                    className="w-full py-4 px-5 bg-black/40 border-[1.5px] border-white/10 text-white text-base rounded-xl outline-none transition-all duration-200 focus:border-[#C5D82D] placeholder-gray-600" />
                )}
              </div>
            ))}
          </div>
        )}

        {(q.type === "single_select" || q.type === "multi_select") && q.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {q.options.map(opt => (
              <OptionBtn key={opt.index} icon={opt.icon} label={opt.label} sub={opt.sub_label ?? undefined}
                isMulti={isMulti}
                isSelected={isMulti ? (multiSelections[q.id]?.has(opt.index) ?? false) : answers[q.id] === opt.index}
                onClick={() => isMulti ? toggleMultiOpt(q.id, opt.index, q.options!.map(o => o.score)) : selectSingleOpt(q.id, opt.index, q.order)} />
            ))}
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-4 mt-10">
          {q.order > 1 && (
            <button onClick={() => goTo(q.order - 1)}
              className="w-full sm:w-auto py-4 px-8 bg-transparent border border-white/20 text-gray-300 font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white/5 hover:text-white uppercase tracking-widest">
              <span>←</span> Back
            </button>
          )}
          
          {/* Only render the Next button if it's NOT a single select question (Inputs and Multi-select still need it) */}
          {q.type !== "single_select" && (
            !isLastQuestion ? (
              <button disabled={isNextDisabled} onClick={() => goTo(q.order + 1)}
                className="w-full sm:w-64 py-4 px-8 bg-[#C5D82D] text-black font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-[#d9ed3d] enabled:hover:-translate-y-1 enabled:hover:shadow-[0_10px_30px_rgba(197,216,45,0.2)] uppercase tracking-widest">
                Next <span>→</span>
              </button>
            ) : (
              <button disabled={isNextDisabled} onClick={() => goTo("wa_capture")}
                className="w-full sm:w-64 py-4 px-8 bg-[#C5D82D] text-black font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-[#d9ed3d] enabled:hover:-translate-y-1 enabled:hover:shadow-[0_10px_30px_rgba(197,216,45,0.2)] uppercase tracking-widest">
                Next <span>→</span>
              </button>
            )
          )}
        </div>
      </div>
    );
  };

  const calcStepLabels: string[] = questionsData.length > 0
    ? questionsData.map(q => q.category || `Analysing marker ${q.order}`)
    : Array.from({ length: TOTAL_Q }, (_, i) => `Analysing marker ${i + 1}`);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f1114] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-[#C5D82D] animate-spin" />
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}.animate-fadeUp{animation:fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}` }} />
      <Toaster position="bottom-right" toastOptions={{ duration: 3500, style: { background: "#1b1b1b", color: "#fff", borderRadius: 8, fontSize: 13 } }} />

      <div id="longevity-assessment" ref={componentRef} className="bg-[#0f1114] text-white w-full min-h-[100dvh] overflow-x-hidden relative leading-relaxed">
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-lime-500/5 blur-[100px] rounded-full -ml-24 -mb-24 pointer-events-none z-0" />

        {renderProgressBar()}

        <div className="max-w-5xl mx-auto px-6 pt-5 pb-24 md:px-8 md:pt-6 relative z-10">

          {currentScreen.startsWith("q") && renderDynamicQuestion()}

          {/* ── WHATSAPP CAPTURE SCREEN ── */}
          {currentScreen === "wa_capture" && (
            <div className="animate-fadeUp relative z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-500/20 bg-lime-500/10 text-[#C5D82D] text-[10px] uppercase tracking-[0.2em] font-bold mb-5">
                Save & Secure
              </div>
              <div className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white leading-[1.15] mb-4">Almost there!</div>
              <div className="text-base sm:text-lg text-gray-400 mb-4 leading-relaxed max-w-2xl">
                Where should we send your complete metabolic profile? Enter your Name and WhatsApp number to securely lock in your answers and generate your personalised results.
              </div>

              <div className="max-w-md">

                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  className="w-full px-4 py-4 bg-black/40 border-[1.5px] border-white/10 text-white rounded-xl mb-6 focus:border-[#C5D82D] outline-none"
                />

                <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">WhatsApp Number</label>
                <div className="flex items-center rounded-xl border border-white/10 bg-black/40 overflow-hidden focus-within:border-[#C5D82D] focus-within:ring-1 focus-within:ring-[#C5D82D]/30 transition-all mb-8">
                  <div className="flex items-center gap-2 px-4 py-4 border-r border-white/10 bg-white/5 shrink-0">
                    <span className="text-lg leading-none">🇮🇳</span>
                    <span className="text-white font-semibold text-base">+91</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="Enter 10-digit number"
                    value={waNumber}
                    maxLength={10}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setWaNumber(val);
                    }}
                    className="flex-1 px-4 py-4 bg-transparent text-white placeholder-gray-600 focus:outline-none text-base"
                  />
                  <div className={`px-4 text-xs font-bold shrink-0 ${waNumber.length === 10 ? 'text-[#C5D82D]' : 'text-gray-500'}`}>
                    {waNumber.length}/10
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4">
                  <button onClick={() => goTo(TOTAL_Q)}
                    className="w-full sm:w-auto py-4 px-8 bg-transparent border border-white/20 text-gray-300 font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-3 hover:bg-white/5 hover:text-white uppercase tracking-widest">
                    <span>←</span> Back
                  </button>
                  <button disabled={waNumber.length !== 10} onClick={calculate}
                    className="w-full sm:w-64 py-4 px-8 bg-[#C5D82D] text-black font-bold text-sm rounded-full transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-[#d9ed3d] enabled:hover:-translate-y-1 enabled:hover:shadow-[0_10px_30px_rgba(197,216,45,0.2)] uppercase tracking-widest">
                    See My Result <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── CALCULATING LOADER SCREEN ── */}
          {currentScreen === "calc" && (
            <div className="text-center py-16 px-4 animate-fadeUp">
              <div className="w-[100px] h-[100px] mx-auto mb-10 relative">
                <svg viewBox="0 0 90 90" className="w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(197,216,45,0.2)]">
                  <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                  <circle cx="45" cy="45" r="40" fill="none" stroke="#C5D82D" strokeWidth="6"
                    strokeDasharray="251" strokeDashoffset={251 - (251 * calcProgress / 100)}
                    strokeLinecap="round" className="transition-[stroke-dashoffset] duration-500 ease" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">{calcProgress}%</div>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">Calculating your <br className="sm:hidden" /> profile analysis…</div>
              <div className="text-base text-gray-500 mb-10 uppercase tracking-widest font-bold">Analysing {TOTAL_Q} biological markers</div>
              <div className="flex flex-col gap-4 mt-6 mx-auto max-w-[320px] text-left">
                {calcStepLabels.map((label, i) => (
                  <div key={i} className={`flex items-center gap-4 text-sm font-bold transition-all duration-300 ${activeSteps[i] ? "opacity-100 text-gray-200" : "opacity-20 text-gray-600"}`}>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${activeSteps[i] ? "bg-[#C5D82D] shadow-[0_0_10px_rgba(197,216,45,0.6)]" : "bg-gray-800"}`} />
                    {label}
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
