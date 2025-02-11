import { formatMarketCap } from '@/lib/utils/stock-helper';
import type { Stock } from '@prisma/client';
import { SymbolItem } from '../stock/components/symbol-item';

interface Props {
  stock: Pick<
    Stock,
    | 'companyName'
    | 'earningsEps'
    | 'earningsEpsEstimated'
    | 'earningsRevenue'
    | 'earningsRevenueEstimated'
    | 'image'
    | 'marketCap'
    | 'symbol'
  >;
}

export const EarningsTooltip = ({ stock }: Props) => {
  return (
    <div className="space-y-3">
      <SymbolItem size="sm" stock={stock} />
      <div className="text-sm">
        <p className="text-desc">MARKET CAP</p>
        {formatMarketCap(stock.marketCap)}
      </div>
      <div className="text-sm">
        <p className="text-desc">EARNINGS (EPS)</p>
        <div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Actual</p>
            {stock.earningsEps ?? 'Not yet released'}
          </div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Estimate</p>
            {stock.earningsEpsEstimated ?? 'N/A'}
          </div>
          {!!stock.earningsEps && (
            <div className="flex gap-2">
              <p className="text-desc w-20">Surprise</p>
              {(stock.earningsEpsEstimated ?? 0) / stock.earningsEps}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm">
        <p className="text-desc">REVENUE</p>
        <div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Actual</p>
            {stock.earningsRevenue
              ? formatMarketCap(stock.earningsRevenue)
              : 'Not yet released'}
          </div>
          <div className="flex gap-2">
            <p className="text-desc w-20">Estimate</p>
            {formatMarketCap(stock.earningsRevenueEstimated)}
          </div>
          {!!stock.earningsRevenue && (
            <div className="flex gap-2">
              <p className="text-desc w-20">Surprise</p>
              {(stock.earningsRevenueEstimated ?? 0) / stock.earningsRevenue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
