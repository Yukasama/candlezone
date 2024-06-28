'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuth } from '@/hooks/use-auth'
import { PortfolioWithStocks } from '@/types/portfolio'
import { Stock } from '@prisma/client'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button, buttonVariants } from '../../components/ui/button'
import { PortfolioCreateCard } from '../portfolio/portfolio-create-card'
import { AddStockPortfolioItem } from './add-stock-portfolio-item'

interface Props {
  stock?: Pick<Stock, 'id' | 'symbol'>
  portfolios?: Pick<
    PortfolioWithStocks,
    'id' | 'title' | 'color' | 'stocks' | 'isPublic'
  >[]
}

export const AddStockPortfolio = ({ stock, portfolios }: Readonly<Props>) => {
  const { user } = useAuth()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="small-icon" aria-label="Add stock to portfolio">
          <Plus size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {user && portfolios?.length ? (
          <div className="f-col gap-2.5">
            {stock &&
              portfolios?.map((portfolio) => (
                <AddStockPortfolioItem
                  key={portfolio.id}
                  portfolio={portfolio}
                  stock={stock}
                />
              ))}
          </div>
        ) : user && !portfolios?.length ? (
          <div className="f-col items-center gap-2">
            Create a portfolio first
            <PortfolioCreateCard />
          </div>
        ) : (
          <div className="f-col items-center gap-2">
            Sign in to create portfolios
            <Link className={buttonVariants({ size: 'sm' })} href="/sign-in">
              Sign In
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
