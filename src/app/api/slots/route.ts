import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIranDayUtcRange, toIranDateKey } from '@/lib/timezone'

// GET /api/slots?mode=ONLINE&date=2024-01-15
// Returns available slots for a given Iran date (or all upcoming slots grouped by date)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const mode = searchParams.get('mode') as 'ONLINE' | 'IN_PERSON' | null
    const dateStr = searchParams.get('date') // "2024-01-15" in Iran tz

    const now = new Date()

    let where: Record<string, unknown> = {
      status: 'AVAILABLE',
      startTimeUtc: { gt: now },
    }

    // Filter by appointment mode
    if (mode) {
      where.appointmentMode = { in: [mode, 'BOTH'] }
    }

    // Filter by Iran date if provided
    if (dateStr) {
      const { start, end } = getIranDayUtcRange(dateStr)
      where.startTimeUtc = { gte: start, lte: end }
    } else {
      // Return next 60 days of available slots
      const sixtyDaysLater = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
      where.startTimeUtc = { gt: now, lt: sixtyDaysLater }
    }

    const slots = await prisma.availabilitySlot.findMany({
      where,
      orderBy: { startTimeUtc: 'asc' },
      select: {
        id: true,
        startTimeUtc: true,
        endTimeUtc: true,
        appointmentMode: true,
        doctorTimezone: true,
      },
    })

    // Group by Iran date for the calendar view
    const byDate: Record<string, typeof slots> = {}
    for (const slot of slots) {
      const key = toIranDateKey(slot.startTimeUtc)
      if (!byDate[key]) byDate[key] = []
      byDate[key].push(slot)
    }

    return NextResponse.json({ slots, byDate, availableDates: Object.keys(byDate) })
  } catch (err) {
    console.error('[api/slots]', err)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
