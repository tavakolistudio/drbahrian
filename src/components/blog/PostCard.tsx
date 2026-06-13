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
      <article className="py-4 border-b border-white/[0.06] last:border-0">
        <Link href={href} className="group">
          <h3 className="text-sm font-medium text-white group-hover:text-[#8052ff] transition-colors mb-1 leading-snug tracking-[0.021em]">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-[#9a9a9a] tracking-[0.021em]">
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
    <article className="group flex flex-col gap-3 p-5 border border-white/[0.08] hover:border-[#8052ff]/40 transition-all duration-200">
      {/* Category */}
      <Badge href={`${prefix}/blog/category/${post.category}`} variant="category">
        {post.category}
      </Badge>

      {/* Title */}
      <Link href={href}>
        <h2
          className={`font-light text-white group-hover:text-[#8052ff] transition-colors leading-snug tracking-[0.021em] ${
            variant === 'featured' ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h2>
      </Link>

      {/* Excerpt */}
      <p className="text-sm text-[#bdbdbd] leading-relaxed line-clamp-3 tracking-[0.025em]">
        {post.excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-[#9a9a9a] mt-auto pt-1 tracking-[0.021em]">
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
