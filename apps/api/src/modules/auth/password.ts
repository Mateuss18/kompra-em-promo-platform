import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const KEY_LENGTH = 64
const COST = 16_384
const BLOCK_SIZE = 8
const PARALLELIZATION = 1

const deriveKey = (password: string, salt: Buffer) =>
  new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION },
      (error, key) => {
        if (error) reject(error)
        else resolve(key)
      },
    )
  })

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16)
  const key = await deriveKey(password, salt)

  return `scrypt$${COST}$${BLOCK_SIZE}$${PARALLELIZATION}$${salt.toString('base64url')}$${key.toString('base64url')}`
}

export const verifyPassword = async (password: string, encodedHash: string) => {
  const [algorithm, cost, blockSize, parallelization, encodedSalt, encodedKey] =
    encodedHash.split('$')

  if (
    algorithm !== 'scrypt' ||
    Number(cost) !== COST ||
    Number(blockSize) !== BLOCK_SIZE ||
    Number(parallelization) !== PARALLELIZATION ||
    !encodedSalt ||
    !encodedKey
  ) {
    return false
  }

  const expectedKey = Buffer.from(encodedKey, 'base64url')

  if (expectedKey.length !== KEY_LENGTH) return false

  const actualKey = await deriveKey(password, Buffer.from(encodedSalt, 'base64url'))

  return timingSafeEqual(actualKey, expectedKey)
}
