import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <section className="py-16 border-t border-[var(--border)]">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
            {t('label')}
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] mb-4 leading-snug">
            {t('title')}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-6">{t('text')}</p>
          <Button href={`${prefix}/about`} variant="secondary">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
