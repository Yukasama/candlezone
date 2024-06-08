'use client'

import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '../../components/ui/button'
import { PortfolioWithStocks } from '@/types/portfolio'
import { Stock } from '@prisma/client'
import { Plus, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { addPortfolioPosition } from '@/actions/portfolio/add-portfolio-position'
import { removePortfolioPosition } from '@/actions/portfolio/remove-portfolio-position'
import { PortfolioItem } from '../../components/portfolio/portfolio-item'

interface Props {
  portfolio: Pick<
    PortfolioWithStocks,
    'id' | 'title' | 'color' | 'isPublic' | 'stocks'
  >
  stock: Pick<Stock, 'id'>
}

export const AddStockPortfolioItem = ({
  portfolio,
  stock,
}: Readonly<Props>) => {
  const router = useRouter()
  const inPortfolio = portfolio.stocks.map((s) => s.stockId).includes(stock.id)

  const { mutate: addToPortfolio, isPending: isAddLoading } = useMutation({
    mutationFn: addPortfolioPosition,
    onError: () => toast.error('Failed to add to portfolio.'),
    onSuccess: () => router.refresh(),
  })

  const { mutate: removeFromPortfolio, isPending: isRemoveLoading } =
    useMutation({
      mutationFn: removePortfolioPosition,
      onError: () => toast.error('Failed to remove from portfolio.'),
      onSuccess: () => router.refresh(),
    })

  return (
    <div className="flex items-center justify-between px-2">
      <PortfolioItem portfolio={portfolio} />
      <Button
        onClick={() =>
          inPortfolio
            ? removeFromPortfolio({
                portfolioId: portfolio.id,
                positions: [{ stockId: stock.id }],
              })
            : addToPortfolio({
                portfolioId: portfolio.id,
                positions: [
                  {
                    stockId: stock.id,
                    price: 0,
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
