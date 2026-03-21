'use client'

import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  isLink?: boolean
  href?: string
}

/**
 * Premium Button Component with micro-interactions
 * Features multiple variants, sizes, and smooth animations
 */
export const PremiumButton = React.forwardRef<
  HTMLButtonElement,
  PremiumButtonProps
>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'right',
      fullWidth = false,
      isLink = false,
      href,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary: 'bg-[#C5D82D] text-black hover:bg-[#d4e830] hover:shadow-lg',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      outline: 'border-2 border-[#C5D82D] text-[#C5D82D] hover:bg-[#C5D82D]/10',
      ghost: 'text-gray-700 hover:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm gap-2',
      md: 'px-6 py-3 text-base gap-2',
      lg: 'px-8 py-4 text-lg gap-3',
      xl: 'px-10 py-5 text-xl gap-3',
    }

    const baseClasses = cn(
      'inline-flex items-center justify-center font-semibold rounded-lg',
      'transition-smooth duration-200 cursor-pointer',
      'focus-ring focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    )

    const content = (
      <>
        {icon && iconPosition === 'left' && (
          <span className={loading ? 'animate-pulse' : ''}>
            {icon}
          </span>
        )}
        <span>{children}</span>
        {icon && iconPosition === 'right' && (
          <span className={`transition-transform ${loading ? 'animate-pulse' : ''}`}>
            {icon}
          </span>
        )}
      </>
    )

    if (isLink && href) {
      return (
        <a
          href={href}
          className={baseClasses}
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={baseClasses}
        {...props}
      >
        {content}
      </button>
    )
  }
)

PremiumButton.displayName = 'PremiumButton'

/**
 * Button Group Component for related actions
 */
interface ButtonGroupProps {
  children: ReactNode
  vertical?: boolean
  gap?: 'sm' | 'md' | 'lg'
}

export function ButtonGroup({
  children,
  vertical = false,
  gap = 'md',
}: ButtonGroupProps) {
  const gapClasses = {
    sm: vertical ? 'space-y-2' : 'gap-2',
    md: vertical ? 'space-y-3' : 'gap-3',
    lg: vertical ? 'space-y-4' : 'gap-4',
  }

  return (
    <div
      className={cn(
        'flex',
        vertical ? 'flex-col' : 'flex-row',
        gapClasses[gap]
      )}
    >
      {children}
    </div>
  )
}

/**
 * Icon Button Component for compact icon-only actions
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: ButtonVariant
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', variant = 'ghost', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    }

    const variantClasses = {
      primary: 'bg-[#C5D82D] text-black hover:bg-[#d4e830]',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      outline: 'border border-[#C5D82D] text-[#C5D82D] hover:bg-[#C5D82D]/10',
      ghost: 'text-gray-700 hover:bg-gray-100',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          'transition-smooth duration-200 cursor-pointer',
          'focus-ring focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
