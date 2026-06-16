'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/types'
import { GraduationCap, BookOpen, Microscope, Heart } from 'lucide-react'

const icons = [GraduationCap, BookOpen, Microscope, Heart]

export function Credentials({ locale }: { locale: Locale }) {
  const t = useTranslations('home.credentials')
  const items = t.raw('items') as string[]
  const isRTL = locale === 'fa'
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="bg-black py-20 md:py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-xs tracking-widest uppercase mb-10"
        >
          {t('title')}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="liquid-glass rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="liquid-glass w-11 h-11 flex items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <p
                  className="text-sm text-white/70"
                  style={{
                    letterSpacing: isRTL ? '0.01em' : '-0.003em',
                    lineHeight: isRTL ? '2' : '1.7',
                  }}
                >
                  {item}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
