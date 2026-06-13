'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      const data = await res.json()
      setError(data.error ?? 'خطا در ورود')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0EEE9] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#F9F8F5] rounded-2xl border border-[#E8E5DF] p-8">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#2C4A3E] flex items-center justify-center text-white text-lg font-bold">
            م
          </div>
          <h1 className="text-lg font-semibold text-[#1a1a1a]">ورود به پنل مدیریت</h1>
          <p className="text-xs text-[#6b6b6b]">دکتر مریم بهریان</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              dir="ltr"
              className="w-full px-3 py-2.5 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30 focus:border-[#2C4A3E] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a4a4a] mb-1.5">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              dir="ltr"
              className="w-full px-3 py-2.5 text-sm border border-[#E8E5DF] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2C4A3E]/30 focus:border-[#2C4A3E] transition"
            />
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#2C4A3E] text-white text-sm font-medium rounded-lg hover:bg-[#1e3429] transition disabled:opacity-60"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  )
}
