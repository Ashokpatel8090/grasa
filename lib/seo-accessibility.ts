/**
 * SEO and Accessibility Utilities
 * Comprehensive helpers for search engine optimization and accessible design
 */

/**
 * Structured data generator for rich snippets
 */
export function generateStructuredData(
  type: 'Organization' | 'Product' | 'Article' | 'LocalBusiness',
  data: Record<string, any>
) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
  }

  return {
    __html: JSON.stringify({ ...baseSchema, ...data }),
  }
}

/**
 * Meta tags generator for OG and Twitter
 */
interface MetaTagsConfig {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  keywords?: string[]
  robots?: string
  canonical?: string
}

export function generateMetaTags(config: MetaTagsConfig) {
  const {
    title,
    description,
    image = '/og-image.png',
    url = typeof window !== 'undefined' ? window.location.href : '',
    type = 'website',
    author,
    keywords = [],
    robots = 'index, follow',
    canonical,
  } = config

  return {
    title,
    description,
    robots,
    openGraph: {
      type,
      title,
      description,
      image,
      url,
      siteName: 'GRASA',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image,
      creator: '@grasafoods',
    },
    keywords: keywords.join(', '),
    author,
    canonical,
    viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    'theme-color': '#C5D82D',
  }
}

/**
 * Accessibility utilities
 */
export const a11y = {
  /**
   * Generate ARIA labels for interactive elements
   */
  ariaLabel: (label: string) => ({ 'aria-label': label }),

  /**
   * Announce important information to screen readers
   */
  screenReaderOnly: {
    className: 'sr-only',
    style: {
      position: 'absolute' as const,
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap' as const,
      borderWidth: 0,
    },
  },

  /**
   * Focus visible styles for keyboard navigation
   */
  focusVisible: {
    outline: '2px solid #C5D82D',
    outlineOffset: '2px',
  },

  /**
   * Skip to main content link
   */
  skipLink: {
    className: 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded',
  },

  /**
   * Announce live region updates
   */
  liveRegion: (message: string, politeness: 'polite' | 'assertive' = 'polite') => ({
    'aria-live': politeness,
    'aria-atomic': true,
    role: 'status',
    children: message,
  }),

  /**
   * Accessible headings hierarchy
   */
  heading: (level: 1 | 2 | 3 | 4 | 5 | 6, text: string) => ({
    as: `h${level}` as any,
    children: text,
  }),
}

/**
 * Performance optimization utilities
 */
export const performance = {
  /**
   * Image optimization helpers
   */
  imageOptimization: {
    /**
     * Responsive image srcset generator
     */
    generateSrcSet: (basePath: string, widths = [320, 640, 960, 1280, 1920]) => {
      return widths
        .map(width => `${basePath}?w=${width} ${width}w`)
        .join(', ')
    },

    /**
     * Optimal image sizes for responsive design
     */
    sizes: 'sm:100vw md:90vw lg:80vw',

    /**
     * Lazy loading configuration
     */
    lazy: {
      loading: 'lazy' as const,
      decoding: 'async' as const,
    },
  },

  /**
   * Critical CSS inline
   */
  criticalCSS: `
    @supports (display: grid) {
      .layout { display: grid; }
    }
  `,

  /**
   * Web Vitals monitoring
   */
  reportWebVitals: (metric: any) => {
    if (typeof window !== 'undefined' && 'sendBeacon' in navigator) {
      const body = JSON.stringify(metric)
      navigator.sendBeacon('/api/metrics', body)
    }
  },
}

/**
 * Keyboard navigation helpers
 */
export const keyboard = {
  /**
   * Common keyboard event handlers
   */
  handlers: {
    /**
     * Handle escape key press
     */
    onEscape: (callback: () => void) => (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        callback()
      }
    },

    /**
     * Handle enter key press
     */
    onEnter: (callback: () => void) => (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault()
        callback()
      }
    },

    /**
     * Handle arrow key navigation
     */
    onArrowKey: (callback: (direction: 'up' | 'down' | 'left' | 'right') => void) => 
      (e: KeyboardEvent) => {
        const direction = {
          'ArrowUp': 'up',
          'ArrowDown': 'down',
          'ArrowLeft': 'left',
          'ArrowRight': 'right',
        }[e.key]

        if (direction) {
          e.preventDefault()
          callback(direction as any)
        }
      },
  },

  /**
   * Focus management
   */
  focusManagement: {
    /**
     * Trap focus within an element
     */
    trapFocus: (element: HTMLElement) => {
      const focusable = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusable.length === 0) return

      const firstElement = focusable[0] as HTMLElement
      const lastElement = focusable[focusable.length - 1] as HTMLElement

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement.focus()
            }
          }
        }
      }

      element.addEventListener('keydown', handleKeyDown)

      return () => element.removeEventListener('keydown', handleKeyDown)
    },
  },
}

/**
 * Color contrast checker
 */
export function checkContrast(foreground: string, background: string): number {
  const getLuminance = (color: string) => {
    const rgb = parseInt(color.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance <= 0.03928
      ? luminance / 12.92
      : Math.pow((luminance + 0.055) / 1.055, 2.4)
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * WCAG compliance checker
 */
export function checkWCAGCompliance(contrastRatio: number): {
  AA: boolean
  AAA: boolean
  level: 'Fail' | 'AA' | 'AAA'
} {
  return {
    AA: contrastRatio >= 4.5,
    AAA: contrastRatio >= 7,
    level: contrastRatio >= 7 ? 'AAA' : contrastRatio >= 4.5 ? 'AA' : 'Fail',
  }
}

/**
 * Accessibility checklist
 */
export const a11yChecklist = {
  /**
   * Validate semantic HTML
   */
  validateSemanticHTML: (document: Document) => {
    const issues: string[] = []

    // Check for multiple h1s
    const h1s = document.querySelectorAll('h1')
    if (h1s.length > 1) {
      issues.push('Multiple h1 tags found. Only one h1 allowed per page.')
    }

    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])')
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text.`)
    }

    // Check for proper link text
    const links = document.querySelectorAll('a')
    links.forEach((link) => {
      const text = link.textContent?.trim()
      if (!text || text === 'click here' || text === 'read more') {
        issues.push('Link has non-descriptive text: ' + text)
      }
    })

    return issues
  },

  /**
   * Validate contrast ratios
   */
  validateContrast: (document: Document) => {
    const issues: string[] = []
    const elements = document.querySelectorAll('*')

    elements.forEach((el) => {
      const styles = window.getComputedStyle(el)
      const color = styles.color
      const bgColor = styles.backgroundColor

      if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
        const ratio = checkContrast(color, bgColor)
        const compliance = checkWCAGCompliance(ratio)

        if (!compliance.AA) {
          issues.push(
            `Low contrast ratio (${ratio.toFixed(2)}) for: ${el.textContent?.substring(0, 50)}`
          )
        }
      }
    })

    return issues
  },
}
