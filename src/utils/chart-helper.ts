import { PortfolioHistory } from '@/types/portfolio'
import { History } from '@/types/stock'
import { format, parseISO } from 'date-fns'

export const computeDomain = (
  data: Pick<History, 'date' | 'close'>[],
): [number, number] => {
  const values = data.map((item) => item.close)
  const [dataMax, dataMin, padding] = compute(values)

  return [dataMin - padding, dataMax + padding]
}

export const computePortfolioDomain = (
  data: PortfolioHistory[],
): [number, number] => {
  const values = data.map((item) => item.return)
  const [dataMax, dataMin, padding] = compute(values)
  const lowerEnd = dataMin + padding < 0 ? dataMin + padding : 0

  return [lowerEnd, dataMax + padding]
}

const compute = (values: number[]) => {
  const dataMax = Math.max(...values)
  const dataMin = Math.min(...values)
  const padding = (dataMax - dataMin) * 0.15

  return [dataMax, dataMin, padding]
}

export const getFormattedDate = (date: string, timeframe: string) => {
  switch (timeframe) {
    case '1D': {
      return format(parseISO(date), 'HH:mm')
    }
    case '5D': {
      return format(parseISO(date), 'dd')
    }
    case '1M': {
      return format(parseISO(date), 'MMM dd')
    }
    case '6M':
    case '1Y': {
      return format(parseISO(date), 'MMM')
    }
    case '5Y':
    case 'All': {
      return format(parseISO(date), 'yyyy')
    }
    default: {
      return format(parseISO(date), 'MM/dd/yyyy')
    }
  }
}
