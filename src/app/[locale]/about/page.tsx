import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PersonSchema } from './schema'
import type { Locale } from '@/types'
import { Mail, Send } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('title'),
    description: t('metaDescription'),
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale })
  const isRTL = locale === 'fa'

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: `/${locale}/` },
    { label: t('about.title') },
  ]

  const sections = isRTL
    ? {
        intro: `دکتر مریم بهریان روان‌شناس بالینی، درمان‌گر و پژوهشگر حوزه روان است. تحصیلات ایشان در حوزه روان‌شناسی بالینی و عمومی تا مقطع دکتری ادامه یافته است.

نوشته‌های دکتر بهریان در تلاقی روانکاوی، فرهنگ، زبان، ادبیات و سیاست قرار دارند. ایشان به‌ویژه به پرسش‌هایی علاقه دارند که روانکاوی در مواجهه با واقعیت‌های فرهنگی و اجتماعی مطرح می‌کند.`,
        education: [
          'دکتری روان‌شناسی بالینی',
          'کارشناسی ارشد روان‌شناسی عمومی',
          'کارشناسی روان‌شناسی',
        ],
        clinical: `فعالیت درمانی دکتر بهریان بر مبنای رویکرد روانکاوی و روان‌پویایی است. ایشان با مراجعانی کار می‌کنند که با مسائلی مانند اضطراب، افسردگی، بحران هویت، روابط، سوگ و آسیب‌های روانی دست‌وپنجه نرم می‌کنند.`,
        writing: [
          'جستارهای روانکاوانه',
          'نقد فیلم و ادبیات از منظر روانکاوی',
          'مقالات بالینی و پژوهشی',
          'یادداشت‌های درمانی',
        ],
      }
    : {
        intro: `Dr. Maryam Bahrian is a clinical psychologist, psychotherapist, and researcher in the field of psychology. She holds a PhD in Clinical Psychology and has extensive experience in both clinical practice and academic settings.

Her writings stand at the intersection of psychoanalysis, culture, language, literature, and politics. She is particularly interested in questions that psychoanalysis raises when confronted with cultural and social realities.`,
        education: [
          'PhD in Clinical Psychology',
          'Master\'s in General Psychology',
          'Bachelor\'s in Psychology',
        ],
        clinical: `Dr. Bahrian's clinical practice is grounded in psychoanalytic and psychodynamic approaches. She works with individuals dealing with anxiety, depression, identity crises, relationship issues, grief, and psychological trauma.`,
        writing: [
          'Psychoanalytic essays',
          'Psychoanalytic film and literary criticism',
          'Clinical and academic articles',
          'Therapeutic notes',
        ],
      }

  return (
    <>
    <PersonSchema locale={locale} />
    <div className="site-container py-12">
      <Breadcrumb items={breadcrumbs} locale={locale} className="mb-8" />

      <div className="max-w-3xl">
        {/* Header with photo */}
        <div className="flex flex-col sm:flex-row items-start gap-8 mb-12">
          <div className="flex-shrink-0">
            <div className="relative w-40 h-52 sm:w-48 sm:h-60 overflow-hidden rounded-sm shadow-md border border-[var(--border)]">
              <Image
                src="/doctor.jpg"
                alt={isRTL ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
                fill
                className="object-cover object-top grayscale"
                sizes="(max-width: 640px) 160px, 192px"
                priority
              />
            </div>
          </div>
          <div className="flex-1">
            <h1
              className="text-[var(--text-primary)] mb-4 leading-tight"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: isRTL ? 300 : 200,
                letterSpacing: isRTL ? '-0.01em' : '-0.03em',
              }}
            >
              {t('about.title')}
            </h1>
            <p className="text-base text-[var(--text-secondary)] leading-loose whitespace-pre-line">
              {sections.intro}
            </p>
          </div>
        </div>

        {/* Education */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
            {t('about.sections.education')}
          </h2>
          <ul className="space-y-2">
            {sections.education.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="h-px bg-[var(--border)] mb-10" />

        {/* Clinical */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
            {t('about.sections.clinical')}
          </h2>
          <p className="text-[var(--text-secondary)] leading-loose">{sections.clinical}</p>
        </section>

        <div className="h-px bg-[var(--border)] mb-10" />

        {/* Writing */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
            {t('about.sections.writing')}
          </h2>
          <ul className="space-y-2">
            {sections.writing.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <div className="h-px bg-[var(--border)] mb-10" />

        {/* License */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
            {t('about.sections.license')}
          </h2>
          <p className="text-[var(--text-muted)] text-sm italic">
            {isRTL ? '[شماره پروانه به زودی درج می‌شود]' : '[License number will be added soon]'}
          </p>
        </section>

        <div className="h-px bg-[var(--border)] mb-10" />

        {/* Contact */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--accent)] mb-4">
            {t('about.sections.contact')}
          </h2>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:bahriyanmaryam@gmail.com"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <Mail size={16} />
              bahriyanmaryam@gmail.com
            </a>
            <a
              href="https://t.me/psychofreepen"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <Send size={16} />
              @psychofreepen
            </a>
          </div>
        </section>
      </div>
    </div>
    </>
  )
}
