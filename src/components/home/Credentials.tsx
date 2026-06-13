import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { GraduationCap, BookOpen, Microscope, Heart } from 'lucide-react'

const icons = [GraduationCap, BookOpen, Microscope, Heart]
const iconColors = ['#8052ff', '#ffb829', '#15846e', '#8052ff']

export function Credentials({ locale }: { locale: Locale }) {
  const t = useTranslations('home.credentials')
  const items = t.raw('items') as string[]

  return (
    <section className="py-16 border-t border-white/[0.06]">
      <div className="site-container">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] mb-8 text-center">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div
                key={i}
                className="flex flex-col gap-4 p-6 border border-white/[0.08] hover:border-white/[0.16] transition-colors"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <Icon size={20} strokeWidth={1.5} style={{ color: iconColors[i % iconColors.length] }} />
                </div>
                <p className="text-sm text-[#bdbdbd] leading-relaxed tracking-[0.025em]">{item}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
