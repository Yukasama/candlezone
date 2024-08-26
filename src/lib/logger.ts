import { env } from '@/env.mjs';
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: isProduction ? 'info' : env.LOG_LEVEL ?? 'info',
  // timestamp: () => `,"time":"${format(new Date(), 'HH:mm:ss')}"`,
  base: {
    pid: false,
  },
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
        },
      },
});
