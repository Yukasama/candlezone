import { Screener } from '@/features/stock/screener';
import { getUser } from '@/lib/auth';

export const metadata = { title: 'Stock Screener' };

export default async function ScreenerPage() {
  const user = await getUser();

  return <Screener user={user} />;
}
