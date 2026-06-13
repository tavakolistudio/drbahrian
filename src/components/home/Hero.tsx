import { useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/types'
import { ParticleField } from '@/components/ui/ParticleField'

export function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations('home.hero')
  const prefix = locale === 'en' ? '/en' : ''
  const isRTL = locale === 'fa'

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Full-bleed particle constellation */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <ParticleField className="w-full h-full opacity-90" />
      </div>

      {/* Gradient veil — keeps text legible on left/right half */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isRTL
            ? 'linear-gradient(to left, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.5) 75%, transparent 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.5) 75%, transparent 100%)',
        }}
      />

      <div className="site-container relative z-10 py-24 md:py-32">
        {/* Text block — max-width keeps it in one "half"; RTL anchors it to the right naturally */}
        <div className="max-w-xl">
          {/* Eyebrow kicker */}
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#8052ff] mb-5">
            {isRTL ? 'وب‌سایت رسمی' : 'Official Website'}
          </p>

          {/* Display headline — ultra-thin signature */}
          <h1
            className="text-white leading-[0.88] tracking-[-0.03em] mb-5"
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              fontWeight: 200,
            }}
          >
            {t('name')}
          </h1>

          {/* Subtitle — plum voltage accent */}
          <p className="text-[#8052ff] font-semibold text-xs uppercase tracking-[0.05em] mb-6">
            {t('subtitle')}
          </p>

          {/* Body */}
          <p className="text-[#bdbdbd] text-base leading-relaxed tracking-[0.025em] mb-10 max-w-[52ch]">
            {t('intro')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#8052ff] text-white text-xs font-semibold uppercase tracking-[0.05em] hover:bg-[#6b3fe0] transition-colors"
            >
              {t('ctaPrimary')}
            </Link>
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#ffb829] text-[#ffb829] text-xs font-semibold uppercase tracking-[0.05em] hover:bg-[#ffb829]/10 transition-colors"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
