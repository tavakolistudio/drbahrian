'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'

interface Appointment {
  id: string
  fullName: string
  country: string
  city: string
  whatsapp: string
  telegram?: string
  preferredContactMethod: string
  appointmentMode: string
  clientType: string
  topic: string
  status: string
  adminNote?: string
  requestedAt: string
  confirmedAt?: string
  rejectedAt?: string
  cancelledAt?: string
  expiresAt?: string
  slot?: { startTimeUtc: string; endTimeUtc: string }
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'در انتظار بررسی',
  CONFIRMED: 'تأیید شده',
  REJECTED: 'رد شده',
  CANCELLED: 'لغو شده',
  EXPIRED: 'منقضی شده',
}

const CLIENT_TYPE_LABELS: Record<string, string> = {
  NEW: 'مراجع جدید',
  RETURNING: 'مراجع قبلی',
}

const MODE_LABELS: Record<string, string> = {
  ONLINE: 'آنلاین (ویدیو/صوتی)',
  IN_PERSON: 'حضوری',
}

export default function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [adminNote, setAdminNote] = useState('')
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/appointments/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setAppointment(d.appointment)
        setAdminNote(d.appointment?.adminNote ?? '')
        setLoading(false)
      })
  }, [id])

  async function doAction(action: 'APPROVE' | 'REJECT' | 'CANCEL') {
    setActing(action)
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNote }),
    })
    if (res.ok) {
      const data = await res.json()
      setAppointment(data.appointment)
    }
    setActing(null)
  }

  if (loading) {
    return (
      <div className="p-8 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-[#E8E5DF] rounded" />
        <div className="h-64 bg-[#F9F8F5] border border-[#E8E5DF] rounded-xl" />
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="p-8 text-center text-[#6b6b6b]">
        <p>درخواست پیدا نشد.</p>
        <button onClick={() => router.back()} className="mt-4 text-sm text-[#2C4A3E] underline">بازگشت</button>
      </div>
    )
  }

  const isPending = appointment.status === 'PENDING'
  const isConfirmed = appointment.status === 'CONFIRMED'

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-sm text-[#6b6b6b] hover:text-[#2C4A3E] transition">
          ← بازگشت
        </button>
        <span className="text-[#E8E5DF]">|</span>
        <h1 className="text-lg font-semibold text-[#1a1a1a]">{appointment.fullName}</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-[#F0EEE9] text-[#4a4a4a]">
          {STATUS_LABELS[appointment.status] ?? appointment.status}
        </span>
      </div>

      <div className="space-y-4">
        {/* Slot info */}
        {appointment.slot && (
          <Section title="زمان جلسه">
            <Row label="تهران">
              {new Date(appointment.slot.startTimeUtc).toLocaleString('fa-IR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran',
              })}
            </Row>
            <Row label="UTC">{appointment.slot.startTimeUtc}</Row>
          </Section>
        )}

        {/* Client info */}
        <Section title="اطلاعات مراجع">
          <Row label="نام کامل">{appointment.fullName}</Row>
          <Row label="کشور / شهر">{appointment.country} — {appointment.city}</Row>
          <Row label="واتساپ" dir="ltr">{appointment.whatsapp}</Row>
          {appointment.telegram && <Row label="تلگرام" dir="ltr">{appointment.telegram}</Row>}
          <Row label="روش تماس">{appointment.preferredContactMethod}</Row>
          <Row label="نوع مراجع">{CLIENT_TYPE_LABELS[appointment.clientType] ?? appointment.clientType}</Row>
        </Section>

        {/* Request info */}
        <Section title="جزئیات درخواست">
          <Row label="نوع جلسه">{MODE_LABELS[appointment.appointmentMode] ?? appointment.appointmentMode}</Row>
          <Row label="موضوع">{appointment.topic}</Row>
          <Row label="تاریخ ثبت">
            {new Date(appointment.requestedAt).toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' })}
          </Row>
          {appointment.expiresAt && isPending && (
            <Row label="انقضا">
              {new Date(appointment.expiresAt).toLocaleString('fa-IR', { timeZone: 'Asia/Tehran' })}
            </Row>
          )}
        </Section>

        {/* Admin note */}
        <Section title="یادداشت داخلی (نمایش داده نمی‌شود)">
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            placeholder="یادداشت داخلی برای این درخواست..."
            className="w-full px-3 py-2 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/20 focus:border-[#2C4A3E] resize-none"
          />
        </Section>

        {/* Actions */}
        {isPending && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => doAction('APPROVE')}
              disabled={!!acting}
              className="px-5 py-2.5 bg-[#2C4A3E] text-white text-sm font-medium rounded-lg hover:bg-[#1e3429] transition disabled:opacity-60"
            >
              {acting === 'APPROVE' ? 'در حال تأیید...' : '✓ تأیید'}
            </button>
            <button
              onClick={() => doAction('REJECT')}
              disabled={!!acting}
              className="px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-60"
            >
              {acting === 'REJECT' ? '...' : '✕ رد'}
            </button>
          </div>
        )}
        {isConfirmed && (
          <div className="pt-2">
            <button
              onClick={() => doAction('CANCEL')}
              disabled={!!acting}
              className="px-5 py-2.5 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition disabled:opacity-60"
            >
              {acting === 'CANCEL' ? '...' : 'لغو نوبت'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E8E5DF] bg-[#F0EEE9]">
        <h2 className="text-xs font-semibold text-[#4a4a4a] uppercase tracking-wide">{title}</h2>
      </div>
      <div className="divide-y divide-[#E8E5DF]">{children}</div>
    </div>
  )
}

function Row({ label, children, dir }: { label: string; children: React.ReactNode; dir?: string }) {
  return (
    <div className="flex gap-4 px-5 py-3 items-baseline">
      <span className="text-xs text-[#6b6b6b] w-24 shrink-0">{label}</span>
      <span className="text-sm text-[#1a1a1a]" dir={dir}>{children}</span>
    </div>
  )
}
