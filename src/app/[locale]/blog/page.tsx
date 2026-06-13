import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { PostCard } from '@/components/blog/PostCard'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { SearchBar } from '@/components/blog/SearchBar'
import { getAllPosts, getAllCategories, searchPosts } from '@/lib/posts'
import { getAllDbPosts, getAllDbCategories, searchDbPosts } from '@/lib/posts-db'
import type { Locale, PostMeta } from '@/types'

export const revalidate = 60

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return { title: t('title'), description: t('metaDescription') }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const { q } = await searchParams
  const t = await getTranslations({ locale })
  const l = locale as Locale
  const prefix = `/${locale}`

  // Merge DB + file posts (DB takes priority)
  const [dbPosts, dbCategories] = await Promise.all([
    q ? searchDbPosts(q, l) : getAllDbPosts(l),
    getAllDbCategories(l),
  ])
  const filePosts = q ? searchPosts(q, l) : getAllPosts(l)
  const fileCategories = getAllCategories(l)

  const dbSlugs = new Set(dbPosts.map(p => p.slug))
  const allPosts: PostMeta[] = [...dbPosts, ...filePosts.filter(p => !dbSlugs.has(p.slug))]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Merge categories
  const catMap = new Map<string, number>()
  for (const c of [...fileCategories, ...dbCategories]) catMap.set(c.slug, (catMap.get(c.slug) ?? 0) + c.count)
  const categories = Array.from(catMap.entries()).map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count)

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: `${prefix}/` },
    { label: t('blog.title') },
  ]

  return (
    <div className="site-container py-12">
      <Breadcrumb items={breadcrumbs} locale={locale} className="mb-8" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">{t('blog.title')}</h1>
        <div className="w-full sm:w-72">
          <SearchBar initialQuery={q} />
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={categories} locale={l} />
      </div>

      {q && (
        <p className="text-sm text-[var(--text-muted)] mb-6">
          {t('blog.searchResults', { query: q })} — {allPosts.length}{' '}
          {locale === 'fa' ? 'مقاله' : 'article(s)'}
        </p>
      )}

      {allPosts.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">{t('blog.noResults')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <PostCard key={post.slug} post={post} locale={l} />
          ))}
        </div>
      )}
    </div>
  )
}
