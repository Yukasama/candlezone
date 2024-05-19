import 'server-only'
import { History } from '@/types/stock'

export const getTar = async (symbol: string) => {
  const data = (await fetch(symbol).then((res) => res.json())) as
    | History[]
    | null

  if (!data) {
    return null
  }

  const close: number[] = data.map((d) => d.close)

  return close.pop()! / close[0]
}
