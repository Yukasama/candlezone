'use client';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getFullPortfolios } from '@/features/portfolio/lib/queries';
import { searchStocks } from '@/features/stock/actions/search-stocks';
import { SymbolItem } from '@/features/stock/components/symbol-item';
import { useMutation, useQuery } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { addOrders as addOrdersFn } from './actions/add-orders';

interface Props {
  portfolio?: Exclude<Awaited<ReturnType<typeof getFullPortfolios>>, undefined>;
}

export function AddModal({ portfolio }: Readonly<Props>) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'search' | 'details'>('search');

  const [searchInput, setSearchInput] = useState('');
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => await searchStocks({ input: searchInput }),
    queryKey: ['search-stocks', searchInput],
    enabled: false,
    staleTime: 1000,
  });

  const debounceRequest = useMemo(
    () => debounce(async () => await refetch(), 300),
    [refetch],
  );

  const [selectedStock, setSelectedStock] =
    useState<Awaited<ReturnType<typeof searchStocks>>[number]>();

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [price, setPrice] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number>(1);

  const { mutate: addOrders, isPending } = useMutation({
    mutationFn: addOrdersFn,
    onError: () => toast.error('Failed to add stock to portfolio.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Order added successfully!');
      router.refresh();
    },
  });

  const handleSelectStock = (
    stock: Awaited<ReturnType<typeof searchStocks>>[number],
  ) => {
    setSelectedStock(stock);
    setSelectedDate(new Date());
    setPrice(0);
    setQuantity(1);
    setStep('details');
  };

  const handleCancel = () => {
    if (step === 'details') {
      setSelectedStock(undefined);
      setStep('search');
    } else {
      setOpen(false);
    }
  };

  const handleAddOrder = () => {
    if (!selectedStock) {
      toast.error('No stock selected.');
      return;
    }
    if (!selectedDate) {
      toast.error('Please pick a date.');
      return;
    }
    if (!price) {
      toast.error('Please enter a price.');
      return;
    }
    if (!quantity || quantity < 1) {
      toast.error('Quantity must be at least 1.');
      return;
    }
    if (!portfolio?.id) {
      toast.error('Invalid portfolio ID.');
      return;
    }

    addOrders({
      portfolioId: portfolio.id,
      orders: [
        {
          stockId: selectedStock.id,
          type: 'BUY',
          date: selectedDate.toISOString(),
          price,
          quantity,
        },
      ],
    });

    setOpen(false);
    setStep('search');
    setSelectedStock(undefined);
  };

  return (
    <>
      <Button
        aria-label="Add orders"
        size="icon"
        variant="faded"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Plus size={18} />
      </Button>

      <ResponsiveDialog open={open} setOpen={setOpen} title="Add Order">
        {step === 'search' && (
          <div className="space-y-4">
            <Input
              placeholder="Search stocks..."
              value={searchInput}
              onChange={async (e) => {
                setSearchInput(e.target.value);
                await debounceRequest();
              }}
            />

            <div className="f-col gap-1.5 p-2">
              {!isLoading &&
                data?.map((stock) => (
                  <div key={'search-command' + stock.symbol}>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSelectStock(stock);
                      }}
                      className="mb-1.5 flex h-[50px] w-full rounded-full p-1 px-2.5 text-start hover:bg-accent"
                    >
                      <SymbolItem stock={stock} size="sm" fullLength />
                    </Button>
                    <Separator />
                  </div>
                ))}
            </div>

            <div className="flex justify-end border-t pt-3">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {step === 'details' && selectedStock && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <SymbolItem stock={selectedStock} />
              <Badge
                className="cursor-pointer bg-red-400 text-white hover:bg-red-600"
                onClick={() => {
                  setStep('search');
                }}
              >
                Change stock
              </Badge>
            </div>

            <div className="space-y-1">
              <Label>Date</Label>
              {/* <DatePicker
                field={{
                  value: selectedDate ?? '',
                  onChange: setSelectedDate,
                }}
              /> */}
            </div>

            <div>
              <Label>Price</Label>
              <div className="flex items-center gap-2">
                <p>Price</p>
                <Input
                  type="number"
                  placeholder="Custom Price"
                  onChange={(e) => {
                    setPrice(Number.parseFloat(e.target.value));
                  }}
                />
              </div>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                defaultValue={1}
                onChange={(e) => {
                  setQuantity(Number.parseFloat(e.target.value));
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t pt-3">
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleAddOrder} isLoading={isPending}>
                Add
              </Button>
            </div>
          </div>
        )}
      </ResponsiveDialog>
    </>
  );
}
