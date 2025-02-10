import { env } from '@/env.mjs';
import { updateStocks } from '@/features/admin/actions/update-stocks';
import { logger } from '@/lib/logger';

export const GET = async (req: Request) => {
  try {
    const authHeader = req.headers.get('authorization');
    const authToken = (authHeader ?? '').split('Bearer ')[1];

    if (!authToken || authToken != env.CRON_SECRET) {
      logger.warn('CRON-upload-stocks (unauthorized): authToken=%s', authToken);
      return new Response('Unauthorized', { status: 401 });
    }

    await updateStocks({});
    return new Response('OK');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`CRON-upload-stocks (error): error=%s`, error.message);
    }
    logger.error('CRON-upload-stocks (error): error=%s', String(error));
    return new Response('Internal Server Error', { status: 500 });
  }
};
