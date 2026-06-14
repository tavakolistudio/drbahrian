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
  'inline-flex items-center justify-center gap-2 font-medium tracking-[0.01em] transition-all duration-200 rounded-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-[#1c5d5f] text-white hover:bg-[#156152]',
  secondary:
    'bg-[#16325a] text-white hover:bg-[#0e2240]',
  ghost:
    'text-[#0e4749] hover:text-[#283338] hover:bg-[#e4f0f1]',
  outline:
    'border border-[#0e4749] text-[#0e4749] hover:bg-[#e4f0f1]',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
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
