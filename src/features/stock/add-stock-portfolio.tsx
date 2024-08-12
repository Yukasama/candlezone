'use client'

import { getClientUser } from '@/actions/auth/get-user'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PortfolioWithStockIds } from '@/types/portfolio'
import { Stock } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { PortfolioCreateCard } from '../portfolio/create-modal'
import { AddStockPortfolioItem } from './add-stock-portfolio-item'

interface Props {
  stock?: Pick<Stock, 'id' | 'symbol'>
  portfolios?: Pick<
    PortfolioWithStockIds,
    'id' | 'title' | 'color' | 'stocks' | 'isPublic'
  >[]
}

export const AddStockPortfolio = ({ stock, portfolios }: Readonly<Props>) => {
  const { data: user } = useQuery({
    queryFn: getClientUser,
    queryKey: ['get-user'],
  })

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
