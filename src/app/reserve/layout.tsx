import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'رزرو نوبت | دکتر مریم بهریان',
  description: 'رزرو جلسه مشاوره آنلاین با دکتر مریم بهریان',
}

export default function ReserveLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen bg-[#000000] text-[#1a1a1a] font-[family-name:var(--font-vazirmatn)] antialiased">
        <header className="border-b border-[rgba(255,255,255,0.06)] bg-[#000000]/90 backdrop-blur-sm sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#8052ff] flex items-center justify-center text-white text-xs font-bold">م</div>
            <span className="text-sm font-medium text-[#8052ff]">دکتر مریم بهریان | روان‌شناس</span>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-[rgba(255,255,255,0.06)] mt-16 py-6 text-center text-xs text-[#6b6b6b]">
          <p>تمامی اطلاعات شما محرمانه نگهداری می‌شود.</p>
        </footer>
      </body>
    </html>
  )
}


