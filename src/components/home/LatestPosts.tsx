import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { PostCard } from '@/components/blog/PostCard'
import type { PostMeta, Locale } from '@/types'

interface LatestPostsProps {
  posts: PostMeta[]
  locale: Locale
}

export function LatestPosts({ posts, locale }: LatestPostsProps) {
  const t = useTranslations('home.latestPosts')
  const prefix = locale === 'en' ? '/en' : ''

  return (
    <section className="py-16 border-t border-[var(--border)]">
      <div className="site-container">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {t('title')}
          </h2>
          <Button href={`${prefix}/blog`} variant="ghost" size="sm">
            {t('viewAll')} ←
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <PostCard
              key={post.slug}
              post={post}
              locale={locale}
              variant={i === 0 ? 'featured' : 'default'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
