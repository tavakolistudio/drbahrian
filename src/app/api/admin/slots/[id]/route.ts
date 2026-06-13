import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { UpdateSlotSchema } from '@/lib/validation'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = UpdateSlotSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'داده نامعتبر' }, { status: 400 })
  }

  const slot = await prisma.availabilitySlot.findUnique({ where: { id } })
  if (!slot) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })

  // Cannot change status of CONFIRMED or PENDING slots to AVAILABLE (must reject first)
  if (parsed.data.status === 'AVAILABLE' && slot.status === 'CONFIRMED') {
    return NextResponse.json({ error: 'وقت تأیید شده را نمی‌توان مستقیم آزاد کرد.' }, { status: 400 })
  }

  const updated = await prisma.availabilitySlot.update({
    where: { id },
    data: parsed.data,
  })

  await prisma.adminActionLog.create({
    data: {
      adminId: session.sub,
      actionType: parsed.data.status === 'LOCKED' ? 'LOCK_SLOT' : 'UNLOCK_SLOT',
      targetType: 'AvailabilitySlot',
      targetId: id,
      details: { previousStatus: slot.status, newStatus: parsed.data.status },
    },
  })

  return NextResponse.json({ slot: updated })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const { id } = await params
  const slot = await prisma.availabilitySlot.findUnique({
    where: { id },
    include: { request: true },
  })

  if (!slot) return NextResponse.json({ error: 'پیدا نشد' }, { status: 404 })
  if (slot.request && slot.status === 'CONFIRMED') {
    return NextResponse.json({ error: 'وقت تأیید شده با مراجع قابل حذف نیست.' }, { status: 400 })
  }

  await prisma.availabilitySlot.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
