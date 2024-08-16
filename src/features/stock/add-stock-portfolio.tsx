'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { PortfolioWithStockIds } from '@/types/portfolio'
import { Stock } from '@prisma/client'
import { Plus } from 'lucide-react'
import { User } from 'next-auth'
import Link from 'next/link'
import { CreateModal } from '../portfolio/create-modal'
import { AddStockPortfolioItem } from './add-stock-portfolio-item'

interface Props {
  stock?: Pick<Stock, 'id' | 'symbol'>
  portfolios?: Pick<
    PortfolioWithStockIds,
    'id' | 'title' | 'color' | 'orders' | 'isPublic'
  >[]
  user: User | undefined
}

export const AddStockPortfolio = ({
  stock,
  portfolios,
  user,
}: Readonly<Props>) => {
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
            <CreateModal />
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
