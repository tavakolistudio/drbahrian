'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PostMeta, Locale } from '@/types'

interface LatestPostsProps {
  posts: PostMeta[]
  locale: Locale
}

export function LatestPosts({ posts, locale }: LatestPostsProps) {
  const t = useTranslations('home.latestPosts')
  const prefix = `/${locale}`
  const isRTL = locale === 'fa'
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  if (posts.length === 0) return null

  return (
    <section ref={ref} className="bg-black py-20 md:py-28 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-between mb-10"
        >
          <h2
            className="text-white text-2xl md:text-3xl tracking-tight"
            style={{
              fontFamily: isRTL ? undefined : 'var(--font-heading), serif',
              fontStyle: isRTL ? 'normal' : 'italic',
              fontWeight: isRTL ? 700 : 400,
            }}
          >
            {t('title')}
          </h2>
          <Link href={`${prefix}/blog`} className="text-white/60 hover:text-white text-sm transition-colors whitespace-nowrap">
            {t('viewAll')} {isRTL ? '←' : '→'}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Link
                href={`${prefix}/blog/${post.slug}`}
                className="liquid-glass rounded-2xl p-6 flex flex-col gap-3 h-full"
              >
                <span className="text-white/50 text-[11px] uppercase tracking-widest">{post.category}</span>
                <h3 className="text-white text-base font-medium leading-snug" style={{ lineHeight: isRTL ? 1.8 : 1.4 }}>
                  {post.title}
                </h3>
                <p className="text-white/50 text-sm line-clamp-3" style={{ lineHeight: isRTL ? 1.9 : 1.6 }}>
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-white/40 mt-auto pt-2">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {isRTL ? `${post.readingTimeMinutes} دقیقه` : `${post.readingTimeMinutes} min`}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
