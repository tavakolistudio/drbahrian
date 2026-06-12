import type { MetadataRoute } from 'next'
import { getAllPosts, getAllCategories, getAllTags } from '@/lib/posts'

const baseUrl = 'https://drmaryambahrian.ir'

export default function sitemap(): MetadataRoute.Sitemap {
  const faPosts = getAllPosts('fa')
  const enPosts = getAllPosts('en')
  const faCategories = getAllCategories('fa')
  const enCategories = getAllCategories('en')
  const faTags = getAllTags('fa')
  const enTags = getAllTags('en')

  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/about`, priority: 0.8 },
    { url: `${baseUrl}/blog`, priority: 0.9 },
    { url: `${baseUrl}/teaching`, priority: 0.7 },
    { url: `${baseUrl}/books`, priority: 0.7 },
    { url: `${baseUrl}/contact`, priority: 0.6 },
    { url: `${baseUrl}/en`, priority: 0.9 },
    { url: `${baseUrl}/en/about`, priority: 0.7 },
    { url: `${baseUrl}/en/blog`, priority: 0.8 },
    { url: `${baseUrl}/en/teaching`, priority: 0.6 },
    { url: `${baseUrl}/en/books`, priority: 0.6 },
    { url: `${baseUrl}/en/contact`, priority: 0.5 },
  ]

  const faBlogPosts = faPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    priority: 0.8,
  }))

  const enBlogPosts = enPosts.map((p) => ({
    url: `${baseUrl}/en/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    priority: 0.7,
  }))

  const faCategoryPages = faCategories.map((c) => ({
    url: `${baseUrl}/blog/category/${encodeURIComponent(c.slug)}`,
    priority: 0.6,
  }))

  const enCategoryPages = enCategories.map((c) => ({
    url: `${baseUrl}/en/blog/category/${encodeURIComponent(c.slug)}`,
    priority: 0.5,
  }))

  const faTagPages = faTags.map((t) => ({
    url: `${baseUrl}/blog/tag/${encodeURIComponent(t.slug)}`,
    priority: 0.5,
  }))

  const enTagPages = enTags.map((t) => ({
    url: `${baseUrl}/en/blog/tag/${encodeURIComponent(t.slug)}`,
    priority: 0.4,
  }))

  return [
    ...staticPages.map((p) => ({ ...p, changeFrequency: 'monthly' as const })),
    ...faBlogPosts.map((p) => ({ ...p, changeFrequency: 'weekly' as const })),
    ...enBlogPosts.map((p) => ({ ...p, changeFrequency: 'weekly' as const })),
    ...faCategoryPages.map((p) => ({ ...p, changeFrequency: 'weekly' as const })),
    ...enCategoryPages.map((p) => ({ ...p, changeFrequency: 'weekly' as const })),
    ...faTagPages.map((p) => ({ ...p, changeFrequency: 'monthly' as const })),
    ...enTagPages.map((p) => ({ ...p, changeFrequency: 'monthly' as const })),
  ]
}
