const COLORS = [
  '#84cc16',
  '#22c55e',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
]

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * COLORS.length)
  return COLORS[randomIndex]
}

export const generateColors = (dataLength: number) => {
  let colors: string[] = []
  while (colors.length < dataLength) {
    colors = colors.concat(COLORS)
  }

  return colors.slice(0, dataLength)
}
