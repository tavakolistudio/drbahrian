import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  external?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] disabled:opacity-40 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-[#0071e3] text-white hover:opacity-80 rounded-[999px]',
  secondary:
    'bg-[#000000] text-white hover:opacity-80 rounded-[999px]',
  ghost:
    'text-[#0066cc] hover:underline',
  outline:
    'border border-[#e8e8ed] text-[#1d1d1f] hover:border-[#1d1d1f] rounded-[999px]',
}

const sizes = {
  sm: 'px-4 py-2 text-sm font-medium',
  md: 'px-6 py-3 text-[17px] font-normal',
  lg: 'px-8 py-3.5 text-[17px] font-normal',
}

export function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  disabled,
  external,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  )
}
