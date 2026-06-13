import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default settings
  const existing = await prisma.settings.findFirst()
  if (!existing) {
    await prisma.settings.create({
      data: {
        doctorTimezone: 'Asia/Tehran',
        defaultSlotDurationMinutes: 50,
        defaultBreakMinutes: 10,
        pendingExpirationHours: 24,
        contactPriority: 'WHATSAPP,TELEGRAM,BALE',
      },
    })
    console.log('✅ Settings created')
  }

  // Create admin user
  const email = process.env.ADMIN_EMAIL || 'admin@drbahrian.com'
  const password = process.env.ADMIN_PASSWORD || 'changeme123'
  const name = process.env.ADMIN_NAME || 'دکتر مریم بهریان'

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: { email, passwordHash, name, role: 'ADMIN' },
    })
    console.log(`✅ Admin user created: ${email}`)
    console.log(`   Password: ${password}`)
    console.log(`   ⚠️  Change this password after first login!`)
  } else {
    console.log(`ℹ️  Admin user already exists: ${email}`)
  }

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
