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
    'inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.05em] px-3 py-1 rounded-full transition-colors',
    variant === 'default' && 'bg-white/5 text-[var(--text-muted)]',
    variant === 'category' &&
      'bg-[#8052ff]/10 text-[#8052ff] hover:bg-[#8052ff] hover:text-white',
    variant === 'tag' &&
      'border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
    className
  )

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }
  return <span className={classes}>{children}</span>
}
