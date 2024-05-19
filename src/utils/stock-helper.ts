export const isSymbolValid = (symbol?: string) => {
  const germanRegex = /^[a-zA-Z]{1,4}\.DE$/
  const genericRegex = /^[a-zA-Z]{1,5}$/

  return germanRegex.test(symbol ?? '') || genericRegex.test(symbol ?? '')
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
