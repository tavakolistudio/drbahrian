import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { GraduationCap, BookOpen, Microscope, Heart } from 'lucide-react'

const icons = [GraduationCap, BookOpen, Microscope, Heart]

export function Credentials({ locale }: { locale: Locale }) {
  const t = useTranslations('home.credentials')
  const items = t.raw('items') as string[]

  return (
    <section className="py-16 bg-[var(--surface)]">
      <div className="site-container">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-8 text-center">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div
                key={i}
                className="flex flex-col gap-3 p-5 bg-[var(--bg)] border border-[var(--border)] rounded-sm"
              >
                <div className="w-8 h-8 flex items-center justify-center text-[var(--accent)]">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
