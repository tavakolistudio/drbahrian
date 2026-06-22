import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { Vazirmatn, Inter, Instrument_Serif } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LocaleEffects } from '@/components/LocaleEffects'
import { BackgroundMusic } from '@/components/BackgroundMusic'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

const vazirmatn = Vazirmatn({
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-vazir',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
})


type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    title: {
      default: t('defaultTitle'),
      template: `%s | ${t('siteName')}`,
    },
    description: t('defaultDescription'),
    authors: [{ name: locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian' }],
    openGraph: {
      type: 'website',
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
      siteName: t('siteName'),
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: '/',
      languages: { fa: '/', en: '/en' },
    },
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages({ locale })
  const isRTL = locale === 'fa'

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(vazirmatn.variable, inter.variable, instrumentSerif.variable)}
    >
      <body
        className={cn(
          'min-h-screen bg-[var(--bg)] text-[var(--text-primary)] antialiased',
          isRTL ? 'font-vazir' : 'font-inter'
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <LocaleEffects locale={locale as Locale} />
          <BackgroundMusic />
          <Header />
          <main id="main-content">{children}</main>
          <Footer locale={locale as Locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
