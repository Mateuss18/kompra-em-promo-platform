import { Role, type User } from '../../generated/prisma/client.js'
import type { PrismaClient } from '../../generated/prisma/client.js'

import { verifyPassword } from './password.js'
import { createRefreshToken, hashRefreshToken } from './refreshToken.js'

const DUMMY_PASSWORD_HASH = `scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$${Buffer.alloc(64).toString('base64url')}`

type PublicUser = Pick<User, 'id' | 'email' | 'role' | 'createdAt' | 'updatedAt'>
type AccessTokenSigner = (user: PublicUser) => string

const toPublicUser = (user: PublicUser) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
})

const expiresAtFromNow = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1_000)

export const createAuthService = (
  prisma: PrismaClient,
  signAccessToken: AccessTokenSigner,
  refreshTokenDays: number,
) => ({
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    const passwordMatches = await verifyPassword(
      password,
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
    )

    if (!user || !passwordMatches || user.role !== Role.ADMIN) return null

    const refreshToken = createRefreshToken()

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashRefreshToken(refreshToken),
        userId: user.id,
        expiresAt: expiresAtFromNow(refreshTokenDays),
      },
    })

    return {
      accessToken: signAccessToken(user),
      refreshToken,
      user: toPublicUser(user),
    }
  },

  async refresh(rawToken: string) {
    const tokenHash = hashRefreshToken(rawToken)
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    })

    if (
      !storedToken ||
      storedToken.expiresAt <= new Date() ||
      storedToken.user.role !== Role.ADMIN
    ) {
      await prisma.refreshToken.deleteMany({ where: { tokenHash } })
      return null
    }

    const refreshToken = createRefreshToken()
    let rotated = false

    await prisma.$transaction(async (transaction) => {
      const deleted = await transaction.refreshToken.deleteMany({ where: { tokenHash } })

      if (deleted.count !== 1) return

      await transaction.refreshToken.create({
        data: {
          tokenHash: hashRefreshToken(refreshToken),
          userId: storedToken.user.id,
          expiresAt: expiresAtFromNow(refreshTokenDays),
        },
      })
      rotated = true
    })

    if (!rotated) return null

    return {
      accessToken: signAccessToken(storedToken.user),
      refreshToken,
      user: toPublicUser(storedToken.user),
    }
  },

  async logout(rawToken: string | undefined) {
    if (!rawToken) return

    await prisma.refreshToken.deleteMany({
      where: { tokenHash: hashRefreshToken(rawToken) },
    })
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })

    return user?.role === Role.ADMIN ? toPublicUser(user) : null
  },
})
