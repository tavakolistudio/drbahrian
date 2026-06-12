'use client'

import { useEffect } from 'react'
import type { Locale } from '@/types'

export function LocaleEffects({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
  }, [locale])

  return null
}
