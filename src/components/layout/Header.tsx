'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
        'text-sm transition-colors py-1 px-2',
        active ? 'text-[#1d1d1f] font-medium' : 'text-[#707070] hover:text-[#1d1d1f]'
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
          ? 'bg-white/90 backdrop-blur-md border-b border-[#e8e8ed]'
          : 'bg-transparent'
      )}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`${prefix}/`}
            className="flex items-center gap-2 group"
            aria-label="دکتر مریم بهریان - خانه"
          >
            <Image
              src="/logo.png"
              alt="دکتر مریم بهریان"
              width={40}
              height={40}
              className="object-contain"
            />
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors tracking-[-0.02em]">
                {locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
              </span>
              <span className="text-[10px] text-[#707070] tracking-[0.04em] uppercase">
                {locale === 'fa' ? 'روان‌شناس بالینی' : 'Clinical Psychologist'}
              </span>
            </div>
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
                'text-sm transition-colors py-1 px-2',
                pathname.startsWith('/reserve')
                  ? 'text-[#0071e3] font-medium'
                  : 'text-[#707070] hover:text-[#0071e3]'
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
              className="hidden md:inline-flex items-center px-4 py-2 text-white text-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#0071e3', borderRadius: '999px' }}
            >
              {t('contact')}
            </Link>
            <button
              className="md:hidden p-2 text-[#707070] hover:text-[#1d1d1f] transition-colors"
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
        <div className="md:hidden border-t border-[#e8e8ed] bg-white/95 backdrop-blur-md">
          <nav className="site-container py-4 flex flex-col gap-1">
            {[...links, { href: '/reserve', label: t('reserve') }, { href: `${prefix}/contact`, label: t('contact') }].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'py-2.5 px-4 rounded-[28px] text-sm transition-colors',
                  (l.href === `${prefix}/`
                    ? pathname === `${prefix}/` || pathname === '/'
                    : pathname.startsWith(l.href))
                    ? 'text-[#1d1d1f] font-medium bg-[#f5f5f7]'
                    : 'text-[#707070] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'
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
