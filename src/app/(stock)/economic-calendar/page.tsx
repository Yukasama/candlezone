import { getEconomicCalendar } from '@/lib/fmp/info/get-economic-calendar';
import { EconomicCalendar } from './economic-calendar';

export const metadata = { title: 'Economic Calendar' };

export default async function EconomicCalendarPage() {
  const data = await getEconomicCalendar();

  return <EconomicCalendar events={data} />;
}
