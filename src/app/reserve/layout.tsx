'use client'

import { Vazirmatn } from 'next/font/google'

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-[family-name:var(--font-vazirmatn)] antialiased">
        <header className="border-b border-[#e8e8ed] bg-white/90 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0071e3] flex items-center justify-center text-white text-xs font-bold">م</div>
              <span className="text-sm font-medium text-[#1d1d1f]">دکتر مریم بهریان</span>
              <span className="hidden sm:inline text-sm text-[#707070]">روان‌شناس بالینی</span>
            </div>
            <a
              href="/fa"
              className="text-sm text-[#707070] hover:text-[#1d1d1f] transition-colors flex items-center gap-1"
            >
              ← بازگشت به سایت
            </a>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-10">
          <div className="bg-white rounded-[28px] border border-[#e8e8ed] p-6 sm:p-8">
            {children}
          </div>
        </main>
        <footer className="border-t border-[#e8e8ed] mt-16 py-6 text-center text-xs text-[#707070]">
          <p>تمامی اطلاعات شما محرمانه نگهداری می‌شود.</p>
        </footer>
      </body>
    </html>
  )
}
