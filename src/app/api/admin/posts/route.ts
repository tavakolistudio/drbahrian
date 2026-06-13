import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import readingTime from 'reading-time'
import { z } from 'zod'

const PostSchema = z.object({
  slug:            z.string().min(1).regex(/^[a-z0-9؀-ۿ_-]+$/i),
  locale:          z.enum(['fa', 'en']),
  title:           z.string().min(1),
  excerpt:         z.string().optional(),
  content:         z.string(),
  category:        z.string().optional(),
  tags:            z.array(z.string()).optional(),
  author:          z.string().optional(),
  status:          z.enum(['DRAFT', 'PUBLISHED']),
  publishedAt:     z.string().optional().nullable(),
  metaTitle:       z.string().optional(),
  metaDescription: z.string().optional(),
})

export async function GET() {
  await requireAdminSession()
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  await requireAdminSession()
  const body = await req.json()
  const data = PostSchema.parse(body)

  const stats = readingTime(data.content)
  const readingTimeMin = Math.max(1, Math.ceil(stats.minutes))
  const publishedAt = data.publishedAt ? new Date(data.publishedAt) : (data.status === 'PUBLISHED' ? new Date() : null)

  const post = await prisma.post.create({
    data: {
      slug:            data.slug,
      locale:          data.locale,
      title:           data.title,
      excerpt:         data.excerpt ?? null,
      content:         data.content,
      category:        data.category ?? null,
      tags:            data.tags ?? [],
      author:          data.author ?? (data.locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian'),
      status:          data.status,
      publishedAt,
      metaTitle:       data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
      readingTimeMin,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
