import { existsSync } from 'node:fs'

import { createApp } from './app/createApp.js'
import { loadConfig } from './config/env.js'

if (existsSync('.env')) process.loadEnvFile()

const config = loadConfig()
const app = await createApp({ config })

try {
  await app.listen({ host: config.host, port: config.port })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
