import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { AdminActionSchema } from '@/lib/validation'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { id } = await params

  const appointment = await prisma.appointmentRequest.findUnique({
    where: { id },
    include: {
      slot: true,
    },
  })

  if (!appointment) {
    return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  }

  return NextResponse.json({ appointment })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = AdminActionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'داده نامعتبر' }, { status: 400 })
  }

  const { action, adminNote } = parsed.data
  const now = new Date()

  const appointment = await prisma.appointmentRequest.findUnique({
    where: { id },
    include: { slot: true },
  })

  if (!appointment) {
    return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  }

  let newRequestStatus: 'CONFIRMED' | 'REJECTED' | 'CANCELLED'
  let newSlotStatus: 'CONFIRMED' | 'REJECTED' | 'AVAILABLE'
  let timeField: Record<string, Date> = {}

  switch (action) {
    case 'APPROVE':
      newRequestStatus = 'CONFIRMED'
      newSlotStatus = 'CONFIRMED'
      timeField = { confirmedAt: now }
      break
    case 'REJECT':
      newRequestStatus = 'REJECTED'
      newSlotStatus = 'AVAILABLE' // make it available again
      timeField = { rejectedAt: now }
      break
    case 'CANCEL':
      newRequestStatus = 'CANCELLED'
      newSlotStatus = 'AVAILABLE'
      timeField = { cancelledAt: now }
      break
  }

  await prisma.$transaction([
    prisma.appointmentRequest.update({
      where: { id },
      data: {
        status: newRequestStatus,
        adminNote: adminNote ?? appointment.adminNote,
        ...timeField,
      },
    }),
    prisma.availabilitySlot.update({
      where: { id: appointment.slotId },
      data: { status: newSlotStatus },
    }),
    prisma.adminActionLog.create({
      data: {
        adminId: session.sub,
        actionType: action,
        targetType: 'AppointmentRequest',
        targetId: id,
        details: { adminNote, previousStatus: appointment.status },
      },
    }),
  ])

  const updated = await prisma.appointmentRequest.findUnique({
    where: { id },
    include: { slot: true },
  })

  return NextResponse.json({ appointment: updated })
}
