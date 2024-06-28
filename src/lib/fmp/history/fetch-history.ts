import { appConfig } from '@/config/app'
import { TIMEFRAMES } from '@/config/fmp'
import { History } from '@/types/stock'
import 'server-only'

interface Props {
  symbol: string
  timeframe: string
  from?: Date
  allFields?: boolean
}

export const fetchHistory = async ({
  symbol,
  timeframe,
  from,
  allFields,
}: Props) => {
  const { url, limit } = TIMEFRAMES[timeframe]

  const result = (await fetch(constructHistoryUrl({ symbol, url, from })).then(
    (res) => res.json()
  )) as History[] | { historical: History[] }

  const containsHistorical =
    url.includes('price-full') && 'historical' in result

  const data = containsHistorical ? result.historical : (result as History[])
  const history = data
    .slice(0, data.length < limit ? data.length : limit)
    .reverse()

  if (allFields) {
    return history
  }

  return history.map((item: History) => ({
    date: item.date,
    close: item.close,
  }))
}

interface ConstructHistoryUrlProps {
  symbol: string
  url: string
  from?: Date
}

export const constructHistoryUrl = ({
  symbol,
  url,
  from,
}: ConstructHistoryUrlProps) => {
  return `${appConfig.fmp.url}v3/${url}/${symbol}?${
    url.includes('price-full')
      ? 'from=1975-01-01'
      : from && `from=${from.toDateString().split('T')[0]}`
  }&apikey=${process.env.FMP_API_KEY}`
}
