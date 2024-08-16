'use client'

import { addOrders as addOrdersFn } from '@/actions/portfolio/order/add-orders'
import { removePosition as removePositionFn } from '@/actions/portfolio/order/remove-position'
import { PortfolioItem } from '@/components/portfolio/portfolio-item'
import { Button } from '@/components/ui/button'
import { PortfolioWithStockIds } from '@/types/portfolio'
import { OrderType, Stock } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  portfolio: Pick<
    PortfolioWithStockIds,
    'id' | 'title' | 'color' | 'isPublic' | 'orders'
  >
  stock: Pick<Stock, 'id'>
}

export const AddStockPortfolioItem = ({
  portfolio,
  stock,
}: Readonly<Props>) => {
  const router = useRouter()
  const inPortfolio = portfolio.orders
    .map((order) => order.stockId)
    .includes(stock.id)

  const { mutate: addOrders, isPending: isAddLoading } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to add to portfolio.'),
    onSuccess: () => router.refresh(),
  })

  const { mutate: removePosition, isPending: isRemoveLoading } = useMutation({
    mutationFn: removePositionFn,
    onError: () => toast.error('Failed to remove from portfolio.'),
    onSuccess: () => router.refresh(),
  })

  return (
    <div className="f-center justify-between px-2">
      <PortfolioItem portfolio={portfolio} />
      <Button
        onClick={() =>
          inPortfolio
            ? removePosition({
                portfolioId: portfolio.id,
                stockId: stock.id,
              })
            : addOrders({
                portfolioId: portfolio.id,
                orders: [
                  {
                    stockId: stock.id,
                    price: 0,
                    type: 'BUY' as OrderType,
                    quantity: 1,
                    date: new Date().toISOString(),
                  },
                ],
              })
        }
        size="icon"
        variant={inPortfolio ? 'destructive' : 'default'}
        isLoading={inPortfolio ? isRemoveLoading : isAddLoading}
        disabled={inPortfolio ? isRemoveLoading : isAddLoading}
        aria-label={inPortfolio ? 'Remove from portfolio' : 'Add to portfolio'}
      >
        {(inPortfolio ? !isRemoveLoading : !isAddLoading) &&
          (inPortfolio ? <X size={18} /> : <Plus size={18} />)}
      </Button>
    </div>
  )
}
