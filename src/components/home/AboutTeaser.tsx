import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section className="py-[60px] bg-black">
      <div className="site-container">
        <div
          className="rounded-[24px] p-8 lg:p-12"
          style={{ border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] mb-10">
            {t('label')}
          </p>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Photo */}
            <div className={`flex-shrink-0 ${isRTL ? 'lg:order-last' : 'lg:order-first'}`}>
              <div
                className="relative w-56 h-72 lg:w-64 lg:h-80 overflow-hidden rounded-[24px]"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Image
                  src="/doctor.jpg"
                  alt={isRTL ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 224px, 256px"
                />
              </div>
            </div>

            {/* Text */}
            <div className="max-w-xl">
              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: isRTL
                    ? 'var(--font-vazir), Tahoma, sans-serif'
                    : 'var(--font-inter), system-ui, sans-serif',
                  fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                  fontWeight: isRTL ? 300 : 200,
                  letterSpacing: isRTL ? '-0.01em' : '-0.04em',
                  lineHeight: isRTL ? 1.4 : 1.0,
                }}
              >
                {t('title')}
              </h2>
              <p
                className="mb-8 text-[#9a9a9a]"
                style={{
                  fontSize: '15px',
                  letterSpacing: isRTL ? '0.01em' : '0.025em',
                  lineHeight: isRTL ? '2.1' : '1.7',
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
      </div>
    </section>
  )
}
