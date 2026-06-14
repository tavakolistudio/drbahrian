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
        <ParticleField className="w-full h-full" rtl={isRTL} />
      </div>

      {/* Subtle violet glow behind brain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'radial-gradient(ellipse 50% 70% at 24% 44%, rgba(128,82,255,0.09) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 50% 70% at 76% 44%, rgba(128,82,255,0.09) 0%, transparent 70%)',
        }}
      />

      {/* Gradient: fades text side to black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'linear-gradient(to left, rgba(0,0,0,0.97) 28%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.97) 28%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="site-container relative z-10 py-24 md:py-36">
        <div className="max-w-[480px]">
          {/* Eyebrow */}
          <p
            className="mb-6 text-[#8052ff]"
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {isRTL ? '● وب‌سایت رسمی' : '● Official Website'}
          </p>

          {/* Display headline — weight 200, ultra-tight */}
          <h1
            className="text-white mb-6"
            style={{
              fontFamily: isRTL
                ? 'var(--font-vazir), Tahoma, sans-serif'
                : 'var(--font-inter), system-ui, sans-serif',
              fontSize: 'clamp(3.2rem, 7.5vw, 6.5rem)',
              fontWeight: 200,
              letterSpacing: isRTL ? '-0.01em' : '-0.04em',
              lineHeight: isRTL ? 1.15 : 0.9,
            }}
          >
            {t('name')}
          </h1>

          {/* Subtitle */}
          <p
            className="mb-7 text-[#9a9a9a]"
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {t('subtitle')}
          </p>

          {/* Body */}
          <p
            className="mb-10 text-[#bdbdbd]"
            style={{
              fontSize: '16px',
              fontWeight: 400,
              letterSpacing: isRTL ? '0.01em' : '0.025em',
              lineHeight: isRTL ? '2' : '1.6',
              maxWidth: '52ch',
            }}
          >
            {t('intro')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center gap-2 px-5 py-3 text-white text-xs font-semibold uppercase tracking-[0.05em] transition-all hover:opacity-80"
              style={{ background: '#8052ff', borderRadius: '24px' }}
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 px-5 py-3 text-[#bdbdbd] text-xs font-semibold uppercase tracking-[0.05em] transition-all hover:text-white hover:border-white"
              style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: '24px' }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
