import { Stock } from "@prisma/client";
import StockImage from "./stock-image";

interface Props {
  stock: Pick<Stock, "symbol" | "image" | "companyName">;
}

export default function SymbolItem({ stock }: Props) {
  return (
    <div className="flex items-center gap-[9px]">
      <StockImage src={stock.image} />
      <div>
        <p className="text-[15px] font-medium max-w-[65px] sm:max-w-[150px] truncate">
          {stock.companyName}
        </p>
        <p className="font-semibold text-sm text-zinc-500">{stock.symbol}</p>
      </div>
    </div>
  );
}
