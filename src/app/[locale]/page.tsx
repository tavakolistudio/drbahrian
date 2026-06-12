import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Hero } from '@/components/home/Hero'
import { LatestPosts } from '@/components/home/LatestPosts'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { AboutTeaser } from '@/components/home/AboutTeaser'
import { Credentials } from '@/components/home/Credentials'
import { getLatestPosts } from '@/lib/posts'
import type { Locale } from '@/types'

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
  const posts = getLatestPosts(locale as Locale, 6)

  return (
    <>
      <Hero locale={locale as Locale} />
      <LatestPosts posts={posts} locale={locale as Locale} />
      <CategoryGrid locale={locale as Locale} />
      <AboutTeaser locale={locale as Locale} />
      <Credentials locale={locale as Locale} />
    </>
  )
}
