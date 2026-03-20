"use client";

import React from "react";
import { 
  ArrowRight, Phone, Droplets, Sun, Wind, CheckCircle2, 
  Activity, Clock, TrendingDown, ShieldAlert, Leaf, 
  Dna, Utensils, Zap, Target, ArrowDownRight, ArrowUpRight
} from "lucide-react";

export default function SciencePage() {
  return (
    <div className="min-h-screen bg-[#f4f4f2] font-sans selection:bg-[#C5D82D] selection:text-[#1b1b1b]">
      
      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#1b1b1b] text-white pt-20 pb-24 px-6 md:px-12 rounded-b-[2.5rem] md:rounded-b-[4rem] relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#C5D82D] opacity-5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <span className="text-[#C5D82D] font-bold tracking-wider uppercase text-sm md:text-base flex items-center gap-2 mb-6">
            <span className="w-8 h-[2px] bg-[#C5D82D]"></span> GRASA The Science
          </span>
          <h1 className="text-5xl  font-extrabold leading-[1.1] tracking-tight mb-8">
            Why food works. <br />
            How <span className="text-[#C5D82D] italic font-serif pr-2">this food</span> works. <br />
            What changes in your body.
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl font-normal leading-relaxed mb-12">
            GRASA is built on decades of research on Indian grain nutrition, metabolic health, and the science of how food preparation affects what your body actually absorbs and does with what you eat.
          </p>

          {/* Core Pillars Nav Pills */}
          <div className="flex flex-wrap gap-3">
            {["Ancient Grains", "Preparation Science", "Blood Sugar & Fat", "Gut Health", "Personalisation"].map((pillar, i) => (
              <span key={i} className="px-5 py-2.5 rounded-full border border-white/20 bg-white/5 text-sm font-bold tracking-wide uppercase text-gray-300 backdrop-blur-sm">
                {pillar}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= THE CORE ARGUMENT ================= */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-24">
            <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4 block">The core argument</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight">
              The food that made India healthy for thousands of years still works. <br />
              <span className="text-[#849411] italic">We just stopped eating it.</span>
            </h2>
          </div>
          <div className="space-y-6 text-lg text-[#5c5c5c] font-medium leading-relaxed">
            <p>
              India's traditional diet — built around millets, lentils, vegetables, fermented preparations, and minimal refined carbohydrates — was remarkably well-suited to Indian metabolic biology. The shift over the last 50 years toward refined wheat (maida), white rice, processed snacks, and excess sugar has coincided precisely with the explosion of lifestyle diseases.
            </p>
            <p>
              This is not a coincidence. <strong className="text-[#1b1b1b]">The food changed. The body's response changed with it.</strong>
            </p>
            <p>
              GRASA's science is not about discovering something new. It is about taking what we know — from traditional food practice and from modern nutritional research — and making it available, palatable, and personalised for the modern Indian body.
            </p>
            <div className="bg-white border border-[#d6d1c4] p-8 rounded-3xl shadow-sm mt-8 relative overflow-hidden group hover:border-[#1b1b1b] transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C5D82D]"></div>
              <p className="text-[#1b1b1b] font-bold text-lg leading-snug">
                Every product GRASA makes, and every plan GRASA builds, is grounded in four areas of evidence: the metabolic properties of ancient Indian grains, the science of preparation methods that unlock their full benefit, how replacing refined carbohydrates changes blood sugar and fat accumulation, and how traditionally prepared whole grains improve gut health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 01 ANCIENT GRAINS ================= */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-[#d6d1c4]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-3xl">
            <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">01. Ancient Indian Grains</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6">
              Why millets are metabolically superior to refined grains
            </h2>
            <p className="text-lg text-[#5c5c5c] font-medium">
              The word "millet" covers a family of ancient grains that were the foundation of Indian diets for millennia. They were replaced not because they were inferior, but because refined wheat and white rice were cheaper to produce and easier to sell. <strong className="text-[#1b1b1b]">The metabolic consequences of that substitution are now visible in India's health statistics.</strong>
            </p>
          </div>

          {/* Comparison Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#d6d1c4] rounded-3xl overflow-hidden mb-16">
            <div className="bg-[#f4f4f2] p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#d6d1c4]">
              <div className="flex items-center gap-3 mb-6">
                <ShieldAlert className="text-red-500" size={28} />
                <h3 className="text-xl font-bold text-[#1b1b1b]">Refined grains <span className="text-sm font-normal text-[#5c5c5c] block">(white rice, maida, white bread)</span></h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Stripped of fibre during processing — digests rapidly",
                  "High glycaemic index — causes sharp blood sugar spikes",
                  "Minimal micronutrients — most lost in milling",
                  "Feeds harmful gut bacteria more than beneficial ones",
                  "Calorie-dense, nutrition-poor — leaves you hungry faster"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-[#5c5c5c] font-medium">
                    <ArrowUpRight className="text-red-400 flex-shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#1b1b1b] p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="text-[#C5D82D]" size={28} />
                <h3 className="text-xl font-bold">Ancient millets <span className="text-sm font-normal text-gray-400 block">(bajra, jowar, ragi, foxtail)</span></h3>
              </div>
              <ul className="space-y-4">
                {[
                  "High insoluble and soluble fibre — slows digestion significantly",
                  "Low to medium glycaemic index — prevents blood sugar spikes",
                  "Rich in magnesium, iron, zinc, B vitamins — often depleted",
                  "Prebiotic properties — actively feeds beneficial gut bacteria",
                  "Higher protein content — keeps you fuller for longer"
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-300 font-medium">
                    <CheckCircle2 className="text-[#C5D82D] flex-shrink-0 mt-1" size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Millet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Pearl Millet", name: "Bajra", tags: ["High iron", "Bone health", "Low GI"], desc: "One of the richest plant sources of iron. Particularly important for Indian women, who are disproportionately iron-deficient. Also high in magnesium — a mineral that plays a direct role in insulin sensitivity." },
              { title: "Sorghum", name: "Jowar", tags: ["Gluten free", "Antioxidants", "Cholesterol"], desc: "Contains unique antioxidants not found in other grains. Research shows regular jowar consumption is associated with reduced bad cholesterol levels. Completely gluten-free and easy to digest." },
              { title: "Finger Millet", name: "Ragi / Nachni", tags: ["Calcium dense", "Blood sugar", "Weight loss"], desc: "Exceptional calcium content — higher than most plant foods and comparable to some dairy. Studies specifically show ragi consumption reduces fasting blood sugar in Type 2 diabetics over 90 days." },
              { title: "Foxtail Millet", name: "Kangni / Kakum", tags: ["Insulin response", "High protein", "Liver health"], desc: "Strong evidence for improved insulin response and reduced triglycerides. Higher protein content than wheat. Associated with improved liver enzyme levels in people with fatty liver." },
              { title: "Little Millet", name: "Kutki / Moraiyo", tags: ["Digestive ease", "B vitamins", "Antioxidants"], desc: "Exceptionally easy on the digestive system — one of the reasons it has been used in Ayurvedic recovery diets for centuries. Rich in niacin (B3), which plays a direct role in cholesterol metabolism." },
              { title: "Barnyard Millet", name: "Sanwa / Jhangora", tags: ["Highest fibre", "Low GI", "Satiety"], desc: "Among the highest dietary fibre content of all millets. The fibre slows gastric emptying significantly — meaning you feel full longer, eat less at the next meal, and your blood sugar stays stable." }
            ].map((millet, i) => (
              <div key={i} className="bg-white border border-[#d6d1c4] p-6 rounded-3xl hover:border-[#1b1b1b] transition-all hover:-translate-y-1 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-[#1b1b1b] font-bold text-xl">{millet.title}</h4>
                    <span className="text-[#5c5c5c] text-sm font-semibold uppercase tracking-wider">{millet.name}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {millet.tags.map((tag, j) => (
                    <span key={j} className="bg-[#f4f4f2] text-[#1b1b1b] text-[11px] font-bold uppercase px-2.5 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
                <p className="text-[#5c5c5c] text-sm leading-relaxed">{millet.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 02 PREPARATION SCIENCE ================= */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">02. Preparation Science</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6 max-w-3xl">
            Why <span className="italic font-serif pr-1">how</span> it's prepared matters as much as what grain it is
          </h2>
          <p className="text-lg text-[#5c5c5c] font-medium max-w-4xl">
            The metabolic benefit of any grain is not fixed. It depends enormously on how it is prepared. Traditional Indian food preparation methods were developed without any knowledge of biochemistry. But they achieve something biochemistry now explains clearly: <strong className="text-[#1b1b1b]">they increase the bioavailability of nutrients, reduce compounds that block absorption, and change the way the grain is digested.</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mb-16">
          {[
            { icon: <Droplets size={32} className="text-[#C5D82D]" />, num: "01", title: "Washing & soaking", desc: "Grains are soaked in water for several hours. This activates enzymes that begin breaking down phytic acid — a compound that binds to minerals like iron, zinc, and calcium and prevents their absorption.", stat: "↑ Mineral absorption by up to 60%" },
            { icon: <Sun size={32} className="text-[#C5D82D]" />, num: "02", title: "Natural sun drying", desc: "After soaking, grains are dried in natural sunlight. This reduces moisture content in a way that preserves heat-sensitive B vitamins and polyphenols that would be destroyed by industrial drying methods.", stat: "Preserves heat-sensitive nutrients" },
            { icon: <Wind size={32} className="text-[#C5D82D]" />, num: "03", title: "Stone grinding", desc: "Cold stone grinding (chakki) keeps the grain at a low temperature throughout milling, preserving oils, enzymes, and the complete fibre structure of the grain. Industrial roller milling strips all of these.", stat: "Complete bran + germ retained" },
            { icon: <Clock size={32} className="text-[#C5D82D]" />, num: "04", title: "Small batch freshness", desc: "All GRASA products are made in small batches and delivered fresh. Rancidity in grain oils — which begins within days of grinding — is eliminated. You receive the grain as it was meant to be consumed.", stat: "Maximum nutritional integrity" }
          ].map((step, i) => (
            <div key={i} className="flex gap-6 group">
              <div className="bg-[#1b1b1b] p-4 rounded-2xl h-fit flex-shrink-0 group-hover:-translate-y-1 transition-transform duration-300">
                {step.icon}
              </div>
              <div>
                <span className="text-[#d6d1c4] font-extrabold text-2xl block mb-1">{step.num}</span>
                <h4 className="font-bold text-[#1b1b1b] text-xl mb-2">{step.title}</h4>
                <p className="text-[#5c5c5c] text-sm leading-relaxed mb-4">{step.desc}</p>
                <span className="inline-block bg-[#ebecdf] text-[#849411] text-xs font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide">
                  {step.stat}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Blockquote */}
        <div className="bg-[#1b1b1b] text-white p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5D82D] opacity-10 rounded-full blur-2xl"></div>
          <blockquote className="text-xl md:text-3xl font-bold leading-tight mb-8 max-w-4xl relative z-10">
            "The difference between a grain that <span className="text-[#C5D82D] italic">sits on a shelf</span> and one that was <span className="text-[#C5D82D] italic">soaked, dried, and stone-ground fresh</span> is not a minor nutritional detail. It is the difference between eating the shell of something and eating the thing itself."
          </blockquote>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 border-t border-white/10 pt-8">
            <p className="text-gray-300 text-sm flex gap-3"><CheckCircle2 size={18} className="text-[#C5D82D] flex-shrink-0" /> Phytic acid reduced by soaking — unlocking minerals</p>
            <p className="text-gray-300 text-sm flex gap-3"><CheckCircle2 size={18} className="text-[#C5D82D] flex-shrink-0" /> Stone grinding preserves the complete grain structure</p>
            <p className="text-gray-300 text-sm flex gap-3"><CheckCircle2 size={18} className="text-[#C5D82D] flex-shrink-0" /> Fresh delivery eliminates oil rancidity (inflammation)</p>
            <p className="text-gray-300 text-sm flex gap-3"><CheckCircle2 size={18} className="text-[#C5D82D] flex-shrink-0" /> Small batch preparation ensures peak nutrition</p>
          </div>
        </div>
      </section>

      {/* ================= 03 BLOOD SUGAR & FAT ================= */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-[#d6d1c4]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">03. Blood Sugar & Fat</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6 max-w-3xl">
              How replacing refined carbohydrates changes what your body stores
            </h2>
            <p className="text-lg text-[#5c5c5c] font-medium max-w-4xl">
              Every time you eat a refined carbohydrate, your blood sugar rises sharply. Your body responds by releasing insulin to bring it back down. <strong className="text-[#1b1b1b]">Insulin's job, when there is excess glucose, is to convert it to fat and store it.</strong> Done many times a day, over many years, this is the mechanism behind weight gain, fatty liver, insulin resistance, and eventually Type 2 diabetes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Visual Chart Representation */}
            <div className="bg-[#f4f4f2] p-8 rounded-3xl border border-[#d6d1c4] relative h-[350px] flex flex-col justify-end overflow-hidden">
              <h4 className="absolute top-8 left-8 font-bold text-[#1b1b1b]">Blood Sugar Response</h4>
              
              {/* Refined Spike */}
              <div className="absolute bottom-0 left-[10%] w-[80%] h-full flex items-end opacity-40">
                <svg viewBox="0 0 100 100" className="w-full h-[80%] preserve-3d" preserveAspectRatio="none">
                  <path d="M0,100 C10,100 20,10 30,10 C40,10 60,90 100,100" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 4" />
                </svg>
                <div className="absolute top-[25%] left-[30%] text-red-500 text-xs font-bold uppercase bg-[#f4f4f2] px-2">Refined Grain Spike</div>
              </div>

              {/* Millet Curve */}
              <div className="absolute bottom-0 left-[10%] w-[80%] h-full flex items-end">
                <svg viewBox="0 0 100 100" className="w-full h-[60%] preserve-3d" preserveAspectRatio="none">
                  <path d="M0,100 C20,100 35,40 50,40 C65,40 80,95 100,100" fill="none" stroke="#849411" strokeWidth="4" />
                </svg>
                <div className="absolute top-[45%] left-[50%] text-[#849411] text-xs font-bold uppercase bg-[#f4f4f2] px-2">GRASA Millet Curve</div>
              </div>

              <div className="w-full border-t-2 border-[#d6d1c4] pt-2 flex justify-between text-xs font-bold text-[#5c5c5c] uppercase">
                <span>Meal Eaten</span>
                <span>Time (Hours) →</span>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <TrendingDown className="text-[#C5D82D] flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-[#1b1b1b] text-lg mb-1">Lower glycaemic response</h4>
                  <p className="text-[#5c5c5c] text-sm">Millet-based meals produce a flatter blood sugar curve — a slower rise, a gentler peak, and a gradual decline. No spike. No crash. No signal to store fat.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="text-[#C5D82D] flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-[#1b1b1b] text-lg mb-1">Slower gastric emptying</h4>
                  <p className="text-[#5c5c5c] text-sm">The fibre in millets slows how quickly food leaves the stomach. This means nutrients are absorbed gradually — reducing the total glycaemic load.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Activity className="text-[#C5D82D] flex-shrink-0" size={28} />
                <div>
                  <h4 className="font-bold text-[#1b1b1b] text-lg mb-1">Visceral fat reduction</h4>
                  <p className="text-[#5c5c5c] text-sm">Lower insulin spikes directly reduce visceral fat accumulation — the fat around organs that drives liver disease and metabolic syndrome in South Asians.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f4f4f2] p-8 md:p-10 rounded-3xl border border-[#d6d1c4]">
            <h3 className="text-xl font-bold text-[#1b1b1b] mb-6">What this means for GRASA users: The change begins at the first meal.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="flex gap-3 text-[#5c5c5c] font-medium text-sm"><CheckCircle2 className="text-[#C5D82D] flex-shrink-0" size={20}/> Replacing your daily atta or rice immediately lowers your daily glycaemic load.</p>
              <p className="flex gap-3 text-[#5c5c5c] font-medium text-sm"><CheckCircle2 className="text-[#C5D82D] flex-shrink-0" size={20}/> Reduced post-meal energy crashes (the "afternoon slump") within 1–2 weeks.</p>
              <p className="flex gap-3 text-[#5c5c5c] font-medium text-sm"><CheckCircle2 className="text-[#C5D82D] flex-shrink-0" size={20}/> Lower insulin demand over time creates the foundation for sustainable weight management.</p>
              <p className="flex gap-3 text-[#5c5c5c] font-medium text-sm"><CheckCircle2 className="text-[#C5D82D] flex-shrink-0" size={20}/> Safe alongside current medicines — no interactions, no risk of hypoglycaemia from food alone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 04 GUT HEALTH ================= */}
      <section className="py-24 px-6 md:px-12 bg-[#1b1b1b] text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <span className="text-[#1b1b1b] bg-[#C5D82D] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">04. Gut Health</span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Your gut bacteria determine more than you think.
            </h2>
            <p className="text-lg text-gray-300 font-medium">
              The gut microbiome influences your blood sugar, weight, immune response, energy, and mental clarity. And it is shaped, more than anything else, by what you eat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <ShieldAlert size={28} className="text-[#ef4444]" />, title: "Refined grains feed the wrong bacteria", desc: "Refined carbs are rapidly absorbed, leaving little for beneficial bacteria in the large intestine. This allows harmful, inflammation-promoting species to dominate." },
              { icon: <Leaf size={28} className="text-[#C5D82D]" />, title: "Whole millets are prebiotic", desc: "Resistant starch and fibre pass intact to the large intestine, becoming food for beneficial bacteria that produce inflammation-reducing short-chain fatty acids." },
              { icon: <Dna size={28} className="text-[#C5D82D]" />, title: "The gut-liver connection", desc: "A healthy gut microbiome reduces toxic compounds reaching the liver, directly reducing the liver's inflammatory burden. Essential for fatty liver reversal." },
              { icon: <Clock size={28} className="text-[#C5D82D]" />, title: "Measurable and fast", desc: "Meaningful shifts in gut microbiome composition begin within 2–4 weeks of sustained dietary change, aligning with reports of rapidly reduced bloating." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                <div className="mb-6 bg-white/10 w-14 h-14 rounded-full flex items-center justify-center">{item.icon}</div>
                <h4 className="font-bold text-xl mb-3">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-[#C5D82D] font-medium text-lg max-w-3xl mx-auto">
              "The bloating and heaviness after meals that most people accept as normal is not normal — it is a sign of a disrupted microbiome. For GRASA users, this is typically the first thing to improve."
            </p>
          </div>
        </div>
      </section>

      {/* ================= 05 PERSONALISATION ================= */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-[#d6d1c4]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-6 inline-block">05. Personalised Nutrition</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-6 max-w-3xl">
              Why one plan does not work for everyone
            </h2>
            <p className="text-lg text-[#5c5c5c] font-medium max-w-4xl">
              The same food affects two people differently. A meal that is ideal for a 35-year-old woman managing PCOS is not ideal for a 52-year-old man with metabolic syndrome. <strong className="text-[#1b1b1b]">Generic nutrition plans fail because they ignore this. GRASA does not.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
             {[
               { icon: <Droplets size={24}/>, title: "Age & Gender", desc: "Metabolic rate, hormonal patterns, and risk profiles shape the grain selection." },
               { icon: <Utensils size={24}/>, title: "Eating Habits", desc: "GRASA works within your food culture and routine, not against them." },
               { icon: <Zap size={24}/>, title: "Energy Levels", desc: "Carb needs vary significantly with activity. Getting this wrong produces poor results." },
               { icon: <Target size={24}/>, title: "Health Goals", desc: "Composition, timing, and portions are adjusted based on your specific medical goals." }
             ].map((item, i) => (
               <div key={i} className="bg-[#f4f4f2] p-6 rounded-2xl border border-[#d6d1c4]">
                 <div className="text-[#849411] mb-4">{item.icon}</div>
                 <h4 className="font-bold text-[#1b1b1b] mb-2">{item.title}</h4>
                 <p className="text-[#5c5c5c] text-sm">{item.desc}</p>
               </div>
             ))}
          </div>

          <div className="bg-[#f4f4f2] p-8 md:p-12 rounded-3xl border border-[#d6d1c4]">
            <h3 className="text-2xl font-bold text-[#1b1b1b] mb-8 text-center">Example: Two different people. Two different plans.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d6d1c4]">
                <p className="font-bold text-[#1b1b1b] mb-1">Person A — Reena, 34</p>
                <p className="text-xs font-bold text-[#849411] uppercase tracking-wider mb-4">Goal: PCOS Management</p>
                <ul className="text-sm text-[#5c5c5c] space-y-2 list-disc pl-4">
                  <li>Ragi + foxtail millet emphasis</li>
                  <li>Lower simple carbs</li>
                  <li>Iron-rich grain rotation</li>
                  <li>Hormone-supporting meal timing</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d6d1c4]">
                <p className="font-bold text-[#1b1b1b] mb-1">Person B — Vikram, 51</p>
                <p className="text-xs font-bold text-[#849411] uppercase tracking-wider mb-4">Goal: Fatty Liver + Energy</p>
                <ul className="text-sm text-[#5c5c5c] space-y-2 list-disc pl-4">
                  <li>Foxtail + jowar base</li>
                  <li>Higher fibre target</li>
                  <li>Liver-supportive preparation</li>
                  <li>Larger morning portion, lighter dinner</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#d6d1c4]">
                <p className="font-bold text-[#1b1b1b] mb-1">Person C — Sanjay, 29</p>
                <p className="text-xs font-bold text-[#849411] uppercase tracking-wider mb-4">Goal: Longevity & Health</p>
                <ul className="text-sm text-[#5c5c5c] space-y-2 list-disc pl-4">
                  <li>Diverse grain rotation</li>
                  <li>Prebiotic-focused</li>
                  <li>Energy-optimised carb timing</li>
                  <li>Micronutrient coverage across grains</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-8 text-[#5c5c5c] font-medium text-sm">
              <strong className="text-[#1b1b1b]">What stays the same:</strong> The food is always fresh, specially prepared, and home-delivered. The guidance is always ongoing. The plan always evolves.
            </div>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE / CONCLUSION ================= */}
      <section className="py-24 px-6 md:px-12 bg-[#f4f4f2]">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl  font-bold text-[#1b1b1b] leading-tight mb-6">
            Four mechanisms. <br />
            <span className="text-[#849411] italic">One outcome — your body works better.</span>
          </h2>
          <p className="text-lg text-[#5c5c5c] font-medium">
            GRASA works because superior grain nutrition, improved preparation, stabilised blood sugar, and gut microbiome restoration act simultaneously. The result is a whole-body shift that most people notice in how they feel before anything else.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-[#d6d1c4] -z-10"></div>
          
          <div className="bg-white border border-[#d6d1c4] p-8 rounded-3xl relative">
            <span className="bg-[#1b1b1b] text-[#C5D82D] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full absolute -top-3 left-8">Wk 1–2</span>
            <h4 className="font-bold text-[#1b1b1b] text-xl mt-4 mb-3">What you feel first</h4>
            <p className="text-[#5c5c5c] text-sm leading-relaxed">Reduced post-meal heaviness. Less bloating. More consistent energy through the day. Better sleep in many cases.</p>
          </div>
          
          <div className="bg-white border border-[#d6d1c4] p-8 rounded-3xl relative">
            <span className="bg-[#1b1b1b] text-[#C5D82D] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full absolute -top-3 left-8">Wk 3–6</span>
            <h4 className="font-bold text-[#1b1b1b] text-xl mt-4 mb-3">What continues changing</h4>
            <p className="text-[#5c5c5c] text-sm leading-relaxed">Weight begins shifting. Digestion consistently improved. Morning energy more reliable. Cravings for refined carbs typically reduce.</p>
          </div>
          
          <div className="bg-white border border-[#d6d1c4] p-8 rounded-3xl relative shadow-[0_0_20px_rgba(197,216,45,0.2)] border-[#C5D82D]">
            <span className="bg-[#C5D82D] text-[#1b1b1b] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full absolute -top-3 left-8">Month 3+</span>
            <h4 className="font-bold text-[#1b1b1b] text-xl mt-4 mb-3">The deeper changes</h4>
            <p className="text-[#5c5c5c] text-sm leading-relaxed">Measurable improvements in metabolic markers for those with existing concerns. Sustainable weight loss. Long-term habit shift.</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-16 p-6 border border-[#d6d1c4] rounded-2xl bg-white/50">
          <p className="text-xs text-[#5c5c5c] leading-relaxed">
            <strong className="text-[#1b1b1b]">A note on this science:</strong> The research cited across this page refers to published studies on traditional Indian grains and metabolic health — not to GRASA-specific clinical trials. GRASA is a food programme, not a medicine. Individual results will vary. This page is intended to help you understand why food-based intervention can produce real metabolic outcomes — not to make medical claims. Always speak with your doctor about your specific health situation. FSSAI Reg. No. 23326009000349.
          </p>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-[#1b1b1b] text-white py-24 px-6 md:px-12 text-center rounded-t-[2.5rem] md:rounded-t-[4rem]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl  font-extrabold mb-6">Ready?</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">The science is why it works. <br className="md:hidden"/>The programme is how you experience it.</p>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">
            A free conversation with our nutritionist. Your situation, your goals, honest guidance on whether GRASA is the right fit — and if it is, a plan built specifically for your body.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.open('tel:+919870263399')}
              className="w-full sm:w-auto px-8 py-4 bg-[#C5D82D] text-[#1b1b1b] font-bold rounded-2xl flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(197,216,45,0.4)] transition-all duration-300"
            >
              <Phone size={20} />
              Talk to Us — Free
            </button>
            <button 
              onClick={() => window.location.href = '/vision-mission'}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
            >
              Our Vision & Mission <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}