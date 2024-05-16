import { Stock } from '@prisma/client'
import { StockImage } from './stock-image'

interface Props {
  stock:
    | (Pick<Stock, 'symbol' | 'companyName'> & Partial<Pick<Stock, 'image'>>)
    | undefined
}

export const SymbolItem = ({ stock }: Readonly<Props>) => {
  return (
    <div className="flex items-center gap-[9px]">
      <StockImage src={stock?.image} px={35} />
      <div>
        <p className="text-[15px] font-medium max-w-[65px] sm:max-w-[150px] truncate">
          {stock?.companyName}
        </p>
        <p className="font-semibold text-sm text-zinc-500">{stock?.symbol}</p>
      </div>
    </div>
  )
}
