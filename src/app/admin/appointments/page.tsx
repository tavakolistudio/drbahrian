'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

type Status = 'ALL' | 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'EXPIRED'

interface Appointment {
  id: string
  fullName: string
  country: string
  whatsapp: string
  status: string
  topic: string
  appointmentMode: string
  requestedAt: string
  slot?: { startTimeUtc: string }
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'در انتظار',
  CONFIRMED: 'تأیید شده',
  REJECTED: 'رد شده',
  CANCELLED: 'لغو شده',
  EXPIRED: 'منقضی شده',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  EXPIRED: 'bg-gray-100 text-gray-500',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<Status>('ALL')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 20

  const load = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status !== 'ALL') params.set('status', status)
    if (search) params.set('search', search)
    const res = await fetch(`/api/admin/appointments?${params}`)
    const data = await res.json()
    setAppointments(data.appointments ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [page, status, search])

  useEffect(() => { load() }, [load])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    load()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap gap-3 items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">همه نوبت‌ها</h1>
          <p className="text-sm text-[#6b6b6b] mt-0.5">{total} درخواست</p>
        </div>
        <a
          href="/api/admin/export"
          className="text-xs px-4 py-2 border border-[#E8E5DF] rounded-lg text-[#4a4a4a] hover:bg-[#F0EEE9] transition"
        >
          دانلود CSV
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['ALL', 'PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'EXPIRED'] as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1) }}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
              status === s
                ? 'bg-[#2C4A3E] text-white'
                : 'bg-[#F9F8F5] border border-[#E8E5DF] text-[#4a4a4a] hover:bg-[#F0EEE9]'
            }`}
          >
            {s === 'ALL' ? 'همه' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearchSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو: نام، واتساپ، کشور..."
          className="flex-1 px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#2C4A3E] text-white text-sm rounded-lg hover:bg-[#1e3429] transition"
        >
          جستجو
        </button>
      </form>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] animate-pulse" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 text-[#6b6b6b] text-sm">نتیجه‌ای یافت نشد</div>
      ) : (
        <div className="space-y-2">
          {appointments.map((a) => (
            <Link
              key={a.id}
              href={`/admin/appointments/${a.id}`}
              className="flex items-center gap-4 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl px-5 py-4 hover:border-[#2C4A3E]/40 transition group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm text-[#1a1a1a] truncate">{a.fullName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[a.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[a.status] ?? a.status}
                  </span>
                </div>
                <div className="text-xs text-[#6b6b6b]">
                  {a.country} · {a.topic} · {a.appointmentMode === 'ONLINE' ? 'آنلاین' : 'حضوری'}
                </div>
              </div>
              <div className="text-xs text-[#9a9a9a] shrink-0">
                {a.slot
                  ? new Date(a.slot.startTimeUtc).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran' })
                  : new Date(a.requestedAt).toLocaleDateString('fa-IR')}
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm border border-[#E8E5DF] rounded-lg disabled:opacity-40 hover:bg-[#F0EEE9] transition"
          >
            قبلی
          </button>
          <span className="px-4 py-2 text-sm text-[#4a4a4a]">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm border border-[#E8E5DF] rounded-lg disabled:opacity-40 hover:bg-[#F0EEE9] transition"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  )
}
