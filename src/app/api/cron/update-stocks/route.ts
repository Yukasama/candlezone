import { uploadStocks } from '@/actions/stock/upload-stocks'
import { getUser } from '@/lib/auth'

export async function GET() {
  const user = await getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (user?.role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 })
  }

  await uploadStocks()

  return new Response('OK')
}
