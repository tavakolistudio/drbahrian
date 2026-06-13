import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = locale === 'en' ? '/en' : ''
  const isRTL = locale === 'fa'

  return (
    <section className="py-20 bg-[#060606]">
      <div className="site-container">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-6 h-px bg-[#15846e]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9a9a9a]">
            {t('label')}
          </p>
        </div>
        <div className="max-w-2xl">
          <h2
            className="text-white mb-6 leading-[1.15]"
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              fontWeight: isRTL ? 300 : 200,
              letterSpacing: isRTL ? '-0.01em' : '-0.02em',
            }}
          >
            {t('title')}
          </h2>
          <p
            className="leading-relaxed mb-8"
            style={{
              color: '#bdbdbd',
              fontWeight: isRTL ? 400 : 300,
              lineHeight: isRTL ? '2.1' : '1.8',
            }}
          >
            {t('text')}
          </p>
          <Button href={`${prefix}/about`} variant="primary">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
