import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ReservationSchema } from '@/lib/validation'
import { computeExpiry } from '@/lib/timezone'

// Simple rate limiting: track IPs in memory (resets on cold start — good enough for MVP)
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '0.0.0.0'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً ۱۰ دقیقه صبر کنید.' },
        { status: 429 }
      )
    }

    const settings = await prisma.settings.findFirst({ select: { reservationEnabled: true } })
    if (settings?.reservationEnabled === false) {
      return NextResponse.json(
        { error: 'رزرو نوبت موقتاً غیرفعال است.' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const parsed = ReservationSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'اطلاعات وارد شده ناقص یا نادرست است', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Atomic slot claim: use a transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Lock the slot for update
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: data.slotId },
      })

      if (!slot) {
        throw new Error('SLOT_NOT_FOUND')
      }

      if (slot.status !== 'AVAILABLE') {
        throw new Error('SLOT_UNAVAILABLE')
      }

      if (slot.startTimeUtc < new Date()) {
        throw new Error('SLOT_PAST')
      }

      // Check if mode is compatible
      if (
        slot.appointmentMode !== 'BOTH' &&
        slot.appointmentMode !== data.appointmentMode
      ) {
        throw new Error('MODE_MISMATCH')
      }

      // Fetch settings for expiry
      const settings = await tx.settings.findFirst()
      const expiryHours = settings?.pendingExpirationHours ?? 24
      const expiresAt = computeExpiry(expiryHours)

      // Update slot to PENDING
      await tx.availabilitySlot.update({
        where: { id: data.slotId },
        data: { status: 'PENDING', updatedAt: new Date() },
      })

      // Create appointment request
      const request = await tx.appointmentRequest.create({
        data: {
          slotId: data.slotId,
          fullName: data.fullName.trim(),
          country: data.country,
          city: data.city.trim(),
          timezone: data.timezone,
          whatsapp: data.whatsapp.trim(),
          telegram: data.telegram?.trim() || null,
          bale: data.bale?.trim() || null,
          preferredContactMethod: data.preferredContactMethod,
          appointmentMode: data.appointmentMode,
          clientType: data.clientType,
          topic: data.topic,
          note: data.note?.trim() || null,
          status: 'PENDING',
          expiresAt,
        },
      })

      return request
    })

    return NextResponse.json({ ok: true, requestId: result.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'UNKNOWN'

    if (message === 'SLOT_NOT_FOUND') {
      return NextResponse.json({ error: 'این وقت پیدا نشد.' }, { status: 404 })
    }
    if (message === 'SLOT_UNAVAILABLE') {
      return NextResponse.json(
        { error: 'این وقت دیگر در دسترس نیست. لطفاً وقت دیگری انتخاب کنید.' },
        { status: 409 }
      )
    }
    if (message === 'SLOT_PAST') {
      return NextResponse.json(
        { error: 'این وقت گذشته است.' },
        { status: 400 }
      )
    }
    if (message === 'MODE_MISMATCH') {
      return NextResponse.json(
        { error: 'نوع جلسه با وقت انتخابی مطابقت ندارد.' },
        { status: 400 }
      )
    }

    console.error('[api/reserve]', err)
    return NextResponse.json({ error: 'خطای سرور. لطفاً دوباره تلاش کنید.' }, { status: 500 })
  }
}
