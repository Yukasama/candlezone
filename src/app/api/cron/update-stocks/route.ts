import { uploadStocks } from '@/actions/stock/upload-stocks'
import { getUser } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET() {
  const user = await getUser()

  if (!user) {
    logger.debug('CRON-upload-stocks (unauthorized) userId=%s')
    return new Response('Unauthorized', { status: 401 })
  }

  if (user?.role !== 'ADMIN') {
    logger.debug('CRON-upload-stocks (forbidden) userId=%s', user.id)
    return new Response('Forbidden', { status: 403 })
  }

  await uploadStocks({})

  return new Response('OK')
}
