'use client'

import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import debounce from 'lodash/debounce'
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandDialog,
} from '@/components/ui/command'
import { PortfolioWithStocks } from '@/types/portfolio'
import { Stock } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addPortfolioPosition } from '@/actions/portfolio/add-portfolio-position'
import { searchStocks } from '@/actions/stock/search-stocks'
import { Loader } from '../loader'
import { Badge } from '../ui/badge'
import { SymbolItem } from '../stock/symbol-item'
import { removePortfolioPosition } from '@/actions/portfolio/remove-portfolio-position'
import { RemovePortfolioPositionProps } from '@/lib/validators/portfolio'

interface Props {
  portfolio: Pick<PortfolioWithStocks, 'id' | 'title' | 'stocks'>
}

type SearchResult = Pick<Stock, 'id' | 'symbol' | 'companyName' | 'image'>

export const PortfolioAddModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SearchResult[]>([])
  const [portfolioStocks, setPortfolioStocks] = useState(
    portfolio.stocks.map((s) => s.stockId)
  )

  const router = useRouter()

  const request = debounce(async () => refetch(), 300)
  const debounceRequest = useCallback(() => {
    request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { isFetching, data, refetch } = useQuery({
    queryFn: async () => await searchStocks({ search: input }),
    queryKey: ['search-stocks', input],
    enabled: false,
  })

  const { mutate: addToPortfolio, isPending } = useMutation({
    mutationFn: addPortfolioPosition,
    onError: () => toast.error('Failed to add stocks to portfolio.'),
    onSuccess: () => router.refresh(),
  })

  const { mutate: removeFromPortfolio } = useMutation({
    mutationFn: (values: RemovePortfolioPositionProps) =>
      removePortfolioPosition(values, false),
  })

  const onSubmit = async () => {
    if (selected.length < 1) {
      return toast.info('Please select atleast one stock.')
    } else if (selected.length > 50) {
      return toast.warning(`You can only add ${50} stocks at a time.`)
    }

    const positions = selected.map((stock) => {
      return {
        stockId: stock.id,
        quantity: 1,
        price: 0,
        date: new Date().toISOString(),
      }
    })

    addToPortfolio({
      portfolioId: portfolio.id,
      positions: positions,
    })

    setSelected([])
    setOpen(false)
  }

  const modifyPortfolio = (stock: SearchResult) => {
    if (selected.some((s) => s.id === stock.id)) {
      setSelected(selected.filter((s) => s.id !== stock.id))
    } else if (portfolioStocks.includes(stock.id)) {
      removeFromPortfolio({
        portfolioId: portfolio.id,
        positions: [{ stockId: stock.id }],
      })
      setPortfolioStocks(portfolioStocks.filter((s) => s !== stock.id))
    } else {
      setSelected([...selected, stock])
    }
  }

  const onOpenChange = (value: boolean) => {
    if (value === false) {
      router.refresh()
    }
    setOpen(value)
    setInput('')
    setSelected([])
  }

  return (
    <>
      <Button
        aria-label="Add new stocks"
        size="icon"
        onClick={() => setOpen(true)}
      >
        <Plus size={18} />
      </Button>

      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput
          onValueChange={(text) => {
            setInput(text)
            debounceRequest()
          }}
          value={input}
          placeholder="Search stocks..."
        />

        <CommandList key={data?.length}>
          {input.length > 0 && (
            <>
              {isFetching ? (
                <CommandEmpty className="f-box">
                  <Loader />
                </CommandEmpty>
              ) : !data?.length ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : (
                <CommandGroup heading="Stocks">
                  {data.map((stock) => (
                    <CommandItem
                      key={stock.id}
                      onSelect={() => modifyPortfolio(stock)}
                      value={stock.symbol + stock.companyName}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <SymbolItem stock={stock} />
                      {(selected.some((s) => s.id === stock.id) ||
                        portfolioStocks.includes(stock.id)) && (
                        <Badge>Added</Badge>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
        <div className="flex border-t p-2 px-3 justify-between">
          <div className="flex items-center gap-1">
            {!selected?.length ? (
              <p className="text-slate-500 text-sm">
                Stocks you select will appear here
              </p>
            ) : (
              <>
                {selected
                  .slice(0, selected.length > 5 ? 5 : selected.length)
                  .map((stock) => (
                    <Badge key={stock.id}>{stock.symbol}</Badge>
                  ))}
                {selected.length > 5 && (
                  <Badge>...+{selected.length - 5}</Badge>
                )}
              </>
            )}
          </div>

          <Button
            color="primary"
            className="h-8"
            aria-label="Add new stocks"
            isLoading={isPending}
            onClick={onSubmit}
          >
            Add
          </Button>
        </div>
      </CommandDialog>
    </>
  )
}
