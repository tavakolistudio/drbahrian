import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'رزرو نوبت غیرفعال است | دکتر مریم بهریان',
}

export default function ReserveClosedPage() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl mx-auto mb-6">
        ◷
      </div>
      <h1 className="text-2xl font-semibold text-[#1d1d1f] mb-3">رزرو نوبت موقتاً غیرفعال است</h1>
      <p className="text-sm text-[#707070] max-w-sm mx-auto leading-relaxed mb-8">
        در حال حاضر امکان ثبت درخواست نوبت جدید وجود ندارد. لطفاً بعداً دوباره مراجعه کنید یا از طریق صفحه تماس با ما در ارتباط باشید.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/"
          className="inline-block px-6 py-2.5 bg-[#0071e3] text-white text-sm font-medium rounded-[999px] hover:opacity-80 transition"
        >
          بازگشت به صفحه اصلی
        </a>
      </div>
    </div>
  )
}
