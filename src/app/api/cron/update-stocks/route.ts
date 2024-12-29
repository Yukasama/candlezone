import { env } from '@/env.mjs';
import { updateStocks } from '@/features/admin/actions/update-stocks';
import { logger } from '@/lib/logger';

export const GET = async (req: Request) => {
  try {
    const authToken =
      (req.headers.get('authorization') ?? '').split('Bearer ')[1] || '';

    if (!authToken || authToken != env.CRON_SECRET) {
      return new Response('Unauthorized', { status: 401 });
    }

    await updateStocks({});
    logger.info('CRON-upload-stocks (done)');
    return new Response('OK');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`CRON-upload-stocks (failed): error=%s`, error.message);
    }
    logger.error('CRON-upload-stocks (failed)');
    return new Response('Internal Server Error', { status: 500 });
  }
};
