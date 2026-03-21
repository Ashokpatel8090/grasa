'use client'

import { useEffect, useState } from 'react'

/**
 * Custom hook for handling intersection observer animations
 * Triggers animations when elements come into view
 */
export function useInView(options = {}) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.unobserve(entry.target)
      }
    }, {
      threshold: 0.1,
      ...options
    })

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, options])

  return [setRef, isInView] as const
}

/**
 * Custom hook for managing animation states
 * Useful for complex animation sequences
 */
export function useAnimationState(initialState = false) {
  const [isAnimating, setIsAnimating] = useState(initialState)
  const [isComplete, setIsComplete] = useState(false)

  const startAnimation = () => {
    setIsAnimating(true)
    setIsComplete(false)
  }

  const completeAnimation = () => {
    setIsAnimating(false)
    setIsComplete(true)
  }

  const reset = () => {
    setIsAnimating(initialState)
    setIsComplete(false)
  }

  return {
    isAnimating,
    isComplete,
    startAnimation,
    completeAnimation,
    reset
  }
}

/**
 * Custom hook for parallax scroll effect
 * Creates depth perception through offset movement
 */
export function useParallax(offset = 0.5) {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    if (!ref) return

    const handleScroll = () => {
      const element = ref
      const elementTop = element.getBoundingClientRect().top
      const scrollPercent = -elementTop / window.innerHeight

      setTranslateY(scrollPercent * 100 * offset)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [ref, offset])

  return {
    ref: setRef,
    style: { transform: `translateY(${translateY}px)` }
  }
}

/**
 * Custom hook for debounced scroll events
 * Improves performance on heavy scroll animations
 */
export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollPosition
}

/**
 * Custom hook for fade in animations on mount
 * Automatically triggers animation when component mounts
 */
export function useFadeInAnimation(delay = 0) {
  const [isVisible, setIsVisible] = useState(delay === 0)

  useEffect(() => {
    if (delay === 0) return

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  return {
    className: isVisible ? 'animate-fade-in-up' : 'opacity-0'
  }
}

/**
 * Custom hook for hover animations
 * Manages hover state with animation callbacks
 */
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false)

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  }

  return { isHovered, handlers }
}
