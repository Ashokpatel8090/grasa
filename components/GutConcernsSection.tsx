"use client"

import { ArrowRight, MessageCircle } from "lucide-react"
import Image from "next/image"

export default function GutConcernsSection() {
  return (
    <section className="w-full bg-[#f5f5f5] py-10 px-6">
      <div className="max-w-7xl mx-auto overflow-hidden rounded-[40px] grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="bg-[#C5D82D] flex flex-col justify-center p-8 lg:p-12 relative overflow-hidden">

          {/* Decorative circle */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <span className="uppercase tracking-widest text-xs font-bold text-slate-800/60 mb-3 block">
              Personalized Wellness
            </span>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0f172a] leading-[1.1] mb-6 tracking-tight">
              Digestive concerns <br />
              <span className="text-gray-100">troubling you?</span>
            </h2>

            <div className="space-y-3 mb-6">
              <p className="text-lg text-slate-900/80 font-medium leading-relaxed">
                Tried everything and nothing worked?
              </p>
              <p className="text-base text-slate-800/70">
                Get a scientifically backed, customized roadmap to recovery.
              </p>
            </div>

            <button
  onClick={() => window.open("https://wa.me/919870263399", "_blank")}
  className="group flex items-center gap-3 bg-[#0f172a] text-white px-6 py-4 rounded-2xl font-bold text-base shadow-lg hover:bg-slate-800 transition-all active:scale-95"
>
  <MessageCircle size={20} className="group-hover:rotate-12 transition-transform" />
  Chat With Us
  <ArrowRight size={16} className=" -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
</button>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="relative min-h-[300px] md:min-h-[340px]">
          <Image
  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd"
  alt="Fresh healthy vegetables bowl"
  fill
  className="object-cover"
/>
        </div>

      </div>
    </section>
  )
}