import { useTranslations } from 'next-intl'
import { PostCard } from './PostCard'
import type { PostMeta, Locale } from '@/types'

interface RelatedPostsProps {
  posts: PostMeta[]
  locale: Locale
}

export function RelatedPosts({ posts, locale }: RelatedPostsProps) {
  const t = useTranslations('blog')
  if (!posts.length) return null

  return (
    <section className="pt-12 border-t border-[var(--border)]">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-6">
        {t('relatedPosts')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} locale={locale} />
        ))}
      </div>
    </section>
  )
}
