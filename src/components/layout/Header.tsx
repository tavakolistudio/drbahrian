'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'
import { Menu, X } from 'lucide-react'

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'text-sm tracking-[0.01em] transition-colors py-1.5 px-3 rounded-[88px]',
        active
          ? 'text-[#1c5d5f] bg-[#e4f0f1]'
          : 'text-[#283338] hover:text-[#1c5d5f] hover:bg-[#e4f0f1]'
      )}
    >
      {label}
    </Link>
  )
}

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const prefix = `/${locale}`

  const links = [
    { href: `${prefix}/`, label: t('home') },
    { href: `${prefix}/about`, label: t('about') },
    { href: `${prefix}/blog`, label: t('blog') },
    { href: `${prefix}/teaching`, label: t('teaching') },
    { href: `${prefix}/books`, label: t('books') },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-[#f2f8f7]/95 backdrop-blur-md border-b border-[#e4f0f1]'
          : 'bg-transparent'
      )}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`${prefix}/`}
            className="flex flex-col leading-none group"
            aria-label="دکتر مریم بهریان - خانه"
          >
            <span className="text-base font-semibold text-[#283338] group-hover:text-[#1c5d5f] transition-colors">
              {locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
            </span>
            <span
              className="text-[10px] text-[#5a7074] tracking-[0.059em] uppercase"
              style={{ fontFamily: 'var(--font-ibm-plex-mono), ui-monospace, monospace' }}
            >
              {locale === 'fa' ? 'روان‌شناس بالینی' : 'Clinical Psychologist'}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="ناوبری اصلی">
            {links.map((l) => (
              <NavLink
                key={l.href}
                href={l.href}
                label={l.label}
                active={
                  l.href === `${prefix}/`
                    ? pathname === `${prefix}/` || pathname === '/'
                    : pathname.startsWith(l.href) && l.href !== `${prefix}/`
                }
              />
            ))}
            <Link
              href="/reserve"
              className={cn(
                'text-sm tracking-[0.01em] transition-colors py-1.5 px-3 rounded-[88px]',
                pathname.startsWith('/reserve')
                  ? 'text-[#16325a] bg-[#e4f0f1]'
                  : 'text-[#16325a]/80 hover:text-[#16325a] hover:bg-[#e4f0f1]'
              )}
            >
              {t('reserve')}
            </Link>
          </nav>

          {/* Right: language switcher + CTA */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href={`${prefix}/contact`}
              className="hidden md:inline-flex items-center px-4 py-2 rounded-[48px] bg-[#1c5d5f] text-white text-sm font-medium hover:bg-[#156152] transition-colors"
            >
              {t('contact')}
            </Link>
            <button
              className="md:hidden p-2 text-[#5a7074] hover:text-[#283338] transition-colors"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? t('menuClose') : t('menuOpen')}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-[#e4f0f1] bg-[#f2f8f7]/95 backdrop-blur-md">
          <nav className="site-container py-4 flex flex-col gap-1">
            {[...links, { href: '/reserve', label: t('reserve') }, { href: `${prefix}/contact`, label: t('contact') }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'py-2.5 px-4 rounded-[88px] text-sm tracking-[0.01em] transition-colors',
                  (l.href === `${prefix}/`
                    ? pathname === `${prefix}/` || pathname === '/'
                    : pathname.startsWith(l.href))
                    ? 'text-[#1c5d5f] bg-[#e4f0f1]'
                    : 'text-[#283338] hover:text-[#1c5d5f] hover:bg-[#e4f0f1]'
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
