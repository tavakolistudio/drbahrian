'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/types'

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = useTranslations('home.about')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-black py-20 md:py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="liquid-glass rounded-3xl p-8 lg:p-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-white/40 text-xs tracking-widest uppercase mb-10"
          >
            {t('label')}
          </motion.p>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className={`flex-shrink-0 ${isRTL ? 'lg:order-last' : 'lg:order-first'}`}
            >
              <div className="relative w-56 h-72 lg:w-64 lg:h-80 overflow-hidden rounded-3xl liquid-glass">
                <Image
                  src="/doctor.jpg"
                  alt={isRTL ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 224px, 256px"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-xl"
            >
              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: isRTL ? 'var(--font-vazir), Tahoma, sans-serif' : 'var(--font-heading), serif',
                  fontStyle: isRTL ? 'normal' : 'italic',
                  fontSize: isRTL ? 'clamp(2rem, 4vw, 3.2rem)' : 'clamp(2.2rem, 4.5vw, 3.8rem)',
                  fontWeight: isRTL ? 700 : 400,
                  letterSpacing: isRTL ? '-0.02em' : '-0.02em',
                  lineHeight: isRTL ? 1.45 : 1.1,
                }}
              >
                {t('title')}
              </h2>
              <p
                className="mb-8 text-white/60 text-base md:text-lg"
                style={{
                  letterSpacing: isRTL ? '0.01em' : '-0.003em',
                  lineHeight: isRTL ? '2.1' : '1.7',
                }}
              >
                {t('text')}
              </p>
              <Link
                href={`${prefix}/about`}
                className="liquid-glass-strong rounded-full px-6 py-3 text-white text-sm font-medium inline-flex items-center gap-2"
              >
                {t('cta')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
