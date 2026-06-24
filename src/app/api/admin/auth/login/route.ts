import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'
import { AdminLoginSchema } from '@/lib/validation'

// Simple rate limiting: track IPs in memory (resets on cold start — good enough for MVP)
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry || entry.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '0.0.0.0'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً ۱۵ دقیقه صبر کنید.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = AdminLoginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'اطلاعات ورود صحیح نیست', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 })
    }

    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    const expiryDays = Number(process.env.ADMIN_TOKEN_EXPIRY_DAYS ?? 7)
    const response = NextResponse.json({ ok: true, name: user.name })
    response.cookies.set({
      name: 'admin-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiryDays * 24 * 60 * 60,
      path: '/',
    })
    return response
  } catch (err) {
    console.error('[admin/auth/login]', err)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
