import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')
  const search = searchParams.get('search') || searchParams.get('q')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { whatsapp: { contains: search } },
      { country: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [appointments, total] = await prisma.$transaction([
    prisma.appointmentRequest.findMany({
      where,
      orderBy: { requestedAt: 'desc' },
      skip,
      take: limit,
      include: {
        slot: { select: { startTimeUtc: true, endTimeUtc: true, appointmentMode: true, status: true } },
      },
    }),
    prisma.appointmentRequest.count({ where }),
  ])

  return NextResponse.json({ appointments, total, page, limit })
}
