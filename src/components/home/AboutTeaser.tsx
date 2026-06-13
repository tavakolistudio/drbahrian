import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <section className="py-20 border-t border-white/[0.06]">
      <div className="site-container">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8052ff] mb-5">
            {t('label')}
          </p>
          <h2 className="text-3xl md:text-4xl font-extralight text-white mb-5 leading-[1.15] tracking-[-0.02em]">
            {t('title')}
          </h2>
          <p className="text-[#bdbdbd] leading-relaxed tracking-[0.025em] mb-8">{t('text')}</p>
          <Button href={`${prefix}/about`} variant="primary">
            {t('cta')}
          </Button>
        </div>
      </div>
    </section>
  )
}
