import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'admin-token'
const EXPIRY_DAYS = Number(process.env.ADMIN_TOKEN_EXPIRY_DAYS ?? 7)

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) throw new Error('ADMIN_JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export interface AdminPayload {
  sub: string   // user id
  email: string
  name: string
  role: string
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRY_DAYS}d`)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<AdminPayload> {
  const { payload } = await jwtVerify(token, getSecret())
  return payload as unknown as AdminPayload
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifyToken(token)
  } catch {
    return null
  }
}

export async function requireAdminSession(): Promise<AdminPayload> {
  const session = await getAdminSession()
  if (!session) redirect('/admin/login')
  return session
}

export function setAuthCookie(token: string): Record<string, string | boolean | number | Date> {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: EXPIRY_DAYS * 24 * 60 * 60,
    path: '/',
  }
}

export function clearAuthCookie(): Record<string, string | boolean | number> {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  }
}
