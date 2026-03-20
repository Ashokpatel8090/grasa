// "use client"

// import { useEffect, useRef, useState } from "react"
// import Image from "next/image"
// import { ChevronLeft, ChevronRight } from "lucide-react"

// /* -----------------------------------------
//    IMAGES
// ------------------------------------------ */
// const items = [
//   { img: "/testimonials/1.png" },
//   { img: "/testimonials/2.png" },
//   { img: "/testimonials/3.png" },
//   { img: "/testimonials/4.png" },
//   { img: "/testimonials/5.png" },
//   { img: "/testimonials/6.png" },
//   { img: "/testimonials/7.png" },
// ]

// // Duplicate for infinite scroll
// const extendedItems = [...items, ...items]

// /* -----------------------------------------
//    SEO SCHEMA
// ------------------------------------------ */
// const generateTestimonialSchema = () => ({
//   "@context": "https://schema.org",
//   "@type": "ImageGallery",
//   name: "Customer Testimonials – GRASA",
//   description:
//     "Real customer testimonials showcasing health transformations with GRASA foods",
//   image: items.map((i) => `https://www.grasafoods.com${i.img}`),
// })

// export default function Testimonials() {
//   const sliderRef = useRef<HTMLDivElement>(null)
//   const [pause, setPause] = useState(false)

//   /* -----------------------------------------
//      HELPERS
//   ------------------------------------------ */
//   const getScrollAmount = () => {
//     if (!sliderRef.current) return 0
//     const card = sliderRef.current.querySelector(
//       "[data-card]"
//     ) as HTMLElement | null
    
//     // Add gap size to the card width for accurate scrolling (16px gap for mobile, 24px for sm+)
//     const gap = window.innerWidth >= 640 ? 24 : 16
//     return card ? card.offsetWidth + gap : 0
//   }

//   /* -----------------------------------------
//      AUTO SCROLL
//   ------------------------------------------ */
//   useEffect(() => {
//     if (pause) return

//     const interval = setInterval(() => {
//       if (!sliderRef.current) return

//       const scrollAmount = getScrollAmount()
//       sliderRef.current.scrollBy({
//         left: scrollAmount,
//         behavior: "smooth",
//       })

//       // Reset logic for infinite scroll illusion
//       const resetPoint = sliderRef.current.scrollWidth / 2
//       if (sliderRef.current.scrollLeft >= resetPoint - scrollAmount) {
//         // Remove smooth behavior for instant reset to prevent visual glitches
//         sliderRef.current.scrollTo({ left: 0, behavior: "instant" })
//       }
//     }, 3000)

//     return () => clearInterval(interval)
//   }, [pause])

//   /* -----------------------------------------
//      MANUAL SCROLL
//   ------------------------------------------ */
//   const manualScroll = (dir: "prev" | "next") => {
//     setPause(true)
//     if (!sliderRef.current) return

//     const scrollAmount = getScrollAmount()
//     sliderRef.current.scrollBy({
//       left: dir === "next" ? scrollAmount : -scrollAmount,
//       behavior: "smooth",
//     })

//     // Pause auto-scroll briefly after manual interaction
//     setTimeout(() => setPause(false), 4000)
//   }

//   return (
//     <>
//       {/* SEO */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(generateTestimonialSchema()),
//         }}
//       />

//       <section className="w-full bg-gradient-to-b from-white via-zinc-50 to-white py-12 sm:py-16">
//         <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
//           {/* Heading */}
//           <div className="text-center md:text-left mb-10 md:mb-12">
//             <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-zinc-900 tracking-tight">
//               Real Customer Transformations
//             </h2>
//             <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-2xl">
//               See the difference GRASA foods is making in our community. Swipe to view real results.
//             </p>
//           </div>

//           {/* Slider */}
//           <div
//             ref={sliderRef}
//             className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth hide-scrollbar pb-4"
//             onMouseEnter={() => setPause(true)}
//             onMouseLeave={() => setPause(false)}
//             onTouchStart={() => setPause(true)}
//             onTouchEnd={() => setTimeout(() => setPause(false), 3000)}
//           >
//             {extendedItems.map((item, index) => (
//               <div
//                 key={`${item.img}-${index}`}
//                 data-card
//                 // Refined breakpoints: scales down cleanly based on screen width
//                 className="flex-shrink-0 w-[80%] xs:w-[75%] sm:w-[55%] md:w-[40%] lg:w-[30%] xl:w-[24%] 2xl:w-[18%] rounded-2xl bg-white border border-zinc-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
//               >
//                 {/* IMAGE WRAPPER */}
//                 <div className="relative w-full aspect-[4/5] sm:aspect-[7/8] overflow-hidden rounded-2xl bg-zinc-100 flex items-center justify-center">
//                   <Image
//                     src={item.img}
//                     alt={`Customer testimonial ${index + 1}`}
//                     fill
//                     priority={index < 4} // Prioritize first few images
//                     sizes="(max-width: 640px) 85vw, (max-width: 768px) 55vw, (max-width: 1024px) 40vw, (max-width: 1280px) 30vw, (max-width: 1536px) 24vw, 18vw"
//                     className="object-contain"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Controls */}
//           <div className="flex justify-center  gap-4 mt-8">
//             <button
//               onClick={() => manualScroll("prev")}
//               className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
//               aria-label="Previous testimonial"
//             >
//               <ChevronLeft className="h-6 w-6 text-zinc-700" strokeWidth={1.5} />
//             </button>

//             <button
//               onClick={() => manualScroll("next")}
//               className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
//               aria-label="Next testimonial"
//             >
//               <ChevronRight className="h-6 w-6 text-zinc-700" strokeWidth={1.5} />
//             </button>
//           </div>
//         </div>

//         {/* Hide scrollbar */}
//         <style jsx global>{`
//           .hide-scrollbar::-webkit-scrollbar {
//             display: none;
//           }
//           .hide-scrollbar {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//         `}</style>
//       </section>
//     </>
//   )
// }








"use client"

import React, { useState, useEffect } from "react"
import { Star } from "lucide-react"

const testimonialsData = [
  {
    plan: "3-Month Plan",
    headline: "No more post-meal crashes",
    quote: "I used to feel completely flat after lunch every day. By Week 3 that was gone. Three months later my energy is consistent through the whole day.",
    author: "Riya S.",
    meta: "44 · South Delhi",
    initial: "R",
  },
  {
    plan: "3-Month Plan",
    headline: "Lost 6kg, digestion transformed",
    quote: "I had tried every diet. This is the first thing that felt sustainable — I wasn't restricting, I was just eating better food. 6kg down and the bloating I had for years is gone.",
    author: "Amit K.",
    meta: "52 · Gurugram",
    initial: "A",
  },
  {
    plan: "6-Month Plan",
    headline: "PCOS symptoms reduced",
    quote: "My PCOS had been affecting my energy and weight for years. The personalised guidance made the difference — not generic advice, but someone actually looking at my situation.",
    author: "Meera J.",
    meta: "34 · Noida",
    initial: "M",
  },
]

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  // Duplicate the array 3 times to ensure smooth infinite looping
  const carouselItems = [...testimonialsData, ...testimonialsData, ...testimonialsData]
  const totalOriginalCards = testimonialsData.length

  // Main Interval: Move right to left every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) setIsTransitioning(true)
      setCurrentIndex((prev) => prev + 1)
    }, 4000) 

    return () => clearInterval(interval)
  }, [isTransitioning])

  // Infinite Loop Snap: When we've scrolled exactly one full set, instantly reset to 0
  useEffect(() => {
    if (currentIndex === totalOriginalCards) {
      const timer = setTimeout(() => {
        setIsTransitioning(false) 
        setCurrentIndex(0) 
      }, 500) 

      return () => clearTimeout(timer)
    }
  }, [currentIndex, totalOriginalCards])

  return (
    <section className="w-full bg-[#fbfbfb] py-10 overflow-hidden" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* Dynamic CSS variables for responsive card counts */}
      <style dangerouslySetInnerHTML={{ __html: `
        .testimonial-container { --cards-visible: 1; }
        @media (min-width: 768px) { .testimonial-container { --cards-visible: 2; } }
        @media (min-width: 1024px) { .testimonial-container { --cards-visible: 3; } }
      `}} />

      <div className="max-w-[1400px] mx-auto px-6 testimonial-container">

        {/* Heading Section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] mb-6">
            Real results from
            <br />
            real transformations
          </h2>
        </div>

        {/* Smooth Carousel Wrapper */}
        <div className="w-full relative py-4 -my-4">
          <div
            className="flex w-full"
            style={{
              transform: `translateX(calc(-100% / var(--cards-visible) * ${currentIndex}))`,
              transitionDuration: isTransitioning ? '500ms' : '0ms',
              transitionProperty: 'transform',
              transitionTimingFunction: 'ease-in-out',
            }}
          >
            {carouselItems.map((item, index) => {
              const isMobileActive = index === currentIndex
              const isTabletActive = index === currentIndex
              const isDesktopActive = index === currentIndex + 1 

              const activeDataProps = {
                "data-mobile-active": isMobileActive,
                "data-tablet-active": isTabletActive,
                "data-desktop-active": isDesktopActive,
              }

              return (
                <div
                  key={`${index}-${item.author}`}
                  className="flex-none px-3"
                  style={{ width: 'calc(100% / var(--cards-visible))' }}
                >
                  <div
                    {...activeDataProps}
                    className={`
                      group relative flex flex-col rounded-2xl px-6 py-8 h-full transition-all duration-500 border
                      bg-[#f3f3ee] border-gray-300 hover:bg-[#C5D82D] hover:border-gray-200 hover:scale-105
                      
                      data-[mobile-active=true]:max-md:bg-[#C5D82D] 
                      data-[mobile-active=true]:max-md:scale-105 
                      data-[mobile-active=true]:max-md:border-gray-200
                      
                      data-[tablet-active=true]:md:max-lg:bg-[#C5D82D] 
                      data-[tablet-active=true]:md:max-lg:scale-105 
                      data-[tablet-active=true]:md:max-lg:border-gray-200
                      
                      data-[desktop-active=true]:lg:bg-[#C5D82D] 
                      data-[desktop-active=true]:lg:scale-105 
                      data-[desktop-active=true]:lg:border-gray-200
                    `}
                  >
                    {/* Top Meta (Plan & Stars) */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[11px] font-bold text-gray-800 tracking-wider uppercase opacity-80">
                        {item.plan}
                      </span>
                      <div className="flex gap-0.5">
                        {/* FIXED: Star color changed to amber-400 */}
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400 text-amber-400 text-[20px]" />
                        ))}
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {item.headline}
                    </h3>

                    {/* Quote */}
                    <p className="text-gray-600 leading-relaxed text-[15px] mb-8 flex-grow">
                      {item.quote}
                    </p>
                        <div className="border-t border-gray-900/10 mb-8" />
                    {/* Footer (Avatar & Author Info) */}
                    <div className="flex items-center gap-4 mt-auto">
                      <div
                        {...activeDataProps}
                        className={`
                          flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-all duration-500
                          group-hover:scale-110

                          data-[mobile-active=true]:max-md:scale-110
                          data-[tablet-active=true]:md:max-lg:scale-110
                          data-[desktop-active=true]:lg:scale-110
                        `}
                      >
                        <span className="text-gray-900 font-bold text-lg">{item.initial}</span>
                      </div>
                      
                      <div>
                        <p className="font-bold text-gray-900 text-[14px]">{item.author}</p>
                        <p className="text-gray-600 text-[12px]">{item.meta}</p>
                      </div>
                    </div>

                    {/* Subtle Glow/Hover Indicator */}
                    <div
                      {...activeDataProps}
                      className={`
                        absolute bottom-4 right-4 h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-500
                        opacity-0 group-hover:opacity-100 shadow-sm

                        data-[mobile-active=true]:max-md:opacity-100
                        data-[tablet-active=true]:md:max-lg:opacity-100
                        data-[desktop-active=true]:lg:opacity-100
                      `}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}