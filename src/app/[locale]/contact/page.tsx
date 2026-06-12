import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ContactForm } from '@/components/contact/ContactForm'
import type { Locale } from '@/types'
import { Mail, Send } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title'), description: t('metaDescription') }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const prefix = locale === 'en' ? '/en' : ''

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: `${prefix}/` },
    { label: t('contact.title') },
  ]

  return (
    <div className="site-container py-12">
      <Breadcrumb items={breadcrumbs} locale={locale} className="mb-8" />

      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-10">
          {t('contact.intro')}
        </p>

        {/* Direct contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <a
            href="mailto:bahriyanmaryam@gmail.com"
            className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] transition-colors group"
          >
            <Mail size={18} className="text-[var(--accent)]" />
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">{t('contact.email')}</p>
              <p className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                bahriyanmaryam@gmail.com
              </p>
            </div>
          </a>
          <a
            href="https://t.me/psychofreepen"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] transition-colors group"
          >
            <Send size={18} className="text-[var(--accent)]" />
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-0.5">{t('contact.telegram')}</p>
              <p className="text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                @psychofreepen
              </p>
            </div>
          </a>
        </div>

        <div className="h-px bg-[var(--border)] mb-10" />

        {/* Form */}
        <ContactForm locale={locale as Locale} />
      </div>
    </div>
  )
}
