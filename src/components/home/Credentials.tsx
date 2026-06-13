import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { GraduationCap, BookOpen, Microscope, Heart } from 'lucide-react'

const icons = [GraduationCap, BookOpen, Microscope, Heart]
const iconColors = ['#8052ff', '#ffb829', '#15846e', '#8052ff']

export function Credentials({ locale }: { locale: Locale }) {
  const t = useTranslations('home.credentials')
  const items = t.raw('items') as string[]
  const isRTL = locale === 'fa'

  return (
    <section className="py-20 bg-[#F9F8F5]">
      <div className="site-container">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-6 h-px bg-[#2C4A3E]" />
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6b]">
            {t('title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.08]">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div key={i} className="flex flex-col gap-4 p-6 bg-[#F9F8F5]">
                <div className="w-9 h-9 flex items-center justify-center rounded-full border border-black/[0.12]">
                  <Icon size={18} strokeWidth={1.5} style={{ color: iconColors[i % iconColors.length] }} />
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: '#4a4a4a',
                    fontWeight: isRTL ? 400 : 300,
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
