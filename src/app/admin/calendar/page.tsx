'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Slot {
  id: string
  startTimeUtc: string
  endTimeUtc: string
  status: string
  appointmentMode: string
  request?: { id: string; fullName: string; status: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  LOCKED: 'bg-gray-100 text-gray-500 border-gray-200',
  PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-100 text-blue-700 border-blue-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'خالی', LOCKED: 'قفل', PENDING: 'در انتظار', CONFIRMED: 'رزرو', CANCELLED: 'لغو',
}

// Group slots by Iran date
function groupByDate(slots: Slot[]) {
  const groups: Record<string, Slot[]> = {}
  for (const slot of slots) {
    const key = new Date(slot.startTimeUtc).toLocaleDateString('fa-IR', { timeZone: 'Asia/Tehran' })
    if (!groups[key]) groups[key] = []
    groups[key].push(slot)
  }
  return groups
}

export default function CalendarPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/slots')
      .then((r) => r.json())
      .then((d) => { setSlots(d.slots ?? []); setLoading(false) })
  }, [])

  const groups = groupByDate(slots)
  const dates = Object.keys(groups).sort()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">نمای تقویم</h1>
        <p className="text-sm text-[#6b6b6b] mt-0.5">وقت‌ها بر اساس تاریخ شمسی (به وقت تهران)</p>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-5 w-32 bg-[#E8E5DF] rounded mb-3" />
              <div className="h-20 bg-[#F9F8F5] rounded-xl border border-[#E8E5DF]" />
            </div>
          ))}
        </div>
      ) : dates.length === 0 ? (
        <div className="text-center py-16 text-[#6b6b6b] text-sm">
          هنوز وقتی ایجاد نشده است.{' '}
          <Link href="/admin/availability" className="text-[#2C4A3E] underline">ایجاد وقت</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {dates.map((date) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-sm font-semibold text-[#1a1a1a]">{date}</h2>
                <div className="flex-1 h-px bg-[#E8E5DF]" />
                <span className="text-xs text-[#6b6b6b]">{groups[date].length} وقت</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {groups[date].map((slot) => (
                  <div
                    key={slot.id}
                    className={`border rounded-lg p-3 text-xs ${STATUS_COLORS[slot.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                  >
                    <div className="font-medium mb-1">
                      {new Date(slot.startTimeUtc).toLocaleTimeString('fa-IR', {
                        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran',
                      })}
                    </div>
                    <div className="opacity-75">{STATUS_LABELS[slot.status] ?? slot.status}</div>
                    {slot.request && (
                      <Link
                        href={`/admin/appointments/${slot.request.id}`}
                        className="mt-1 block truncate font-medium underline"
                      >
                        {slot.request.fullName}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mt-10 flex flex-wrap gap-3">
        {Object.entries(STATUS_LABELS).map(([k, v]) => (
          <div key={k} className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg border ${STATUS_COLORS[k]}`}>
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
