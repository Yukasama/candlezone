import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SITE } from '@/config/site'
import { PORTFOLIO_COLORS } from '@/config/colors'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const getPercentage = (count: number, total: number) => {
  return `${((count / total) * 100).toFixed(2)}%`
}

export const Timeout = async (ms: number) => {
  return await new Promise((resolve) => setTimeout(resolve, ms))
}

export const absoluteUrl = (path: string) => {
  if (typeof window !== 'undefined') {
    return path
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`
  }

  return `http://localhost:${process.env.PORT ?? 3000}${path}`
}

export const formatMarketCap = (value: number | null) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formatter.format(value ?? 0)
}

export const isSymbolValid = (symbol?: string) => {
  return !!symbol?.match(/^[a-zA-Z.-]{1,6}$/)
}

export const computeDomain = (data: any[]) => {
  const values = data.map((item) => Number.parseFloat(item.close))
  const dataMax = Math.max(...values)
  const dataMin = Math.min(...values)
  const padding = (dataMax - dataMin) * 0.15 // 15% padding

  return [dataMin - padding, dataMax + padding]
}

export const computeVolumeMax = (data: any[]) => {
  const values = data.map((item) => Number.parseFloat(item.volume))
  const dataMax = Math.max(...values)

  return dataMax * 5
}

export const constructMetadata = () => {
  return {
    title: {
      default: SITE.name,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    openGraph: {
      title: SITE.name,
      description: SITE.description,
      images: [{ url: '/logo.png' }],
    },
    icons: '/favicon.ico',
    metadataBase: new URL(SITE.url),
  }
}

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PORTFOLIO_COLORS.length)
  return PORTFOLIO_COLORS[randomIndex]
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
