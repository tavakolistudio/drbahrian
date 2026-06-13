'use client'

import { useEffect, useState } from 'react'

interface Slot {
  id: string
  startTimeUtc: string
  endTimeUtc: string
  status: string
  appointmentMode: string
  request?: { id: string; fullName: string; status: string } | null
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'خالی',
  LOCKED: 'قفل شده',
  PENDING: 'در انتظار',
  CONFIRMED: 'رزرو شده',
  CANCELLED: 'لغو شده',
}

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-700',
  LOCKED: 'bg-gray-200 text-gray-600',
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-600',
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  // Create form
  const [iranDate, setIranDate] = useState('')
  const [startHour, setStartHour] = useState(9)
  const [endHour, setEndHour] = useState(18)
  const [durationMin, setDurationMin] = useState(50)
  const [breakMin, setBreakMin] = useState(10)
  const [mode, setMode] = useState<'ONLINE' | 'IN_PERSON'>('ONLINE')
  const [creating, setCreating] = useState(false)
  const [createResult, setCreateResult] = useState<string | null>(null)

  async function loadSlots() {
    setLoading(true)
    const res = await fetch('/api/admin/slots')
    const data = await res.json()
    setSlots(data.slots ?? [])
    setLoading(false)
  }

  useEffect(() => { loadSlots() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateResult(null)
    const res = await fetch('/api/admin/slots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ iranDate, startHour, endHour, durationMin, breakMin, appointmentMode: mode }),
    })
    const data = await res.json()
    if (res.ok) {
      setCreateResult(`✓ ${data.created} وقت ایجاد شد${data.skipped ? ` (${data.skipped} تکراری رد شد)` : ''}`)
      await loadSlots()
    } else {
      setCreateResult('خطا: ' + (data.error ?? 'ناشناخته'))
    }
    setCreating(false)
  }

  async function toggleLock(slot: Slot) {
    const newStatus = slot.status === 'LOCKED' ? 'AVAILABLE' : 'LOCKED'
    await fetch(`/api/admin/slots/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    await loadSlots()
  }

  async function deleteSlot(id: string) {
    if (!confirm('حذف این وقت؟')) return
    await fetch(`/api/admin/slots/${id}`, { method: 'DELETE' })
    await loadSlots()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">مدیریت وقت‌های مشاوره</h1>
        <p className="text-sm text-[#6b6b6b] mt-0.5">ایجاد، قفل و حذف وقت‌های خالی</p>
      </div>

      {/* Create form */}
      <div className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-6 mb-8">
        <h2 className="text-sm font-semibold text-[#1a1a1a] mb-4">ایجاد وقت‌های جدید</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">تاریخ (میلادی)</label>
            <input
              type="date"
              value={iranDate}
              onChange={(e) => setIranDate(e.target.value)}
              dir="ltr"
              required
              className="w-full px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">ساعت شروع</label>
            <input type="number" min={0} max={23} value={startHour} onChange={(e) => setStartHour(+e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">ساعت پایان</label>
            <input type="number" min={1} max={24} value={endHour} onChange={(e) => setEndHour(+e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">مدت جلسه (دقیقه)</label>
            <input type="number" min={30} max={120} value={durationMin} onChange={(e) => setDurationMin(+e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">فاصله (دقیقه)</label>
            <input type="number" min={0} max={60} value={breakMin} onChange={(e) => setBreakMin(+e.target.value)} className="w-full px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">نوع جلسه</label>
            <select value={mode} onChange={(e) => setMode(e.target.value as 'ONLINE' | 'IN_PERSON')} className="w-full px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E]">
              <option value="ONLINE">آنلاین</option>
              <option value="IN_PERSON">حضوری</option>
            </select>
          </div>
          <div className="col-span-2 md:col-span-3 flex items-center gap-4">
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 bg-[#2C4A3E] text-white text-sm font-medium rounded-lg hover:bg-[#1e3429] transition disabled:opacity-60"
            >
              {creating ? 'در حال ایجاد...' : 'ایجاد وقت‌ها'}
            </button>
            {createResult && (
              <span className={`text-sm ${createResult.startsWith('✓') ? 'text-[#2C4A3E]' : 'text-red-600'}`}>
                {createResult}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Slots list */}
      <h2 className="text-sm font-semibold text-[#1a1a1a] mb-3">وقت‌های موجود ({slots.length})</h2>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-[#F9F8F5] rounded-xl border border-[#E8E5DF]" />)}
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-10 text-[#6b6b6b] text-sm">هنوز وقتی ایجاد نشده است.</div>
      ) : (
        <div className="space-y-2">
          {slots.map((slot) => (
            <div key={slot.id} className="flex items-center gap-4 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl px-5 py-3">
              <div className="flex-1">
                <div className="text-sm text-[#1a1a1a]">
                  {new Date(slot.startTimeUtc).toLocaleString('fa-IR', {
                    weekday: 'short', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran',
                  })}
                </div>
                {slot.request && (
                  <div className="text-xs text-[#6b6b6b] mt-0.5">→ {slot.request.fullName}</div>
                )}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[slot.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABELS[slot.status] ?? slot.status}
              </span>
              <span className="text-xs text-[#6b6b6b]">{slot.appointmentMode === 'ONLINE' ? 'آنلاین' : 'حضوری'}</span>
              {(slot.status === 'AVAILABLE' || slot.status === 'LOCKED') && (
                <>
                  <button
                    onClick={() => toggleLock(slot)}
                    className="text-xs px-3 py-1.5 border border-[#E8E5DF] rounded-lg text-[#4a4a4a] hover:bg-[#F0EEE9] transition"
                  >
                    {slot.status === 'LOCKED' ? 'باز کردن' : 'قفل'}
                  </button>
                  <button
                    onClick={() => deleteSlot(slot.id)}
                    className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition"
                  >
                    حذف
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
