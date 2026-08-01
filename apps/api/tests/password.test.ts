import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from '../src/modules/auth/password.js'
import { createRefreshToken, hashRefreshToken } from '../src/modules/auth/refreshToken.js'

describe('authentication secrets', () => {
  it('hashes and verifies passwords without storing the password', async () => {
    const hash = await hashPassword('correct horse battery staple')

    expect(hash).not.toContain('correct horse battery staple')
    await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true)
    await expect(verifyPassword('wrong password', hash)).resolves.toBe(false)
  })

  it('creates opaque refresh tokens and stable hashes', () => {
    const token = createRefreshToken()

    expect(token).toHaveLength(43)
    expect(hashRefreshToken(token)).toHaveLength(64)
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token))
  })
})
