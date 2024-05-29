import { uploadStocks } from '@/actions/stock/upload-stocks'
import { logger } from '@/lib/logger'

export const maxDuration = 1000 * 60 * 2

export async function GET() {
  try {
    await uploadStocks({})
    logger.info('CRON-upload-stocks (done)')
  } catch {
    logger.error('CRON-upload-stocks (failed)')
  }

  return new Response('OK')
}
