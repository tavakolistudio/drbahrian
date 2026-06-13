import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section className="py-20 bg-[#F9F8F5]">
      <div className="site-container">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-6 h-px bg-[#2C4A3E]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6b]">
            {t('label')}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Photo */}
          <div className={`flex-shrink-0 ${isRTL ? 'lg:order-last' : 'lg:order-first'}`}>
            <div className="relative w-64 h-80 lg:w-72 lg:h-96 overflow-hidden rounded-sm shadow-lg">
              <Image
                src="/doctor.jpg"
                alt={isRTL ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
                fill
                className="object-cover object-top grayscale"
                sizes="(max-width: 1024px) 256px, 288px"
              />
            </div>
          </div>
          {/* Text */}
          <div className="max-w-xl">
            <h2
              className="text-[#1a1a1a] mb-6 leading-[1.15]"
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
                color: '#4a4a4a',
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
      </div>
    </section>
  )
}
