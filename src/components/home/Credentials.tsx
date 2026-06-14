import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { GraduationCap, BookOpen, Microscope, Heart } from 'lucide-react'

const icons = [GraduationCap, BookOpen, Microscope, Heart]
const iconColors = ['#0071e3', '#1d1d1f', '#0071e3', '#1d1d1f']

export function Credentials({ locale }: { locale: Locale }) {
  const t = useTranslations('home.credentials')
  const items = t.raw('items') as string[]
  const isRTL = locale === 'fa'

  return (
    <section className="py-[80px] bg-[#f5f5f7]">
      <div className="site-container">
        <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#707070] mb-10">
          {t('title')}
        </p>
        <div
          className="rounded-[28px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#e8e8ed] border border-[#e8e8ed] bg-white"
        >
          {items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div key={i} className="flex flex-col gap-4 p-6">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f7] border border-[#e8e8ed]">
                  <Icon size={16} strokeWidth={1.5} style={{ color: iconColors[i % iconColors.length] }} />
                </div>
                <p
                  className="text-sm text-[#707070]"
                  style={{
                    letterSpacing: isRTL ? '0.01em' : '-0.003em',
                    lineHeight: isRTL ? '2' : '1.7',
                  }}
                >
                  {item}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
