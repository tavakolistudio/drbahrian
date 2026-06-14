export default function ReserveSuccessPage() {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-[#1c5d5f]/10 flex items-center justify-center text-3xl mx-auto mb-6 text-[#1c5d5f]">
        ✓
      </div>
      <h1 className="text-2xl font-semibold text-[#283338] mb-3">درخواست شما ثبت شد</h1>
      <p className="text-sm text-[#5a7074] max-w-sm mx-auto leading-relaxed mb-8">
        درخواست رزرو شما با موفقیت دریافت شد. دکتر بهریان پس از بررسی درخواست شما، از طریق روش تماسی که انتخاب کردید با شما در ارتباط خواهند بود.
      </p>
      <div className="bg-[#e4f0f1] rounded-[12px] p-5 max-w-sm mx-auto text-sm text-[#333333] leading-relaxed mb-8">
        <p className="font-medium text-[#1c5d5f] mb-2">نکات مهم:</p>
        <ul className="space-y-1.5 text-right list-disc list-inside">
          <li>لطفاً تا تأیید نهایی منتظر بمانید.</li>
          <li>وقت شما تا زمان تأیید برای دیگران نیز قابل درخواست است.</li>
          <li>پس از تأیید، جلسه قطعی می‌شود.</li>
        </ul>
      </div>
      <a
        href="/"
        className="inline-block px-6 py-2.5 bg-[#1c5d5f] text-white text-sm font-medium rounded-[48px] hover:bg-[#156152] transition"
      >
        بازگشت به صفحه اصلی
      </a>
    </div>
  )
}
