import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { Mail, Send } from 'lucide-react'

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations()
  const prefix = locale === 'en' ? '/en' : ''
  const year = new Date().getFullYear()

  const links = [
    { href: `${prefix}/`, label: t('nav.home') },
    { href: `${prefix}/about`, label: t('nav.about') },
    { href: `${prefix}/blog`, label: t('nav.blog') },
    { href: `${prefix}/teaching`, label: t('nav.teaching') },
    { href: `${prefix}/books`, label: t('nav.books') },
    { href: `${prefix}/contact`, label: t('nav.contact') },
  ]

  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`${prefix}/`} className="block mb-3">
              <span className="text-base font-semibold text-[var(--text-primary)]">
                {locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
              {locale === 'fa'
                ? 'روان‌شناس بالینی، درمان‌گر، نویسنده و مدرس دانشگاه'
                : 'Clinical Psychologist, Psychotherapist, Author & Lecturer'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:bahriyanmaryam@gmail.com"
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <Mail size={14} />
                  bahriyanmaryam@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/psychofreepen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <Send size={14} />
                  @psychofreepen
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
          <span>
            {locale === 'fa' ? `© ${year} دکتر مریم بهریان` : `© ${year} Dr. Maryam Bahrian`}
            {' — '}
            {t('footer.rights')}
          </span>
        </div>
      </div>
    </footer>
  )
}
