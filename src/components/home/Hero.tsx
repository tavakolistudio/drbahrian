import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/types'

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('home.hero')
  const tNav = useTranslations('nav')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section style={{ backgroundColor: '#f5f5f7' }} className="overflow-hidden">
      {/* Center-stack text */}
      <div className="site-container pt-24 pb-20 text-center">
        {/* Eyebrow — specialty */}
        <p
          className="mb-5"
          style={{
            fontFamily: isRTL ? 'var(--font-vazir), Tahoma, sans-serif' : 'var(--font-inter), system-ui, sans-serif',
            fontSize: '17px',
            fontWeight: 400,
            color: '#707070',
            letterSpacing: isRTL ? '0.01em' : '-0.1px',
            lineHeight: 1.6,
          }}
        >
          {t('subtitle')}
        </p>

        {/* Display headline */}
        <h1
          className="mb-6"
          style={{
            fontFamily: isRTL ? 'var(--font-vazir), Tahoma, sans-serif' : 'var(--font-inter), system-ui, sans-serif',
            fontSize: isRTL ? 'clamp(52px, 9vw, 88px)' : 'clamp(48px, 9vw, 96px)',
            fontWeight: 700,
            color: '#1d1d1f',
            letterSpacing: isRTL ? '-0.025em' : '-2.11px',
            lineHeight: isRTL ? 1.25 : 1.04,
          }}
        >
          {t('name')}
        </h1>

        {/* Intro */}
        <p
          className="mx-auto mb-10"
          style={{
            fontFamily: isRTL ? 'var(--font-vazir), Tahoma, sans-serif' : 'var(--font-inter), system-ui, sans-serif',
            fontSize: '20px',
            fontWeight: 300,
            color: '#1d1d1f',
            letterSpacing: isRTL ? '0.01em' : '-0.2px',
            lineHeight: isRTL ? 1.9 : 1.4,
            maxWidth: '560px',
          }}
        >
          {t('intro')}
        </p>

        {/* CTA pills */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/reserve"
            className="transition-opacity hover:opacity-80"
            style={{
              backgroundColor: '#0071e3',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '12px 24px',
              fontSize: '17px',
              fontWeight: 400,
              letterSpacing: isRTL ? '0.01em' : '-0.1px',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            {tNav('reserve')}
          </Link>
          <Link
            href={`${prefix}/blog`}
            className="transition-opacity hover:opacity-80"
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '12px 24px',
              fontSize: '17px',
              fontWeight: 400,
              letterSpacing: isRTL ? '0.01em' : '-0.1px',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            {t('ctaPrimary')}
          </Link>
        </div>
      </div>

    </section>
  )
}
