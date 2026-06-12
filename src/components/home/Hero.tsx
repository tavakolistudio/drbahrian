import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('home.hero')
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <section className="py-20 md:py-28 border-b border-[var(--border)]">
      <div className="site-container">
        <div className="max-w-3xl">
          {/* Pre-title */}
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-5">
            {locale === 'fa' ? 'وب‌سایت رسمی' : 'Official Website'}
          </p>

          {/* Name */}
          <h1
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight mb-4',
              locale === 'fa' ? 'font-vazir' : 'font-playfair'
            )}
          >
            {t('name')}
          </h1>

          {/* Subtitle */}
          <p
            className={cn(
              'text-base md:text-lg text-[var(--accent)] font-medium mb-6',
              locale === 'fa' ? 'font-vazir' : 'font-inter'
            )}
          >
            {t('subtitle')}
          </p>

          {/* Intro */}
          <p className="text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-10">
            {t('intro')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button href={`${prefix}/blog`} variant="primary" size="lg">
              {t('ctaPrimary')}
            </Button>
            <Button href={`${prefix}/contact`} variant="outline" size="lg">
              {t('ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
