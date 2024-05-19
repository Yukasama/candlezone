const COLORS = [
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
