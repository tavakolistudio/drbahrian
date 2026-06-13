import { type NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

function getSecret() {
  return new TextEncoder().encode(
    process.env.ADMIN_JWT_SECRET || 'fallback_secret_change_me'
  )
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Admin route protection ──────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
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

  // ── Pass /reserve and /api through without locale handling ───────────────
  if (
    pathname.startsWith('/reserve') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel')
  ) {
    return NextResponse.next()
  }

  // ── next-intl middleware handles locale detection + requestLocale context ─
  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
}
