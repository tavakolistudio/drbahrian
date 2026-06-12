import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'teaching' })
  return { title: t('title'), description: t('metaDescription') }
}

export default async function TeachingPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const isRTL = locale === 'fa'
  const prefix = locale === 'en' ? '/en' : ''

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: `${prefix}/` },
    { label: t('teaching.title') },
  ]

  const courses = isRTL
    ? [
        { title: 'روان‌شناسی عمومی', level: 'کارشناسی' },
        { title: 'روانکاوی', level: 'کارشناسی ارشد' },
        { title: 'روان‌شناسی شخصیت', level: 'کارشناسی' },
        { title: 'روان‌شناسی اجتماعی', level: 'کارشناسی' },
        { title: 'آسیب‌شناسی روانی', level: 'کارشناسی ارشد' },
        { title: 'روش‌های پژوهش در روان‌شناسی', level: 'کارشناسی ارشد' },
      ]
    : [
        { title: 'General Psychology', level: 'Undergraduate' },
        { title: 'Psychoanalysis', level: 'Graduate' },
        { title: 'Personality Psychology', level: 'Undergraduate' },
        { title: 'Social Psychology', level: 'Undergraduate' },
        { title: 'Psychopathology', level: 'Graduate' },
        { title: 'Research Methods in Psychology', level: 'Graduate' },
      ]

  const researchAreas = isRTL
    ? [
        { title: 'روانکاوی و هویت فرهنگی', desc: 'بررسی تأثیر فرهنگ بر شکل‌گیری هویت از منظر روانکاوی' },
        { title: 'بدن و سوبژکتیویته', desc: 'تحلیل نسبت بدن با میل و سوژه‌بودگی' },
        { title: 'سوگ و فقدان', desc: 'پژوهش در نظریه‌های روانکاوانه سوگ' },
        { title: 'روانکاوی و ادبیات فارسی', desc: 'خوانش روانکاوانه متون کلاسیک و معاصر فارسی' },
      ]
    : [
        { title: 'Psychoanalysis and Cultural Identity', desc: 'Examining cultural influence on identity formation from a psychoanalytic perspective' },
        { title: 'Body and Subjectivity', desc: 'Analysis of the relation between the body, desire, and subjectivity' },
        { title: 'Grief and Loss', desc: 'Research into psychoanalytic theories of mourning' },
        { title: 'Psychoanalysis and Persian Literature', desc: 'Psychoanalytic readings of classical and contemporary Persian texts' },
      ]

  return (
    <div className="site-container py-12">
      <Breadcrumb items={breadcrumbs} locale={locale} className="mb-8" />

      <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-12">
        {t('teaching.title')}
      </h1>

      {/* Teaching */}
      <section className="mb-14">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-6">
          {t('teaching.teaching')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c, i) => (
            <div key={i} className="p-5 border border-[var(--border)] rounded-sm bg-[var(--surface)]">
              <p className="text-xs text-[var(--text-muted)] mb-1">{c.level}</p>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">{c.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-[var(--border)] mb-14" />

      {/* Research */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-6">
          {t('teaching.research')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchAreas.map((r, i) => (
            <div key={i} className="p-5 border border-[var(--border)] rounded-sm">
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{r.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
