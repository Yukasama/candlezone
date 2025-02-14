import { getCurrentEarnings } from '../lib/queries';

export type CurrentEarnings = Awaited<ReturnType<typeof getCurrentEarnings>>;
