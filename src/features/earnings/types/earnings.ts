import { getCurrentEarnings } from '../lib/get-current-earnings';
import { getWeeklyEarnings } from '../lib/get-weekly-earnings';

export type CurrentEarnings = Awaited<ReturnType<typeof getCurrentEarnings>>;

export type CurrentEarningsItem = Awaited<
  ReturnType<typeof getWeeklyEarnings>
>[number];
