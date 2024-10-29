import { History } from '@/features/stock/types/history';
import 'server-only';

export const getTar = async (symbol: string) => {
  const data = await fetch(symbol).then(
    (res) => res.json() as Promise<History[]>,
  );

  if (!data) {
    return;
  }

  const close: number[] = data.map((d) => d.close);

  return close.pop()! / close[0];
};
