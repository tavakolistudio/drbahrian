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
    <section className="py-[60px] bg-black">
      <div className="site-container">
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[#9a9a9a] mb-10">
          {t('title')}
        </p>
        <div
          className="rounded-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x"
          style={{
            border: '1px solid rgba(255,255,255,0.06)',
            divideColor: 'rgba(255,255,255,0.06)',
          }}
        >
          {items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div
                key={i}
                className="flex flex-col gap-4 p-6"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon size={16} strokeWidth={1.5} style={{ color: iconColors[i % iconColors.length] }} />
                </div>
                <p
                  className="text-sm text-[#9a9a9a]"
                  style={{
                    letterSpacing: isRTL ? '0.01em' : '0.025em',
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
