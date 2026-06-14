export default function ReserveUnavailablePage() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl mx-auto mb-6">
        ◷
      </div>
      <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-3">این وقت دیگر در دسترس نیست</h1>
      <p className="text-sm text-[#6b6b6b] max-w-sm mx-auto leading-relaxed mb-8">
        متأسفانه وقتی که انتخاب کرده بودید در همان لحظه توسط فرد دیگری رزرو شد. لطفاً وقت دیگری انتخاب کنید.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href="/reserve"
          className="inline-block px-6 py-2.5 bg-[#8052ff] text-white text-sm font-medium rounded-[48px] hover:bg-[#6a3de8] transition"
        >
          انتخاب وقت دیگر
        </a>
        <a
          href="/"
          className="inline-block px-6 py-2.5 border border-[rgba(255,255,255,0.06)] text-[#4a4a4a] text-sm rounded-[48px] hover:bg-[rgba(255,255,255,0.06)] transition"
        >
          بازگشت به صفحه اصلی
        </a>
      </div>
    </div>
  )
}


