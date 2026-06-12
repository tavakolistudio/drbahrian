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
  const prefix = locale === 'en' ? '/en' : ''
  const href = `${prefix}/blog/${post.slug}`
  const readLabel = locale === 'fa' ? `${post.readingTimeMinutes} دقیقه` : `${post.readingTimeMinutes} min`

  if (variant === 'compact') {
    return (
      <article className="py-4 border-b border-[var(--border)] last:border-0">
        <Link href={href} className="group">
          <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1 leading-snug">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
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
    <article className="group flex flex-col gap-3">
      {/* Category */}
      <Badge
        href={`${prefix}/blog/category/${post.category}`}
        variant="category"
      >
        {post.category}
      </Badge>

      {/* Title */}
      <Link href={href}>
        <h2
          className={`text-lg font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors leading-snug ${variant === 'featured' ? 'text-xl md:text-2xl' : ''}`}
        >
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-auto pt-1">
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
