import { uploadStocks } from '@/actions/stock/upload-stocks'
import { logger } from '@/lib/logger'

export async function GET(req: Request) {
  const authToken =
    (req.headers.get('authorization') ?? '').split('Bearer ')[1] || ''

  if (!authToken || authToken != process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  uploadStocks({})
    .then(() => logger.info('CRON-upload-stocks (done)'))
    .catch(() => logger.error('CRON-upload-stocks (failed)'))

  return new Response('OK')
}
