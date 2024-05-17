import pino from 'pino'
import { env } from '@/env.mjs'

const isProduction = process.env.NODE_ENV === 'production'

export const logger = pino({
  level: isProduction ? 'info' : env.LOG_LEVEL ?? 'info',
  // timestamp: () => `,"time":"${format(new Date(), 'HH:mm:ss')}"`,
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
})
