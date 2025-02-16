import { env } from '@/env.mjs';
import { uploadStocks } from '@/features/admin/actions/upload-stocks';
import { getUser } from '@/features/auth/actions/get-user';
import { logger } from '@/lib/logger';

export const GET = async (req: Request) => {
  try {
    const authHeader = req.headers.get('authorization');
    const authToken = (authHeader ?? '').split('Bearer ')[1];

    const user = await getUser();
    if (!user) {
      logger.warn('CRON-upload-stocks (unauthorized): user=%o', user);
      return new Response('Unauthorized', { status: 401 });
    }

    if (user.role === 'ADMIN' || authToken === env.CRON_SECRET) {
      await uploadStocks();
      logger.info('CRON-upload-stocks (done) userId=%s', user.id);
      return new Response('OK');
    }

    logger.warn(
      'CRON-upload-stocks (unauthorized): authToken=%s user=%o',
      authToken,
      user,
    );
    return new Response('Unauthorized', { status: 401 });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`CRON-upload-stocks (error): error=%s`, error.message);
    }
    logger.error('CRON-upload-stocks (error): error=%s', String(error));
    return new Response('Internal Server Error', { status: 500 });
  }
};
