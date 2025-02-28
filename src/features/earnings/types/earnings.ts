import { getWeeklyEarnings } from '../lib/get-weekly-earnings';

export type CurrentEarningsItem = Awaited<
  ReturnType<typeof getWeeklyEarnings>
>[number];
