'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Appointment {
  id: string
  fullName: string
  country: string
  whatsapp: string
  topic: string
  appointmentMode: string
  requestedAt: string
  expiresAt?: string
  slot?: { startTimeUtc: string }
}

export default function PendingAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/appointments?status=PENDING&limit=50')
    const data = await res.json()
    setAppointments(data.appointments ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function doAction(id: string, action: 'APPROVE' | 'REJECT') {
    setActing(id + action)
    await fetch(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    setActing(null)
    await load()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">درخواست‌های در انتظار بررسی</h1>
        <p className="text-sm text-[#6b6b6b] mt-0.5">
          {total > 0 ? `${total} درخواست منتظر پاسخ است` : 'درخواست جدیدی وجود ندارد'}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] animate-pulse" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3 text-[#E8E5DF]">◷</div>
          <p className="text-[#6b6b6b] text-sm">همه درخواست‌ها بررسی شده‌اند.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((a) => {
            const expires = a.expiresAt ? new Date(a.expiresAt) : null
            const isExpiringSoon = expires && (expires.getTime() - Date.now()) < 3 * 3600 * 1000
            return (
              <div key={a.id} className={`bg-[#F9F8F5] border rounded-xl p-5 ${isExpiringSoon ? 'border-amber-300' : 'border-[#E8E5DF]'}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/admin/appointments/${a.id}`} className="font-medium text-sm text-[#1a1a1a] hover:text-[#2C4A3E] transition">
                        {a.fullName}
                      </Link>
                      {isExpiringSoon && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          به‌زودی منقضی
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#6b6b6b] mb-1">
                      {a.country} · {a.topic} · {a.appointmentMode === 'ONLINE' ? 'آنلاین' : 'حضوری'}
                    </div>
                    {a.slot && (
                      <div className="text-xs text-[#2C4A3E] font-medium">
                        {new Date(a.slot.startTimeUtc).toLocaleString('fa-IR', {
                          weekday: 'short', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran',
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => doAction(a.id, 'APPROVE')}
                      disabled={!!acting}
                      className="px-4 py-2 bg-[#2C4A3E] text-white text-xs font-medium rounded-lg hover:bg-[#1e3429] transition disabled:opacity-50"
                    >
                      {acting === a.id + 'APPROVE' ? '...' : 'تأیید'}
                    </button>
                    <button
                      onClick={() => doAction(a.id, 'REJECT')}
                      disabled={!!acting}
                      className="px-4 py-2 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {acting === a.id + 'REJECT' ? '...' : 'رد'}
                    </button>
                    <Link
                      href={`/admin/appointments/${a.id}`}
                      className="px-4 py-2 border border-[#E8E5DF] text-[#4a4a4a] text-xs rounded-lg hover:bg-[#F0EEE9] transition"
                    >
                      جزئیات
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
