// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Check, X, Shield, ArrowRight, Sparkles, Zap, Loader2, CheckCircle2, Clock, XCircle } from "lucide-react";
// import { BASE_URL } from "@/components/config/api";

// /* ------------------- TOAST ------------------- */
// function Toast({ toasts, removeToast }) {
//   return (
//     <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none">
//       {toasts.map((t) => (
//         <div
//           key={t.id}
//           className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold min-w-[260px] max-w-xs border transition-all duration-300 ${
//             t.type === "success"
//               ? "bg-[#C5D82D] text-[#1b1b1b] border-[#b0c228]"
//               : t.type === "error"
//               ? "bg-[#1b1b1b] text-white border-[#333]"
//               : "bg-white text-[#1b1b1b] border-[#d6d1c4]"
//           }`}
//           style={{ animation: "overlaySlideUp 0.3s ease" }}
//         >
//           {t.type === "success" && <CheckCircle2 size={16} className="flex-shrink-0" />}
//           {t.type === "error" && <XCircle size={16} className="flex-shrink-0 text-red-400" />}
//           <span className="flex-1">{t.message}</span>
//           <button onClick={() => removeToast(t.id)} className="ml-1 opacity-60 hover:opacity-100">
//             <X size={14} />
//           </button>
//         </div>
//       ))}
//       <style>{`@keyframes overlaySlideUp { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }`}</style>
//     </div>
//   );
// }

// function useToast() {
//   const [toasts, setToasts] = useState([]);
//   const add = (message, type = "info", duration = 4000) => {
//     const id = Date.now();
//     setToasts((prev) => [...prev, { id, message, type }]);
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
//   };
//   const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
//   return { toasts, toast: { success: (m) => add(m, "success"), error: (m) => add(m, "error"), info: (m) => add(m, "info") }, removeToast: remove };
// }

// /* ------------------- COOKIE UTILITY ------------------- */
// const getCookie = (name) => {
//   const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
//   return match ? decodeURIComponent(match[2]) : "";
// };

// const setCookie = (name, value, days = 365) => {
//   const date = new Date();
//   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//   const expires = "expires=" + date.toUTCString();
//   document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
// };

// /* ------------------- RAZORPAY SCRIPT LOADER ------------------- */
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) { resolve(true); return; }
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// /* ------------------- PAYMENT OVERLAY ------------------- */
// function PaymentOverlay({ plan, onClose, onConfirm, paymentState }) {
//   const overlayRef = useRef(null);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "Escape" && (paymentState === "idle" || paymentState === "cancelled")) onClose();
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, [paymentState, onClose]);

//   if (!plan) return null;

//   const steps = [
//     { label: "Securing your session",       done: paymentState !== "idle" && paymentState !== "cancelled" },
//     { label: "Initialising payment gateway", done: ["processing","verifying","success"].includes(paymentState) },
//     { label: "Processing your payment",      done: ["verifying","success"].includes(paymentState) },
//     { label: "Verifying & activating plan",  done: paymentState === "success" },
//   ];

//   const isLoading = !["idle","success","cancelled","failed"].includes(paymentState);
//   const doneCount = steps.filter(s => s.done).length;
//   const isCancelledOrFailed = paymentState === "cancelled" || paymentState === "failed";

//   return (
//     <div
//       ref={overlayRef}
//       className="fixed inset-0 z-[9999] flex items-center justify-center"
//       style={{ animation: "overlayFadeIn 0.25s ease" }}
//     >
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 backdrop-blur-sm"
//         style={{ background: "rgba(27,27,27,0.75)" }}
//         onClick={() => !isLoading && onClose()}
//       />

//       {/* Panel */}
//       <div
//         className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl bg-[#f4f4f2]"
//         style={{ animation: "overlaySlideUp 0.35s cubic-bezier(0.16,1,0.3,1)", border: "1px solid #d6d1c4" }}
//       >
//         {/* Top accent line */}
//         <div className={`h-1 w-full ${isCancelledOrFailed ? "bg-red-500" : "bg-[#1b1b1b]"}`} />

//         {/* Close button — always shown when not loading */}
//         {!isLoading && (
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-[#e8e8e4] transition-all z-10"
//           >
//             <X size={16} />
//           </button>
//         )}

//         <div className="p-7 sm:p-8">

//           {/* ── SUCCESS ── */}
//           {paymentState === "success" ? (
//             <div className="text-center py-2" style={{ animation: "overlayFadeIn 0.4s ease" }}>
//               <div
//                 className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-[#C5D82D]"
//                 style={{ animation: "overlayScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
//               >
//                 <CheckCircle2 size={38} className="text-[#1b1b1b]" />
//               </div>
//               <h3 className="text-2xl font-black text-[#1b1b1b] mb-1">You&apos;re in! 🎉</h3>
//               <p className="text-[#5c5c5c] text-sm mb-6">
//                 Your <span className="font-bold text-[#1b1b1b]">{plan.title}</span> subscription is now active.
//               </p>
//               <div className="bg-[#ebecdf] rounded-xl p-4 text-left mb-6 border border-[#d6d1c4]">
//                 <p className="text-[10px] font-black uppercase tracking-[3px] text-[#5c5c5c] mb-3 flex items-center gap-1.5">
//                   <Sparkles size={11} className="text-[#1b1b1b]" /> What happens next
//                 </p>
//                 <ul className="space-y-2.5">
//                   {["Check your email for a welcome message","Our coach will reach out within 24 hrs","Your personalised plan starts today"].map((s, i) => (
//                     <li key={i} className="flex items-center gap-3 text-sm text-[#1b1b1b]">
//                       <div className="w-5 h-5 rounded-full bg-[#C5D82D] flex items-center justify-center flex-shrink-0">
//                         <Check size={11} className="text-[#1b1b1b]" />
//                       </div>
//                       {s}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <button onClick={onClose} className="w-full py-3.5 rounded-lg font-bold text-[#1b1b1b] text-sm bg-[#C5D82D] hover:bg-[#d4e840] transition-colors shadow-sm">
//                 Continue to Dashboard
//               </button>
//             </div>

//           ) : isCancelledOrFailed ? (
//             /* ── CANCELLED / FAILED ── */
//             <div className="text-center py-2" style={{ animation: "overlayFadeIn 0.4s ease" }}>
//               <div
//                 className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-red-100"
//                 style={{ animation: "overlayScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
//               >
//                 <XCircle size={38} className="text-red-500" />
//               </div>
//               <h3 className="text-2xl font-black text-[#1b1b1b] mb-1">
//                 {paymentState === "cancelled" ? "Payment Failled" : "Payment Failed"}
//               </h3>
//               <p className="text-[#5c5c5c] text-sm mb-6">
//                 {paymentState === "cancelled"
//                   ? "You closed the payment window. Your subscription was not activated."
//                   : "Something went wrong while processing your payment. Please try again."}
//               </p>

//               <div className="bg-[#ebecdf] rounded-xl p-4 text-left mb-6 border border-[#d6d1c4]">
//                 <p className="text-[10px] font-black uppercase tracking-[3px] text-[#5c5c5c] mb-3">What you can do</p>
//                 <ul className="space-y-2.5">
//                   {["Try again with a different payment method","Check your card/UPI details and retry","Contact support if the issue persists"].map((s, i) => (
//                     <li key={i} className="flex items-center gap-3 text-sm text-[#1b1b1b]">
//                       <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
//                         <ArrowRight size={11} className="text-red-500" />
//                       </div>
//                       {s}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={onClose}
//                   className="flex-1 py-3.5 rounded-lg font-bold text-[#5c5c5c] text-sm bg-[#ebecdf] hover:bg-[#e0e0d8] transition-colors border border-[#d6d1c4]"
//                 >
//                   Close
//                 </button>
//                 <button
//                   onClick={onConfirm}
//                   className="flex-1 py-3.5 rounded-lg font-bold text-[#1b1b1b] text-sm bg-[#C5D82D] hover:bg-[#d4e840] transition-colors shadow-sm flex items-center justify-center gap-2"
//                 >
//                   Try Again <ArrowRight size={15} />
//                 </button>
//               </div>
//             </div>

//           ) : isLoading ? (
//             /* ── LOADING ── */
//             <div className="py-2">
//               <div className="flex items-center gap-3 mb-7">
//                 <div className="w-10 h-10 rounded-full bg-[#C5D82D] flex items-center justify-center flex-shrink-0" style={{ animation: "overlaySpin 1.4s linear infinite" }}>
//                   <Loader2 size={20} className="text-[#1b1b1b]" />
//                 </div>
//                 <div>
//                   <h3 className="text-[#1b1b1b] font-black text-lg leading-tight">Processing your payment</h3>
//                   <p className="text-[#5c5c5c] text-xs mt-0.5">Please don&apos;t close this window</p>
//                 </div>
//               </div>
//               <div className="space-y-3.5 mb-7">
//                 {steps.map((step, i) => (
//                   <div key={i} className="flex items-center gap-3.5">
//                     <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 border ${step.done ? "bg-[#C5D82D] border-[#C5D82D]" : "bg-transparent border-[#d6d1c4]"}`}>
//                       {step.done ? <Check size={13} className="text-[#1b1b1b]" /> : <div className="w-2 h-2 rounded-full bg-[#d6d1c4]" />}
//                     </div>
//                     <span className={`text-sm transition-colors duration-300 ${step.done ? "text-[#1b1b1b] font-semibold" : "text-[#5c5c5c]"}`}>{step.label}</span>
//                     {!step.done && i === doneCount && (
//                       <div className="ml-auto" style={{ animation: "overlaySpin 1s linear infinite" }}>
//                         <Loader2 size={14} className="text-[#1b1b1b]" />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <div className="h-1.5 rounded-full bg-[#d6d1c4] overflow-hidden">
//                 <div className="h-full rounded-full bg-[#C5D82D] transition-all duration-700" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
//               </div>
//               <p className="text-center text-[#5c5c5c] text-xs mt-3">{Math.round((doneCount / steps.length) * 100)}% complete</p>
//             </div>

//           ) : (
//             /* ── IDLE / CONFIRM ── */
//             <>
//               <div className="mb-5">
//                 <p className="text-[11px] tracking-[3px] font-bold text-[#5c5c5c] mb-1">{plan.weeks}</p>
//                 <h3 className="text-2xl font-bold text-[#1b1b1b] mb-0.5">{plan.title}</h3>
//                 <p className="text-[#5c5c5c] text-sm font-semibold">{plan.subtitle}</p>
//               </div>
//               <div className="w-8 h-[2px] bg-[#1b1b1b] mb-5" />
//               <div className="rounded-xl p-4 mb-5 bg-[#ebecdf] border border-[#d6d1c4]">
//                 <div className="flex items-end justify-between">
//                   <div>
//                     {plan.oldPrice !== plan.price && (
//                       <span className="line-through text-[#5c5c5c] text-xs font-bold block mb-0.5">₹{plan.oldPrice}</span>
//                     )}
//                     <span className="text-4xl font-black text-[#1b1b1b]">₹{plan.price}</span>
//                     <span className="text-[#5c5c5c] text-sm ml-1.5">/ {plan.weeks.toLowerCase()}</span>
//                   </div>
//                   {plan.oldPrice !== plan.price && (
//                     <div className="text-right">
//                       <div className="text-[10px] font-black uppercase tracking-widest text-[#5c5c5c]">You save</div>
//                       <div className="text-[#1b1b1b] font-black text-lg">
//                         ₹{(parseInt(plan.oldPrice.replace(/,/g, "")) - parseInt(plan.price.replace(/,/g, ""))).toLocaleString("en-IN")}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <ul className="space-y-2 mb-5">
//                 {plan.features.slice(0, 4).map((f, i) => (
//                   <li key={i} className="flex items-start gap-3 text-[14px] font-medium text-[#1b1b1b]">
//                     <div className="mt-0.5 rounded-full p-0.5 flex-shrink-0 shadow-sm bg-[#C5D82D]">
//                       <Check size={13} className="text-[#1b1b1b]" />
//                     </div>
//                     {f}
//                   </li>
//                 ))}
//               </ul>
//               <div className="flex items-center justify-between border-y border-[#d6d1c4] py-3.5 mb-5">
//                 {[{ icon: <Shield size={13} />, label: "256-bit SSL" },{ icon: <Zap size={13} />, label: "Instant Activation" },{ icon: <Clock size={13} />, label: "Cancel Anytime" }].map((b, i) => (
//                   <div key={i} className="flex items-center gap-1.5 text-[#5c5c5c] text-xs">
//                     <span className="text-[#1b1b1b]">{b.icon}</span>{b.label}
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={onConfirm}
//                 className="group w-full py-4 rounded-lg font-bold text-[#1b1b1b] text-sm bg-[#C5D82D] hover:bg-[#d4e840] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-[#C5D82D]"
//               >
//                 Proceed to Payment
//                 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
//               </button>
//               <p className="text-center text-[#5c5c5c] text-xs mt-3">🔒 Powered by Razorpay · Secure payment</p>
//             </>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @keyframes overlayFadeIn  { from { opacity: 0 } to { opacity: 1 } }
//         @keyframes overlaySlideUp { from { opacity: 0; transform: translateY(36px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
//         @keyframes overlayScaleIn { from { opacity: 0; transform: scale(0.5) } to { opacity: 1; transform: scale(1) } }
//         @keyframes overlaySpin    { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
//       `}</style>
//     </div>
//   );
// }

// /* ------------------- MAIN COMPONENT ------------------- */
// export default function RegimenPlans() {
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activePlanId, setActivePlanId] = useState(null);
//   const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [paymentState, setPaymentState] = useState("idle");

//   const { toasts, toast, removeToast } = useToast();

//   useEffect(() => {
//     const checkActiveSubscription = () => {
//       const status = getCookie("subscription_status");
//       const planId = getCookie("subscription_plan_id");
//       const expiry = getCookie("subscription_expiry");
//       let isActive = status === "active" || status === "authenticated";
//       if (isActive && expiry) {
//         let expiryDate = !isNaN(expiry)
//           ? new Date(Number(expiry) * (expiry.length <= 10 ? 1000 : 1))
//           : new Date(expiry);
//         if (expiryDate < new Date()) isActive = false;
//       }
//       if (isActive && planId) {
//         setActivePlanId(String(planId));
//         setHasActiveSubscription(true);
//       }
//     };
//     checkActiveSubscription();

//     const fetchPlans = async () => {
//       try {
//         const plansResponse = await fetch(`${BASE_URL}/subscriptions/grasa/plans`);
//         if (!plansResponse.ok) throw new Error("Failed to fetch plans");
//         const plansData = await plansResponse.json();

//         const mappedPlans = plansData.map((plan) => {
//           const nameParts = plan.name ? plan.name.split(/—|-/) : [];
//           const title = nameParts[0]?.trim() || plan.name || "Nutrition Plan";
//           const subtitle = nameParts[1]?.trim() || plan.benefits?.subtitle || "Complete Nutrition Plan";
//           const months = Math.round((plan.duration_days || 30) / 30);
//           const durationText = months === 1 ? "1 MONTH" : `${months} MONTHS`;
//           let features = [];
//           if (plan.benefits && typeof plan.benefits === "object") {
//             features = plan.benefits.features || Object.keys(plan.benefits).filter(k => k !== "subtitle" && k !== "description");
//           }
//           const displayDescription = plan.benefits?.description || plan.description || "A personalised approach to your health, metabolism, and overall wellness.";
//           const currentPrice = plan.price || 0;
//           const finalPrice = plan.final_price !== undefined ? plan.final_price : currentPrice;
//           return {
//             id: plan.id,
//             weeks: durationText,
//             title,
//             subtitle,
//             description: displayDescription,
//             features: features.length > 0 ? features : ["Personalised nutrition plan"],
//             benefits: plan.benefits?.outcomes || ["Wellness", "Nutrition"],
//             oldPrice: currentPrice.toLocaleString("en-IN"),
//             price: finalPrice.toLocaleString("en-IN"),
//             button: "Start Here",
//             isActive: plan.is_active || false,
//           };
//         });

//         setPlans(mappedPlans);
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load nutrition programs. Please try again later.");
//         setLoading(false);
//       }
//     };
//     fetchPlans();
//   }, []);

//   const handleOpenOverlay = (plan) => {
//     const token = getCookie("token");
//     if (!token) {
      
//       toast.error("Please log in to subscribe to a plan.");
//       return;
//     }
//     setSelectedPlan(plan);
//     setPaymentState("idle");
//   };

//   const handleConfirmPayment = async () => {
//     const token = getCookie("token");
//     const plan = selectedPlan;

//     setPaymentState("loading");

//     try {
//       const isScriptLoaded = await loadRazorpayScript();
//       if (!isScriptLoaded) {
//         toast.error("Failed to load payment gateway. Please try again.");
//         setPaymentState("idle");
//         return;
//       }

//       setPaymentState("processing");

//       const response = await fetch(`${BASE_URL}/subscriptions/grasa/subscriptions`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ plan_id: plan.id, total_count: 12 }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data?.message || "Failed to create subscription");

//       if (data.status === "created" && data.subscription_id && data.key) {
//         const options = {
//           key: data.key,
//           subscription_id: data.subscription_id,
//           name: "Grasa",
//           description: `Subscription for ${plan.title}`,
//           theme: { color: "#1b1b1b" },

//           modal: {
//             ondismiss: () => {
//               setPaymentState("cancelled");
//             },
//           },

//           handler: async (rzpResponse) => {
//             setPaymentState("verifying");
//             try {
//               const verifyResponse = await fetch(`${BASE_URL}/subscriptions/grasa/verify-payment`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//                 body: JSON.stringify({
//                   razorpay_payment_id: rzpResponse.razorpay_payment_id,
//                   razorpay_subscription_id: rzpResponse.razorpay_subscription_id,
//                   razorpay_signature: rzpResponse.razorpay_signature,
//                 }),
//               });

//               const verifyData = await verifyResponse.json();

//               if (!verifyResponse.ok) throw new Error("Verification failed");

//               setCookie("subscription_status", "active");
//               setCookie("subscription_plan_id", String(plan.id));
//               const expiryDate = new Date();
//               expiryDate.setDate(expiryDate.getDate() + 30);
//               setCookie("subscription_expiry", expiryDate.toISOString());
//               if (verifyData.subscription_id) setCookie("razorpay_subscription_id", verifyData.subscription_id);

//               setActivePlanId(String(plan.id));
//               setHasActiveSubscription(true);
//               setPaymentState("success");
//               toast.success("Subscription activated successfully! 🎉");
//             } catch (verifyErr) {
//               console.error("Verification Error:", verifyErr);
//               setPaymentState("failed");
//               toast.error("Payment processed but verification failed. Contact support.");
//             }
//           },
//         };

//         const rzp = new window.Razorpay(options);

//         rzp.on("payment.failed", (r) => {
//           console.error("Payment Failed:", r.error);
//           setPaymentState("failed");
//           toast.error(`Payment failed: ${r.error.description}`);
//         });

//         rzp.open();
//       } else {
//         toast.error("Invalid response from server. Please try again.");
//         setPaymentState("idle");
//       }
//     } catch (err) {
//       console.error("Payment Error:", err);
//       setPaymentState("failed");
//       toast.error("Failed to process subscription. Please try again.");
//     }
//   };

//   const handleCloseOverlay = () => {
//     if (paymentState === "success") window.location.reload();
//     setSelectedPlan(null);
//     setPaymentState("idle");
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#C5D82D] mb-4"></div>
//         <p className="text-base sm:text-lg font-medium text-zinc-700 text-center">Loading ...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <section className="w-full bg-[#ebecdf] py-24 px-4 text-center font-sans">
//         <p className="text-red-600 font-bold">{error}</p>
//       </section>
//     );
//   }

//   return (
//     <>
//       <Toast toasts={toasts} removeToast={removeToast} />

//       <section id="regimen-plans" className="w-full bg-[#ebecdf] py-14 px-4 sm:px-6 lg:px-12 font-sans border-y border-[#d6d1c4]">
//         <div className="max-w-[1400px] mx-auto">
//           <div className="mb-12">
//             <span className="inline-block text-[#1b1b1b] text-sm uppercase tracking-wider font-bold mb-3">Our Programmes</span>
//             <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] text-[#1b1b1b] mb-4">
//               Flexible plans. One goal —<br />more healthy years ahead.
//             </h2>
//             <div className="w-12 h-[3px] bg-[#1b1b1b] mb-4" />
//             <p className="text-[#5c5c5c] max-w-2xl text-[16px] leading-relaxed">
//               Our clinically guided nutrition programs help restore gut balance, improve metabolism, and support long-term health through fermented grain nutrition and expert coaching.
//             </p>
//           </div>

//           <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
//             {plans.map((plan, i) => {
//               const isCurrentActivePlan = activePlanId === String(plan.id);
//               const shouldDisableAllButtons = hasActiveSubscription;
//               return (
//                 <div
//                   key={plan.id || i}
//                   className={`group relative rounded-2xl flex flex-col overflow-hidden transition-all duration-500 bg-[#f4f4f2] ${
//                     isCurrentActivePlan
//                       ? "border-2 border-[#C5D82D] shadow-[0_10px_30px_rgba(197,216,45,0.25)] scale-[1.03] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[#C5D82D]/20 before:to-transparent before:opacity-100 before:pointer-events-none"
//                       : "border border-[#d6d1c4] hover:border-[#C5D82D] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1"
//                   }`}
//                 >
//                   {isCurrentActivePlan && (
//                     <div className="absolute top-4 right-4 z-10 bg-[#C5D82D] text-[#1b1b1b] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
//                       ✓ Active Plan
//                     </div>
//                   )}
//                   <div className="p-6 sm:p-7 flex-grow flex flex-col">
//                     <p className="text-[11px] tracking-[3px] font-bold mb-1 text-[#5c5c5c]">{plan.weeks}</p>
//                     <h3 className="text-2xl font-bold mb-1 text-[#1b1b1b]">{plan.title}</h3>
//                     <p className="font-semibold text-sm mb-3 text-[#5c5c5c]">{plan.subtitle}</p>
//                     <div className="w-8 h-[2px] mb-4 bg-[#d6d1c4]" />
//                     <p className="text-[14px] leading-relaxed mb-5 italic min-h-[56px] text-[#5c5c5c]">{plan.description}</p>
//                     <ul className="space-y-2 mb-5 flex-grow">
//                       {plan.features.map((feature, index) => (
//                         <li key={index} className="flex items-start gap-3 text-[14px] font-medium text-[#1b1b1b]">
//                           <div className="mt-0.5 rounded-full p-0.5 flex-shrink-0 shadow-sm bg-[#C5D82D]">
//                             <Check size={13} className="text-[#1b1b1b]" />
//                           </div>
//                           <span>{feature}</span>
//                         </li>
//                       ))}
//                     </ul>
//                     <div className="border-t pt-4 mt-auto border-[#d6d1c4]">
//                       <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#5c5c5c]">Includes:</p>
//                       <div className="flex flex-wrap gap-1.5">
//                         {plan.benefits.map((benefit, index) => (
//                           <span key={index} className="text-[12px] px-2.5 py-1 rounded-md font-semibold border bg-[#ebecdf] text-[#1b1b1b] border-[#d6d1c4]">
//                             {benefit}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0">
//                     <div className="flex items-end justify-between border-t pt-5 border-[#d6d1c4]">
//                       <div>
//                         {plan.oldPrice !== plan.price && (
//                           <span className="line-through text-xs font-bold block mb-0.5 text-[#5c5c5c]">₹{plan.oldPrice}</span>
//                         )}
//                         <span className="text-3xl font-black text-[#1b1b1b]">₹{plan.price}</span>
//                       </div>
//                       {!isCurrentActivePlan && !shouldDisableAllButtons && (
//                         <button
//                           onClick={() => handleOpenOverlay(plan)}
//                           className="px-5 py-3 rounded-lg font-bold text-sm transition-all duration-200 shadow-sm whitespace-nowrap bg-[#C5D82D] text-[#1b1b1b] hover:bg-[#d4e840] border border-[#C5D82D]"
//                         >
//                           {plan.button}
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {selectedPlan && !hasActiveSubscription && (
//         <PaymentOverlay
//           plan={selectedPlan}
//           onClose={handleCloseOverlay}
//           onConfirm={handleConfirmPayment}
//           paymentState={paymentState}
//         />
//       )}
//     </>
//   );
// }









"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, X, Shield, ArrowRight, Sparkles, Zap, Loader2, CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react";
import { BASE_URL } from "@/components/config/api";

/* ------------------- TOAST ------------------- */
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold min-w-[260px] max-w-xs border transition-all duration-300 ${
            t.type === "success"
              ? "bg-[#C5D82D] text-[#1b1b1b] border-[#b0c228]"
              : t.type === "error"
              ? "bg-[#1b1b1b] text-white border-[#333]"
              : "bg-white text-[#1b1b1b] border-[#d6d1c4]"
          }`}
          style={{ animation: "overlaySlideUp 0.3s ease" }}
        >
          {t.type === "success" && <CheckCircle2 size={16} className="flex-shrink-0" />}
          {t.type === "error" && <XCircle size={16} className="flex-shrink-0 text-red-400" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="ml-1 opacity-60 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
      <style>{`@keyframes overlaySlideUp { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = (message, type = "info", duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  };
  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return { toasts, toast: { success: (m) => add(m, "success"), error: (m) => add(m, "error"), info: (m) => add(m, "info") }, removeToast: remove };
}

/* ------------------- COOKIE UTILITY ------------------- */
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : "";
};

const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
};

/* ------------------- RAZORPAY SCRIPT LOADER ------------------- */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ------------------- PAYMENT OVERLAY ------------------- */
function PaymentOverlay({ plan, onClose, onConfirm, paymentState }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && (paymentState === "idle" || paymentState === "cancelled")) onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [paymentState, onClose]);

  if (!plan) return null;

  const steps = [
    { label: "Securing your session",       done: paymentState !== "idle" && paymentState !== "cancelled" },
    { label: "Initialising payment gateway", done: ["processing","verifying","success"].includes(paymentState) },
    { label: "Processing your payment",      done: ["verifying","success"].includes(paymentState) },
    { label: "Verifying & activating plan",  done: paymentState === "success" },
  ];

  const isLoading = !["idle","success","cancelled","failed"].includes(paymentState);
  const doneCount = steps.filter(s => s.done).length;
  const isCancelledOrFailed = paymentState === "cancelled" || paymentState === "failed";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ animation: "overlayFadeIn 0.25s ease" }}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(27,27,27,0.75)" }}
        onClick={() => !isLoading && onClose()}
      />

      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl bg-[#f4f4f2]"
        style={{ animation: "overlaySlideUp 0.35s cubic-bezier(0.16,1,0.3,1)", border: "1px solid #d6d1c4" }}
      >
        <div className={`h-1 w-full ${isCancelledOrFailed ? "bg-red-500" : "bg-[#1b1b1b]"}`} />

        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-[#e8e8e4] transition-all z-10"
          >
            <X size={16} />
          </button>
        )}

        <div className="p-7 sm:p-8">

          {/* ── SUCCESS ── */}
          {paymentState === "success" ? (
            <div className="text-center py-2" style={{ animation: "overlayFadeIn 0.4s ease" }}>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-[#C5D82D]"
                style={{ animation: "overlayScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
              >
                <CheckCircle2 size={38} className="text-[#1b1b1b]" />
              </div>
              <h3 className="text-2xl font-black text-[#1b1b1b] mb-1">You&apos;re in! 🎉</h3>
              <p className="text-[#5c5c5c] text-sm mb-6">
                Your <span className="font-bold text-[#1b1b1b]">{plan.title}</span> subscription is now active.
              </p>
              <div className="bg-[#ebecdf] rounded-xl p-4 text-left mb-6 border border-[#d6d1c4]">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-[#5c5c5c] mb-3 flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#1b1b1b]" /> What happens next
                </p>
                <ul className="space-y-2.5">
                  {["Check your email for a welcome message","Our coach will reach out within 24 hrs","Your personalised plan starts today"].map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#1b1b1b]">
                      <div className="w-5 h-5 rounded-full bg-[#C5D82D] flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-[#1b1b1b]" />
                      </div>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={onClose} className="w-full py-3.5 rounded-lg font-bold text-[#1b1b1b] text-sm bg-[#C5D82D] hover:bg-[#d4e840] transition-colors shadow-sm">
                Continue to Dashboard
              </button>
            </div>

          ) : isCancelledOrFailed ? (
            /* ── CANCELLED / FAILED ── */
            <div className="text-center py-2" style={{ animation: "overlayFadeIn 0.4s ease" }}>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-red-100"
                style={{ animation: "overlayScaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
              >
                <XCircle size={38} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-[#1b1b1b] mb-1">
                {paymentState === "cancelled" ? "Payment Failed" : "Payment Failed"}
              </h3>
              <p className="text-[#5c5c5c] text-sm mb-6">
                {paymentState === "cancelled"
                  ? "You closed the payment window. Your subscription was not activated."
                  : "Something went wrong while processing your payment. Please try again."}
              </p>

              <div className="bg-[#ebecdf] rounded-xl p-4 text-left mb-6 border border-[#d6d1c4]">
                <p className="text-[10px] font-black uppercase tracking-[3px] text-[#5c5c5c] mb-3">What you can do</p>
                <ul className="space-y-2.5">
                  {["Try again with a different payment method","Check your card/UPI details and retry","Contact support if the issue persists"].map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#1b1b1b]">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <ArrowRight size={11} className="text-red-500" />
                      </div>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 rounded-lg font-bold text-[#5c5c5c] text-sm bg-[#ebecdf] hover:bg-[#e0e0d8] transition-colors border border-[#d6d1c4]"
                >
                  Close
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3.5 rounded-lg font-bold text-[#1b1b1b] text-sm bg-[#C5D82D] hover:bg-[#d4e840] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Try Again <ArrowRight size={15} />
                </button>
              </div>
            </div>

          ) : isLoading ? (
            /* ── LOADING ── */
            <div className="py-2">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-10 h-10 rounded-full bg-[#C5D82D] flex items-center justify-center flex-shrink-0" style={{ animation: "overlaySpin 1.4s linear infinite" }}>
                  <Loader2 size={20} className="text-[#1b1b1b]" />
                </div>
                <div>
                  <h3 className="text-[#1b1b1b] font-black text-lg leading-tight">Processing your payment</h3>
                  <p className="text-[#5c5c5c] text-xs mt-0.5">Please don&apos;t close this window</p>
                </div>
              </div>
              <div className="space-y-3.5 mb-7">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 border ${step.done ? "bg-[#C5D82D] border-[#C5D82D]" : "bg-transparent border-[#d6d1c4]"}`}>
                      {step.done ? <Check size={13} className="text-[#1b1b1b]" /> : <div className="w-2 h-2 rounded-full bg-[#d6d1c4]" />}
                    </div>
                    <span className={`text-sm transition-colors duration-300 ${step.done ? "text-[#1b1b1b] font-semibold" : "text-[#5c5c5c]"}`}>{step.label}</span>
                    {!step.done && i === doneCount && (
                      <div className="ml-auto" style={{ animation: "overlaySpin 1s linear infinite" }}>
                        <Loader2 size={14} className="text-[#1b1b1b]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="h-1.5 rounded-full bg-[#d6d1c4] overflow-hidden">
                <div className="h-full rounded-full bg-[#C5D82D] transition-all duration-700" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
              </div>
              <p className="text-center text-[#5c5c5c] text-xs mt-3">{Math.round((doneCount / steps.length) * 100)}% complete</p>
            </div>

          ) : (
            /* ── IDLE / CONFIRM ── */
            <>
              <div className="mb-5">
                <p className="text-[11px] tracking-[3px] font-bold text-[#5c5c5c] mb-1">{plan.weeks}</p>
                <h3 className="text-2xl font-bold text-[#1b1b1b] mb-0.5">{plan.title}</h3>
                <p className="text-[#5c5c5c] text-sm font-semibold">{plan.subtitle}</p>
              </div>
              <div className="w-8 h-[2px] bg-[#1b1b1b] mb-5" />
              <div className="rounded-xl p-4 mb-5 bg-[#ebecdf] border border-[#d6d1c4]">
                <div className="flex items-end justify-between">
                  <div>
                    {plan.oldPrice !== plan.price && (
                      <span className="line-through text-[#5c5c5c] text-xs font-bold block mb-0.5">₹{plan.oldPrice}</span>
                    )}
                    <span className="text-4xl font-black text-[#1b1b1b]">₹{plan.price}</span>
                    <span className="text-[#5c5c5c] text-sm ml-1.5">/ {plan.weeks.toLowerCase()}</span>
                  </div>
                  {plan.oldPrice !== plan.price && (
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#5c5c5c]">You save</div>
                      <div className="text-[#1b1b1b] font-black text-lg">
                        ₹{(parseInt(plan.oldPrice.replace(/,/g, "")) - parseInt(plan.price.replace(/,/g, ""))).toLocaleString("en-IN")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <ul className="space-y-2 mb-5">
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] font-medium text-[#1b1b1b]">
                    <div className="mt-0.5 rounded-full p-0.5 flex-shrink-0 shadow-sm bg-[#C5D82D]">
                      <Check size={13} className="text-[#1b1b1b]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-y border-[#d6d1c4] py-3.5 mb-5">
                {[{ icon: <Shield size={13} />, label: "256-bit SSL" },{ icon: <Zap size={13} />, label: "Instant Activation" },{ icon: <Clock size={13} />, label: "Cancel Anytime" }].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[#5c5c5c] text-xs">
                    <span className="text-[#1b1b1b]">{b.icon}</span>{b.label}
                  </div>
                ))}
              </div>
              <button
                onClick={onConfirm}
                className="group w-full py-4 rounded-lg font-bold text-[#1b1b1b] text-sm bg-[#C5D82D] hover:bg-[#d4e840] flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-[#C5D82D]"
              >
                Proceed to Payment
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="text-center text-[#5c5c5c] text-xs mt-3">🔒 Powered by Razorpay · Secure payment</p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes overlayFadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes overlaySlideUp { from { opacity: 0; transform: translateY(36px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        @keyframes overlayScaleIn { from { opacity: 0; transform: scale(0.5) } to { opacity: 1; transform: scale(1) } }
        @keyframes overlaySpin    { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
}

/* ------------------- DETAILS MODAL ------------------- */
function PlanDetailsModal({ plan, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!plan) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      style={{ animation: "overlayFadeIn 0.25s ease" }}
    >
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(27,27,27,0.75)" }}
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#f4f4f2] shadow-2xl"
        style={{ animation: "overlaySlideUp 0.35s cubic-bezier(0.16,1,0.3,1)", border: "1px solid #d6d1c4" }}
      >
        <div className="h-1 w-full bg-[#1b1b1b]" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#5c5c5c] hover:text-[#1b1b1b] hover:bg-[#e8e8e4] transition-all z-10"
        >
          <X size={16} />
        </button>

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[11px] tracking-[3px] font-bold text-[#5c5c5c] mb-2">{plan.weeks}</p>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1b1b1b] mb-2">{plan.title}</h2>
            <p className="text-lg text-[#5c5c5c] font-semibold">{plan.subtitle}</p>
            <div className="w-12 h-[3px] bg-[#1b1b1b] mt-4" />
          </div>

          {/* Pricing Card */}
          <div className="rounded-xl p-6 mb-8 bg-[#ebecdf] border border-[#d6d1c4]">
            <div className="flex items-end justify-between">
              <div>
                {plan.oldPrice !== plan.price && (
                  <span className="line-through text-[#5c5c5c] text-sm font-bold block mb-1">₹{plan.oldPrice}</span>
                )}
                <span className="text-5xl font-black text-[#1b1b1b]">₹{plan.price}</span>
                <span className="text-[#5c5c5c] text-base ml-2">/ {plan.weeks.toLowerCase()}</span>
              </div>
              {plan.oldPrice !== plan.price && (
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#5c5c5c]">You save</div>
                  <div className="text-[#1b1b1b] font-black text-2xl">
                    ₹{(parseInt(plan.oldPrice.replace(/,/g, "")) - parseInt(plan.price.replace(/,/g, ""))).toLocaleString("en-IN")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 p-5 bg-white border border-[#d6d1c4] rounded-xl">
            <p className="text-[#1b1b1b] text-base leading-relaxed italic">{plan.description}</p>
          </div>

          {/* All Features */}
          <div className="mb-8">
            <h3 className="text-xl font-black text-[#1b1b1b] mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#C5D82D] flex items-center justify-center flex-shrink-0">
                <Check size={16} className="text-[#1b1b1b]" />
              </span>
              Complete Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#d6d1c4]">
                  <div className="mt-1 rounded-full p-0.5 flex-shrink-0 shadow-sm bg-[#C5D82D]">
                    <Check size={13} className="text-[#1b1b1b]" />
                  </div>
                  <span className="text-[14px] font-medium text-[#1b1b1b]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-8 p-6 bg-[#ebecdf] rounded-xl border border-[#d6d1c4]">
            <p className="text-[10px] font-black uppercase tracking-[3px] text-[#5c5c5c] mb-4 flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#1b1b1b]" />
              What&apos;s Included In This Plan
            </p>
            <div className="flex flex-wrap gap-2.5">
              {plan.benefits.map((benefit, index) => (
                <span key={index} className="text-sm px-4 py-2.5 rounded-lg font-semibold border bg-white text-[#1b1b1b] border-[#d6d1c4] flex items-center gap-2">
                  <Check size={13} className="text-[#C5D82D]" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          {/* <div className="mb-8 p-6 rounded-xl border border-[#d6d1c4] bg-white">
            <p className="text-[10px] font-black uppercase tracking-[3px] text-[#5c5c5c] mb-4">Why Choose This Plan</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Shield size={20} />, label: "256-bit SSL", desc: "Secure" },
                { icon: <Zap size={20} />, label: "Instant Activation", desc: "Quick Start" },
                { icon: <Clock size={20} />, label: "Cancel Anytime", desc: "Flexible" }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[#ebecdf] flex items-center justify-center mx-auto mb-2 text-[#1b1b1b]">
                    {item.icon}
                  </div>
                  <p className="font-bold text-sm text-[#1b1b1b]">{item.label}</p>
                  <p className="text-xs text-[#5c5c5c]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div> */}

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-lg font-bold text-[#5c5c5c] text-sm bg-[#ebecdf] hover:bg-[#e0e0d8] transition-colors border border-[#d6d1c4]"
            >
              Back
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-lg font-bold text-[#1b1b1b] text-sm bg-[#C5D82D] hover:bg-[#d4e840] transition-colors shadow-sm flex items-center justify-center gap-2 group"
            >
              Proceed to Payment
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <style>{`
          @keyframes overlayFadeIn  { from { opacity: 0 } to { opacity: 1 } }
          @keyframes overlaySlideUp { from { opacity: 0; transform: translateY(36px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
        `}</style>
      </div>
    </div>
  );
}

/* ------------------- MAIN COMPONENT ------------------- */
export default function RegimenPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePlanId, setActivePlanId] = useState(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentState, setPaymentState] = useState("idle");
  const [detailedPlan, setDetailedPlan] = useState(null);

  const { toasts, toast, removeToast } = useToast();

  useEffect(() => {
    const checkActiveSubscription = () => {
      const status = getCookie("subscription_status");
      const planId = getCookie("subscription_plan_id");
      const expiry = getCookie("subscription_expiry");
      let isActive = status === "active" || status === "authenticated";
      if (isActive && expiry) {
        let expiryDate = !isNaN(expiry)
          ? new Date(Number(expiry) * (expiry.length <= 10 ? 1000 : 1))
          : new Date(expiry);
        if (expiryDate < new Date()) isActive = false;
      }
      if (isActive && planId) {
        setActivePlanId(String(planId));
        setHasActiveSubscription(true);
      }
    };
    checkActiveSubscription();

    const fetchPlans = async () => {
      try {
        const plansResponse = await fetch(`${BASE_URL}/subscriptions/grasa/plans`);
        if (!plansResponse.ok) throw new Error("Failed to fetch plans");
        const plansData = await plansResponse.json();

        const mappedPlans = plansData.map((plan) => {
          const nameParts = plan.name ? plan.name.split(/—|-/) : [];
          const title = nameParts[0]?.trim() || plan.name || "Nutrition Plan";
          const subtitle = nameParts[1]?.trim() || plan.benefits?.subtitle || "Complete Nutrition Plan";
          const months = Math.round((plan.duration_days || 30) / 30);
          const durationText = months === 1 ? "1 MONTH" : `${months} MONTHS`;
          let features = [];
          if (plan.benefits && typeof plan.benefits === "object") {
            features = plan.benefits.features || Object.keys(plan.benefits).filter(k => k !== "subtitle" && k !== "description");
          }
          const displayDescription = plan.benefits?.description || plan.description || "A personalised approach to your health, metabolism, and overall wellness.";
          const currentPrice = plan.price || 0;
          const finalPrice = plan.final_price !== undefined ? plan.final_price : currentPrice;
          return {
            id: plan.id,
            weeks: durationText,
            title,
            subtitle,
            description: displayDescription,
            features: features.length > 0 ? features : ["Personalised nutrition plan"],
            benefits: plan.benefits?.outcomes || ["Wellness", "Nutrition"],
            oldPrice: currentPrice.toLocaleString("en-IN"),
            price: finalPrice.toLocaleString("en-IN"),
            button: "Start Here",
            isActive: plan.is_active || false,
          };
        });

        setPlans(mappedPlans);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load nutrition programs. Please try again later.");
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // const handleOpenOverlay = (plan) => {
  //   const token = getCookie("token");
  //   if (!token) {
  //     toast.error("Please log in to subscribe to a plan.");
  //     return;
  //   }
  //   setSelectedPlan(plan);
  //   setPaymentState("idle");
  // };


  const handleOpenOverlay = (plan) => {
  const token = getCookie("token");

  if (!token) {
    toast.error("Please log in to continue.");

    // ✅ Redirect after short delay (better UX)
    setTimeout(() => {
      window.location.href = "/login"; // change if your route is different
    }, 1000);

    return;
  }

  setSelectedPlan(plan);
  setPaymentState("idle");
};
  const handleViewDetails = (plan) => {
    setDetailedPlan(plan);
  };

  const handleConfirmPayment = async () => {
    const token = getCookie("token");
    const plan = selectedPlan;

    setPaymentState("loading");

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Failed to load payment gateway. Please try again.");
        setPaymentState("idle");
        return;
      }

      setPaymentState("processing");

      const response = await fetch(`${BASE_URL}/subscriptions/grasa/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan_id: plan.id, total_count: 12 }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.message || "Failed to create subscription");

      if (data.status === "created" && data.subscription_id && data.key) {
        const options = {
          key: data.key,
          subscription_id: data.subscription_id,
          name: "Grasa",
          description: `Subscription for ${plan.title}`,
          theme: { color: "#1b1b1b" },

          modal: {
            ondismiss: () => {
              setPaymentState("cancelled");
            },
          },

          handler: async (rzpResponse) => {
            setPaymentState("verifying");
            try {
              const verifyResponse = await fetch(`${BASE_URL}/subscriptions/grasa/verify-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                  razorpay_payment_id: rzpResponse.razorpay_payment_id,
                  razorpay_subscription_id: rzpResponse.razorpay_subscription_id,
                  razorpay_signature: rzpResponse.razorpay_signature,
                }),
              });

              const verifyData = await verifyResponse.json();

              if (!verifyResponse.ok) throw new Error("Verification failed");

              setCookie("subscription_status", "active");
              setCookie("subscription_plan_id", String(plan.id));
              const expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + 30);
              setCookie("subscription_expiry", expiryDate.toISOString());
              if (verifyData.subscription_id) setCookie("razorpay_subscription_id", verifyData.subscription_id);

              setActivePlanId(String(plan.id));
              setHasActiveSubscription(true);
              setPaymentState("success");
              toast.success("Subscription activated successfully! 🎉");
            } catch (verifyErr) {
              console.error("Verification Error:", verifyErr);
              setPaymentState("failed");
              toast.error("Payment processed but verification failed. Contact support.");
            }
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (r) => {
          console.error("Payment Failed:", r.error);
          setPaymentState("failed");
          toast.error(`Payment failed: ${r.error.description}`);
        });

        rzp.open();
      } else {
        toast.error("Invalid response from server. Please try again.");
        setPaymentState("idle");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      setPaymentState("failed");
      toast.error("Failed to process subscription. Please try again.");
    }
  };

  const handleCloseOverlay = () => {
    if (paymentState === "success") window.location.reload();
    setSelectedPlan(null);
    setPaymentState("idle");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#C5D82D] mb-4"></div>
        <p className="text-base sm:text-lg font-medium text-zinc-700 text-center">Loading ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#ebecdf] py-24 px-4 text-center font-sans">
        <p className="text-red-600 font-bold">{error}</p>
      </section>
    );
  }

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />

      <section id="regimen-plans" className="w-full bg-[#ebecdf] py-14 px-4 sm:px-6 lg:px-12 font-sans border-y border-[#d6d1c4]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-12">
            <span className="inline-block text-[#1b1b1b] text-sm uppercase tracking-wider font-bold mb-3">Our Programmes</span>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] text-[#1b1b1b] mb-4">
              Flexible plans. One goal —<br />more healthy years ahead.
            </h2>
            <div className="w-12 h-[3px] bg-[#1b1b1b] mb-4" />
            <p className="text-[#5c5c5c] max-w-2xl text-[16px] leading-relaxed">
              Our clinically guided nutrition programs help restore gut balance, improve metabolism, and support long-term health through fermented grain nutrition and expert coaching.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, i) => {
              const isCurrentActivePlan = activePlanId === String(plan.id);
              const shouldDisableAllButtons = hasActiveSubscription;
              return (
                <div
                  key={plan.id || i}
                  className={`group relative rounded-2xl flex flex-col overflow-hidden transition-all duration-500 bg-[#f4f4f2] ${
                    isCurrentActivePlan
                      ? "border-2 border-[#C5D82D] shadow-[0_10px_30px_rgba(197,216,45,0.25)] scale-[1.03] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[#C5D82D]/20 before:to-transparent before:opacity-100 before:pointer-events-none"
                      : "border border-[#d6d1c4] hover:border-[#C5D82D] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                  }`}
                >
                  {isCurrentActivePlan && (
                    <div className="absolute top-4 right-4 z-10 bg-[#C5D82D] text-[#1b1b1b] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      ✓ Active Plan
                    </div>
                  )}
                  <div className="p-6 sm:p-7 flex-grow flex flex-col">
                    <p className="text-[11px] tracking-[3px] font-bold mb-1 text-[#5c5c5c]">{plan.weeks}</p>
                    <h3 className="text-2xl font-bold mb-1 text-[#1b1b1b]">{plan.title}</h3>
                    <p className="font-semibold text-sm mb-3 text-[#5c5c5c]">{plan.subtitle}</p>
                    <div className="w-8 h-[2px] mb-4 bg-[#d6d1c4]" />
                    <p className="text-[14px] leading-relaxed mb-5 italic min-h-[56px] text-[#5c5c5c]">{plan.description}</p>
                    
                    {/* Show only 2 features */}
                    <ul className="space-y-2 mb-4 flex-grow">
                      {plan.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-[14px] font-medium text-[#1b1b1b]">
                          <div className="mt-0.5 rounded-full p-0.5 flex-shrink-0 shadow-sm bg-[#C5D82D]">
                            <Check size={13} className="text-[#1b1b1b]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Show remaining count if more features exist */}
                    {plan.features.length > 2 && (
                      <button
                        onClick={() => handleViewDetails(plan)}
                        className="text-[12px] font-bold text-[#C5D82D] hover:text-[#b0c228] transition-colors mb-5 flex items-center gap-1.5 group"
                      >
                        + {plan.features.length - 2} more features
                        <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </button>
                    )}

                    <div className="border-t pt-4 mt-auto border-[#d6d1c4]">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-[#5c5c5c]">Includes:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.benefits.map((benefit, index) => (
                          <span key={index} className="text-[12px] px-2.5 py-1 rounded-md font-semibold border bg-[#ebecdf] text-[#1b1b1b] border-[#d6d1c4]">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-0">
                    <div className="flex items-end justify-between border-t pt-5 border-[#d6d1c4]">
                      <div>
                        {plan.oldPrice !== plan.price && (
                          <span className="line-through text-xs font-bold block mb-0.5 text-[#5c5c5c]">₹{plan.oldPrice}</span>
                        )}
                        <span className="text-3xl font-black text-[#1b1b1b]">₹{plan.price}</span>
                      </div>
                      {!isCurrentActivePlan && !shouldDisableAllButtons && (
                        <button
                          onClick={() => handleOpenOverlay(plan)}
                          className="px-5 py-3 rounded-lg font-bold text-sm transition-all duration-200 shadow-sm whitespace-nowrap bg-[#C5D82D] text-[#1b1b1b] hover:bg-[#d4e840] border border-[#C5D82D]"
                        >
                          {plan.button}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {selectedPlan && !hasActiveSubscription && (
        <PaymentOverlay
          plan={selectedPlan}
          onClose={handleCloseOverlay}
          onConfirm={handleConfirmPayment}
          paymentState={paymentState}
        />
      )}

      {detailedPlan && (
        <PlanDetailsModal
          plan={detailedPlan}
          onClose={() => setDetailedPlan(null)}
        />
      )}
    </>
  );
}