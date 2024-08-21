import { format, parseISO } from 'date-fns'

export const computeDomain = (data: any[]) => {
  const values = data.map((item) => Number.parseFloat(item.close))
  const dataMax = Math.max(...values)
  const dataMin = Math.min(...values)
  const padding = (dataMax - dataMin) * 0.15

  return [dataMin - padding, dataMax + padding]
}

export const computePortfolioDomain = (data: any[]) => {
  const values = data.map((item) => Number.parseFloat(item.totalValue))
  const dataMax = Math.max(...values)
  const dataMin = Math.min(...values)
  const padding = (dataMax - dataMin) * 0.15

  const lowerEnd = dataMin + padding < 0 ? dataMin + padding : 0

  return [lowerEnd, dataMax + padding]
}

export const getFormattedDate = (date: string, timeframe: string) => {
  switch (timeframe) {
    case '1D':
      return format(parseISO(date), 'HH:mm')
    case '5D':
      return format(parseISO(date), 'dd')
    case '1M':
      return format(parseISO(date), 'MMM dd')
    case '6M':
    case '1Y':
      return format(parseISO(date), 'MMM')
    case '5Y':
    case 'All':
      return format(parseISO(date), 'yyyy')
    default:
      return format(parseISO(date), 'MM/dd/yyyy')
  }
}
