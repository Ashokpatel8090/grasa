"use client"

import React, { useState, useEffect } from "react"
import { Utensils, Brain, Activity, ShieldOff, Flame } from "lucide-react"

const scienceData = [
  {
    title: "Poor Diet",
    description: "Eating too many processed foods and sugary snacks can disturb your digestive system and reduce your body's ability to absorb nutrients properly.",
    icon: Utensils,
  },
  {
    title: "Stress",
    description: "Long-term stress can upset the balance of healthy bacteria in your digestive system and lead to common stomach problems.",
    icon: Brain,
  },
  {
    title: "Hormones",
    description: "Hormone changes can affect how your digestive system works and may disturb the balance of helpful bacteria.",
    icon: Activity,
  },
  {
    title: "Toxins",
    description: "Chemicals from polluted air, pesticides, and unhealthy foods can harm your digestive lining and reduce good bacteria.",
    icon: ShieldOff,
  },
  {
    title: "Inflammation",
    description: "Constant internal inflammation can disturb digestion and may lead to many long-term health problems.",
    icon: Flame,
  },
]

export default function ScienceSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)

  // Duplicate the array 3 times to ensure we always have enough cards off-screen 
  // to smoothly animate into view before snapping back to the beginning.
  const carouselItems = [...scienceData, ...scienceData, ...scienceData]
  const totalOriginalCards = scienceData.length

  // Main Interval: Move right to left every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) setIsTransitioning(true)
      setCurrentIndex((prev) => prev + 1)
    }, 2800)

    return () => clearInterval(interval)
  }, [isTransitioning])

  // Infinite Loop Snap: When we've scrolled exactly one full set, instantly reset to 0
  useEffect(() => {
    if (currentIndex === totalOriginalCards) {
      const timer = setTimeout(() => {
        setIsTransitioning(false) // Turn off transition for an instant snap
        setCurrentIndex(0) // Snap back to the first exact replica
      }, 500) // 500ms matches our CSS transition duration

      return () => clearTimeout(timer)
    }
  }, [currentIndex, totalOriginalCards])

  return (
    <section className="w-full bg-[#fbfbfb] py-10 overflow-hidden" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* We use CSS variables to dynamically set how many cards show per screen size. 
        This keeps the sliding math perfectly responsive without needing JS event listeners. 
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        .carousel-container { --cards-visible: 1; }
        @media (min-width: 768px) { .carousel-container { --cards-visible: 3; } }
        @media (min-width: 1024px) { .carousel-container { --cards-visible: 5; } }
      `}} />

      <div className="max-w-[1400px] mx-auto px-6 carousel-container">

        {/* Heading Section */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.15] mb-6">
            Digestive problems have
            <br />
            multiple root causes
          </h2>
        </div>

        {/* Smooth Carousel Wrapper */}
        <div className="w-full relative py-4 -my-4">
          <div
            className="flex w-full"
            style={{
              // Slide the wrapper to the left by the exact width of 1 card
              transform: `translateX(calc(-100% / var(--cards-visible) * ${currentIndex}))`,
              transitionDuration: isTransitioning ? '500ms' : '0ms',
              transitionProperty: 'transform',
              transitionTimingFunction: 'ease-in-out',
            }}
          >
            {carouselItems.map((item, index) => {
              const Icon = item.icon

              // Calculate which card is the physical "middle" based on screen size
              const isMobileActive = index === currentIndex
              const isTabletActive = index === currentIndex + 1
              const isDesktopActive = index === currentIndex + 2

              const activeDataProps = {
                "data-mobile-active": isMobileActive,
                "data-tablet-active": isTabletActive,
                "data-desktop-active": isDesktopActive,
              }

              return (
                <div
                  key={`${index}-${item.title}`}
                  className="flex-none px-2"
                  style={{ width: 'calc(100% / var(--cards-visible))' }}
                >
                  <div
                    {...activeDataProps}
                    className={`
                      group relative rounded-2xl px-4 py-5 h-full transition-all duration-500 border
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
                    {/* Icon Container */}
                    <div
                      {...activeDataProps}
                      className={`
                        mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition-all duration-500
                        group-hover:scale-110

                        data-[mobile-active=true]:max-md:scale-110
                        data-[tablet-active=true]:md:max-lg:scale-110
                        data-[desktop-active=true]:lg:scale-110
                      `}
                    >
                      <Icon size={24} className="text-gray-800" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-[14px]">
                      {item.description}
                    </p>

                    {/* Subtle Glow/Hover Indicator */}
                    <div
                      {...activeDataProps}
                      className={`
                        absolute bottom-4 right-4 h-1 w-1 rounded-full bg-lime-400 transition-opacity duration-500
                        opacity-0 group-hover:opacity-100

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