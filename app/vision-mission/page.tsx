"use client";

import React from "react";
import { ArrowRight, Phone, CheckCircle2, Package, Compass, Target, Sprout, Home, TrendingDown, Handshake  } from "lucide-react";


export default function VisionMission() {
  return (
    <div className="min-h-screen bg-[#f4f4f2] font-sans selection:bg-[#C5D82D] selection:text-[#1b1b1b]">
      
      {/* ================= HERO SECTION ================= */}
      <section className="bg-[#1b1b1b] text-white pt-16 pb-24 px-6 md:px-12 rounded-b-[2.5rem] md:rounded-b-[4rem] relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C5D82D] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <span className="text-[#C5D82D] font-bold tracking-wider uppercase text-sm md:text-base flex items-center gap-2 mb-6">
            <span className="w-8 h-[2px] bg-[#C5D82D]"></span> Our Vision & Mission
          </span>
          <h1 className="text-5xl  font-extrabold leading-[1.1] tracking-tight">
            Food was always <br className="hidden md:block" />
            the answer. <br />
            <span className="text-[#C5D82D] italic">We're making it <br className="hidden md:block" /> the first one.</span>
          </h1>
          <p className="mt-8 text-xl text-gray-300 max-w-3xl font-normal leading-relaxed">
            India is in the middle of a silent health crisis — one that was built on plates, and one that can be meaningfully reversed the same way. That is what GRASA exists for.
          </p>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/15 pt-12">
            <div>
              <p className="text-4xl  font-bold text-[#C5D82D] mb-2">77M+</p>
              <p className="text-gray-400 font-medium">Indians with diabetes</p>
            </div>
            <div>
              <p className="text-4xl  font-bold text-[#C5D82D] mb-2">1 in 4</p>
              <p className="text-gray-400 font-medium">Urban adults at metabolic risk</p>
            </div>
            <div>
              <p className="text-4xl  font-bold text-[#C5D82D] mb-2 flex items-center gap-2">
                Rising <span className="w-3 h-3 rounded-full bg-[#C5D82D] animate-pulse"></span>
              </p>
              <p className="text-gray-400 font-medium">Every single year</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE PROBLEM SECTION ================= */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="sticky top-24">
            <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4 block">The Problem We're Solving</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight">
              India doesn't have a medicine problem. <br />
              <span className="text-[#849411] italic">It has a food problem.</span>
            </h2>
          </div>
          <div className="space-y-6 text-lg text-[#5c5c5c] font-medium leading-relaxed">
            <p>
              The most common chronic conditions in India — diabetes, fatty liver, high cholesterol, obesity — are largely <strong className="text-[#1b1b1b]">lifestyle conditions.</strong> They were created over years by what we eat. They are being managed, at enormous personal and social cost, with medicines taken every day for the rest of a person's life.
            </p>
            <p>
              This is not wrong. Medicines save lives and manage symptoms. But it is <strong className="text-[#1b1b1b]">incomplete.</strong> A prescription without a food intervention addresses the consequence, not the cause. And the cause — the quality and nature of what enters the body every day — remains unchanged.
            </p>
            <div className="bg-white border border-[#d6d1c4] p-8 rounded-3xl shadow-sm mt-8 relative overflow-hidden group hover:border-[#1b1b1b] transition-colors">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C5D82D]"></div>
              <p className="text-[#1b1b1b] font-bold text-xl md:text-2xl leading-snug">
                GRASA was built on one conviction: food, when used correctly, is the most powerful metabolic intervention available to any human being.
              </p>
              <p className="mt-4 text-base">
                Before medicines. Alongside medicines. And in the space where medicines cannot reach — the space of how you feel, how you age, and how long you stay well.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INDIA'S HEALTH REALITY ================= */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-[#d6d1c4]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4 block">India's Health Reality</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-4">
              The numbers that made us start.
            </h2>
            <p className="text-lg text-[#5c5c5c] font-medium">
              These are not distant statistics. They are the people in your building, in your family, in your society.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#f4f4f2] p-8 rounded-3xl border border-[#d6d1c4] hover:shadow-lg transition-all hover:-translate-y-1">
              <span className="text-5xl font-extrabold text-[#d6d1c4] opacity-50 mb-6 block">01</span>
              <h3 className="text-xl font-bold text-[#1b1b1b] mb-4">India is the diabetes capital of the world</h3>
              <p className="text-[#5c5c5c] mb-6">Over 77 million Indians live with Type 2 diabetes — a number projected to cross 134 million by 2045. The vast majority are on lifelong medication. Very few receive meaningful food-based intervention.</p>
              <p className="text-xs font-bold text-[#1b1b1b] uppercase tracking-wider">IDF Diabetes Atlas, 2021</p>
            </div>
            {/* Card 2 */}
            <div className="bg-[#f4f4f2] p-8 rounded-3xl border border-[#d6d1c4] hover:shadow-lg transition-all hover:-translate-y-1">
              <span className="text-5xl font-extrabold text-[#d6d1c4] opacity-50 mb-6 block">02</span>
              <h3 className="text-xl font-bold text-[#1b1b1b] mb-4">Fatty liver now affects 1 in 3 urban Indians</h3>
              <p className="text-[#5c5c5c] mb-6">Non-alcoholic fatty liver disease (NAFLD) has quietly become one of India's most common conditions — driven almost entirely by refined grain consumption, sedentary living, and excess sugar. It is almost entirely reversible through food.</p>
              <p className="text-xs font-bold text-[#1b1b1b] uppercase tracking-wider">Journal of Clinical & Exp. Hepatology, 2022</p>
            </div>
            {/* Card 3 */}
            <div className="bg-[#f4f4f2] p-8 rounded-3xl border border-[#d6d1c4] hover:shadow-lg transition-all hover:-translate-y-1">
              <span className="text-5xl font-extrabold text-[#d6d1c4] opacity-50 mb-6 block">03</span>
              <h3 className="text-xl font-bold text-[#1b1b1b] mb-4">South Asians age metabolically faster</h3>
              <p className="text-[#5c5c5c] mb-6">Indians accumulate visceral fat — the dangerous fat around organs — at lower BMIs than any other population. Our genetics make us more vulnerable. Our diets, increasingly dominated by refined carbs, accelerate the process.</p>
              <p className="text-xs font-bold text-[#1b1b1b] uppercase tracking-wider">The Lancet Diabetes & Endocrinology, 2020</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= VISION & MISSION ================= */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto space-y-32">
        
        {/* Vision */}
        <div>
          <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-8 inline-block">Our Vision</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-8">
            A India where food is the <span className=" underline-offset-8">first intervention</span> — not the last resort.
          </h2>
          <div className="text-lg text-[#5c5c5c] font-medium leading-relaxed max-w-4xl space-y-6 mb-16">
            <p>
              We envision a future where the first thing a person does when their energy drops, their weight creeps up, or their reports start drifting — is change what they eat. Not in a vague, generic way. In a <strong className="text-[#1b1b1b]">personalised, expert-guided, measurable way</strong> that fits their body, their life, and their kitchen.
            </p>
            <p>
              Where longevity is not a luxury for the wealthy and health-obsessed, but something <strong className="text-[#1b1b1b]">accessible in every Indian household</strong> — because the food that does the work is delivered to your door, and the guidance that makes it effective comes with it.
            </p>
            <p>
              Where the conversation between patient and doctor includes not just "which medicine" but "which food" — because the clinical community has the evidence, and the patient has access to the intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {[
    { 
      icon: <Sprout size={28} className="text-[#C5D82D]" />, 
      title: "Ancient wisdom, modern delivery", 
      desc: "India's grain heritage — millets, ancient varieties, traditional preparation — contains metabolic intelligence that modern food processing has stripped away. We bring it back, in forms that fit today's life." 
    },
    { 
      icon: <Home size={28} className="text-[#C5D82D]" />, 
      title: "Longevity for every household", 
      desc: "Not a premium supplement for the wealthy. Not a clinic visit for the already-sick. Food that works, guidance that's real, and delivery that reaches you — wherever you are in Delhi NCR." 
    },
    { 
      icon: <TrendingDown size={28} className="text-[#C5D82D]" />, 
      title: "Reducing medicine dependency, measurably", 
      desc: "The goal is not to replace prescribed medicines — it is to give the body what it needs so that over time, with a doctor's guidance, the medicine list can shorten. That is a meaningful outcome." 
    },
    { 
      icon: <Handshake size={28} className="text-[#C5D82D]" />, 
      title: "Working with medicine, not against it", 
      desc: "GRASA is not an alternative to your doctor. It is the part of your health that your doctor currently cannot prescribe — because food programmes don't come in boxes from a pharmacy. Yet." 
    }
  ].map((item, i) => (
    <div key={i} className="flex flex-col sm:flex-row gap-5 p-6 bg-white border border-[#d6d1c4] rounded-3xl shadow-sm hover:border-[#C5D82D] transition-colors group">
      {/* Icon Container with dark background and hover effect */}
      <div className="bg-[#1b1b1b] p-4 rounded-2xl h-fit w-fit flex-shrink-0 group-hover:-translate-y-1 transition-transform duration-300">
        {item.icon}
      </div>
      <div>
        <h4 className="font-bold text-[#1b1b1b] text-lg mb-2">{item.title}</h4>
        <p className="text-[#5c5c5c] text-sm leading-relaxed">{item.desc}</p>
      </div>
    </div>
  ))}
</div>
        </div>

        {/* Mission */}
        <div>
          <span className="text-[#C5D82D] bg-[#1b1b1b] px-4 py-1.5 rounded-full font-bold tracking-wider uppercase text-sm mb-8 inline-block">Our Mission</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight mb-8">
            To make food-based health intervention <span className="text-[#849411] italic">accessible, guided, and measurable</span> — for every Indian.
          </h2>
          <p className="text-lg text-[#5c5c5c] font-medium leading-relaxed max-w-3xl mb-16">
            Not one day. Not at scale in ten years. <strong className="text-[#1b1b1b]">Right now, in Delhi NCR</strong>, one person at a time, one family at a time — building the evidence, the trust, and the infrastructure that makes this possible everywhere.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Target className="text-[#C5D82D]" size={32} />, title: "Personalised", desc: "No two bodies are the same. No two plans are the same. Your nutrition is built around you." },
              { icon: <Compass className="text-[#C5D82D]" size={32} />, title: "Expert-guided", desc: "Nutritionist-supervised at every step. Your plan evolves as your body responds." },
              { icon: <Package className="text-[#C5D82D]" size={32} />, title: "Delivered", desc: "Fresh, specially prepared food that arrives at your home. No effort, no guesswork." },
              { icon: <CheckCircle2 className="text-[#C5D82D]" size={32} />, title: "Measurable", desc: "Results you can feel, and outcomes that are real — not just a feeling, but a fact." }
            ].map((item, i) => (
              <div key={i} className="bg-[#1b1b1b] p-8 rounded-3xl text-center flex flex-col items-center justify-center hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-6 bg-white/10 p-4 rounded-full">{item.icon}</div>
                <h4 className="font-bold text-white text-xl mb-3">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY GRASA, WHY NOW ================= */}
      <section className="py-24 px-6 md:px-12 bg-white border-y border-[#d6d1c4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-4 block">Why GRASA, Why Now</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1b1b1b] leading-tight">
              The conditions for this to work have <span className="text-[#C5D82D] italic">never been better.</span>
            </h2>
            <p className="mt-6 text-lg text-[#5c5c5c] font-medium">
              India's food crisis is not new. What is new is that the evidence, the awareness, and the delivery infrastructure have finally converged to make a food-first intervention possible at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1b1b1b] mb-4 border-b-2 border-[#C5D82D] pb-4 inline-block">The evidence</h3>
              <p className="text-[#1b1b1b] font-bold mb-2">The science of millet and metabolic health is now clinical.</p>
              <p className="text-[#5c5c5c] text-sm leading-relaxed">Decades of research on traditional Indian grains, fermentation, and metabolic outcomes now supports what our grandmothers knew intuitively. The gap between traditional food wisdom and clinical nutrition has closed significantly. GRASA sits at that intersection.</p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1b1b1b] mb-4 border-b-2 border-[#C5D82D] pb-4 inline-block">The awareness</h3>
              <p className="text-[#1b1b1b] font-bold mb-2">Indians are asking better questions about food.</p>
              <p className="text-[#5c5c5c] text-sm leading-relaxed">A generation of urban Indians — educated, aware, increasingly health-conscious — is questioning what they eat in a way no previous generation did. The appetite for food-based health intervention has never been higher. What has been missing is a trustworthy, clinical, personalised answer.</p>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1b1b1b] mb-4 border-b-2 border-[#C5D82D] pb-4 inline-block">The moment</h3>
              <p className="text-[#1b1b1b] font-bold mb-2">Delivery infrastructure makes it possible.</p>
              <p className="text-[#5c5c5c] text-sm leading-relaxed">Fresh, specialised food — prepared correctly, delivered consistently — can now reach someone's door anywhere in Delhi NCR. The logistics that once made a food-based clinical programme impossible are no longer a barrier. The moment is now.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOUNDER NOTE ================= */}
      <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <span className="text-[#5c5c5c] font-bold tracking-wider uppercase text-sm mb-8 block">A note from our founder</span>
        <blockquote className="text-2xl md:text-4xl font-bold text-[#1b1b1b] leading-tight mb-12">
          "I started GRASA because I kept seeing the same thing — people managing conditions for years with growing lists of medicines, and nobody asking them what they were eating. Not once."
        </blockquote>
        <p className="text-lg text-[#5c5c5c] font-medium leading-relaxed mb-12 max-w-3xl mx-auto text-left">
          The food conversation was happening in wellness blogs and fitness apps, not in clinical settings. GRASA is my attempt to close that gap. To take what the science says, what traditional Indian food knowledge shows, and what people actually need — and build something that works in a real person's real life. Not a diet. Not a supplement. A programme that treats food with the same seriousness we give to medicine.
        </p>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#1b1b1b] text-[#C5D82D] flex items-center justify-center rounded-full text-2xl font-serif font-bold italic mb-4">G</div>
          <h4 className="font-bold text-[#1b1b1b] text-xl">Founder, GRASA</h4>
          {/* <p className="text-[#5c5c5c] text-sm tracking-widest uppercase mt-1">G · Delhi NCR</p> */}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-[#1b1b1b] text-white py-20 px-6 md:px-12 text-center rounded-t-[2.5rem] md:rounded-t-[4rem]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-extrabold mb-6">Ready to start?</h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">This is what we believe. <br className="md:hidden"/>The programme is how we prove it.</p>
          <p className="text-gray-400 mb-12 max-w-xl mx-auto">
            Every person who completes a GRASA plan is evidence. Talk to us — free, no pressure — and become part of what we're building.
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
              onClick={() => window.location.href = '/science'}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-300"
            >
              Read the Science <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}