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
      <article className="py-4 border-b border-[#e4f0f1] last:border-0">
        <Link href={href} className="group">
          <h3 className="text-sm font-medium text-[#283338] group-hover:text-[#1c5d5f] transition-colors mb-1 leading-snug">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[#5a7074]">
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
    <article className="group flex flex-col gap-3 p-6 bg-[#e4f0f1] hover:bg-[#cae1e2] transition-colors duration-200 rounded-[12px]">
      {/* Category */}
      <Badge href={`${prefix}/blog/category/${post.category}`} variant="category">
        {post.category}
      </Badge>

      {/* Title */}
      <Link href={href}>
        <h2
          className={`text-[#283338] group-hover:text-[#1c5d5f] transition-colors leading-snug ${
            variant === 'featured' ? 'text-xl md:text-2xl' : 'text-base'
          }`}
          style={{
            fontFamily: isRTL
              ? 'var(--font-vazir), Tahoma, sans-serif'
              : 'var(--font-source-serif), Georgia, serif',
            fontWeight: isRTL ? 500 : 400,
          }}
        >
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p
        className="text-sm leading-relaxed line-clamp-3"
        style={{
          color: '#333333',
          fontWeight: isRTL ? 400 : 400,
          lineHeight: isRTL ? '2' : '1.7',
        }}
      >
        {post.excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-[#5a7074] mt-auto pt-1">
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
