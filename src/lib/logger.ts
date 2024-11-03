import { env } from '@/env.mjs';
import pino from 'pino';
// import { logflarePinoVercel } from 'pino-logflare';

const isProduction = process.env.NODE_ENV === 'production';

// const { stream, send } = logflarePinoVercel({
//   apiKey: 'eA_3wro12LpZ',
//   sourceToken: 'eb1d841a-e0e4-4d23-af61-84465c808157',
// });

export const logger = pino(
  {
    // browser: {
    //   transmit: {
    //     level: 'info',
    //     send: send,
    //   },
    // },
    level: isProduction ? 'info' : (env.LOG_LEVEL ?? 'info'),
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
  },
  // stream,
);
