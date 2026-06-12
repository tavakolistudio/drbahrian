import { type NextRequest, NextResponse } from 'next/server'

const locales = ['fa', 'en'] as const
const defaultLocale = 'fa'

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip if path already starts with a locale prefix
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (hasLocale) return NextResponse.next()

  // Rewrite to default locale (fa) — keeps URL clean (no redirect)
  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
