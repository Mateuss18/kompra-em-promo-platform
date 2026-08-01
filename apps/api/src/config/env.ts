export type ApiConfig = {
  host: string
  port: number
  accessTokenSecret: string
  accessTokenTtl: string
  refreshTokenDays: number
  loginRateLimitMax: number
  webOrigin: string
  secureCookies: boolean
  databaseUrl: string
}

const readPositiveInteger = (value: string | undefined, fallback: number, name: string) => {
  const parsed = value === undefined ? fallback : Number(value)

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }

  return parsed
}

export const loadConfig = (environment: NodeJS.ProcessEnv = process.env): ApiConfig => {
  const accessTokenSecret = environment.ACCESS_TOKEN_SECRET
  const databaseUrl = environment.DATABASE_URL

  if (
    !accessTokenSecret ||
    accessTokenSecret.length < 32 ||
    accessTokenSecret === 'replace-with-at-least-32-random-characters'
  ) {
    throw new Error('ACCESS_TOKEN_SECRET must contain at least 32 characters')
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required')
  }

  return {
    host: environment.API_HOST ?? '0.0.0.0',
    port: readPositiveInteger(environment.API_PORT, 3000, 'API_PORT'),
    accessTokenSecret,
    accessTokenTtl: environment.ACCESS_TOKEN_TTL ?? '15m',
    refreshTokenDays: readPositiveInteger(environment.REFRESH_TOKEN_DAYS, 30, 'REFRESH_TOKEN_DAYS'),
    loginRateLimitMax: readPositiveInteger(
      environment.LOGIN_RATE_LIMIT_MAX,
      5,
      'LOGIN_RATE_LIMIT_MAX',
    ),
    webOrigin: environment.WEB_ORIGIN ?? 'http://localhost:5173',
    secureCookies: environment.NODE_ENV === 'production',
    databaseUrl,
  }
}
