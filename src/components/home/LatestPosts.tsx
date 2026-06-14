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
  const prefix = `/${locale}`

  return (
    <section className="py-[80px] bg-white">
      <div className="site-container">
        <div className="flex items-center justify-between mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#707070]">
            {t('title')}
          </p>
          <Button href={`${prefix}/blog`} variant="ghost" size="sm">
            {t('viewAll')} →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
