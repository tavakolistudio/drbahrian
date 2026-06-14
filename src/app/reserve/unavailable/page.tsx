export default function ReserveUnavailablePage() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-3xl mx-auto mb-6">
        ◷
      </div>
      <h1 className="text-2xl font-semibold text-[#1d1d1f] mb-3">این وقت دیگر در دسترس نیست</h1>
      <p className="text-sm text-[#707070] max-w-sm mx-auto leading-relaxed mb-8">
        متأسفانه وقتی که انتخاب کرده بودید در همان لحظه توسط فرد دیگری رزرو شد. لطفاً وقت دیگری انتخاب کنید.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/reserve"
          className="inline-block px-6 py-2.5 bg-[#0071e3] text-white text-sm font-medium rounded-[999px] hover:opacity-80 transition"
        >
          انتخاب وقت دیگر
        </a>
        <a
          href="/"
          className="inline-block px-6 py-2.5 border border-[#e8e8ed] text-[#707070] text-sm rounded-[999px] hover:bg-[#f5f5f7] transition"
        >
          بازگشت به صفحه اصلی
        </a>
      </div>
    </div>
  )
}
