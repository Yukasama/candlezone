'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@nextui-org/button'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getLatestInserts } from '../../actions/admin/get-latest-inserts'
import { StockImage } from '@/components/stock/stock-image'
import { Separator } from '@/components/ui/separator'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Loader } from '../loader'

export const AdminDashboard = () => {
  const { mutate: upload, isPending } = useMutation({
    mutationFn: async () =>
      await fetch('/api/cron/upload-stocks', { cache: 'no-cache' }),
    onError: () => toast.error('Failed to upload stocks.'),
    onSuccess: () => toast.success('Stocks uploaded.'),
  })

  const { data: fetchLatest, isLoading } = useQuery({
    queryFn: async () => await getLatestInserts(),
    queryKey: ['latest-inserts'],
  })

  return (
    <div className="f-col lg:flex-row gap-4 lg:gap-6">
      <Card className="w-full p-2 gap-1 sm:w-[500px] bg-faded border">
        <CardHeader className="f-col items-start">
          <h3 className="text-md">UPLOAD STOCKS</h3>
          <p className="text-gray-400">Test or start data uploading</p>
        </CardHeader>
        <Separator className="mb-8" />
        <CardContent className="gap-3.5">
          <div className="flex gap-3.5">
            <Button
              isLoading={isPending}
              onClick={() => upload()}
              className="bg-blue-500 text-white"
              aria-label="Upload stocks"
            >
              {!isPending && <UploadCloud size={18} />}
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full p-2 gap-1 sm:w-[500px] bg-faded border">
        <CardHeader className="f-col items-start">
          <h3 className="text-md">LATEST INSERTS</h3>
          <p className="text-gray-400">Stocks ordered by insert date</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader />
          ) : (
            <Table aria-label="latest inserts">
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead>Insert/Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {fetchLatest?.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell className="flex items-center gap-1">
                      <StockImage src={item.image} />
                      <div className="f-col">
                        <h4 className="truncate font-medium max-w-[200px]">
                          {item.companyName}
                        </h4>
                        <p className="text-[13px] text-gray-400">
                          {item.symbol}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {item.updatedAt.toISOString().split('T')[0]}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {
                          item.updatedAt
                            .toISOString()
                            .split('T')[1]
                            .split('.')[0]
                        }
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
