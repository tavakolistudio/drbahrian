import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { formatIranTime } from '@/lib/timezone'

export async function GET(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status')

  const appointments = await prisma.appointmentRequest.findMany({
    where: status ? { status: status as 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED' } : {},
    orderBy: { requestedAt: 'desc' },
    include: { slot: { select: { startTimeUtc: true, endTimeUtc: true } } },
  })

  const rows = [
    ['نام', 'کشور', 'شهر', 'واتساپ', 'تلگرام', 'روش ارتباطی', 'نوع جلسه', 'نوع مراجع', 'موضوع', 'وضعیت', 'زمان جلسه (ایران)', 'تاریخ ثبت'],
    ...appointments.map((a) => [
      a.fullName,
      a.country,
      a.city,
      a.whatsapp,
      a.telegram ?? '',
      a.preferredContactMethod,
      a.appointmentMode,
      a.clientType,
      a.topic,
      a.status,
      a.slot ? formatIranTime(a.slot.startTimeUtc) : '',
      a.requestedAt.toISOString(),
    ]),
  ]

  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const bom = '﻿' // UTF-8 BOM for Excel compatibility

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="appointments-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
