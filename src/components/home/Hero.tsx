import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/types'
import { ParticleField } from '@/components/ui/ParticleField'

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('home.hero')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Full-bleed particle constellation */}
      <div className="absolute inset-0">
        <ParticleField className="w-full h-full" />
      </div>

      {/* Gradient: keeps text legible — deep on text side, transparent toward particles */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'linear-gradient(to left, rgba(0,0,0,0.92) 35%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.15) 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.92) 35%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.15) 100%)',
        }}
      />

      <div className="site-container relative z-10 py-24 md:py-36">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p
            className="text-xs font-semibold uppercase tracking-[0.08em] mb-5"
            style={{ color: '#8052ff' }}
          >
            {isRTL ? 'وب‌سایت رسمی' : 'Official Website'}
          </p>

          {/* Display headline — weight 300 for FA (legible), 200 for EN (Dala signature) */}
          <h1
            className="text-white leading-[0.9] mb-5"
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
              fontWeight: isRTL ? 300 : 200,
              letterSpacing: isRTL ? '-0.01em' : '-0.03em',
            }}
          >
            {t('name')}
          </h1>

          {/* Subtitle */}
          <p
            className="font-semibold text-xs uppercase tracking-[0.06em] mb-6"
            style={{ color: '#8052ff' }}
          >
            {t('subtitle')}
          </p>

          {/* Body — weight 400 for FA, 300 for EN */}
          <p
            className="text-base leading-relaxed mb-10 max-w-[52ch]"
            style={{
              color: '#bdbdbd',
              fontWeight: isRTL ? 400 : 300,
              letterSpacing: isRTL ? '0.01em' : '0.025em',
              lineHeight: isRTL ? '2' : '1.7',
            }}
          >
            {t('intro')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white text-xs font-semibold uppercase tracking-[0.05em] transition-colors"
              style={{ background: '#8052ff' }}
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.05em] transition-colors"
              style={{ border: '1px solid #ffb829', color: '#ffb829' }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
