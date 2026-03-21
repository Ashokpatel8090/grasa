'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  gap?: 'none' | 'sm' | 'md' | 'lg'
}

/**
 * Responsive Container Component
 * Handles padding, max-width, and responsive spacing
 */
export function ResponsiveContainer({
  children,
  className,
  as: Component = 'div',
  maxWidth = 'lg',
  padding = 'md',
  gap = 'md',
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'w-full',
  }

  const paddingClasses = {
    none: 'px-0 py-0',
    sm: 'px-4 py-6 sm:px-6 sm:py-8',
    md: 'px-4 py-8 sm:px-6 sm:py-12 lg:px-8',
    lg: 'px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20',
  }

  const gapClasses = {
    none: '',
    sm: 'space-y-4 sm:space-y-6',
    md: 'space-y-6 sm:space-y-8 lg:space-y-12',
    lg: 'space-y-8 sm:space-y-12 lg:space-y-16',
  }

  return (
    <Component
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * Responsive Grid Component
 * Automatically adjusts columns based on screen size
 */
interface ResponsiveGridProps {
  children: ReactNode
  columns?: {
    mobile?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ResponsiveGrid({
  children,
  columns = { mobile: 1, md: 2, lg: 3 },
  gap = 'md',
  className,
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-3 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  }

  const colClasses = [
    columns.mobile && `grid-cols-${columns.mobile}`,
    columns.sm && `sm:grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
  ]

  return (
    <div
      className={cn(
        'grid grid-cols-1',
        columns.sm && `sm:grid-cols-${columns.sm}`,
        columns.md && `md:grid-cols-${columns.md}`,
        columns.lg && `lg:grid-cols-${columns.lg}`,
        columns.xl && `xl:grid-cols-${columns.xl}`,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Responsive Flex Component
 * Handles flexbox layouts with responsive direction
 */
interface ResponsiveFlexProps {
  children: ReactNode
  direction?: 'row' | 'col' | { mobile?: 'row' | 'col'; md?: 'row' | 'col' }
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  gap?: 'sm' | 'md' | 'lg'
  wrap?: boolean
  className?: string
}

export function ResponsiveFlex({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className,
}: ResponsiveFlexProps) {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  const gapClasses = {
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
  }

  const getDirectionClasses = () => {
    if (typeof direction === 'string') {
      return direction === 'col' ? 'flex-col' : 'flex-row'
    }

    return cn(
      direction.mobile === 'col' ? 'flex-col' : 'flex-row',
      direction.md === 'col' ? 'md:flex-col' : 'md:flex-row'
    )
  }

  return (
    <div
      className={cn(
        'flex',
        getDirectionClasses(),
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap],
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Responsive Stack Component
 * Simplified component for vertical stacking with responsive gap
 */
interface ResponsiveStackProps {
  children: ReactNode
  as?: keyof JSX.IntrinsicElements
  gap?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function ResponsiveStack({
  children,
  as: Component = 'div',
  gap = 'md',
  align = 'start',
  className,
}: ResponsiveStackProps) {
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
  }

  const gapClasses = {
    sm: 'space-y-2 sm:space-y-3',
    md: 'space-y-4 sm:space-y-6',
    lg: 'space-y-6 sm:space-y-8',
  }

  return (
    <Component
      className={cn(
        'flex flex-col',
        alignClasses[align],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </Component>
  )
}

/**
 * Responsive Section Component
 * Full-width section with controlled content width
 */
interface ResponsiveSectionProps {
  children: ReactNode
  className?: string
  bgColor?: string
  fullHeight?: boolean
}

export function ResponsiveSection({
  children,
  className,
  bgColor = 'bg-white',
  fullHeight = false,
}: ResponsiveSectionProps) {
  return (
    <section
      className={cn(
        'w-full',
        fullHeight && 'min-h-screen',
        bgColor,
        className
      )}
    >
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </section>
  )
}
