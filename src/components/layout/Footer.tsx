import Link from 'next/link'
import Image from 'next/image'
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
    <footer className="bg-black border-t border-white/10">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href={`${prefix}/`} className="flex items-center gap-2 mb-2 group">
              <Image
                src="/logo.png"
                alt="دکتر مریم بهریان"
                width={48}
                height={48}
                className="object-contain"
              />
              <span className="text-base font-semibold text-white group-hover:text-white/80 transition-colors tracking-[-0.02em]">
                {locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
              </span>
            </Link>
            <p className="text-[10px] text-white/50 uppercase tracking-[0.05em] mb-4">
              {locale === 'fa' ? 'روان‌شناس بالینی' : 'Clinical Psychologist'}
            </p>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {locale === 'fa'
                ? 'روان‌شناس بالینی و درمان‌گر'
                : 'Clinical Psychologist & Psychotherapist'}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-white/40 mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-white/40 mb-4">
              {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:bahriyanmaryam@gmail.com"
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
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
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
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
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <Instagram size={14} />
                  @dr.maryam.bahrian
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/40 tracking-[0.03em] uppercase">
          <span>
            {locale === 'fa' ? `© ${year} دکتر مریم بهریان` : `© ${year} Dr. Maryam Bahrian`}
            {' — '}
            {t('footer.rights')}
          </span>
          <a
            href="https://tavakolistudio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-white transition-colors normal-case tracking-normal"
            style={{ fontSize: '11px' }}
          >
            Powered by <span className="font-semibold tracking-[0.05em] uppercase">TAVAKOLISTUDIO</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
