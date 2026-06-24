'use client'

import { useEffect, useState } from 'react'

interface Settings {
  id: string
  doctorTimezone: string
  defaultSlotDurationMinutes: number
  defaultBreakMinutes: number
  pendingExpirationHours: number
  contactPriority: string
  reservationEnabled: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
  }, [])

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!settings) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-[#E8E5DF] rounded" />
          <div className="h-40 bg-[#F9F8F5] rounded-xl border border-[#E8E5DF]" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#1a1a1a]">تنظیمات</h1>
        <p className="text-sm text-[#6b6b6b] mt-1">پیکربندی سیستم رزرو</p>
      </div>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">رزرو نوبت آنلاین</h2>
              <p className="text-xs text-[#6b6b6b] mt-1 max-w-sm">
                با خاموش‌کردن این گزینه، دکمه و لینک «رزرو نوبت» از سایت مخفی می‌شود و امکان ثبت درخواست نوبت جدید بسته خواهد شد.
              </p>
            </div>
            <ToggleSwitch
              checked={settings.reservationEnabled}
              onChange={(checked) => setSettings({ ...settings, reservationEnabled: checked })}
              label="رزرو نوبت آنلاین"
            />
          </div>
        </div>

        <div className="bg-[#F9F8F5] rounded-xl border border-[#E8E5DF] p-6 space-y-5">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">تنظیمات وقت‌دهی</h2>

          <Field label="مدت هر جلسه (دقیقه)">
            <input
              type="number"
              min={30}
              max={120}
              value={settings.defaultSlotDurationMinutes}
              onChange={(e) => setSettings({ ...settings, defaultSlotDurationMinutes: +e.target.value })}
              className="input"
            />
          </Field>

          <Field label="فاصله بین جلسات (دقیقه)">
            <input
              type="number"
              min={0}
              max={60}
              value={settings.defaultBreakMinutes}
              onChange={(e) => setSettings({ ...settings, defaultBreakMinutes: +e.target.value })}
              className="input"
            />
          </Field>

          <Field label="مهلت تأیید درخواست (ساعت)">
            <input
              type="number"
              min={1}
              max={72}
              value={settings.pendingExpirationHours}
              onChange={(e) => setSettings({ ...settings, pendingExpirationHours: +e.target.value })}
              className="input"
            />
            <p className="text-xs text-[#6b6b6b] mt-1">
              درخواست‌هایی که در این بازه تأیید نشوند به‌صورت خودکار منقضی می‌شوند.
            </p>
          </Field>

          <Field label="اولویت روش تماس (جدا با ویرگول)">
            <input
              type="text"
              value={settings.contactPriority}
              onChange={(e) => setSettings({ ...settings, contactPriority: e.target.value })}
              placeholder="WHATSAPP,TELEGRAM,BALE"
              dir="ltr"
              className="input"
            />
          </Field>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#2C4A3E] text-white text-sm font-medium rounded-lg hover:bg-[#1e3429] transition disabled:opacity-60"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
          {saved && <span className="text-sm text-[#2C4A3E] font-medium">✓ ذخیره شد</span>}
        </div>
      </form>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border: 1px solid #E8E5DF;
          border-radius: 0.5rem;
          background: white;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input:focus {
          border-color: #2C4A3E;
          box-shadow: 0 0 0 3px rgba(44, 74, 62, 0.15);
        }
      `}</style>
    </div>
  )
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-12 flex-shrink-0 rounded-full transition-colors"
      style={{ backgroundColor: checked ? '#2C4A3E' : '#D8D4CC' }}
    >
      <span
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{ insetInlineStart: checked ? '1.5rem' : '0.25rem' }}
      />
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">{label}</label>
      {children}
    </div>
  )
}
