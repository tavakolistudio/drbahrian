import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings — public, read-only subset of Settings safe to expose to visitors
export async function GET() {
  const settings = await prisma.settings.findFirst({ select: { reservationEnabled: true } })
  return NextResponse.json({ reservationEnabled: settings?.reservationEnabled ?? true })
}
