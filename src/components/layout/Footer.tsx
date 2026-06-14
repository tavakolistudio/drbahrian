import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { Mail, Send, Instagram } from 'lucide-react'

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations()
  const prefix = `/${locale}`
  const year = new Date().getFullYear()

  const links = [
    { href: `${prefix}/`, label: t('nav.home') },
    { href: `${prefix}/about`, label: t('nav.about') },
    { href: `${prefix}/blog`, label: t('nav.blog') },
    { href: `${prefix}/contact`, label: t('nav.contact') },
  ]

  return (
    <footer className="mt-24 border-t border-[#e8e8ed] bg-[#f5f5f7]">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`${prefix}/`} className="block mb-2">
              <span className="text-base font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                {locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
              </span>
            </Link>
            <p className="text-[10px] text-[#0071e3] uppercase tracking-[0.05em] mb-4">
              {locale === 'fa' ? 'روان‌شناس بالینی' : 'Clinical Psychologist'}
            </p>
            <p className="text-sm text-[#707070] leading-relaxed max-w-xs">
              {locale === 'fa'
                ? 'روان‌شناس بالینی و درمان‌گر'
                : 'Clinical Psychologist & Psychotherapist'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#707070] mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[#707070] hover:text-[#1d1d1f] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#707070] mb-4">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:bahriyanmaryam@gmail.com"
                  className="flex items-center gap-2 text-sm text-[#707070] hover:text-[#1d1d1f] transition-colors"
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
                  className="flex items-center gap-2 text-sm text-[#707070] hover:text-[#1d1d1f] transition-colors"
                >
                  <Send size={14} />
                  @psychofreepen
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/dr.maryam.bahrian"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#707070] hover:text-[#1d1d1f] transition-colors"
                >
                  <Instagram size={14} />
                  @dr.maryam.bahrian
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#e8e8ed] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#707070] tracking-[0.03em] uppercase">
          <span>
            {locale === 'fa' ? `© ${year} دکتر مریم بهریان` : `© ${year} Dr. Maryam Bahrian`}
            {' — '}
            {t('footer.rights')}
          </span>
          <a
            href="https://tavakolistudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#707070] hover:text-[#0066cc] transition-colors normal-case tracking-normal"
            style={{ fontSize: '11px' }}
          >
            Powered by <span className="font-semibold tracking-[0.05em] uppercase">TAVAKOLISTUDIO</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
