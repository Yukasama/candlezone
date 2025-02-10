import { randomInt } from 'd3-random';

export const getRandomTestEmail = () => {
  return `playwright-test-${randomInt(10000, 99999)()}@zenathra.com`;
};
