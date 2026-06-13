import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function buildDatasourceUrl(): string {
  const url = process.env.DATABASE_URL ?? ''
  // Supabase transaction pooler (port 6543) requires pgbouncer=true for Prisma
  if (url.includes(':6543') && !url.includes('pgbouncer=true')) {
    return url + (url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true')
  }
  return url
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: { db: { url: buildDatasourceUrl() } },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
