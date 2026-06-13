'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  pending: number
  confirmed: number
  total: number
  todayCount: number
}

function StatCard({ label, value, href, accent }: { label: string; value: number; href?: string; accent?: string }) {
  const content = (
    <div className={`bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-5 transition ${href ? 'hover:border-[#2C4A3E]/40 cursor-pointer' : ''}`}>
      <div className={`text-3xl font-bold ${accent ?? 'text-[#1a1a1a]'} mb-1`}>{value}</div>
      <div className="text-xs text-[#6b6b6b]">{label}</div>
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : content
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [pendingRes, confirmedRes, totalRes] = await Promise.all([
          fetch('/api/admin/appointments?status=PENDING&page=1&limit=1'),
          fetch('/api/admin/appointments?status=CONFIRMED&page=1&limit=1'),
          fetch('/api/admin/appointments?page=1&limit=1'),
        ])
        const [pendingData, confirmedData, totalData] = await Promise.all([
          pendingRes.json(),
          confirmedRes.json(),
          totalRes.json(),
        ])
        setStats({
          pending: pendingData.total ?? 0,
          confirmed: confirmedData.total ?? 0,
          total: totalData.total ?? 0,
          todayCount: 0,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">داشبورد</h1>
        <p className="text-sm text-[#6b6b6b] mt-1">خلاصه وضعیت نوبت‌های مشاوره</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-5 animate-pulse">
              <div className="h-8 w-12 bg-[#E8E5DF] rounded mb-2" />
              <div className="h-3 w-20 bg-[#E8E5DF] rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="در انتظار بررسی"
            value={stats?.pending ?? 0}
            href="/admin/appointments/pending"
            accent="text-amber-600"
          />
          <StatCard
            label="تأیید شده"
            value={stats?.confirmed ?? 0}
            accent="text-[#2C4A3E]"
          />
          <StatCard
            label="کل درخواست‌ها"
            value={stats?.total ?? 0}
            href="/admin/appointments"
          />
          <StatCard
            label="امروز (ایران)"
            value={stats?.todayCount ?? 0}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/appointments/pending"
          className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-6 hover:border-[#2C4A3E]/40 transition group"
        >
          <div className="text-2xl mb-3">◷</div>
          <h2 className="font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#2C4A3E] transition">بررسی درخواست‌های جدید</h2>
          <p className="text-sm text-[#6b6b6b]">تأیید یا رد درخواست‌هایی که منتظر پاسخ هستند</p>
        </Link>
        <Link
          href="/admin/availability"
          className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-6 hover:border-[#2C4A3E]/40 transition group"
        >
          <div className="text-2xl mb-3">◫</div>
          <h2 className="font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#2C4A3E] transition">مدیریت وقت‌های خالی</h2>
          <p className="text-sm text-[#6b6b6b]">اضافه کردن، قفل کردن یا حذف وقت‌های مشاوره</p>
        </Link>
        <Link
          href="/admin/calendar"
          className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-6 hover:border-[#2C4A3E]/40 transition group"
        >
          <div className="text-2xl mb-3">⊞</div>
          <h2 className="font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#2C4A3E] transition">نمای تقویم</h2>
          <p className="text-sm text-[#6b6b6b]">مشاهده نوبت‌ها بر اساس تاریخ شمسی</p>
        </Link>
        <Link
          href={`/api/admin/export`}
          target="_blank"
          className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-6 hover:border-[#2C4A3E]/40 transition group"
        >
          <div className="text-2xl mb-3">↓</div>
          <h2 className="font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#2C4A3E] transition">خروجی CSV</h2>
          <p className="text-sm text-[#6b6b6b]">دانلود لیست کامل درخواست‌ها</p>
        </Link>
      </div>
    </div>
  )
}
