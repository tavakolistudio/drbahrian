'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'

const FA_CATEGORIES = [
  { slug: 'روانکاوی', label: 'روانکاوی', description: 'نظریه و کاربرد روانکاوی کلاسیک و معاصر' },
  { slug: 'روانکاوی-و-ادبیات', label: 'روانکاوی و ادبیات', description: 'خوانش روانکاوانه متون ادبی' },
  { slug: 'روانکاوی-و-فرهنگ', label: 'روانکاوی و فرهنگ', description: 'روان، هویت و ساختارهای فرهنگی' },
  { slug: 'روانکاوی-و-سیاست', label: 'روانکاوی و سیاست', description: 'ناخودآگاه در عرصه اجتماع و سیاست' },
  { slug: 'بدن-میل-فقدان', label: 'بدن، میل و فقدان', description: 'جستارهایی درباره میل، سوگ و بدن' },
  { slug: 'یادداشت‌های-درمانگر', label: 'یادداشت‌های درمان‌گر', description: 'تأملات از اتاق درمان' },
  { slug: 'نقد-فیلم-و-کتاب', label: 'نقد فیلم و کتاب', description: 'نقد و تحلیل روانکاوانه آثار هنری' },
  { slug: 'جستارهای-روان', label: 'جستارهای روان', description: 'مقالات آزاد درباره روان انسانی' },
]

const EN_CATEGORIES = [
  { slug: 'psychoanalysis', label: 'Psychoanalysis', description: 'Theory and practice of classical and contemporary psychoanalysis' },
  { slug: 'psychoanalysis-and-literature', label: 'Psychoanalysis & Literature', description: 'Psychoanalytic readings of literary texts' },
  { slug: 'psychoanalysis-and-culture', label: 'Psychoanalysis & Culture', description: 'Mind, identity, and cultural structures' },
  { slug: 'psychoanalysis-and-politics', label: 'Psychoanalysis & Politics', description: 'The unconscious in society and politics' },
  { slug: 'body-desire-loss', label: 'Body, Desire & Loss', description: 'Essays on desire, grief, and the body' },
  { slug: 'therapist-notes', label: "Therapist's Notes", description: 'Reflections from the therapy room' },
  { slug: 'film-book-review', label: 'Film & Book Review', description: 'Psychoanalytic critique of artistic works' },
  { slug: 'psychological-essays', label: 'Psychological Essays', description: 'Free essays on the human psyche' },
]

export function CategoryGrid({ locale }: { locale: Locale }) {
  const t = useTranslations('home.categories')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'
  const categories = isRTL ? FA_CATEGORIES : EN_CATEGORIES
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="relative bg-black py-20 md:py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-white text-2xl md:text-3xl tracking-tight mb-10"
          style={{
            fontFamily: isRTL ? undefined : 'var(--font-heading), serif',
            fontStyle: isRTL ? 'normal' : 'italic',
            fontWeight: isRTL ? 700 : 400,
          }}
        >
          {t('title')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.06 }}
            >
              <Link
                href={`${prefix}/blog/category/${cat.slug}`}
                className="liquid-glass group block p-5 rounded-2xl h-full"
              >
                <h3
                  className="text-sm font-medium text-white mb-2 leading-snug"
                  style={{ lineHeight: isRTL ? 1.8 : 1.5 }}
                >
                  {cat.label}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
