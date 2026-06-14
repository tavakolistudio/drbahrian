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
    'inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.05em] px-3 py-1 rounded-[24px] transition-colors',
    variant === 'default' && 'bg-white/[0.06] text-[#bdbdbd]',
    variant === 'category' &&
      'bg-white/[0.06] text-[#8052ff] hover:bg-[#8052ff] hover:text-white border border-[#8052ff]/30',
    variant === 'tag' &&
      'border border-white/10 text-[#9a9a9a] hover:border-white/30 hover:text-white',
    className
  )

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  return <span className={classes}>{children}</span>
}
