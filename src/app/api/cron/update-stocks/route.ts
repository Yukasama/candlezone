import { env } from '@/env.mjs';
import { updateStocks } from '@/features/admin/actions/update-stocks';
import { logger } from '@/lib/logger';

export function GET(req: Request) {
  const authToken =
    (req.headers.get('authorization') ?? '').split('Bearer ')[1] || '';

  if (!authToken || authToken != env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  updateStocks({})
    .then(() => logger.info('CRON-upload-stocks (done)'))
    .catch(() => logger.error('CRON-upload-stocks (failed)'));

  return new Response('OK');
}
