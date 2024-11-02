import { EconomicCalendar } from '@/features/stock/economic-calendar';
import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';

export const metadata = { title: 'Economic Calendar' };

export default async function EconomicCalendarPage() {
  const data = await getEconomicCalendar();

  return <EconomicCalendar events={data} />;
}
