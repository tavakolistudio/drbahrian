import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/types'
import { ParticleField } from '@/components/ui/ParticleField'

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('home.hero')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#F0EEE9]">
      {/* Full-bleed particle constellation */}
      <div className="absolute inset-0">
        <ParticleField className="w-full h-full" rtl={isRTL} />
      </div>

      {/* Subtle dark atmosphere behind the brain area to boost particle contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'radial-gradient(ellipse 48% 65% at 24% 44%, rgba(44,74,62,0.10) 0%, transparent 72%)'
            : 'radial-gradient(ellipse 48% 65% at 76% 44%, rgba(44,74,62,0.10) 0%, transparent 72%)',
        }}
      />

      {/* Gradient: fades text side to bg color, leaves particle side transparent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'linear-gradient(to left, rgba(240,238,233,0.97) 30%, rgba(240,238,233,0.6) 60%, rgba(240,238,233,0) 100%)'
            : 'linear-gradient(to right, rgba(240,238,233,0.97) 30%, rgba(240,238,233,0.6) 60%, rgba(240,238,233,0) 100%)',
        }}
      />

      <div className="site-container relative z-10 py-24 md:py-36">
        <div className="max-w-xl">
          {/* Eyebrow */}
          <p
            className="text-xs font-semibold uppercase tracking-[0.08em] mb-5"
            style={{ color: '#2C4A3E' }}
          >
            {isRTL ? 'وب‌سایت رسمی' : 'Official Website'}
          </p>

          {/* Display headline */}
          <h1
            className="text-[#1a1a1a] leading-[0.9] mb-5"
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
            style={{ color: '#2C4A3E' }}
          >
            {t('subtitle')}
          </p>

          {/* Body */}
          <p
            className="text-base leading-relaxed mb-10 max-w-[52ch]"
            style={{
              color: '#4a4a4a',
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white text-xs font-semibold uppercase tracking-[0.05em] transition-colors hover:opacity-90"
              style={{ background: '#2C4A3E' }}
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.05em] transition-colors hover:bg-[#2C4A3E]/10"
              style={{ border: '1px solid #2C4A3E', color: '#2C4A3E' }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
