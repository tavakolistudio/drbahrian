import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="site-container py-24 text-center">
      <p className="text-6xl font-bold text-[var(--border)] mb-4">۴۰۴</p>
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-3">صفحه یافت نشد</h1>
      <p className="text-[var(--text-muted)] mb-8">صفحه‌ای که دنبالش می‌گردید وجود ندارد یا جابه‌جا شده است.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white rounded-sm text-sm hover:bg-[var(--accent-hover)] transition-colors"
      >
        بازگشت به خانه
      </Link>
    </div>
  )
}
