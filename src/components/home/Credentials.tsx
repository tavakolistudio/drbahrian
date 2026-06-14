import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { GraduationCap, BookOpen, Microscope, Heart } from 'lucide-react'

const icons = [GraduationCap, BookOpen, Microscope, Heart]
const iconColors = ['#1c5d5f', '#16325a', '#65b8a2', '#1c5d5f']

export function Credentials({ locale }: { locale: Locale }) {
  const t = useTranslations('home.credentials')
  const items = t.raw('items') as string[]
  const isRTL = locale === 'fa'

  return (
    <section className="py-[88px] bg-[#f2f8f7]">
      <div className="site-container">
        <p
          className="flex items-center gap-2 mb-12"
          style={{
            fontFamily: 'var(--font-ibm-plex-mono), ui-monospace, monospace',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.059em',
            textTransform: 'uppercase',
            color: '#283338',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#65b8a2',
              flexShrink: 0,
            }}
          />
          {t('title')}
        </p>

        {/* Stat-banner style strip */}
        <div className="border border-[#e4f0f1] rounded-[12px] divide-y divide-[#e4f0f1] md:divide-y-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:divide-x md:divide-[#e4f0f1]">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <div key={i} className="flex flex-col gap-4 p-6 bg-[#f2f8f7]">
                <div
                  className="w-9 h-9 flex items-center justify-center rounded-full"
                  style={{ background: 'rgba(28,93,95,0.08)' }}
                >
                  <Icon size={18} strokeWidth={1.5} style={{ color: iconColors[i % iconColors.length] }} />
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: '#333333',
                    fontWeight: isRTL ? 400 : 400,
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
