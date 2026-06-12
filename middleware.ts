import { type NextRequest, NextResponse } from 'next/server'

const locales = ['fa', 'en'] as const
const defaultLocale = 'fa'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through if path already has a locale prefix
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  if (hasLocale) return NextResponse.next()

  // Rewrite to default locale — URL stays clean (no visible redirect)
  const newPath = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(new URL(newPath, request.url))
}

export const config = {
  // Explicitly include root + all non-static paths
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
