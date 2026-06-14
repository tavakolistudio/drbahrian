import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/types'
import { ParticleField } from '@/components/ui/ParticleField'

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('home.hero')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#f2f8f7]">
      {/* Particle brain illustration */}
      <div className="absolute inset-0">
        <ParticleField className="w-full h-full" rtl={isRTL} />
      </div>

      {/* Soft teal atmosphere behind brain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'radial-gradient(ellipse 48% 65% at 24% 44%, rgba(28,93,95,0.07) 0%, transparent 72%)'
            : 'radial-gradient(ellipse 48% 65% at 76% 44%, rgba(28,93,95,0.07) 0%, transparent 72%)',
        }}
      />

      {/* Fade text side to canvas */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'linear-gradient(to left, rgba(242,248,247,0.97) 30%, rgba(242,248,247,0.6) 60%, rgba(242,248,247,0) 100%)'
            : 'linear-gradient(to right, rgba(242,248,247,0.97) 30%, rgba(242,248,247,0.6) 60%, rgba(242,248,247,0) 100%)',
        }}
      />

      <div className="site-container relative z-10 py-24 md:py-36">
        <div className="max-w-xl">
          {/* Eyebrow — IBM Plex Mono */}
          <p
            className="mb-5 flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), ui-monospace, monospace',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.059em',
              textTransform: 'uppercase',
              color: '#1c5d5f',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#65b8a2',
                flexShrink: 0,
              }}
            />
            {isRTL ? 'وب‌سایت رسمی' : 'Official Website'}
          </p>

          {/* Display headline — Source Serif 4 */}
          <h1
            className="text-[#283338] mb-5"
            style={{
              fontFamily: isRTL
                ? 'var(--font-vazir), Tahoma, sans-serif'
                : 'var(--font-source-serif), Georgia, serif',
              fontSize: 'clamp(2.8rem, 6.5vw, 5rem)',
              fontWeight: isRTL ? 300 : 400,
              letterSpacing: isRTL ? '-0.01em' : '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {t('name')}
          </h1>

          {/* Subtitle — IBM Plex Mono */}
          <p
            className="mb-6"
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), ui-monospace, monospace',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.059em',
              textTransform: 'uppercase',
              color: '#0e4749',
            }}
          >
            {t('subtitle')}
          </p>

          {/* Body text */}
          <p
            className="text-base mb-10 max-w-[52ch]"
            style={{
              color: '#333333',
              fontWeight: isRTL ? 400 : 400,
              letterSpacing: isRTL ? '0.01em' : '0.005em',
              lineHeight: isRTL ? '2' : '1.7',
            }}
          >
            {t('intro')}
          </p>

          {/* CTAs — pill buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[48px] text-white text-sm font-medium transition-colors hover:bg-[#156152]"
              style={{ background: '#1c5d5f' }}
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[48px] text-sm font-medium transition-colors hover:bg-[#e4f0f1]"
              style={{ border: '1px solid #0e4749', color: '#0e4749' }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
