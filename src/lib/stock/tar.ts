import "server-only";

import { History } from "@/types/stock";

export async function getTar(symbol: string): Promise<number | null> {
  try {
    const data = (await fetch(symbol).then((res) => res.json())) as
      | History[]
      | null;

    if (!data) {
      return null;
    }

    const close: number[] = data.map((d) => d.close);

    const y1 = close.pop()! / close[0];

    return 0.5;
  } catch {
    return null;
  }
}
