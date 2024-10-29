import { randomInt } from 'd3-random';

const COLORS = [
  '#84cc16',
  '#22c55e',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
];

export const getRandomColor = () => {
  const randInt = randomInt(COLORS.length)();
  return COLORS.at(randInt);
};

export const generateColors = (length: number) => {
  let colors: string[] = [];
  while (colors.length < length) {
    colors = [...colors, ...COLORS];
  }
  return colors.slice(0, length);
};
