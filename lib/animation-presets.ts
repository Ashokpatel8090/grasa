/**
 * Framer Motion Animation Presets
 * Reusable animation configurations for consistent, premium animations throughout the app
 */

// Basic entrance animations
export const enterAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  
  slideInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  slideInDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  slideInRight: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  
  rotateIn: {
    initial: { opacity: 0, rotate: -5 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: -5 },
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

// Stagger animations for lists and grids
export const staggerAnimations = {
  container: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    }
  },
  
  item: {
    variants: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
      }
    }
  },
  
  gridItem: {
    variants: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" }
      }
    }
  }
}

// Hover and interaction animations
export const interactionAnimations = {
  buttonHover: {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 }
  },
  
  cardHover: {
    whileHover: { y: -8, scale: 1.02 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  linkHover: {
    whileHover: { x: 4 },
    whileTap: { x: 2 },
    transition: { duration: 0.2 }
  },
  
  imageHover: {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  iconHover: {
    whileHover: { scale: 1.1, rotate: 5 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 }
  }
}

// Scroll-triggered animations
export const scrollAnimations = {
  fadeInOnScroll: {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "0px 0px -200px 0px" },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  
  slideInOnScroll: {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: "0px 0px -200px 0px" },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  
  scaleInOnScroll: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: "0px 0px -200px 0px" },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  
  staggerOnScroll: {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "0px 0px -200px 0px" },
    variants: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0
        }
      }
    }
  }
}

// Page transition animations
export const pageTransitions = {
  enter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  
  exit: {
    initial: { opacity: 1, y: 0 },
    animate: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeIn" }
  }
}

// Modal and overlay animations
export const modalAnimations = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },
  
  modal: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  slideModal: {
    initial: { opacity: 0, x: 400 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 400 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

// Loading animations
export const loadingAnimations = {
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },
  
  pulse: {
    animate: { opacity: [0.4, 1, 0.4] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  },
  
  shimmer: {
    initial: { backgroundPosition: "200% 0" },
    animate: { backgroundPosition: "-200% 0" },
    transition: { duration: 2, repeat: Infinity, ease: "linear" }
  },
  
  skeleton: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
  }
}

// Tooltip animations
export const tooltipAnimations = {
  initial: { opacity: 0, scale: 0.95, y: -10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -10 },
  transition: { duration: 0.2, ease: "easeOut" }
}

// Success/error animations
export const feedbackAnimations = {
  success: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  
  error: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  shake: {
    animate: { x: [-10, 10, -10, 10, 0] },
    transition: { duration: 0.4, ease: "easeInOut" }
  }
}
