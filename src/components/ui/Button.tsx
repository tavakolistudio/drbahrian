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
  'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-[0.05em] transition-all duration-200 rounded-[24px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8052ff] disabled:opacity-40 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-[#8052ff] text-white hover:opacity-80',
  secondary:
    'bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.1]',
  ghost:
    'text-[#9a9a9a] hover:text-white',
  outline:
    'border border-white/20 text-[#bdbdbd] hover:border-white/40 hover:text-white',
}

const sizes = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-5 py-2.5 text-xs',
  lg: 'px-6 py-3 text-xs',
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
