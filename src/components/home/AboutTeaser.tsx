import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section className="py-[88px] bg-[#e4f0f1]">
      <div className="site-container">
        <p
          className="flex items-center gap-2 mb-12"
          style={{
            fontFamily: 'var(--font-ibm-plex-mono), ui-monospace, monospace',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.059em',
            textTransform: 'uppercase',
            color: '#283338',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#1c5d5f',
              flexShrink: 0,
            }}
          />
          {t('label')}
        </p>
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Photo */}
          <div className={`flex-shrink-0 ${isRTL ? 'lg:order-last' : 'lg:order-first'}`}>
            <div className="relative w-64 h-80 lg:w-72 lg:h-96 overflow-hidden rounded-[12px]">
              <Image
                src="/doctor.jpg"
                alt={isRTL ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 256px, 288px"
              />
            </div>
          </div>

          {/* Text */}
          <div className="max-w-xl">
            <h2
              className="text-[#283338] mb-6"
              style={{
                fontFamily: isRTL
                  ? 'var(--font-vazir), Tahoma, sans-serif'
                  : 'var(--font-source-serif), Georgia, serif',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
                fontWeight: isRTL ? 300 : 400,
                letterSpacing: isRTL ? '-0.01em' : '-0.01em',
                lineHeight: 1.2,
              }}
            >
              {t('title')}
            </h2>
            <p
              className="leading-relaxed mb-8"
              style={{
                color: '#333333',
                fontWeight: isRTL ? 400 : 400,
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
