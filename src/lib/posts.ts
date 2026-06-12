import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Post, PostMeta, Locale } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function getPostsDir(locale: Locale): string {
  return path.join(CONTENT_DIR, locale, 'posts')
}

export function getAllPostSlugs(locale: Locale): string[] {
  const dir = getPostsDir(locale)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string, locale: Locale): Post | null {
  const dir = getPostsDir(locale)
  const filePath = path.join(dir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const stats = readingTime(content)

  return {
    ...(data as Omit<Post, 'content' | 'readingTimeMinutes'>),
    slug,
    content,
    readingTimeMinutes: Math.ceil(stats.minutes),
  }
}

export function getAllPosts(locale: Locale): PostMeta[] {
  const slugs = getAllPostSlugs(locale)
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug, locale)
      if (!post || post.draft) return null
      const { content: _, ...meta } = post
      return meta as PostMeta
    })
    .filter(Boolean) as PostMeta[]

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getFeaturedPosts(locale: Locale, limit = 3): PostMeta[] {
  return getAllPosts(locale)
    .filter((p) => p.featured)
    .slice(0, limit)
}

export function getLatestPosts(locale: Locale, limit = 6): PostMeta[] {
  return getAllPosts(locale).slice(0, limit)
}

export function getPostsByCategory(category: string, locale: Locale): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.category === category)
}

export function getPostsByTag(tag: string, locale: Locale): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.tags?.includes(tag))
}

export function getAllCategories(locale: Locale): { slug: string; count: number }[] {
  const posts = getAllPosts(locale)
  const map = new Map<string, number>()
  posts.forEach((p) => {
    const cat = p.category
    map.set(cat, (map.get(cat) ?? 0) + 1)
  })
  return Array.from(map.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
}

export function getAllTags(locale: Locale): { slug: string; count: number }[] {
  const posts = getAllPosts(locale)
  const map = new Map<string, number>()
  posts.forEach((p) => {
    p.tags?.forEach((tag) => map.set(tag, (map.get(tag) ?? 0) + 1))
  })
  return Array.from(map.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
}

export function getRelatedPosts(post: PostMeta, locale: Locale, limit = 3): PostMeta[] {
  return getAllPosts(locale)
    .filter(
      (p) =>
        p.slug !== post.slug &&
        (p.category === post.category || p.tags?.some((t) => post.tags?.includes(t)))
    )
    .slice(0, limit)
}

export function searchPosts(query: string, locale: Locale): PostMeta[] {
  const q = query.toLowerCase()
  return getAllPosts(locale).filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
  )
}
