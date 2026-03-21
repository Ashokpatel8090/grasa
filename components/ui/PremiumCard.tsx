'use client'

import React, { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PremiumCardProps {
  children: ReactNode
  className?: string
  hover?: 'lift' | 'glow' | 'scale' | 'none'
  animated?: boolean
  delay?: number
  onClick?: () => void
  href?: string
}

/**
 * Premium Card Component with built-in animations
 * Features smooth hover effects, entrance animations, and responsive design
 */
export function PremiumCard({
  children,
  className,
  hover = 'lift',
  animated = true,
  delay = 0,
  onClick,
  href,
}: PremiumCardProps) {
  const hoverClasses = {
    lift: 'hover-lift',
    glow: 'hover-glow',
    scale: 'hover:scale-105 transition-smooth',
    none: '',
  }

  const baseClasses = cn(
    'rounded-xl border border-gray-200 bg-white p-6',
    'transition-smooth duration-300',
    hoverClasses[hover],
    animated && 'animate-fade-in-up',
    className
  )

  const style = animated ? { animationDelay: `${delay}ms` } : undefined

  const content = (
    <div className={baseClasses} style={style} onClick={onClick}>
      {children}
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return content
}

/**
 * Card Grid Component for displaying multiple cards with staggered animations
 */
interface CardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function CardGrid({
  children,
  columns = 3,
  gap = 'md',
  className,
}: CardGridProps) {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  }

  const colClasses = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1',
        colClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Stat Card Component for displaying key metrics
 */
interface StatCardProps {
  icon?: ReactNode
  label: string
  value: string | number
  description?: string
  className?: string
  animated?: boolean
  delay?: number
}

export function StatCard({
  icon,
  label,
  value,
  description,
  className,
  animated = true,
  delay = 0,
}: StatCardProps) {
  return (
    <PremiumCard
      className={cn(
        'flex flex-col items-center text-center md:items-start md:text-left',
        className
      )}
      animated={animated}
      delay={delay}
    >
      {icon && (
        <div className="mb-3 text-[#C5D82D] text-2xl">
          {icon}
        </div>
      )}
      
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-2">
        {label}
      </h3>
      
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed">
          {description}
        </p>
      )}
    </PremiumCard>
  )
}

/**
 * Feature Card Component for showcasing features
 */
interface FeatureCardProps {
  title: string
  description: string
  icon?: ReactNode
  image?: string
  className?: string
  animated?: boolean
  delay?: number
}

export function FeatureCard({
  title,
  description,
  icon,
  image,
  className,
  animated = true,
  delay = 0,
}: FeatureCardProps) {
  return (
    <PremiumCard
      className={className}
      animated={animated}
      delay={delay}
    >
      {image && (
        <div className="mb-4 h-40 rounded-lg bg-gray-100 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-smooth duration-300"
          />
        </div>
      )}
      
      {icon && (
        <div className="mb-3 text-2xl">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </PremiumCard>
  )
}
