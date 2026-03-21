'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/lib/hooks/useAnimation'

/**
 * Scroll-triggered fade-in component
 * Animates content when it comes into view
 */
interface ScrollFadeInProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function ScrollFadeIn({
  children,
  className,
  delay = 0,
}: ScrollFadeInProps) {
  const [ref, isInView] = useInView()

  return (
    <div
      ref={ref as any}
      className={cn(
        'transition-all duration-700 ease-out',
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10',
        className
      )}
      style={{
        transitionDelay: isInView ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Scroll-triggered slide component
 * Slides in from specified direction
 */
interface ScrollSlideProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  className?: string
  delay?: number
}

export function ScrollSlide({
  children,
  direction = 'up',
  className,
  delay = 0,
}: ScrollSlideProps) {
  const [ref, isInView] = useInView()

  const getTransformClass = () => {
    if (isInView) return 'translate-x-0 translate-y-0'

    switch (direction) {
      case 'up':
        return 'translate-y-10'
      case 'down':
        return 'translate-y-(-10px)'
      case 'left':
        return 'translate-x-10'
      case 'right':
        return 'translate-x-(-10px)'
      default:
        return 'translate-y-10'
    }
  }

  return (
    <div
      ref={ref as any}
      className={cn(
        'transition-all duration-700 ease-out',
        isInView ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        transform: getTransformClass(),
        transitionDelay: isInView ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Staggered list animation component
 * Animates list items with sequential delays
 */
interface StaggerListProps {
  children: React.ReactElement[]
  className?: string
}

export function StaggerList({
  children,
  className,
}: StaggerListProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollFadeIn key={index} delay={index * 100}>
          {child}
        </ScrollFadeIn>
      ))}
    </div>
  )
}

/**
 * Parallax scroll effect component
 * Creates depth effect based on scroll position
 */
interface ParallaxProps {
  children: ReactNode
  offset?: number
  className?: string
}

export function Parallax({
  children,
  offset = 0.5,
  className,
}: ParallaxProps) {
  const [scrollY, setScrollY] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn('transition-transform ease-out', className)}
      style={{
        transform: `translateY(${scrollY * offset}px)`,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Hover scale animation component
 * Scales up on hover with smooth transition
 */
interface HoverScaleProps {
  children: ReactNode
  scale?: number
  className?: string
}

export function HoverScale({
  children,
  scale = 1.05,
  className,
}: HoverScaleProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className={cn('transition-transform duration-300 ease-out', className)}
      style={{
        transform: isHovered ? `scale(${scale})` : 'scale(1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

/**
 * Gradient animation component
 * Animates gradient background
 */
interface GradientAnimationProps {
  children: ReactNode
  className?: string
}

export function GradientAnimation({
  children,
  className,
}: GradientAnimationProps) {
  return (
    <div
      className={cn(
        'relative bg-gradient-to-r from-[#C5D82D] via-white to-[#C5D82D]',
        'bg-[length:200%_200%] animate-gradient',
        className
      )}
    >
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
      {children}
    </div>
  )
}

/**
 * Number counter animation component
 * Animates counting from 0 to target number
 */
interface CounterProps {
  from?: number
  to: number
  duration?: number
  className?: string
  format?: (value: number) => string
}

export function Counter({
  from = 0,
  to,
  duration = 2000,
  className,
  format = (v) => v.toString(),
}: CounterProps) {
  const [count, setCount] = React.useState(from)

  React.useEffect(() => {
    const steps = 60
    const stepDuration = duration / steps
    const increment = (to - from) / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setCount(Math.floor(from + increment * currentStep))

      if (currentStep >= steps) {
        setCount(to)
        clearInterval(interval)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [from, to, duration])

  return (
    <span className={className}>
      {format(count)}
    </span>
  )
}

/**
 * Pulse animation component
 * Creates a pulsing effect
 */
interface PulseProps {
  children: ReactNode
  className?: string
  intensity?: 'light' | 'normal' | 'strong'
}

export function Pulse({
  children,
  className,
  intensity = 'normal',
}: PulseProps) {
  const intensityClasses = {
    light: 'opacity-[0.7,1] animate-pulse',
    normal: 'opacity-[0.4,1] animate-pulse',
    strong: 'opacity-[0.2,1] animate-pulse',
  }

  return (
    <div className={cn(intensityClasses[intensity], className)}>
      {children}
    </div>
  )
}

/**
 * Shimmer loading animation component
 * Creates a shimmer effect for loading states
 */
interface ShimmerProps {
  className?: string
  width?: string
  height?: string
  count?: number
}

export function Shimmer({
  className,
  width = 'w-full',
  height = 'h-4',
  count = 3,
}: ShimmerProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            width,
            height,
            'bg-gray-200 rounded-lg',
            'animate-pulse'
          )}
        />
      ))}
    </div>
  )
}
