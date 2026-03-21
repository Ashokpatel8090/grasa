/**
 * Central export file for all lib utilities
 * Import from @/lib for cleaner imports
 */

// Utils
export { cn, animationPresets, useResponsive, breakpoints } from './utils'

// Animation Presets
export * from './animation-presets'

// API Utilities
export { apiClient, retryRequest, debounceAPI, createAbortController } from './api-utils'

// SEO & Accessibility
export * from './seo-accessibility'

// Animation Hooks
export {
  useInView,
  useAnimationState,
  useParallax,
  useScrollPosition,
  useFadeInAnimation,
  useHoverAnimation,
} from './hooks/useAnimation'

// Responsive Hooks
export {
  useBreakpoint,
  useMedia,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useOrientation,
  useTouchSupport,
  useContainerSize,
  useAspectRatio,
} from './hooks/useResponsive'

// Data Hooks
export {
  useData,
  useMutation,
  usePagination,
  useDebouncedSearch,
  useForm,
} from './hooks/useData'

/**
 * Common imports from components
 * Add these for frequently used components
 */
export type { PremiumCardProps } from '../components/ui/PremiumCard'
export type { PremiumButtonProps } from '../components/ui/PremiumButton'
