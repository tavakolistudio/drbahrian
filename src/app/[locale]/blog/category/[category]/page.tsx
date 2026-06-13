import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PostCard } from '@/components/blog/PostCard'
import { getPostsByCategory, getAllCategories } from '@/lib/posts'
import type { Locale } from '@/types'

type Props = { params: Promise<{ locale: string; category: string }> }

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params
  return getAllCategories(locale as Locale).map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params
  const decoded = decodeURIComponent(category)
  return {
    title: decoded,
    description: `${locale === 'fa' ? 'مقالات دسته‌بندی' : 'Articles in category'}: ${decoded}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params
  setRequestLocale(locale)
  const decoded = decodeURIComponent(category)
  const t = await getTranslations({ locale })
  const l = locale as Locale
  const prefix = `/${locale}`

  const posts = getPostsByCategory(decoded, l)

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: `${prefix}/` },
    { label: t('blog.title'), href: `${prefix}/blog` },
    { label: decoded },
  ]

  return (
    <div className="site-container py-12">
      <Breadcrumb items={breadcrumbs} locale={locale} className="mb-8" />
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)] mb-2">
            {t('blog.category')}
          </p>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{decoded}</h1>
        </div>
        <span className="text-sm text-[var(--text-muted)]">
          {posts.length} {locale === 'fa' ? 'مقاله' : 'articles'}
        </span>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">{t('blog.noResults')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={l} />
          ))}
        </div>
      )}
    </div>
  )
}
