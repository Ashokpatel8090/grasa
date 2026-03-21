'use client'

import { useEffect, useState } from 'react'

const breakpoints = {
  mobile: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

type Breakpoint = keyof typeof breakpoints

/**
 * Custom hook to detect current breakpoint
 * Returns the current active breakpoint based on window width
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const handleResize = () => {
      const width = window.innerWidth

      if (width < breakpoints.sm) {
        setBreakpoint('mobile')
      } else if (width < breakpoints.md) {
        setBreakpoint('sm')
      } else if (width < breakpoints.lg) {
        setBreakpoint('md')
      } else if (width < breakpoints.xl) {
        setBreakpoint('lg')
      } else if (width < breakpoints['2xl']) {
        setBreakpoint('xl')
      } else {
        setBreakpoint('2xl')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { breakpoint, isMounted }
}

/**
 * Custom hook to check if a specific breakpoint is active
 * Useful for conditional rendering based on screen size
 */
export function useMedia(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    setMatches(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }

    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Custom hook to detect mobile device
 * Returns true if current breakpoint is mobile or smaller
 */
export function useIsMobile() {
  const matches = useMedia('(max-width: 640px)')
  return matches
}

/**
 * Custom hook to detect tablet device
 * Returns true if current breakpoint is md (tablet) size
 */
export function useIsTablet() {
  const matches = useMedia('(min-width: 768px) and (max-width: 1024px)')
  return matches
}

/**
 * Custom hook to detect desktop device
 * Returns true if current breakpoint is lg or larger
 */
export function useIsDesktop() {
  const matches = useMedia('(min-width: 1024px)')
  return matches
}

/**
 * Custom hook to get screen orientation
 * Returns 'portrait' or 'landscape'
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    handleOrientationChange()
    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [])

  return orientation
}

/**
 * Custom hook to check if touch is supported
 * Returns true if device supports touch events
 */
export function useTouchSupport() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const hasTouch = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      )
    }

    setIsTouch(hasTouch())
  }, [])

  return isTouch
}

/**
 * Custom hook for responsive container queries
 * Monitor container size changes for responsive components
 */
export function useContainerSize() {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref) return

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })

    resizeObserver.observe(ref)

    return () => resizeObserver.disconnect()
  }, [ref])

  return { ref: setRef, size }
}

/**
 * Custom hook for aspect ratio responsive sizing
 * Maintains aspect ratio across different screen sizes
 */
export function useAspectRatio(ratio: number) {
  const [width, setWidth] = useState<number | null>(null)

  const paddingBottom = width ? (width / ratio) * 100 : 0

  useEffect(() => {
    const updateWidth = () => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      setWidth(vw)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)

    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  return {
    style: {
      position: 'relative' as const,
      paddingBottom: `${paddingBottom}%`
    }
  }
}
