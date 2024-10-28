import { Screener } from '@/features/screener/screener';
import { queryStocks } from '@/features/stock/actions/query-stocks';
import { getUser } from '@/lib/auth';

export const metadata = { title: 'Stock Screener' };

export default async function ScreenerPage() {
  const user = await getUser();
  const data = await queryStocks({
    exchange: 'Any',
  });

  return <Screener user={user} />;
}
