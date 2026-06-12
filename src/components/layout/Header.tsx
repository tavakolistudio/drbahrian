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
        'text-sm transition-colors py-1 border-b border-transparent',
        active
          ? 'text-[var(--accent)] border-[var(--accent)]'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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

  const prefix = locale === 'en' ? '/en' : ''

  const links = [
    { href: `${prefix}/`, label: t('home') },
    { href: `${prefix}/about`, label: t('about') },
    { href: `${prefix}/blog`, label: t('blog') },
    { href: `${prefix}/teaching`, label: t('teaching') },
    { href: `${prefix}/books`, label: t('books') },
    { href: `${prefix}/contact`, label: t('contact') },
  ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-[var(--bg)]/95 backdrop-blur-sm border-b border-[var(--border)]'
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
            <span
              className={cn(
                'text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors',
                locale === 'fa' ? 'font-vazir' : 'font-inter'
              )}
            >
              {locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'}
            </span>
            <span
              className={cn(
                'text-[11px] text-[var(--text-muted)]',
                locale === 'fa' ? 'font-vazir' : 'font-inter'
              )}
            >
              {locale === 'fa' ? 'روان‌شناس بالینی' : 'Clinical Psychologist'}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="ناوبری اصلی">
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
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <nav className="site-container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'py-2.5 px-3 rounded-sm text-sm transition-colors',
                  (l.href === `${prefix}/`
                    ? pathname === `${prefix}/` || pathname === '/'
                    : pathname.startsWith(l.href))
                    ? 'text-[var(--accent)] bg-[var(--accent-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
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
