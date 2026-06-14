import { cn } from '@/lib/utils'
import Link from 'next/link'

interface BadgeProps {
  children: React.ReactNode
  href?: string
  variant?: 'default' | 'category' | 'tag'
  className?: string
}

export function Badge({ children, href, variant = 'default', className }: BadgeProps) {
  const classes = cn(
    'inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.059em] px-3 py-1 rounded-[100px] transition-colors',
    variant === 'default' && 'bg-[#e4f0f1] text-[#283338]',
    variant === 'category' &&
      'bg-[#e4f0f1] text-[#0e4749] hover:bg-[#1c5d5f] hover:text-white',
    variant === 'tag' &&
      'border border-[#a2cbcd] text-[#0e4749] hover:border-[#1c5d5f] hover:text-[#1c5d5f]',
    className
  )

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  return <span className={classes}>{children}</span>
}
