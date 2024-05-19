export const GRAPH_COLORS = [
  '#ED261F',
  '#FF8042',
  '#FFBB28',
  '#FFD700',
  '#00C49F',
  '#20B2AA',
  '#0088FE',
  '#7C4DFF',
  '#A463F2',
  '#FF6F91',
]

export const PORTFOLIO_COLORS = [
  '#FF6347',
  '#FFA07A',
  '#FFD700',
  '#FF8C00',
  '#DB7093',
]

export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * PORTFOLIO_COLORS.length)
  return PORTFOLIO_COLORS[randomIndex]
}

export const generateColors = (dataLength: number) => {
  let colors: string[] = []
  while (colors.length < dataLength) {
    colors = colors.concat(GRAPH_COLORS)
  }

  return colors.slice(0, dataLength)
}
