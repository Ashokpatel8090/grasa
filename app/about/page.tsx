
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import {
//   ArrowRight,
//   Phone,
//   CheckCircle2,
//   Activity,
//   Clock,
//   ShieldAlert,
//   Leaf,
//   Dna,
//   Utensils,
//   Zap,
//   Target,
//   Award,
//   Users,
//   TrendingDown,
//   Heart,
//   Microscope,
//   Star,
//   MapPin,
//   Mail,
//   MessageCircle,
//   ChevronDown,
//   Droplets,
//   Sun,
//   Wind,
//   ArrowUpRight,
// } from "lucide-react";

// // ─── Schema ────────────────────────────────────────────────────────────────
// const generateAboutSchema = () => {
//   const domain = "https://www.grasamillets.com";
//   return {
//     "@context": "https://schema.org",
//     "@graph": [
//       {
//         "@type": "Organization",
//         "@id": `${domain}/#organization`,
//         name: "GRASA Millets & Foods Pvt. Ltd.",
//         url: domain,
//         logo: { "@type": "ImageObject", url: `${domain}/logo.png` },
//         address: {
//           "@type": "PostalAddress",
//           streetAddress: "GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
//           addressLocality: "New Delhi",
//           postalCode: "110001",
//           addressCountry: "IN",
//         },
//         telephone: "+919870263399",
//         email: "support@grasafoods.com",
//         award: "Rashtriya Ratna Samman 2026 — Emerging Health Tech & Nutrition Innovation Startup of the Year",
//       },
//       {
//         "@type": "AboutPage",
//         "@id": `${domain}/about#webpage`,
//         url: `${domain}/about`,
//         name: "About GRASA — India's Food-First Metabolic Health Company",
//         description:
//           "GRASA was built on the conviction that food, when used correctly, is the most powerful metabolic intervention available to any human being.",
//         inLanguage: "en",
//         isPartOf: { "@id": `${domain}/#website` },
//         publisher: { "@id": `${domain}/#organization` },
//       },
//     ],
//   };
// };

// // ─── Animated Counter ──────────────────────────────────────────────────────
// function useCountUp(target: number, duration = 1800, start = false) {
//   const [count, setCount] = useState(0);
//   useEffect(() => {
//     if (!start) return;
//     let startTime: number | null = null;
//     const step = (ts: number) => {
//       if (!startTime) startTime = ts;
//       const progress = Math.min((ts - startTime) / duration, 1);
//       setCount(Math.floor(progress * target));
//       if (progress < 1) requestAnimationFrame(step);
//     };
//     requestAnimationFrame(step);
//   }, [target, duration, start]);
//   return count;
// }

// // ─── Intersection hook ────────────────────────────────────────────────────
// function useInView(threshold = 0.15) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [inView, setInView] = useState(false);
//   useEffect(() => {
//     const obs = new IntersectionObserver(
//       ([entry]) => { if (entry.isIntersecting) setInView(true); },
//       { threshold }
//     );
//     if (ref.current) obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, [threshold]);
//   return { ref, inView };
// }

// // ─── Stat Card ────────────────────────────────────────────────────────────
// function StatCard({
//   prefix = "",
//   value,
//   suffix = "",
//   label,
//   source,
// }: {
//   prefix?: string;
//   value: number;
//   suffix?: string;
//   label: string;
//   source: string;
// }) {
//   const { ref, inView } = useInView();
//   const count = useCountUp(value, 1600, inView);
//   return (
//     <div
//       ref={ref}
//       className="group bg-white border border-[#d6d1c4] p-8 rounded-3xl hover:border-[#1b1b1b] hover:-translate-y-1 transition-all duration-300 shadow-sm relative overflow-hidden"
//     >
//       <div className="absolute top-0 left-0 w-1 h-full bg-[#C5D82D] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-3xl" />
//       <p className="text-5xl font-extrabold text-[#1b1b1b] leading-none mb-3">
//         {prefix}{count}{suffix}
//       </p>
//       <p className="text-[#1b1b1b] font-bold text-sm leading-snug mb-2">{label}</p>
//       <p className="text-[#5c5c5c] text-xs uppercase tracking-wider font-semibold">{source}</p>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────
// export default function AboutPage() {
//   const schema = generateAboutSchema();

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
//       />

//       <div className="min-h-screen bg-[#f4f4f2] font-sans selection:bg-[#C5D82D] selection:text-[#1b1b1b]">

//         {/* ══════════════════════════════════════════════════
//             AWARD STRIP
//         ══════════════════════════════════════════════════ */}
//         <div className="bg-[#1b1b1b] text-white py-3 px-6 flex items-center justify-center gap-3 text-center">
//           <Award size={18} className="text-[#C5D82D] flex-shrink-0" />
//           <p className="text-xs md:text-sm font-medium">
//             <span className="text-[#C5D82D] font-bold">Rashtriya Ratna Samman 2026</span>
//             {" "}— Emerging Health Tech &amp; Nutrition Innovation Startup of the Year —{" "}
//             <span className="text-gray-300">Presented by Ms. Kangana Ranaut, MP</span>
//           </p>
//         </div>

//        {/* Award Strip */}
//       <div className="mt-16 bg-gradient-to-r from-[#1C3A2A] via-[#2D5A3D] to-[#1C3A2A] py-3.5 px-10 flex items-center justify-center gap-4 relative overflow-hidden">
//         <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_120px,rgba(196,151,42,0.08)_120px,rgba(196,151,42,0.08)_121px)]"></div>
//         <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8C96A] to-[#C4972A] flex items-center justify-center text-lg flex-shrink-0 relative z-10 shadow-[0_0_0_3px_rgba(196,151,42,0.3)]">
//           🏅
//         </div>
//         <p className="text-[#F5F0E8] text-xs font-normal tracking-wider relative z-10">
//           <strong className="text-[#E8C96A]">Rashtriya Ratna Samman 2026</strong> — Emerging Health Tech & Nutrition Innovation Startup of the Year
//         </p>
//       </div>

//         {/* ══════════════════════════════════════════════════
//             AWARD SHOWCASE
//         ══════════════════════════════════════════════════ */}
//         <section className="py-10 px-6  bg-white border-y border-[#d6d1c4]">
//           <div className="max-w-6xl mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//               {/* Award visual */}
//               <div className="relative">
//                 <div className="bg-[#f4f4f2] border border-[#d6d1c4] rounded-3xl p-12 flex flex-col items-center justify-center gap-6 text-center min-h-[360px] relative overflow-hidden">
//                   <div className="absolute inset-0 bg-gradient-to-br from-[#C5D82D]/10 to-transparent rounded-3xl" />
//                   {/* Decorative ring */}
//                   <div className="w-36 h-36 rounded-full border-4 border-[#C5D82D]/30 flex items-center justify-center relative z-10">
//                     <div className="w-28 h-28 rounded-full border-2 border-[#C5D82D]/60 flex items-center justify-center bg-[#1b1b1b]">
//                       <Award size={48} className="text-[#C5D82D]" />
//                     </div>
//                   </div>
//                   <div className="relative z-10">
//                     <p className="text-2xl font-extrabold text-[#1b1b1b] leading-snug mb-2">
//                       Rashtriya Ratna Samman
//                     </p>
//                     <p className="text-[#C5D82D] font-bold text-lg tracking-wider mb-3">2026</p>
//                     <p className="text-[#5c5c5c] text-sm font-medium max-w-xs mx-auto leading-relaxed">
//                       Emerging Health Tech &amp; Nutrition Innovation Startup of the Year
//                     </p>
//                   </div>
//                 </div>
//                 {/* Offset border */}
//                 <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C5D82D]/30 rounded-3xl -z-10" />
//               </div>

//               {/* Award copy */}
//               <div>
//                 <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">
//                   National Recognition
//                 </span>
//                 <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6">
//                   Nationally recognised.{" "} Rashtriya Ratna Samman 2026.
//                   {/* <span className="text-[#1b1b1b] bg-[#C5D82D] italic font-serif inline px-2 py-1 box-decoration-clone">
//                     Rashtriya Ratna Samman 2026.
//                   </span> */}
//                 </h2>
//                 <p className="text-lg text-[#5c5c5c] font-medium leading-relaxed mb-8">
//                   In 2026, GRASA was honoured with India&apos;s most prestigious startup recognition — the Rashtriya Ratna Samman — in the category of Emerging Health Tech &amp; Nutrition Innovation Startup of the Year.
//                 </p>
//                 <div className="bg-[#f4f4f2] border border-[#d6d1c4] p-6 rounded-3xl relative overflow-hidden mb-8">
//                   <div className="absolute top-0 left-0 w-1 h-full bg-[#C5D82D]" />
//                   <p className="text-[#1b1b1b] font-bold text-base leading-snug">
//                     Presented by{" "}
//                     <span className="text-[#849411]">Ms. Kangana Ranaut, MP</span>, this national award recognises GRASA&apos;s pioneering work in making food-based metabolic intervention accessible, guided, and measurable for every Indian.
//                   </p>
//                 </div>
//                 <div className="flex flex-wrap gap-3">
//                   {[
//                     "Health Tech Innovation",
//                     "Nutrition Science",
//                     "Fermented Millets",
//                     "Delhi NCR",
//                   ].map((tag, i) => (
//                     <span
//                       key={i}
//                       className="px-4 py-2 rounded-full border border-[#d6d1c4] bg-white text-[#5c5c5c] text-xs font-bold uppercase tracking-wider"
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

      

//         {/* ══════════════════════════════════════════════════
//             THE CORE ARGUMENT / OUR STORY
//         ══════════════════════════════════════════════════ */}
//         <section className="py-10 px-6 md:px-12 bg-white ">
//           <div className="max-w-6xl mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
//               {/* Sticky left */}
//               <div className="lg:sticky lg:top-24">
//                 <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4 block">Our Story</span>
//                 <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-8">
//                   India doesn&apos;t have a medicine problem.{" "}
//                   <span className="text-[#1b1b1b] bg-[#C5D82D] italic font-serif inline px-2 py-1 box-decoration-clone">
//                     It has a food problem.
//                   </span>
//                 </h2>
//                 {/* Founder quote */}
//                 <div className="bg-[#1b1b1b] text-white p-8 rounded-3xl relative overflow-hidden">
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5D82D] opacity-10 rounded-full blur-2xl" />
//                   <blockquote className="text-lg font-bold leading-snug mb-6 relative z-10">
//                     &quot;I started GRASA because I kept seeing the same thing — people managing conditions for years with growing lists of medicines, and nobody asking them what they were eating. Not once.&quot;
//                   </blockquote>
//                   <p className="text-[#C5D82D] font-bold text-xs uppercase tracking-wider relative z-10">
//                     — Founder, GRASA
//                   </p>
//                 </div>
//               </div>

//               {/* Right timeline */}
//               <div className="space-y-0">
//                 {[
//                   {
//                     emoji: "🌾",
//                     title: "The Food Problem",
//                     body: "India's traditional diet — built around millets, lentils, vegetables, fermented preparations, and minimal refined carbohydrates — was remarkably well-suited to Indian metabolic biology. The shift over the last 50 years toward refined wheat (maida), white rice, and processed snacks coincided precisely with the explosion of lifestyle diseases. The food changed. The body's response changed with it.",
//                   },
//                   {
//                     emoji: "🔬",
//                     title: "The Science Converges",
//                     body: "Decades of research on traditional Indian grains, fermentation, and metabolic outcomes now supports what our grandmothers knew intuitively. GRASA sits at the intersection of ancient food wisdom and modern clinical nutrition — taking what we know and making it available, palatable, and personalised for the modern Indian body.",
//                   },
//                   {
//                     emoji: "🏙️",
//                     title: "Delivery Infrastructure Arrives",
//                     body: "Fresh, specially prepared food — stone-ground, soaked, sun-dried — can now reach someone's door anywhere in Delhi NCR. The logistics that once made a food-based clinical programme impossible are no longer a barrier. Right now, in Delhi NCR, one person at a time, one family at a time.",
//                   },
//                   {
//                     emoji: "🏅",
//                     title: "National Recognition — 2026",
//                     body: "Awarded the Rashtriya Ratna Samman 2026 as India's Emerging Health Tech & Nutrition Innovation Startup of the Year — presented by Ms. Kangana Ranaut, MP — validating GRASA's mission to make food-first intervention mainstream across Indian healthcare.",
//                   },
//                 ].map((item, i, arr) => (
//                   <div key={i} className="flex gap-6 relative group">
//                     {/* Line */}
//                     {i < arr.length - 1 && (
//                       <div className="absolute left-6 top-14 bottom-0 w-[2px] bg-gradient-to-b from-[#d6d1c4] to-transparent" />
//                     )}
//                     {/* Dot */}
//                     <div className="flex-shrink-0 w-12 h-12 bg-[#1b1b1b] rounded-full flex items-center justify-center text-xl z-10 group-hover:scale-110 transition-transform duration-300">
//                       {item.emoji}
//                     </div>
//                     <div className="pb-12">
//                       <h3 className="font-bold text-[#1b1b1b] text-xl mb-3 mt-2">{item.title}</h3>
//                       <p className="text-[#5c5c5c] font-medium text-sm leading-relaxed">{item.body}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

    

//         {/* ══════════════════════════════════════════════════
//             WHO WE SERVE — 3 PERSONAS
//         ══════════════════════════════════════════════════ */}
//         <section className="py-24 px-6 md:px-12 bg-white border-y border-[#d6d1c4]">
//           <div className="max-w-6xl mx-auto">
//             <div className="mb-16">
//               <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">
//                 Who GRASA Serves
//               </span>
//               <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6 max-w-3xl">
//                 Three people.{" "}
//                 <span className="text-[#1b1b1b] bg-[#C5D82D] italic font-serif inline px-2 py-1 box-decoration-clone">
//                   Three plans.
//                 </span>
//               </h2>
//               <p className="text-lg text-[#5c5c5c] font-medium max-w-3xl">
//                 The same food affects two people differently. GRASA builds each plan around the specific person — their condition, their biology, their life. Generic plans fail because they ignore this. GRASA does not.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               {/* Comparison: Refined vs Millets */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#d6d1c4] rounded-3xl overflow-hidden">
//                 <div className="bg-[#f4f4f2] p-8 border-b md:border-b-0 md:border-r border-[#d6d1c4]">
//                   <div className="flex items-center gap-3 mb-6">
//                     <ShieldAlert className="text-red-500" size={24} />
//                     <h3 className="text-lg font-bold text-[#1b1b1b]">Refined Grains</h3>
//                   </div>
//                   <ul className="space-y-3">
//                     {[
//                       "Sharp blood sugar spikes",
//                       "Feeds harmful gut bacteria",
//                       "Strips fibre & micronutrients",
//                       "Drives visceral fat accumulation",
//                     ].map((item, i) => (
//                       <li key={i} className="flex gap-2 text-[#5c5c5c] font-medium text-sm">
//                         <ArrowUpRight className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="bg-[#1b1b1b] p-8 text-white">
//                   <div className="flex items-center gap-3 mb-6">
//                     <CheckCircle2 className="text-[#C5D82D]" size={24} />
//                     <h3 className="text-lg font-bold">Ancient Millets</h3>
//                   </div>
//                   <ul className="space-y-3">
//                     {[
//                       "Flat, stable blood sugar curve",
//                       "Actively feeds beneficial bacteria",
//                       "Rich in fibre, iron, magnesium",
//                       "Reduces visceral fat over time",
//                     ].map((item, i) => (
//                       <li key={i} className="flex gap-2 text-gray-300 font-medium text-sm">
//                         <CheckCircle2 className="text-[#C5D82D] flex-shrink-0 mt-0.5" size={16} />
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Personalisation factors */}
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   { icon: <Droplets size={20} />, title: "Age & Gender", desc: "Metabolic rate, hormonal patterns, and risk profiles shape grain selection." },
//                   { icon: <Utensils size={20} />, title: "Eating Habits", desc: "GRASA works within your food culture and routine, not against them." },
//                   { icon: <Zap size={20} />, title: "Energy Levels", desc: "Carb needs vary significantly with activity. Getting this wrong produces poor results." },
//                   { icon: <Target size={20} />, title: "Health Goals", desc: "Composition, timing, and portions adjusted to your specific medical goals." },
//                 ].map((item, i) => (
//                   <div key={i} className="bg-[#f4f4f2] p-5 rounded-2xl border border-[#d6d1c4]">
//                     <div className="text-[#849411] mb-3">{item.icon}</div>
//                     <h4 className="font-bold text-[#1b1b1b] text-sm mb-1">{item.title}</h4>
//                     <p className="text-[#5c5c5c] text-xs leading-relaxed">{item.desc}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Three personas */}
//             <div className="bg-[#f4f4f2] p-8 md:p-12 rounded-3xl border border-[#d6d1c4]">
//               <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-2 inline-block">
//                 Example — How plans differ
//               </span>
//               <h3 className="text-3xl font-bold text-[#1b1b1b] mb-8 mt-4">
//                 Three different people. Three different plans.
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 {[
//                   {
//                     person: "Person A — Reena, 34",
//                     goal: "PCOS Management",
//                     items: ["Ragi + foxtail millet emphasis", "Lower simple carbs", "Iron-rich grain rotation", "Hormone-supporting meal timing"],
//                   },
//                   {
//                     person: "Person B — Vikram, 51",
//                     goal: "Fatty Liver + Energy",
//                     items: ["Foxtail + jowar base", "Higher fibre target", "Liver-supportive preparation", "Larger morning portion, lighter dinner"],
//                   },
//                   {
//                     person: "Person C — Sanjay, 29",
//                     goal: "Longevity & Health",
//                     items: ["Diverse grain rotation", "Prebiotic-focused", "Energy-optimised carb timing", "Micronutrient coverage across grains"],
//                   },
//                 ].map((p, i) => (
//                   <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#d6d1c4] hover:border-[#1b1b1b] transition-colors">
//                     <p className="font-bold text-[#1b1b1b] mb-1">{p.person}</p>
//                     <p className="text-xs font-bold text-[#849411] uppercase tracking-wider mb-4">Goal: {p.goal}</p>
//                     <ul className="text-sm text-[#5c5c5c] space-y-2">
//                       {p.items.map((item, j) => (
//                         <li key={j} className="flex gap-2">
//                           <CheckCircle2 size={14} className="text-[#C5D82D] flex-shrink-0 mt-0.5" />
//                           {item}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//               <p className="text-center mt-8 text-[#5c5c5c] font-medium text-sm">
//                 <strong className="text-[#1b1b1b]">What stays the same:</strong> The food is always fresh, specially prepared, and home-delivered. The guidance is always ongoing. The plan always evolves.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════════════════
//             GUT HEALTH STRIP
//         ══════════════════════════════════════════════════ */}
//         <section className="py-24 px-6 md:px-12 bg-[#1b1b1b] text-white">
//           <div className="max-w-6xl mx-auto">
//             <div className="mb-16 text-center max-w-3xl mx-auto">
//               <span className="text-[#1b1b1b] bg-[#C5D82D] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">
//                 04. Gut Health
//               </span>
//               <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
//                 Your gut bacteria{" "}
//                 <span className="text-[#C5D82D] italic font-serif pr-2">
//                   determine more than you think.
//                 </span>
//               </h2>
//               <p className="text-lg text-gray-300 font-medium">
//                 The gut microbiome influences your blood sugar, weight, immune response, energy, and mental clarity. And it is shaped, more than anything else, by what you eat.
//               </p>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {[
//                 { icon: <ShieldAlert size={28} className="text-red-400" />, title: "Refined grains feed the wrong bacteria", desc: "Refined carbs are rapidly absorbed, leaving little for beneficial bacteria. Harmful, inflammation-promoting species dominate." },
//                 { icon: <Leaf size={28} className="text-[#C5D82D]" />, title: "Whole millets are prebiotic", desc: "Resistant starch and fibre pass intact to the large intestine, feeding beneficial bacteria that produce inflammation-reducing short-chain fatty acids." },
//                 { icon: <Dna size={28} className="text-[#C5D82D]" />, title: "The gut-liver connection", desc: "A healthy gut microbiome reduces toxic compounds reaching the liver — directly reducing the liver's inflammatory burden. Essential for fatty liver reversal." },
//                 { icon: <Clock size={28} className="text-[#C5D82D]" />, title: "Measurable and fast", desc: "Meaningful shifts in gut microbiome composition begin within 2–4 weeks of sustained dietary change, aligning with rapidly reduced bloating." },
//               ].map((item, i) => (
//                 <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
//                   <div className="mb-6 bg-white/10 w-14 h-14 rounded-full flex items-center justify-center">
//                     {item.icon}
//                   </div>
//                   <h4 className="font-bold text-xl mb-3">{item.title}</h4>
//                   <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-12 text-center">
//               <p className="text-[#C5D82D] font-medium text-lg max-w-3xl mx-auto">
//                 &quot;The bloating and heaviness after meals that most people accept as normal is not normal — it is a sign of a disrupted microbiome. For GRASA users, this is typically the first thing to improve.&quot;
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════════════════
//             TIMELINE — WHAT CHANGES WHEN
//         ══════════════════════════════════════════════════ */}
//         <section className="py-24 px-6 md:px-12 bg-[#f4f4f2]">
//           <div className="max-w-4xl mx-auto text-center mb-16">
//             <h2 className="text-4xl font-bold text-[#1b1b1b] leading-tight mb-6">
//               Four mechanisms.{" "}
//               <span className="text-[#1b1b1b] bg-[#C5D82D] italic font-serif inline px-2 py-1 box-decoration-clone">
//                 One outcome — your body works better.
//               </span>
//             </h2>
//             <p className="text-lg text-[#5c5c5c] font-medium">
//               Superior grain nutrition, improved preparation, stabilised blood sugar, and gut microbiome restoration act simultaneously. Most people notice the change in how they <em>feel</em> before anything else.
//             </p>
//           </div>

//           <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative">
//             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-[#d6d1c4] -z-10" />
//             <div className="bg-white border border-[#d6d1c4] p-8 rounded-3xl relative">
//               <span className="bg-[#1b1b1b] text-[#C5D82D] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full absolute -top-3 left-8">Wk 1–2</span>
//               <h4 className="font-bold text-[#1b1b1b] text-xl mt-4 mb-3">What you feel first</h4>
//               <p className="text-[#5c5c5c] text-sm leading-relaxed">Reduced post-meal heaviness. Less bloating. More consistent energy through the day. Better sleep in many cases.</p>
//             </div>
//             <div className="bg-white border border-[#d6d1c4] p-8 rounded-3xl relative">
//               <span className="bg-[#1b1b1b] text-[#C5D82D] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full absolute -top-3 left-8">Wk 3–6</span>
//               <h4 className="font-bold text-[#1b1b1b] text-xl mt-4 mb-3">What continues changing</h4>
//               <p className="text-[#5c5c5c] text-sm leading-relaxed">Weight begins shifting. Digestion consistently improved. Morning energy more reliable. Cravings for refined carbs typically reduce.</p>
//             </div>
//             <div className="bg-white border border-[#C5D82D] p-8 rounded-3xl relative shadow-[0_0_20px_rgba(197,216,45,0.2)]">
//               <span className="bg-[#C5D82D] text-[#1b1b1b] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full absolute -top-3 left-8">Month 3+</span>
//               <h4 className="font-bold text-[#1b1b1b] text-xl mt-4 mb-3">The deeper changes</h4>
//               <p className="text-[#5c5c5c] text-sm leading-relaxed">Measurable improvements in metabolic markers for those with existing concerns. Sustainable weight loss. Long-term habit shift.</p>
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════════════════
//             WHY NOW
//         ══════════════════════════════════════════════════ */}
//         <section className="py-24 px-6 md:px-12 bg-white border-y border-[#d6d1c4]">
//           <div className="max-w-6xl mx-auto">
//             <div className="mb-16 max-w-3xl">
//               <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4 block">Why GRASA, Why Now</span>
//               <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight">
//                 The conditions for this to work have{" "}
//                 <span className="text-[#1b1b1b] bg-[#C5D82D] italic font-serif inline px-2 py-1 box-decoration-clone">
//                   never been better.
//                 </span>
//               </h2>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 {
//                   number: "01",
//                   title: "The Evidence",
//                   subtitle: "The science of millet and metabolic health is now clinical.",
//                   body: "Decades of research on traditional Indian grains, fermentation, and metabolic outcomes now supports what our grandmothers knew intuitively. The gap between traditional food wisdom and clinical nutrition has closed significantly.",
//                 },
//                 {
//                   number: "02",
//                   title: "The Awareness",
//                   subtitle: "Indians are asking better questions about food.",
//                   body: "A generation of urban Indians — educated, aware, increasingly health-conscious — is questioning what they eat in a way no previous generation did. The appetite for food-based health intervention has never been higher.",
//                 },
//                 {
//                   number: "03",
//                   title: "The Moment",
//                   subtitle: "Delivery infrastructure makes it possible.",
//                   body: "Fresh, specialised food — prepared correctly, delivered consistently — can now reach someone's door anywhere in Delhi NCR. The logistics that once made a food-based clinical programme impossible are no longer a barrier.",
//                 },
//               ].map((item, i) => (
//                 <div key={i} className="bg-[#f4f4f2] border border-[#d6d1c4] p-8 rounded-3xl hover:border-[#1b1b1b] transition-colors">
//                   <span className="text-[#C5D82D] bg-[#1b1b1b] w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-6">
//                     {item.number}
//                   </span>
//                   <h3 className="font-bold text-[#1b1b1b] text-2xl mb-2">{item.title}</h3>
//                   <p className="text-[#849411] font-semibold text-sm mb-4">{item.subtitle}</p>
//                   <p className="text-[#5c5c5c] text-sm leading-relaxed">{item.body}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════════════════
//             CTA
//         ══════════════════════════════════════════════════ */}
//         <section className="bg-[#1b1b1b] text-white py-24 px-6 md:px-12 text-center rounded-t-[2.5rem] md:rounded-t-[4rem] relative overflow-hidden">
//           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C5D82D] opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
//           <div className="max-w-3xl mx-auto relative z-10">
//             {/* Award badge */}
//             <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mb-8">
//               <Award size={16} className="text-[#C5D82D]" />
//               <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
//                 Nationally recognised · Rashtriya Ratna Samman 2026
//               </span>
//             </div>

//             <h2 className="text-5xl text-[#C5D82D] font-serif italic font-extrabold mb-6">Ready?</h2>
//             <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">
//               This is what we believe. <br className="md:hidden" />
//               The programme is how we prove it.
//             </p>
//             <p className="text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
//               Every person who completes a GRASA plan is evidence. A free conversation with our nutritionist — your situation, your goals, honest guidance on whether GRASA is the right fit.
//             </p>

//             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
//               <button
//                 onClick={() => window.open("tel:+919870263399")}
//                 className="w-full sm:w-auto px-8 py-4 bg-[#C5D82D] text-[#1b1b1b] font-bold rounded-2xl flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(197,216,45,0.4)] transition-all duration-300"
//               >
//                 <Phone size={20} />
//                 Call Us Now — Free
//               </button>
//               <button
//                 onClick={() => window.open("https://wa.me/919870263399")}
//                 className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
//               >
//                 <MessageCircle size={20} />
//                 Chat on WhatsApp
//               </button>
//               <button
//                 onClick={() => window.location.href = "/science"}
//                 className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
//               >
//                 Read the Science <ArrowRight size={20} />
//               </button>
//             </div>

//             {/* Contact details */}
//             <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 border-t border-white/10 pt-8">
//               <span className="flex items-center gap-2">
//                 <MapPin size={14} className="text-[#C5D82D]" />
//                 IDC India, Ashoka Estate, Barakhamba Road, Connaught Place, New Delhi – 110001
//               </span>
//               <span className="flex items-center gap-2">
//                 <Mail size={14} className="text-[#C5D82D]" />
//                 support@grasafoods.com
//               </span>
//               <span className="flex items-center gap-2">
//                 <Star size={14} className="text-[#C5D82D]" />
//                 FSSAI: 23326009000349
//               </span>
//             </div>
//           </div>
//         </section>

//         {/* ══════════════════════════════════════════════════
//             DISCLAIMER
//         ══════════════════════════════════════════════════ */}
//         <div className="bg-[#f4f4f2] px-6 md:px-12 py-8">
//           <div className="max-w-4xl mx-auto p-6 border border-[#d6d1c4] rounded-2xl bg-white/50">
//             <p className="text-xs text-[#5c5c5c] leading-relaxed">
//               <strong className="text-[#1b1b1b]">A note:</strong> The research referenced on this page refers to published studies on traditional Indian grains and metabolic health — not to GRASA-specific clinical trials. GRASA is a food programme, not a medicine. Individual results will vary. This page is intended to help you understand why food-based intervention can produce real metabolic outcomes — not to make medical claims. Always speak with your doctor about your specific health situation. GRASA Millets &amp; Foods Pvt. Ltd. FSSAI Reg. No. 23326009000349. © 2026 All rights reserved.
//             </p>
//           </div>
//         </div>

//       </div>
//     </>
//   );
// }













"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Phone,
  CheckCircle2,
  Activity,
  Clock,
  ShieldAlert,
  Leaf,
  Dna,
  Utensils,
  Zap,
  Target,
  Award,
  Users,
  TrendingDown,
  Heart,
  Microscope,
  Star,
  MapPin,
  Mail,
  MessageCircle,
  ChevronDown,
  Droplets,
  Sun,
  Wind,
  ArrowUpRight,
} from "lucide-react";

// ─── Schema ────────────────────────────────────────────────────────────────
const generateAboutSchema = () => {
  const domain = "https://www.grasamillets.com";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        name: "GRASA Millets & Foods Pvt. Ltd.",
        url: domain,
        logo: { "@type": "ImageObject", url: `${domain}/logo.png` },
        address: {
          "@type": "PostalAddress",
          streetAddress: "GL-7, Ashoka Estate Building, Barakhamba Road, Connaught Place",
          addressLocality: "New Delhi",
          postalCode: "110001",
          addressCountry: "IN",
        },
        telephone: "+919870263399",
        email: "support@grasafoods.com",
        award: "Rashtriya Ratna Samman 2026 — Emerging Health Tech & Nutrition Innovation Startup of the Year",
      },
      {
        "@type": "AboutPage",
        "@id": `${domain}/about#webpage`,
        url: `${domain}/about`,
        name: "About GRASA — India's Food-First Metabolic Health Company",
        description:
          "GRASA was built on the conviction that food, when used correctly, is the most powerful metabolic intervention available to any human being.",
        inLanguage: "en",
        isPartOf: { "@id": `${domain}/#website` },
        publisher: { "@id": `${domain}/#organization` },
      },
    ],
  };
};

// ─── Animated Counter ──────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Intersection hook ────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Stat Card ────────────────────────────────────────────────────────────
function StatCard({
  prefix = "",
  value,
  suffix = "",
  label,
  source,
}: {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  source: string;
}) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1600, inView);
  return (
    <div
      ref={ref}
      className="group bg-white border border-[#d6d1c4] p-8 rounded-3xl hover:border-[#1b1b1b] hover:-translate-y-1 transition-all duration-300 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-[#C5D82D] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top rounded-l-3xl" />
      <p className="text-5xl font-extrabold text-[#1b1b1b] leading-none mb-3">
        {prefix}{count}{suffix}
      </p>
      <p className="text-[#1b1b1b] font-bold text-sm leading-snug mb-2">{label}</p>
      <p className="text-[#5c5c5c] text-xs uppercase tracking-wider font-semibold">{source}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────
export default function AboutPage() {
  const schema = generateAboutSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-[#f4f4f2] font-sans selection:bg-[#C5D82D] selection:text-[#1b1b1b]">


        {/* ══════════════════════════════════════════════════
            AWARD SHOWCASE
        ══════════════════════════════════════════════════ */}
        <section className="py-10 px-6 bg-white">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      {/* Award visual (UPDATED WITH IMAGE) */}
      <div className="relative">
  <div className="bg-[#f4f4f2]  overflow-hidden min-h-[360px] relative shadow-sm">

    <img
      src="https://res.cloudinary.com/daunsn0z7/image/upload/v1777271129/medicaps/social_img/lcst0w40cahkkvsduxpe.jpg"
      alt="Rashtriya Ratna Samman 2026"
      className="w-full h-full object-cover "
    />

          {/* Overlay (optional for style consistency) */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-3xl" /> */}

          {/* Text Overlay */}
        
        </div>

        {/* Offset border */}
        <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C5D82D]/30 rounded-3xl -z-10" />
      </div>

      {/* Award copy (UNCHANGED) */}
      <div>
        <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">
          National Recognition
        </span>

        <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6">
          Nationally recognised.{" "} Rashtriya Ratna Samman 2026.
        </h2>

        <p className="text-lg text-[#5c5c5c] font-medium leading-relaxed mb-8">
          In 2026, GRASA was honoured with India&apos;s most prestigious startup recognition — the Rashtriya Ratna Samman — in the category of Emerging Health Tech &amp; Nutrition Innovation Startup of the Year.
        </p>

        <div className="bg-[#f4f4f2] border border-[#d6d1c4] p-6 rounded-3xl relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C5D82D]" />
          <p className="text-[#1b1b1b] font-bold text-base leading-snug">
            Presented by{" "}
            <span className="text-[#849411]">Ms. Kangana Ranaut, MP</span>, this national award recognises GRASA&apos;s pioneering work in making food-based metabolic intervention accessible, guided, and measurable for every Indian.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            "Health Tech Innovation",
            "Nutrition Science",
            "Fermented Millets",
            "Delhi NCR",
          ].map((tag, i) => (
            <span
              key={i}
              className="px-4 py-2 rounded-full border border-[#d6d1c4] bg-white text-[#5c5c5c] text-xs font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>
  </div>
</section>

      

        {/* ══════════════════════════════════════════════════
            THE CORE ARGUMENT / OUR STORY
        ══════════════════════════════════════════════════ */}
        <section className="py-10 px-6 md:px-12 bg-white ">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Sticky left */}
              <div className="lg:sticky lg:top-24">
                <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4 block">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-8">
                  India doesn&apos;t have a medicine problem.{" "} It has a food problem.
                  {/* <span className="text-[#1b1b1b] bg-[#C5D82D] italic font-serif inline px-2 py-1 box-decoration-clone">
                    It has a food problem.
                  </span> */}
                </h2>
                {/* Founder quote */}
                <div className="bg-[#1b1b1b] text-white p-8 rounded-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5D82D] opacity-10 rounded-full blur-2xl" />
                  <blockquote className="text-lg font-bold leading-snug mb-6 relative z-10">
                    &quot;I started GRASA because I kept seeing the same thing — people managing conditions for years with growing lists of medicines, and nobody asking them what they were eating. Not once.&quot;
                  </blockquote>
                  <p className="text-[#C5D82D] font-bold text-xs uppercase tracking-wider relative z-10">
                    — Founder, GRASA
                  </p>
                </div>
              </div>

              {/* Right timeline */}
              <div className="space-y-0">
                {[
                  {
                    emoji: "🌾",
                    title: "The Food Problem",
                    body: "India's traditional diet — built around millets, lentils, vegetables, fermented preparations, and minimal refined carbohydrates — was remarkably well-suited to Indian metabolic biology. The shift over the last 50 years toward refined wheat (maida), white rice, and processed snacks coincided precisely with the explosion of lifestyle diseases. The food changed. The body's response changed with it.",
                  },
                  {
                    emoji: "🔬",
                    title: "The Science Converges",
                    body: "Decades of research on traditional Indian grains, fermentation, and metabolic outcomes now supports what our grandmothers knew intuitively. GRASA sits at the intersection of ancient food wisdom and modern clinical nutrition — taking what we know and making it available, palatable, and personalised for the modern Indian body.",
                  },
                  {
                    emoji: "🏙️",
                    title: "Delivery Infrastructure Arrives",
                    body: "Fresh, specially prepared food — stone-ground, soaked, sun-dried — can now reach someone's door anywhere in Delhi NCR. The logistics that once made a food-based clinical programme impossible are no longer a barrier. Right now, in Delhi NCR, one person at a time, one family at a time.",
                  },
                  {
                    emoji: "🏅",
                    title: "National Recognition — 2026",
                    body: "Awarded the Rashtriya Ratna Samman 2026 as India's Emerging Health Tech & Nutrition Innovation Startup of the Year — presented by Ms. Kangana Ranaut, MP — validating GRASA's mission to make food-first intervention mainstream across Indian healthcare.",
                  },
                ].map((item, i, arr) => (
                  <div key={i} className="flex gap-6 relative group">
                    {/* Line */}
                    {i < arr.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-0 w-[2px] bg-gradient-to-b from-[#d6d1c4] to-transparent" />
                    )}
                    {/* Dot */}
                    <div className="flex-shrink-0 w-12 h-12 bg-[#1b1b1b] rounded-full flex items-center justify-center text-xl z-10 group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </div>
                    <div className="pb-12">
                      <h3 className="font-bold text-[#1b1b1b] text-xl mb-3 mt-2">{item.title}</h3>
                      <p className="text-[#5c5c5c] font-medium text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


    
        {/* ══════════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════════ */}
        <section className="bg-[#1b1b1b] text-white py-24 px-6 md:px-12 text-center rounded-t-[2.5rem] md:rounded-t-[4rem] relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C5D82D] opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          <div className="max-w-3xl mx-auto relative z-10">
            {/* Award badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full mb-8">
              <Award size={16} className="text-[#C5D82D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Nationally recognised · Rashtriya Ratna Samman 2026
              </span>
            </div>

            <h2 className="text-5xl text-[#C5D82D] font-serif italic font-extrabold mb-6">Ready?</h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">
              This is what we believe. <br className="md:hidden" />
              The programme is how we prove it.
            </p>
            <p className="text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
              Every person who completes a GRASA plan is evidence. A free conversation with our nutritionist — your situation, your goals, honest guidance on whether GRASA is the right fit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => window.open("tel:+919870263399")}
                className="w-full sm:w-auto px-8 py-4 bg-[#C5D82D] text-[#1b1b1b] font-bold rounded-2xl flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(197,216,45,0.4)] transition-all duration-300"
              >
                <Phone size={20} />
                Call Us Now — Free
              </button>
              <button
                onClick={() => window.open("https://wa.me/919870263399")}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </button>
              <button
                onClick={() => window.location.href = "/science"}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
              >
                Read the Science <ArrowRight size={20} />
              </button>
            </div>

            {/* Contact details */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 border-t border-white/10 pt-8">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[#C5D82D]" />
                IDC India, Ashoka Estate, Barakhamba Road, Connaught Place, New Delhi – 110001
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="text-[#C5D82D]" />
                support@grasafoods.com
              </span>
              <span className="flex items-center gap-2">
                <Star size={14} className="text-[#C5D82D]" />
                FSSAI: 23326009000349
              </span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            DISCLAIMER
        ══════════════════════════════════════════════════ */}
        <div className="bg-[#f4f4f2] px-6 md:px-12 py-8">
          <div className="max-w-4xl mx-auto p-6 border border-[#d6d1c4] rounded-2xl bg-white/50">
            <p className="text-xs text-[#5c5c5c] leading-relaxed">
              <strong className="text-[#1b1b1b]">A note:</strong> The research referenced on this page refers to published studies on traditional Indian grains and metabolic health — not to GRASA-specific clinical trials. GRASA is a food programme, not a medicine. Individual results will vary. This page is intended to help you understand why food-based intervention can produce real metabolic outcomes — not to make medical claims. Always speak with your doctor about your specific health situation. GRASA Millets &amp; Foods Pvt. Ltd. FSSAI Reg. No. 23326009000349. © 2026 All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}