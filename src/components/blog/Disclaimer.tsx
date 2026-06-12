import { useTranslations } from 'next-intl'
import { Info } from 'lucide-react'

export function Disclaimer() {
  const t = useTranslations('blog')

  return (
    <div className="flex gap-3 p-4 border border-[var(--border)] bg-[var(--surface)] rounded-sm text-sm text-[var(--text-muted)]">
      <Info size={16} className="flex-shrink-0 mt-0.5 text-[var(--accent)]" />
      <p className="leading-relaxed">{t('disclaimer')}</p>
    </div>
  )
}
