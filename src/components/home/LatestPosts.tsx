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
    <section className="py-20 bg-[#F9F8F5]">
      <div className="site-container">
        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-6 h-px bg-[#2C4A3E]" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6b]">
              {t('title')}
            </h2>
          </div>
          <Button href={`${prefix}/blog`} variant="ghost" size="sm">
            {t('viewAll')} ←
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.06]">
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
