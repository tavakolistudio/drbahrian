import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import readingTime from 'reading-time'
import { z } from 'zod'

const UpdateSchema = z.object({
  slug:            z.string().min(1).optional(),
  locale:          z.enum(['fa', 'en']).optional(),
  title:           z.string().min(1).optional(),
  excerpt:         z.string().optional().nullable(),
  content:         z.string().optional(),
  category:        z.string().optional().nullable(),
  tags:            z.array(z.string()).optional(),
  author:          z.string().optional(),
  status:          z.enum(['DRAFT', 'PUBLISHED']).optional(),
  publishedAt:     z.string().optional().nullable(),
  metaTitle:       z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
})

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  await requireAdminSession()
  const { id } = await params
  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: Params) {
  await requireAdminSession()
  const { id } = await params
  const body = await req.json()
  const data = UpdateSchema.parse(body)

  const update: Record<string, unknown> = { ...data }
  if (data.content) {
    const stats = readingTime(data.content)
    update.readingTimeMin = Math.max(1, Math.ceil(stats.minutes))
  }
  if (data.publishedAt !== undefined) {
    update.publishedAt = data.publishedAt ? new Date(data.publishedAt) : null
  }
  if (data.status === 'PUBLISHED') {
    const existing = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true } })
    if (!existing?.publishedAt) update.publishedAt = new Date()
  }

  const post = await prisma.post.update({ where: { id }, data: update })
  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  await requireAdminSession()
  const { id } = await params
  await prisma.post.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
