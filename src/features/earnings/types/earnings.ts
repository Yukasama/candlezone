import { getCurrentEarnings } from '../lib/queries';

export type CurrentEarningsItem = Awaited<
  ReturnType<typeof getCurrentEarnings>
>[number];
