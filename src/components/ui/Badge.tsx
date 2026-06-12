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
    'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-sm transition-colors',
    variant === 'default' && 'bg-[var(--surface)] text-[var(--text-secondary)]',
    variant === 'category' &&
      'bg-[var(--accent-light)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white',
    variant === 'tag' &&
      'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return <span className={classes}>{children}</span>
}
