'use client'

import { addPortfolioPosition } from '@/actions/portfolio/add-portfolio-position'
import { searchStocks } from '@/actions/stock/search-stocks'
import { Loader } from '@/components/loader'
import { SymbolItem } from '@/components/stock/symbol-item'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { getServerQuote } from '@/lib/fmp/quote/get-server-quote'
import { PortfolioWithPositions } from '@/types/portfolio'
import { Stock } from '@prisma/client'
import { useMutation, useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Props {
  portfolio: Pick<PortfolioWithPositions, 'id' | 'title' | 'stocks'>
}

type SearchResult = Pick<Stock, 'id' | 'symbol' | 'companyName' | 'image'>

export const PortfolioAddModal = ({ portfolio }: Readonly<Props>) => {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<SearchResult[]>([])
  const [portfolioStocks, setPortfolioStocks] = useState(portfolio.stocks)

  const router = useRouter()

  const request = debounce(async () => refetch(), 300)
  const debounceRequest = useCallback(() => {
    request()
  }, [request])

  const { data, isFetched, refetch } = useQuery({
    queryFn: async () => await searchStocks({ search: input }),
    queryKey: ['search-stocks', input],
    enabled: false,
    staleTime: 1000,
  })

  const { mutate: addToPortfolio, isPending } = useMutation({
    mutationFn: addPortfolioPosition,
    onError: () => toast.error('Failed to add stocks to portfolio.'),
    onSuccess: () => router.refresh(),
  })

  const onSubmit = () => {
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

  const addPortfolio = (stock: SearchResult) => {
    if (!selected.some((s) => s.id === stock.id)) {
      setSelected([...selected, stock])
    }
  }

  const removePortfolio = (stock: SearchResult) => {
    setPortfolioStocks(portfolioStocks.filter((s) => s.id !== stock.id))
    setSelected(selected.filter((s) => s.id !== stock.id))
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
          {input.length > 0 ? (
            <>
              {!isFetched ? (
                <CommandEmpty className="f-box h-[300px]">
                  <Loader />
                </CommandEmpty>
              ) : !data?.length ? (
                <CommandEmpty className="f-box h-[300px]">
                  <p className="text-sm text-gray-400">
                    No search results found.
                  </p>
                </CommandEmpty>
              ) : (
                <CommandGroup heading="Stocks">
                  {data
                    .filter((stock) => !stock.isEtf)
                    .map((stock) => (
                      <CommandItem
                        key={stock.id}
                        onSelect={() => addPortfolio(stock)}
                        value={stock.symbol + stock.companyName}
                        className="flex cursor-pointer items-center justify-between"
                      >
                        <div>
                          <SymbolItem stock={stock} />
                          {(selected.some((s) => s.id === stock.id) ||
                            portfolioStocks.includes(stock)) && (
                            <div className="flex items-center gap-2 px-2 pt-2">
                              <div>
                                <Label>Date</Label>
                                <Input
                                  type="date"
                                  defaultValue={new Date().toISOString()}
                                />
                              </div>
                              <div>
                                <Label>Price</Label>
                                <Input
                                  type="number"
                                  className="w-24"
                                  // defaultValue={() => {
                                  //   'use server'
                                  //   return getServerQuote(stock.id)
                                  // }}
                                />
                              </div>
                              <div>
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  className="w-24"
                                  defaultValue={1}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {(selected.some((s) => s.id === stock.id) ||
                          portfolioStocks.includes(stock)) && (
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => removePortfolio(stock)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        )}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          ) : (
            <CommandEmpty className="f-box h-[300px]">
              <p className="text-sm text-gray-400">
                Search results will appear here.
              </p>
            </CommandEmpty>
          )}
        </CommandList>
        <div className="flex justify-between border-t p-2 px-3">
          <div className="flex items-center gap-1">
            {!selected?.length ? (
              <p className="text-sm text-gray-400">
                Stocks you select will appear here.
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
