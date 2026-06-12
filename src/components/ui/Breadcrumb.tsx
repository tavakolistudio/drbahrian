import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  locale: string
  className?: string
}

export function Breadcrumb({ items, locale, className }: BreadcrumbProps) {
  const isRTL = locale === 'fa'

  return (
    <nav aria-label="breadcrumb" className={cn('flex items-center flex-wrap gap-1.5 text-sm text-[var(--text-muted)]', className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && (
            <span aria-hidden="true" className={isRTL ? 'rotate-180' : ''}>
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text-secondary)]" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
