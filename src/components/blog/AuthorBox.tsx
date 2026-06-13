import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { Locale } from '@/types'

export function AuthorBox({ locale }: { locale: Locale }) {
  const t = useTranslations('blog')

  return (
    <div className="flex items-start gap-4 p-5 bg-[var(--surface)] border border-[var(--border)] rounded-sm">
      <div className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0 border border-[var(--border)]">
        <Image
          src="/doctor.jpg"
          alt={t('author')}
          width={56}
          height={56}
          className="w-full h-full object-cover object-top grayscale"
        />
      </div>
      <div>
        <p className="text-xs text-[var(--text-muted)] mb-0.5">{t('by')}</p>
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{t('author')}</h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('authorTitle')}</p>
      </div>
    </div>
  )
}
