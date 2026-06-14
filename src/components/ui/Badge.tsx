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
    'inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.05em] px-3 py-1 rounded-[999px] transition-colors',
    variant === 'default' && 'bg-[#f5f5f7] text-[#707070]',
    variant === 'category' &&
      'bg-[#f5f5f7] text-[#0071e3] border border-[#0071e3]/20 hover:bg-[#0071e3] hover:text-white',
    variant === 'tag' &&
      'border border-[#e8e8ed] text-[#707070] hover:border-[#1d1d1f] hover:text-[#1d1d1f]',
    className
  )

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  return <span className={classes}>{children}</span>
}
