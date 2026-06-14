export default function ReserveSuccessPage() {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-3xl mx-auto mb-6 text-[#0071e3]">
        ✓
      </div>
      <h1 className="text-2xl font-semibold text-[#1d1d1f] mb-3">درخواست شما ثبت شد</h1>
      <p className="text-sm text-[#707070] max-w-sm mx-auto leading-relaxed mb-8">
        درخواست رزرو شما با موفقیت دریافت شد. دکتر بهریان پس از بررسی درخواست شما، از طریق روش تماسی که انتخاب کردید با شما در ارتباط خواهند بود.
      </p>
      <div className="bg-[#f5f5f7] border border-[#e8e8ed] rounded-[20px] p-5 max-w-sm mx-auto text-sm text-[#707070] leading-relaxed mb-8">
        <p className="font-medium text-[#1d1d1f] mb-2">نکات مهم:</p>
        <ul className="space-y-1.5 text-right list-disc list-inside">
          <li>لطفاً تا تأیید نهایی منتظر بمانید.</li>
          <li>وقت شما تا زمان تأیید برای دیگران نیز قابل درخواست است.</li>
          <li>پس از تأیید، جلسه قطعی می‌شود.</li>
        </ul>
      </div>
      <a
        href="/"
        className="inline-block px-6 py-2.5 bg-[#0071e3] text-white text-sm font-medium rounded-[999px] hover:opacity-80 transition"
      >
        بازگشت به صفحه اصلی
      </a>
    </div>
  )
}
