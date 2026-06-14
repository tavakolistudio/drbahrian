'use client'

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
  const categories = locale === 'fa' ? FA_CATEGORIES : EN_CATEGORIES

  return (
    <section className="py-[60px] bg-black">
      <div className="site-container">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] mb-10">
          {t('title')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`${prefix}/blog/category/${cat.slug}`}
              className="group block p-5 transition-all duration-200 rounded-[24px]"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(128,82,255,0.3)'
                el.style.background = 'rgba(128,82,255,0.04)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.background = 'transparent'
              }}
            >
              <h3 className="text-sm font-medium text-[#bdbdbd] group-hover:text-white transition-colors mb-2 leading-snug">
                {cat.label}
              </h3>
              <p className="text-xs text-[#9a9a9a] leading-relaxed">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
