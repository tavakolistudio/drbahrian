'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import type { PostMeta, Locale } from '@/types'
import { Clock } from 'lucide-react'

interface PostCardProps {
  post: PostMeta
  locale: Locale
  variant?: 'default' | 'featured' | 'compact'
}

export function PostCard({ post, locale, variant = 'default' }: PostCardProps) {
  const prefix = `/${locale}`
  const href = `${prefix}/blog/${post.slug}`
  const isRTL = locale === 'fa'
  const readLabel = isRTL ? `${post.readingTimeMinutes} دقیقه` : `${post.readingTimeMinutes} min`

  if (variant === 'compact') {
    return (
      <article className="py-4 border-b border-white/[0.06] last:border-0">
        <Link href={href} className="group">
          <h3 className="text-sm font-medium text-[#bdbdbd] group-hover:text-white transition-colors mb-1 leading-snug">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[#9a9a9a]">
            <span>{formatDate(post.publishedAt, locale)}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {readLabel}
            </span>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article
      className="group flex flex-col gap-3 p-6 transition-colors duration-200 rounded-[24px]"
      style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(128,82,255,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
    >
      <Badge href={`${prefix}/blog/category/${post.category}`} variant="category">
        {post.category}
      </Badge>

      <Link href={href}>
        <h2
          className={`text-white group-hover:text-[#8052ff] transition-colors leading-snug ${
            variant === 'featured' ? 'text-xl md:text-2xl' : 'text-base'
          }`}
          style={{
            fontWeight: isRTL ? 500 : 200,
            letterSpacing: isRTL ? '0' : '-0.02em',
          }}
        >
          {post.title}
        </h2>
      </Link>

      <p
        className="text-sm line-clamp-3 text-[#9a9a9a]"
        style={{
          lineHeight: isRTL ? '2' : '1.7',
          letterSpacing: isRTL ? '0.01em' : '0.025em',
        }}
      >
        {post.excerpt}
      </p>

      <div className="flex items-center gap-3 text-xs text-[#9a9a9a] mt-auto pt-1">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {readLabel}
        </span>
      </div>
    </article>
  )
}
