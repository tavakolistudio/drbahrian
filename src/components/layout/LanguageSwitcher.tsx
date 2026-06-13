'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale() {
    const rawPath = pathname.replace(/^\/(fa|en)/, '') || '/'
    const newPath = locale === 'fa' ? `/en${rawPath}` : rawPath
    router.push(newPath)
  }

  return (
    <button
      onClick={switchLocale}
      className={cn(
        'text-sm font-medium px-3 py-1.5 rounded-sm border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors',
        locale === 'en' ? 'font-vazir' : 'font-inter tracking-wide',
        className
      )}
      aria-label={locale === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
    >
      {locale === 'fa' ? 'EN' : 'فا'}
    </button>
  )
}
