import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'

  return (
    <section className="py-[80px] bg-white">
      <div className="site-container">
        <div className="rounded-[28px] p-8 lg:p-12 border border-[#e8e8ed] bg-[#f5f5f7]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#707070] mb-10">
            {t('label')}
          </p>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Photo */}
            <div className={`flex-shrink-0 ${isRTL ? 'lg:order-last' : 'lg:order-first'}`}>
              <div className="relative w-56 h-72 lg:w-64 lg:h-80 overflow-hidden rounded-[28px] border border-[#e8e8ed]">
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
                className="text-[#1d1d1f] mb-6"
                style={{
                  fontFamily: isRTL
                    ? 'var(--font-vazir), Tahoma, sans-serif'
                    : 'var(--font-inter), system-ui, sans-serif',
                  fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                  fontWeight: isRTL ? 700 : 700,
                  letterSpacing: isRTL ? '-0.01em' : '-0.022em',
                  lineHeight: isRTL ? 1.4 : 1.1,
                }}
              >
                {t('title')}
              </h2>
              <p
                className="mb-8 text-[#707070]"
                style={{
                  fontSize: '17px',
                  letterSpacing: isRTL ? '0.01em' : '-0.003em',
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
