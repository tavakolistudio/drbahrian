import { prisma } from './prisma'
import type { Post, PostMeta, Locale } from '@/types'
import { Prisma } from '@prisma/client'

type DbRow = Prisma.PostGetPayload<Record<string, never>>

function toMeta(p: DbRow): PostMeta {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    author: p.author,
    publishedAt: p.publishedAt?.toISOString() ?? p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    category: p.category ?? '',
    tags: p.tags ?? [],
    metaTitle: p.metaTitle ?? undefined,
    metaDescription: p.metaDescription ?? undefined,
    draft: p.status === 'DRAFT',
    readingTimeMinutes: p.readingTimeMin,
  }
}

function toPost(p: DbRow): Post {
  return { ...toMeta(p), content: p.content }
}

export async function getDbPostBySlug(slug: string, locale: Locale): Promise<Post | null> {
  try {
    const p = await prisma.post.findUnique({ where: { slug_locale: { slug, locale } } })
    if (!p || p.status !== 'PUBLISHED') return null
    return toPost(p)
  } catch { return null }
}

export async function getAllDbPosts(locale: Locale): Promise<PostMeta[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { locale, status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    })
    return posts.map(toMeta)
  } catch { return [] }
}

export async function getAllDbCategories(locale: Locale): Promise<{ slug: string; count: number }[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { locale, status: 'PUBLISHED' },
      select: { category: true },
    })
    const counts: Record<string, number> = {}
    for (const p of posts) {
      if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1
    }
    return Object.entries(counts).map(([slug, count]) => ({ slug, count })).sort((a, b) => b.count - a.count)
  } catch { return [] }
}

export async function searchDbPosts(query: string, locale: Locale): Promise<PostMeta[]> {
  try {
    const posts = await prisma.post.findMany({
      where: {
        locale, status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
    })
    return posts.map(toMeta)
  } catch { return [] }
}

export async function getDbRelatedPosts(post: PostMeta, locale: Locale): Promise<PostMeta[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { locale, status: 'PUBLISHED', category: post.category || undefined, NOT: { slug: post.slug } },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
    return posts.map(toMeta)
  } catch { return [] }
}

// Admin-only: all posts (draft + published)
export async function adminGetAllPosts(locale?: string) {
  try {
    return await prisma.post.findMany({
      where: locale ? { locale } : undefined,
      orderBy: { createdAt: 'desc' },
    })
  } catch { return [] }
}

export async function adminGetPostById(id: string) {
  try {
    return await prisma.post.findUnique({ where: { id } })
  } catch { return null }
}
