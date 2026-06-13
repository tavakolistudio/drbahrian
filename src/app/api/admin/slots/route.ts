import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { CreateSlotSchema } from '@/lib/validation'
import { generateSlots } from '@/lib/timezone'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Record<string, unknown> = {}
  if (from) where.startTimeUtc = { gte: new Date(from) }
  if (to) where.startTimeUtc = { ...(where.startTimeUtc as Record<string,unknown> ?? {}), lte: new Date(to) }

  const slots = await prisma.availabilitySlot.findMany({
    where,
    orderBy: { startTimeUtc: 'asc' },
    include: { request: { select: { id: true, fullName: true, status: true } } },
  })

  return NextResponse.json({ slots })
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const body = await req.json()
  const parsed = CreateSlotSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'داده نامعتبر', issues: parsed.error.issues }, { status: 400 })
  }

  const { iranDate, startHour, endHour, durationMin, breakMin, appointmentMode } = parsed.data

  if (endHour <= startHour) {
    return NextResponse.json({ error: 'ساعت پایان باید بعد از ساعت شروع باشد' }, { status: 400 })
  }

  const slotsToCreate = generateSlots(iranDate, startHour, endHour, durationMin, breakMin)

  if (slotsToCreate.length === 0) {
    return NextResponse.json({ error: 'هیچ وقتی در این بازه تولید نشد' }, { status: 400 })
  }

  // Skip slots that already exist (same startTime)
  const existing = await prisma.availabilitySlot.findMany({
    where: {
      startTimeUtc: { in: slotsToCreate.map((s) => s.startUtc) },
    },
    select: { startTimeUtc: true },
  })
  const existingTimes = new Set(existing.map((e) => e.startTimeUtc.toISOString()))

  const newSlots = slotsToCreate.filter(
    (s) => !existingTimes.has(s.startUtc.toISOString())
  )

  const created = await prisma.availabilitySlot.createMany({
    data: newSlots.map((s) => ({
      startTimeUtc: s.startUtc,
      endTimeUtc: s.endUtc,
      doctorTimezone: 'Asia/Tehran',
      appointmentMode,
      status: 'AVAILABLE',
      createdByAdminId: session.sub,
    })),
  })

  await prisma.adminActionLog.create({
    data: {
      adminId: session.sub,
      actionType: 'CREATE_SLOT',
      targetType: 'AvailabilitySlot',
      targetId: 'bulk',
      details: { iranDate, startHour, endHour, durationMin, count: created.count },
    },
  })

  return NextResponse.json({ created: created.count, skipped: slotsToCreate.length - created.count })
}
