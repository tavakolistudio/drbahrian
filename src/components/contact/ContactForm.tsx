'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Locale } from '@/types'

export function ContactForm({ locale }: { locale: Locale }) {
  const t = useTranslations('contact.form')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    await new Promise((r) => setTimeout(r, 1000))
    // Wire up to your email API (Resend, EmailJS, etc.)
    const mailto = `mailto:bahriyanmaryam@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`نام: ${form.name}\nایمیل: ${form.email}\n\n${form.message}`)}`
    window.location.href = mailto
    setStatus('success')
  }

  const inputClass = cn(
    'w-full px-4 py-2.5 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-sm',
    'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
    'focus:outline-none focus:border-[var(--accent)] transition-colors'
  )
  const labelClass = 'block text-sm text-[var(--text-secondary)] mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>{t('name')}</label>
          <input
            id="name" name="name" type="text" required
            value={form.name} onChange={handleChange}
            placeholder={t('namePlaceholder')}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>{t('email')}</label>
          <input
            id="email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder={t('emailPlaceholder')}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>{t('subject')}</label>
        <input
          id="subject" name="subject" type="text" required
          value={form.subject} onChange={handleChange}
          placeholder={t('subjectPlaceholder')}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>{t('message')}</label>
        <textarea
          id="message" name="message" required rows={6}
          value={form.message} onChange={handleChange}
          placeholder={t('messagePlaceholder')}
          className={cn(inputClass, 'resize-y')}
        />
      </div>

      {status === 'success' && (
        <p className="text-sm text-[var(--accent)]">{t('success')}</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-red-600">{t('error')}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? t('sending') : t('send')}
      </Button>
    </form>
  )
}
