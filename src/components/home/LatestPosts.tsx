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
    <section className="py-20 bg-[#060606]">
      <div className="site-container">
        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-6 h-px bg-[#8052ff]" />
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9a9a9a]">
              {t('title')}
            </h2>
          </div>
          <Button href={`${prefix}/blog`} variant="ghost" size="sm">
            {t('viewAll')} ←
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.06]">
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
