import { type NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const locales = ['fa', 'en'] as const
const defaultLocale = 'fa'

// Paths that bypass the locale rewrite AND have their own auth logic
const RESERVE_PATHS = ['/reserve']
const ADMIN_PUBLIC_PATHS = ['/admin/login']
const ADMIN_PATHS = ['/admin']

function getSecret() {
  return new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || 'fallback_secret_change_me'
  )
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Admin route protection ──────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Allow login page through
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await jwtVerify(token, getSecret())
      return NextResponse.next()
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin-token')
      return response
    }
  }

  // ── Pass /reserve and /api through without locale rewrite ────────────────
  if (
    pathname.startsWith('/reserve') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel')
  ) {
    return NextResponse.next()
  }

  // ── Locale routing for main site ─────────────────────────────────────────
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
  if (hasLocale) return NextResponse.next()

  const newPath = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(new URL(newPath, request.url))
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
