import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { SettingsSchema } from '@/lib/validation'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  let settings = await prisma.settings.findFirst()
  if (!settings) {
    settings = await prisma.settings.create({
      data: {
        doctorTimezone: 'Asia/Tehran',
        defaultSlotDurationMinutes: 50,
        defaultBreakMinutes: 10,
        pendingExpirationHours: 24,
        contactPriority: 'WHATSAPP,TELEGRAM,BALE',
      },
    })
  }
  return NextResponse.json({ settings })
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'دسترسی ندارید' }, { status: 401 })

  const body = await req.json()
  const parsed = SettingsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'داده نامعتبر', issues: parsed.error.issues }, { status: 400 })
  }

  let settings = await prisma.settings.findFirst()
  if (!settings) {
    settings = await prisma.settings.create({ data: parsed.data })
  } else {
    settings = await prisma.settings.update({ where: { id: settings.id }, data: parsed.data })
  }

  await prisma.adminActionLog.create({
    data: {
      adminId: session.sub,
      actionType: 'UPDATE_SETTINGS',
      targetType: 'Settings',
      targetId: settings.id,
      details: parsed.data,
    },
  })

  return NextResponse.json({ settings })
}
