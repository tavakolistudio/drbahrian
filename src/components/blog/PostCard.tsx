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
      <article className="py-4 border-b border-[#e8e8ed] last:border-0">
        <Link href={href} className="group">
          <h3 className="text-sm font-medium text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors mb-1 leading-snug">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[#707070]">
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
      className="group flex flex-col gap-3 p-6 rounded-[28px] border border-[#e8e8ed] bg-white hover:border-[#0071e3]/30 transition-all duration-200"
    >
      <Badge href={`${prefix}/blog/category/${post.category}`} variant="category">
        {post.category}
      </Badge>

      <Link href={href}>
        <h2
          className={`text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors leading-snug ${
            variant === 'featured' ? 'text-xl md:text-2xl' : 'text-base'
          }`}
          style={{
            fontWeight: isRTL ? 600 : 700,
            letterSpacing: isRTL ? '0' : '-0.02em',
          }}
        >
          {post.title}
        </h2>
      </Link>

      <p
        className="text-sm line-clamp-3 text-[#707070]"
        style={{
          lineHeight: isRTL ? '2' : '1.7',
          letterSpacing: isRTL ? '0.01em' : '-0.003em',
        }}
      >
        {post.excerpt}
      </p>

      <div className="flex items-center gap-3 text-xs text-[#707070] mt-auto pt-1">
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
