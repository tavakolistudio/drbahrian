'use client'

import { useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  initialQuery?: string
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const t = useTranslations('blog')
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(initialQuery)

  const handleSearch = useCallback(
    (value: string) => {
      const url = value ? `${pathname}?q=${encodeURIComponent(value)}` : pathname
      router.push(url)
    },
    [pathname, router]
  )

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
        placeholder={t('search')}
        className="w-full ps-10 pe-10 py-2.5 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
      />
      {query && (
        <button
          onClick={() => { setQuery(''); handleSearch('') }}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="پاک کردن جست‌وجو"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
