import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'

export function AuthorBox({ locale }: { locale: Locale }) {
  const t = useTranslations('blog')

  return (
    <div className="flex items-start gap-4 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
      <div className="w-12 h-12 rounded-sm bg-[var(--accent-light)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
        <span className="text-lg text-[var(--accent)] font-semibold">
          {locale === 'fa' ? 'م' : 'M'}
        </span>
      </div>
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-0.5">{t('by')}</p>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{t('author')}</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('authorTitle')}</p>
      </div>
    </div>
  )
}
