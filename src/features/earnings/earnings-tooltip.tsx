import { formatMarketCap } from '@/lib/utils/stock-helper';
import type { Stock } from '@prisma/client';
import { SymbolItem } from '../stock/components/symbol-item';

interface Props {
  stock: Pick<
    Stock,
    | 'symbol'
    | 'companyName'
    | 'image'
    | 'mktCap'
    | 'earningsEps'
    | 'earningsEpsEstimated'
    | 'earningsRevenue'
    | 'earningsRevenueEstimated'
  >;
}

export const EarningsTooltip = ({ stock }: Props) => {
  return (
    <div className="space-y-3">
      <SymbolItem stock={stock} size="sm" />
      <div className="text-sm">
        <p className="text-gray-500">MARKET CAP</p>
        <p>{formatMarketCap(stock.mktCap!)}</p>
      </div>
      <div className="text-sm">
        <p className="text-gray-500">EARNINGS (EPS)</p>
        <div>
          <div className="flex gap-2">
            <p className="w-20 text-gray-400">Actual</p>
            <p>{stock.earningsEps ?? 'Not yet released'}</p>
          </div>
          <div className="flex gap-2">
            <p className="w-20 text-gray-400">Estimate</p>
            <p>{stock.earningsEpsEstimated ?? 'N/A'}</p>
          </div>
          {!!stock.earningsEps && (
            <div className="flex gap-2">
              <p className="w-20 text-gray-400">Surprise</p>
              <p>{(stock.earningsEpsEstimated ?? 0) / stock.earningsEps}</p>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm">
        <p className="text-gray-500">REVENUE</p>
        <div>
          <div className="flex gap-2">
            <p className="w-20 text-gray-400">Actual</p>
            <p>
              {stock.earningsRevenue
                ? formatMarketCap(stock.earningsRevenue)
                : 'Not yet released'}
            </p>
          </div>
          <div className="flex gap-2">
            <p className="w-20 text-gray-400">Estimate</p>
            <p>{formatMarketCap(stock.earningsRevenueEstimated!) ?? 'N/A'}</p>
          </div>
          {!!stock.earningsRevenue && (
            <div className="flex gap-2">
              <p className="w-20 text-gray-400">Surprise</p>
              <p>
                {(stock.earningsRevenueEstimated ?? 0) / stock.earningsRevenue}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
