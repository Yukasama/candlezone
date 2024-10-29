import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getPortfoliosWithPositionsByUser } from '@/features/portfolio/lib/queries';
import { ScreenerFilters } from '@/features/screener/screener-filters';
import { ScreenerTable } from '@/features/screener/screener-table';
import { getUser } from '@/lib/auth';
import { Filter } from 'lucide-react';

export const metadata = { title: 'Stock Screener' };

export default async function ScreenerPage() {
  const user = await getUser();
  const portfolios = user
    ? await getPortfoliosWithPositionsByUser({
        userId: user?.id,
      })
    : [];

  return (
    <div className="grid-cols-4 gap-8 lg:grid">
      <ScreenerFilters className="lg:f-col hidden p-5" />

      <Sheet>
        <SheetTrigger asChild className="absolute left-4 top-4 lg:hidden">
          <Button variant="faded" size="icon">
            <Filter className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetTitle className="hidden">Screener Filters</SheetTitle>
          <ScreenerFilters className="pt-2" />
        </SheetContent>
      </Sheet>

      <ScreenerTable portfolios={portfolios} user={user} />
    </div>
  );
}
