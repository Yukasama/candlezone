import { StockCard } from '@/app/stock-card';
import { formatMarketCap } from '@/lib/utils/stock-helper';
import { getCurrentEarnings } from './lib/queries';

interface Props {
  stock: Awaited<ReturnType<typeof getCurrentEarnings>>[number];
}

export const EarningsTooltip = ({ stock }: Props) => {
  return (
    <div className="space-y-3">
      <StockCard stock={stock} />
      <div className="text-sm">
        <p className="text-desc">MARKET CAP</p>
        {formatMarketCap(stock.marketCap)}
      </div>
      <div className="text-sm">
        <p className="text-desc">EARNINGS (EPS)</p>
        <div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Actual</p>
            {stock.earnings?.epsActual ?? 'Not yet released'}
          </div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Estimate</p>
            {stock.earnings?.epsEstimated ?? 'N/A'}
          </div>
          {!!stock.earnings?.epsActual && (
            <div className="flex gap-2">
              <p className="text-desc w-20">Surprise</p>
              {(stock.earnings.epsEstimated ?? 0) / stock.earnings.epsActual}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm">
        <p className="text-desc">REVENUE</p>
        <div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Actual</p>
            {stock.earnings?.revenueActual
              ? formatMarketCap(stock.earnings.revenueActual)
              : 'Not yet released'}
          </div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Estimate</p>
            {formatMarketCap(stock.earnings?.revenueEstimated)}
          </div>
          {!!stock.earnings?.revenueActual && (
            <div className="flex gap-2">
              <p className="text-desc w-20">Surprise</p>
              {(stock.earnings.revenueEstimated ?? 0) /
                stock.earnings.revenueActual}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
