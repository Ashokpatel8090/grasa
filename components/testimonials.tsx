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

// // duplicate for infinite scroll
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
//     return card ? card.offsetWidth + 16 : 0
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

//       const resetPoint = sliderRef.current.scrollWidth / 2
//       if (sliderRef.current.scrollLeft >= resetPoint) {
//         sliderRef.current.scrollLeft = 0
//       }
//     }, 2800)

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

//     setTimeout(() => setPause(false), 3500)
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

//       <section className="w-full bg-gradient-to-b from-white via-zinc-50 to-white pb-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Heading */}
//           <h2 className="text-2xl pt-10 sm:text-3xl lg:text-5xl font-serif mt-3 mb-10 text-zinc-900">
//             Real Customer Transformations
//           </h2>

//           {/* Slider */}
//           <div
//             ref={sliderRef}
//             className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth hide-scrollbar"
//             onMouseEnter={() => setPause(true)}
//             onMouseLeave={() => setPause(false)}
//             onTouchStart={() => setPause(true)}
//           >
//             {extendedItems.map((item, index) => (
//               <div
//                 key={`${item.img}-${index}`}
//                 data-card
//                 className="flex-shrink-0 w-[85%] sm:w-[60%] md:w-[45%] lg:w-[32%] xl:w-[28%] rounded-2xl bg-white border border-zinc-200 shadow-md transition hover:shadow-xl"
//               >
//                 {/* IMAGE WRAPPER */}
//                 <div className="relative w-full aspect-[7/8] overflow-hidden rounded-2xl bg-zinc-100 flex items-center justify-center">
//                   <Image
//                     src={item.img}
//                     alt={`Customer testimonial ${index + 1}`}
//                     fill
//                     priority={index < 3}
//                     sizes="(max-width:640px) 85vw, (max-width:1024px) 45vw, 28vw"
//                     className="object-contain"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Controls */}
//           <div className="flex justify-center gap-6 mt-8 sm:mt-10">
//             <button
//               onClick={() => manualScroll("prev")}
//               className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border bg-white shadow hover:scale-105 transition"
//               aria-label="Previous testimonial"
//             >
//               <ChevronLeft className="mx-auto" />
//             </button>

//             <button
//               onClick={() => manualScroll("next")}
//               className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border bg-white shadow hover:scale-105 transition"
//               aria-label="Next testimonial"
//             >
//               <ChevronRight className="mx-auto" />
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

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

/* -----------------------------------------
   IMAGES
------------------------------------------ */
const items = [
  { img: "/testimonials/1.png" },
  { img: "/testimonials/2.png" },
  { img: "/testimonials/3.png" },
  { img: "/testimonials/4.png" },
  { img: "/testimonials/5.png" },
  { img: "/testimonials/6.png" },
  { img: "/testimonials/7.png" },
]

// Duplicate for infinite scroll
const extendedItems = [...items, ...items]

/* -----------------------------------------
   SEO SCHEMA
------------------------------------------ */
const generateTestimonialSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Customer Testimonials – GRASA",
  description:
    "Real customer testimonials showcasing health transformations with GRASA foods",
  image: items.map((i) => `https://www.grasafoods.com${i.img}`),
})

export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [pause, setPause] = useState(false)

  /* -----------------------------------------
     HELPERS
  ------------------------------------------ */
  const getScrollAmount = () => {
    if (!sliderRef.current) return 0
    const card = sliderRef.current.querySelector(
      "[data-card]"
    ) as HTMLElement | null
    
    // Add gap size to the card width for accurate scrolling (16px gap for mobile, 24px for sm+)
    const gap = window.innerWidth >= 640 ? 24 : 16
    return card ? card.offsetWidth + gap : 0
  }

  /* -----------------------------------------
     AUTO SCROLL
  ------------------------------------------ */
  useEffect(() => {
    if (pause) return

    const interval = setInterval(() => {
      if (!sliderRef.current) return

      const scrollAmount = getScrollAmount()
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })

      // Reset logic for infinite scroll illusion
      const resetPoint = sliderRef.current.scrollWidth / 2
      if (sliderRef.current.scrollLeft >= resetPoint - scrollAmount) {
        // Remove smooth behavior for instant reset to prevent visual glitches
        sliderRef.current.scrollTo({ left: 0, behavior: "instant" })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [pause])

  /* -----------------------------------------
     MANUAL SCROLL
  ------------------------------------------ */
  const manualScroll = (dir: "prev" | "next") => {
    setPause(true)
    if (!sliderRef.current) return

    const scrollAmount = getScrollAmount()
    sliderRef.current.scrollBy({
      left: dir === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })

    // Pause auto-scroll briefly after manual interaction
    setTimeout(() => setPause(false), 4000)
  }

  return (
    <>
      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateTestimonialSchema()),
        }}
      />

      <section className="w-full bg-gradient-to-b from-white via-zinc-50 to-white py-12 sm:py-16">
        <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Heading */}
          <div className="text-center md:text-left mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-zinc-900 tracking-tight">
              Real Customer Transformations
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-2xl">
              See the difference GRASA foods is making in our community. Swipe to view real results.
            </p>
          </div>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth hide-scrollbar pb-4"
            onMouseEnter={() => setPause(true)}
            onMouseLeave={() => setPause(false)}
            onTouchStart={() => setPause(true)}
            onTouchEnd={() => setTimeout(() => setPause(false), 3000)}
          >
            {extendedItems.map((item, index) => (
              <div
                key={`${item.img}-${index}`}
                data-card
                // Refined breakpoints: scales down cleanly based on screen width
                className="flex-shrink-0 w-[80%] xs:w-[75%] sm:w-[55%] md:w-[40%] lg:w-[30%] xl:w-[24%] 2xl:w-[18%] rounded-2xl bg-white border border-zinc-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* IMAGE WRAPPER */}
                <div className="relative w-full aspect-[4/5] sm:aspect-[7/8] overflow-hidden rounded-2xl bg-zinc-100 flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={`Customer testimonial ${index + 1}`}
                    fill
                    priority={index < 4} // Prioritize first few images
                    sizes="(max-width: 640px) 85vw, (max-width: 768px) 55vw, (max-width: 1024px) 40vw, (max-width: 1280px) 30vw, (max-width: 1536px) 24vw, 18vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center  gap-4 mt-8">
            <button
              onClick={() => manualScroll("prev")}
              className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-zinc-700" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => manualScroll("next")}
              className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-zinc-700" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Hide scrollbar */}
        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    </>
  )
}