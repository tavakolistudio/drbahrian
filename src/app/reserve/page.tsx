import type { Metadata } from 'next'
import { ReserveClient } from '@/components/reserve/ReserveClient'

export const metadata: Metadata = {
  title: 'رزرو نوبت | دکتر مریم بهریان',
  description: 'رزرو جلسه مشاوره آنلاین با دکتر مریم بهریان',
}

export default function ReservePage() {
  return <ReserveClient />
}
