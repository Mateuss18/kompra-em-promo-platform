import { existsSync } from 'node:fs'

import { Role } from '../../generated/prisma/client.js'
import { hashPassword } from '../auth/password.js'
import { createPrismaClient } from '../../plugins/prisma.js'

if (existsSync('.env')) process.loadEnvFile()

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const databaseUrl = process.env.DATABASE_URL

if (!email || !email.includes('@')) {
  throw new Error('ADMIN_EMAIL must be a valid email')
}

if (!password || password.length < 12 || password === 'replace-with-at-least-12-characters') {
  throw new Error('ADMIN_PASSWORD must contain at least 12 characters')
}

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const prisma = createPrismaClient(databaseUrl)

try {
  const passwordHash = await hashPassword(password)
  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: Role.ADMIN },
    create: { email, passwordHash, role: Role.ADMIN },
    select: { id: true, email: true, role: true },
  })

  process.stdout.write(`${JSON.stringify(admin)}\n`)
} finally {
  await prisma.$disconnect()
}
