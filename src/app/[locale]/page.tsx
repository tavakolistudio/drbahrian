import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Hero } from '@/components/home/Hero'
import { LatestPosts } from '@/components/home/LatestPosts'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { AboutTeaser } from '@/components/home/AboutTeaser'
import { Credentials } from '@/components/home/Credentials'
import { getLatestPosts } from '@/lib/posts'
import { getAllDbPosts } from '@/lib/posts-db'
import type { Locale, PostMeta } from '@/types'

export const revalidate = 60

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    openGraph: {
      title: t('defaultTitle'),
      description: t('defaultDescription'),
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const l = locale as Locale
  const filePosts = getLatestPosts(l, 6)
  const dbPosts = await getAllDbPosts(l)
  const dbSlugs = new Set(dbPosts.map(p => p.slug))
  const posts: PostMeta[] = [...dbPosts, ...filePosts.filter(p => !dbSlugs.has(p.slug))]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 6)

  return (
    <>
      <Hero locale={l} />
      <LatestPosts posts={posts} locale={l} />
      <CategoryGrid locale={l} />
      <AboutTeaser locale={l} />
      <Credentials locale={l} />
    </>
  )
}
