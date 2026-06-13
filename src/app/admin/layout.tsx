'use client'

import { Vazirmatn } from 'next/font/google'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

const NAV = [
  { href: '/admin', label: 'داشبورد', icon: '◈', exact: true },
  { href: '/admin/appointments/pending', label: 'در انتظار بررسی', icon: '◷', exact: false },
  { href: '/admin/appointments', label: 'همه نوبت‌ها', icon: '☰', exact: true },
  { href: '/admin/calendar', label: 'تقویم', icon: '⊞', exact: false },
  { href: '/admin/availability', label: 'مدیریت وقت‌ها', icon: '◫', exact: false },
  { href: '/admin/settings', label: 'تنظیمات', icon: '⚙', exact: false },
]

function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 min-h-screen bg-[#F9F8F5] border-l border-[#E8E5DF] flex flex-col shrink-0">
      <div className="p-4 border-b border-[#E8E5DF]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#2C4A3E] flex items-center justify-center text-white text-xs font-bold">
            م
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1a1a1a]">پنل مدیریت</div>
            <div className="text-[10px] text-[#6b6b6b]">دکتر مریم بهریان</div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {NAV.map((item) => {
          const active = item.exact ? path === item.href : path.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#2C4A3E] text-white font-medium'
                  : 'text-[#4a4a4a] hover:bg-[#F0EEE9] hover:text-[#2C4A3E]'
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-[#E8E5DF]">
        <form action="/api/admin/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full text-right text-xs text-[#6b6b6b] hover:text-red-600 transition-colors py-1"
          >
            خروج از سیستم
          </button>
        </form>
      </div>
    </aside>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const isLogin = path === '/admin/login'

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className={`min-h-screen text-[#1a1a1a] font-[family-name:var(--font-vazirmatn)] antialiased ${isLogin ? 'bg-[#F0EEE9]' : 'bg-[#F0EEE9] flex'}`}>
        {isLogin ? (
          children
        ) : (
          <>
            <Sidebar />
            <main className="flex-1 min-h-screen overflow-auto">
              {children}
            </main>
          </>
        )}
      </body>
    </html>
  )
}
