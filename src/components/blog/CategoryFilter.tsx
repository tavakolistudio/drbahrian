import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types'

interface CategoryFilterProps {
  categories: { slug: string; count: number }[]
  currentCategory?: string
  locale: Locale
}

export function CategoryFilter({ categories, currentCategory, locale }: CategoryFilterProps) {
  const t = useTranslations('blog')
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`${prefix}/blog`}
        className={cn(
          'px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors',
          !currentCategory
            ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
            : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
        )}
      >
        {t('allCategories')}
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`${prefix}/blog/category/${cat.slug}`}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-sm border transition-colors',
            currentCategory === cat.slug
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
          )}
        >
          {cat.slug}
          <span className="ms-1 opacity-60">({cat.count})</span>
        </Link>
      ))}
    </div>
  )
}
