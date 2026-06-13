import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Badge } from '@/components/ui/Badge'
import type { Locale } from '@/types'
import { BookOpen } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'books' })
  return { title: t('title'), description: t('metaDescription') }
}

export default async function BooksPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const isRTL = locale === 'fa'
  const prefix = `/${locale}`

  const breadcrumbs = [
    { label: t('breadcrumb.home'), href: `${prefix}/` },
    { label: t('books.title') },
  ]

  const books = isRTL
    ? [
        {
          title: 'به‌زودی معرفی می‌شود',
          status: 'در دست انتشار',
          desc: 'اطلاعات کامل کتاب‌ها و نوشته‌های دکتر مریم بهریان به زودی در این صفحه درج خواهد شد.',
          upcoming: true,
        },
      ]
    : [
        {
          title: 'Coming Soon',
          status: 'Upcoming',
          desc: 'Complete information about books and writings by Dr. Maryam Bahrian will be added to this page soon.',
          upcoming: true,
        },
      ]

  return (
    <div className="site-container py-12">
      <Breadcrumb items={breadcrumbs} locale={locale} className="mb-8" />

      <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-12">
        {t('books.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {books.map((book, i) => (
          <div key={i} className="flex gap-5 p-6 border border-[var(--border)] rounded-sm">
            <div className="w-14 h-20 bg-[var(--accent-light)] border border-[var(--border)] rounded-sm flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{book.title}</h3>
                <Badge variant={book.upcoming ? 'default' : 'category'}>{book.status}</Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{book.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
