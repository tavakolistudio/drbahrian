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
    <section className="py-[88px] bg-[#f2f8f7]">
      <div className="site-container">
        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <p
            className="flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), ui-monospace, monospace',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.059em',
              textTransform: 'uppercase',
              color: '#283338',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#1c5d5f',
                flexShrink: 0,
              }}
            />
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
