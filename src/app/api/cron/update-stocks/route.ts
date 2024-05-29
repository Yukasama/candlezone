import { uploadStocks } from '@/actions/stock/upload-stocks'
import { logger } from '@/lib/logger'

export const maxDuration = 1000 * 60 * 2

export async function GET(req: Request) {
  const authToken = (req.headers.get('authorization') ?? '')
    .split('Bearer ')
    .at(1)

  // If not found OR the bearer token does NOT equal the CRON_SECRET
  if (!authToken || authToken != process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    await uploadStocks({})
    logger.info('CRON-upload-stocks (done)')
  } catch {
    logger.error('CRON-upload-stocks (failed)')
  }

  return new Response('OK')
}
