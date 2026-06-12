import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, locale: Locale): string {
  const date = new Date(dateStr)
  if (locale === 'fa') {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-؀-ۿ]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function extractToc(content: string) {
  const headingRegex = /^#{2,3}\s+(.+)$/gm
  const toc: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim()
    const level = match[0].startsWith('###') ? 3 : 2
    const id = slugify(text)
    toc.push({ id, text, level })
  }

  return toc
}

export function isRTL(locale: Locale): boolean {
  return locale === 'fa'
}
