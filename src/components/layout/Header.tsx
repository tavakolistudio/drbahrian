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
        'text-sm tracking-[0.021em] transition-colors py-1',
        active ? 'text-white' : 'text-[#9a9a9a] hover:text-white'
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
          ? 'bg-black/90 backdrop-blur-md border-b border-white/[0.06]'
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
            <span className="text-base font-semibold text-white group-hover:text-[#8052ff] transition-colors">
              {locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
            </span>
            <span className="text-[11px] text-[#9a9a9a] tracking-[0.021em]">
              {locale === 'fa' ? 'روان‌شناس بالینی' : 'Clinical Psychologist'}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="ناوبری اصلی">
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
                'text-sm tracking-[0.021em] transition-colors py-1',
                pathname.startsWith('/reserve')
                  ? 'text-[#8052ff]'
                  : 'text-[#8052ff]/70 hover:text-[#8052ff]'
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
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full bg-[#8052ff] text-white text-xs font-semibold uppercase tracking-[0.05em] hover:bg-[#6b3fe0] transition-colors"
            >
              {t('contact')}
            </Link>
            <button
              className="md:hidden p-2 text-[#9a9a9a] hover:text-white transition-colors"
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
        <div className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-md">
          <nav className="site-container py-4 flex flex-col gap-1">
            {[...links, { href: '/reserve', label: t('reserve') }, { href: `${prefix}/contact`, label: t('contact') }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'py-2.5 px-4 rounded-full text-sm tracking-[0.021em] transition-colors',
                  (l.href === `${prefix}/`
                    ? pathname === `${prefix}/` || pathname === '/'
                    : pathname.startsWith(l.href))
                    ? 'text-white bg-[#8052ff]/10'
                    : 'text-[#9a9a9a] hover:text-white hover:bg-white/5'
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
