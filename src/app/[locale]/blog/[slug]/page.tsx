import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/posts'
import { extractToc, formatDate } from '@/lib/utils'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { AuthorBox } from '@/components/blog/AuthorBox'
import { Disclaimer } from '@/components/blog/Disclaimer'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import type { Locale } from '@/types'
import { Clock, Calendar } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params
  return getAllPostSlugs(locale as Locale).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale as Locale)
  if (!post) return {}

  const baseUrl = 'https://drmaryambahrian.ir'
  const url = locale === 'en' ? `${baseUrl}/en/blog/${slug}` : `${baseUrl}/blog/${slug}`

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    authors: [{ name: post.author }],
    alternates: { canonical: url },
    openGraph: {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug, locale as Locale)
  if (!post) notFound()
  if (post.draft) notFound()

  const t = await getTranslations({ locale })
  const l = locale as Locale
  const prefix = `/${locale}`
  const toc = extractToc(post.content)

  const { content: _c, ...postMeta } = post
  const relatedPosts = getRelatedPosts(postMeta, l)

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: `${prefix}/` },
    { label: t('blog.title'), href: `${prefix}/blog` },
    { label: post.title },
  ]

  const baseUrl = 'https://drmaryambahrian.ir'
  const postUrl = locale === 'en' ? `${baseUrl}/en/blog/${slug}` : `${baseUrl}/blog/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.author, url: baseUrl },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url: postUrl,
    inLanguage: locale === 'fa' ? 'fa-IR' : 'en-US',
    keywords: post.tags?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="site-container py-12">
        <Breadcrumb items={breadcrumbs} locale={locale} className="mb-8" />

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Header */}
            <header className="mb-10">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge href={`${prefix}/blog/category/${post.category}`} variant="category">
                  {post.category}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] leading-snug mb-5">
                {post.title}
              </h1>

              <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] pb-6 border-b border-[var(--border)]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, l)}</time>
                </span>
                {post.updatedAt && (
                  <span className="flex items-center gap-1.5">
                    <span className="text-xs">{t('blog.updatedAt')}:</span>
                    <time dateTime={post.updatedAt}>{formatDate(post.updatedAt, l)}</time>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {locale === 'fa'
                    ? `${post.readingTimeMinutes} دقیقه مطالعه`
                    : `${post.readingTimeMinutes} min read`}
                </span>
              </div>
            </header>

            {/* Content */}
            <div className={`prose-article ${locale === 'fa' ? 'prose-rtl' : ''}`}>
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                    ],
                  },
                }}
              />
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)] me-1">{t('blog.tags')}:</span>
                {post.tags.map((tag) => (
                  <Badge key={tag} href={`${prefix}/blog/tag/${tag}`} variant="tag">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-6">
              <ShareButtons title={post.title} url={postUrl} />
            </div>

            {/* Author */}
            <div className="mt-8">
              <AuthorBox locale={l} />
            </div>

            {/* Disclaimer */}
            <div className="mt-6">
              <Disclaimer />
            </div>

            {/* Related */}
            <div className="mt-10">
              <RelatedPosts posts={relatedPosts} locale={l} />
            </div>
          </article>

          {/* Sidebar TOC */}
          {toc.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <TableOfContents items={toc} label={t('blog.toc')} />
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
