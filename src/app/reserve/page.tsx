'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { COUNTRIES, TOPICS } from '@/data/countries'

// ─── Types ───────────────────────────────────────────────────────────────────

type Mode = 'ONLINE' | 'IN_PERSON'
type ClientType = 'NEW' | 'RETURNING'
type ContactMethod = 'WHATSAPP' | 'TELEGRAM' | 'BALE'

interface Slot {
  id: string
  startTimeUtc: string
  endTimeUtc: string
  appointmentMode: string
}

interface GroupedSlots {
  [iranDate: string]: Slot[]
}

interface FormData {
  fullName: string
  country: string
  city: string
  whatsapp: string
  telegram: string
  preferredContactMethod: ContactMethod
  topic: string
  clientType: ClientType
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatIranTime(utc: string) {
  return new Date(utc).toLocaleTimeString('fa-IR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran',
  })
}

function formatClientTime(utc: string, tz: string) {
  try {
    return new Date(utc).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit', timeZone: tz,
    })
  } catch {
    return ''
  }
}

function formatIranDate(utc: string) {
  return new Date(utc).toLocaleDateString('fa-IR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tehran',
  })
}

// ─── Step indicators ─────────────────────────────────────────────────────────

const STEPS = ['نوع جلسه', 'موقعیت شما', 'انتخاب وقت', 'اطلاعات تماس']

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10" role="list">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                i < current
                  ? 'bg-[#0071e3] text-white'
                  : i === current
                  ? 'bg-[#0071e3] text-white ring-4 ring-[#0071e3]/20'
                  : 'bg-[#f5f5f7] text-[#707070] border border-[#e8e8ed]'
              }`}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap hidden sm:block ${i <= current ? 'text-[#0071e3]' : 'text-[#707070]'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-4 ${i < current ? 'bg-[#0071e3]' : 'bg-[#e8e8ed]'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Step 1: Mode ─────────────────────────────────────────────────────────────

function Step1Mode({ onNext }: { onNext: (mode: Mode) => void }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">نوع جلسه را انتخاب کنید</h2>
      <p className="text-sm text-[#707070] mb-8">جلسات آنلاین از طریق ویدیو یا تماس صوتی برگزار می‌شوند.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { value: 'ONLINE' as Mode, title: 'آنلاین', desc: 'ویدیو یا تماس صوتی — از هر جای دنیا', icon: '⊙' },
          { value: 'IN_PERSON' as Mode, title: 'حضوری', desc: 'مراجعه حضوری به مطب', icon: '⊡' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => onNext(opt.value)}
            className="text-right border border-[#e8e8ed] rounded-[28px] p-6 hover:border-[#0071e3]/40 hover:bg-[rgba(0,113,227,0.02)] transition group bg-white"
          >
            <div className="text-2xl mb-3 text-[#0071e3] group-hover:scale-110 transition-transform inline-block">{opt.icon}</div>
            <div className="font-semibold text-[#1d1d1f] mb-1">{opt.title}</div>
            <div className="text-sm text-[#707070]">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Step 2: Country + timezone ───────────────────────────────────────────────

function Step2Location({
  onNext,
  onBack,
}: {
  onNext: (country: string, timezone: string) => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string>('')

  const country = COUNTRIES.find((c) => c.nameEn === selected)

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">کشور و منطقه زمانی شما</h2>
      <p className="text-sm text-[#707070] mb-6">زمان وقت‌ها به‌صورت همزمان به وقت ایران و وقت محلی شما نشان داده می‌شود.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto border border-[#e8e8ed] rounded-[28px] p-3 mb-6 bg-white">
        {COUNTRIES.map((c) => (
          <button
            key={c.nameEn}
            onClick={() => setSelected(c.nameEn)}
            className={`flex items-center gap-3 px-4 py-3 rounded-[16px] text-sm transition text-right ${
              selected === c.nameEn
                ? 'bg-[#0071e3] text-white'
                : 'hover:bg-[#f5f5f7] text-[#1d1d1f]'
            }`}
          >
            <span className="text-lg">{c.flag}</span>
            <span className="flex-1">{c.name}</span>
          </button>
        ))}
      </div>

      {country && (
        <div className="text-xs text-[#707070] mb-6 bg-[#f5f5f7] border border-[#e8e8ed] rounded-[16px] px-4 py-3">
          منطقه زمانی: <span className="font-medium text-[#0071e3]" dir="ltr">{country.timezone}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 border border-[#e8e8ed] text-[#707070] text-sm rounded-[999px] hover:bg-[#f5f5f7] transition"
        >
          بازگشت
        </button>
        <button
          disabled={!country}
          onClick={() => country && onNext(country.name, country.timezone)}
          className="px-6 py-2.5 bg-[#0071e3] text-white text-sm font-medium rounded-[999px] hover:opacity-80 transition disabled:opacity-40"
        >
          ادامه
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Date + slot ──────────────────────────────────────────────────────

function Step3Slot({
  mode,
  timezone,
  onNext,
  onBack,
}: {
  mode: Mode
  timezone: string
  onNext: (slotId: string) => void
  onBack: () => void
}) {
  const [slots, setSlots] = useState<GroupedSlots>({})
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => r.json())
      .then((d) => {
        const grouped: GroupedSlots = d.byDate ?? {}
        if (mode === 'IN_PERSON') {
          for (const date of Object.keys(grouped)) {
            grouped[date] = grouped[date].filter((s) => s.appointmentMode !== 'ONLINE')
          }
        }
        setSlots(grouped)
        setLoading(false)
      })
  }, [mode])

  const dates = Object.keys(slots).sort()
  const dateSlots = selectedDate ? (slots[selectedDate] ?? []) : []

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">انتخاب تاریخ و وقت</h2>
      <p className="text-sm text-[#707070] mb-6">
        وقت‌ها به وقت تهران نمایش داده می‌شوند.
        {timezone !== 'Asia/Tehran' && ' وقت محلی شما هم نشان داده می‌شود.'}
      </p>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-[#f5f5f7] rounded-[999px]" />)}
        </div>
      ) : dates.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-[#707070] text-sm mb-4">در حال حاضر وقت خالی موجود نیست.</p>
          <a href="/reserve/unavailable" className="text-sm text-[#0066cc] underline">ثبت درخواست اطلاع‌رسانی</a>
        </div>
      ) : (
        <>
          <div className="mb-5">
            <p className="text-xs font-medium text-[#707070] mb-2">تاریخ</p>
            <div className="flex flex-wrap gap-2">
              {dates.map((date) => {
                const firstSlot = slots[date][0]
                const displayDate = formatIranDate(firstSlot.startTimeUtc)
                return (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                    className={`px-4 py-2.5 text-sm rounded-[999px] border transition ${
                      selectedDate === date
                        ? 'bg-[#0071e3] text-white border-[#0071e3]'
                        : 'border-[#e8e8ed] text-[#1d1d1f] bg-white hover:border-[#0071e3]/40 hover:bg-[rgba(0,113,227,0.02)]'
                    }`}
                  >
                    {displayDate}
                  </button>
                )
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="mb-6">
              <p className="text-xs font-medium text-[#707070] mb-2">ساعت</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {dateSlots.map((slot) => {
                  const iranTime = formatIranTime(slot.startTimeUtc)
                  const clientTime = timezone !== 'Asia/Tehran' ? formatClientTime(slot.startTimeUtc, timezone) : null
                  return (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`px-4 py-3 rounded-[999px] border text-sm transition text-right ${
                        selectedSlot === slot.id
                          ? 'bg-[#0071e3] text-white border-[#0071e3]'
                          : 'border-[#e8e8ed] text-[#1d1d1f] bg-white hover:border-[#0071e3]/40 hover:bg-[rgba(0,113,227,0.02)]'
                      }`}
                    >
                      <div className="font-medium" dir="ltr">{iranTime} تهران</div>
                      {clientTime && (
                        <div className={`text-xs mt-0.5 ${selectedSlot === slot.id ? 'text-white/70' : 'text-[#707070]'}`} dir="ltr">
                          {clientTime} (وقت شما)
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 border border-[#e8e8ed] text-[#707070] text-sm rounded-[999px] hover:bg-[#f5f5f7] transition"
        >
          بازگشت
        </button>
        <button
          disabled={!selectedSlot}
          onClick={() => selectedSlot && onNext(selectedSlot)}
          className="px-6 py-2.5 bg-[#0071e3] text-white text-sm font-medium rounded-[999px] hover:opacity-80 transition disabled:opacity-40"
        >
          ادامه
        </button>
      </div>
    </div>
  )
}

// ─── Step 4: Personal info ────────────────────────────────────────────────────

function Step4Form({
  mode,
  country,
  slotId,
  timezone,
  onBack,
}: {
  mode: Mode
  country: string
  slotId: string
  timezone: string
  onBack: () => void
}) {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({
    fullName: '',
    country,
    city: '',
    whatsapp: '',
    telegram: '',
    preferredContactMethod: 'WHATSAPP',
    topic: '',
    clientType: 'NEW',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.whatsapp.trim()) { setError('شماره واتساپ الزامی است'); return }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slotId, appointmentMode: mode, timezone }),
    })

    if (res.ok) {
      router.push('/reserve/success')
    } else {
      const data = await res.json()
      if (res.status === 409) {
        router.push('/reserve/unavailable')
      } else {
        setError(data.error ?? 'خطایی رخ داد. لطفاً دوباره تلاش کنید.')
        setSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">اطلاعات تماس</h2>
      <p className="text-sm text-[#707070] mb-6">اطلاعات شما محرمانه است و فقط برای هماهنگی جلسه استفاده می‌شود.</p>

      <div className="space-y-4">
        <Field label="نام کامل *">
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="نام و نام خانوادگی"
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="کشور">
            <input type="text" value={form.country} readOnly className="input" />
          </Field>
          <Field label="شهر *">
            <input
              type="text"
              required
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="شهر شما"
              className="input"
            />
          </Field>
        </div>

        <Field label="شماره واتساپ *">
          <input
            type="tel"
            required
            value={form.whatsapp}
            onChange={(e) => update('whatsapp', e.target.value)}
            placeholder="+49123456789"
            dir="ltr"
            className="input"
          />
          <p className="text-xs text-[#707070] mt-1">با کد کشور وارد کنید، مثال: +49...</p>
        </Field>

        <Field label="شماره تلگرام (اختیاری)">
          <input
            type="text"
            value={form.telegram}
            onChange={(e) => update('telegram', e.target.value)}
            placeholder="@username یا +شماره"
            dir="ltr"
            className="input"
          />
        </Field>

        <Field label="روش تماس ترجیحی">
          <div className="flex gap-2">
            {(['WHATSAPP', 'TELEGRAM', 'BALE'] as ContactMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update('preferredContactMethod', m)}
                className={`flex-1 py-2 text-sm rounded-[999px] border transition font-medium ${
                  form.preferredContactMethod === m
                    ? 'bg-[#0071e3] text-white border-[#0071e3]'
                    : 'border-[#e8e8ed] text-[#707070] hover:bg-[#f5f5f7]'
                }`}
              >
                {m === 'WHATSAPP' ? 'واتساپ' : m === 'TELEGRAM' ? 'تلگرام' : 'بله'}
              </button>
            ))}
          </div>
        </Field>

        <Field label="نوع مراجعه">
          <div className="flex gap-2">
            {[
              { value: 'NEW' as ClientType, label: 'مراجع جدید' },
              { value: 'RETURNING' as ClientType, label: 'مراجع قبلی' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('clientType', opt.value)}
                className={`flex-1 py-2 text-sm rounded-[999px] border transition ${
                  form.clientType === opt.value
                    ? 'bg-[#0071e3] text-white border-[#0071e3]'
                    : 'border-[#e8e8ed] text-[#707070] hover:bg-[#f5f5f7]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="موضوع جلسه *">
          <select
            required
            value={form.topic}
            onChange={(e) => update('topic', e.target.value)}
            className="input"
          >
            <option value="">انتخاب کنید...</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <p className="text-xs text-[#707070] mt-1.5 leading-relaxed">
            لطفاً فقط موضوع کلی جلسه را ذکر کنید. از ارسال اطلاعات بسیار شخصی یا جزئیات حساس در این مرحله خودداری کنید.
          </p>
        </Field>
      </div>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-[16px] px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-[#e8e8ed] text-[#707070] text-sm rounded-[999px] hover:bg-[#f5f5f7] transition"
        >
          بازگشت
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 bg-[#0071e3] text-white text-sm font-semibold rounded-[999px] hover:opacity-80 transition disabled:opacity-60"
        >
          {submitting ? 'در حال ثبت درخواست...' : 'ثبت درخواست'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#707070] mb-1.5">{label}</label>
      {children}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReservePage() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<Mode>('ONLINE')
  const [country, setCountry] = useState('')
  const [timezone, setTimezone] = useState('Asia/Tehran')
  const [slotId, setSlotId] = useState('')

  return (
    <div>
      <StepBar current={step} />

      {step === 0 && (
        <Step1Mode
          onNext={(m) => { setMode(m); setStep(1) }}
        />
      )}
      {step === 1 && (
        <Step2Location
          onNext={(c, tz) => { setCountry(c); setTimezone(tz); setStep(2) }}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <Step3Slot
          mode={mode}
          timezone={timezone}
          onNext={(id) => { setSlotId(id); setStep(3) }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step4Form
          mode={mode}
          country={country}
          slotId={slotId}
          timezone={timezone}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  )
}
