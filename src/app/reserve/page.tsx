import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ReserveClient } from '@/components/reserve/ReserveClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'رزرو نوبت | دکتر مریم بهریان',
  description: 'رزرو جلسه مشاوره آنلاین با دکتر مریم بهریان',
}

export default async function ReservePage() {
  const settings = await prisma.settings.findFirst({ select: { reservationEnabled: true } })
  if (settings?.reservationEnabled === false) {
    redirect('/reserve/closed')
  }
  return <ReserveClient />
}
