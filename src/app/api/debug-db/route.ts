import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const rawUrl = process.env.DATABASE_URL ?? ''
  let host = 'NOT SET'
  try {
    const u = new URL(rawUrl)
    host = `${u.hostname}:${u.port} (user: ${u.username})`
  } catch {}

  let dbStatus = 'unknown'
  let dbError = ''
  try {
    await prisma.user.findFirst({ select: { id: true } })
    dbStatus = 'ok'
  } catch (e) {
    dbStatus = 'error'
    dbError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({ host, dbStatus, dbError })
}
