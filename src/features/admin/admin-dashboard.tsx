'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '../../components/ui/button'
import { CirclePlay, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
import { getLatestInserts } from '../../actions/admin/get-latest-inserts'
import { Separator } from '@/components/ui/separator'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Loader } from '../../components/loader'
import { uploadStocks } from '@/actions/stock/upload-stocks'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '../../components/ui/tooltip'
import { cleanDatabase as cleanDatabaseFn } from '@/actions/stock/clean-database'
import { clearStocks as clearStocksFn } from '@/actions/stock/clear-stocks'
import { SymbolItem } from '../../components/stock/symbol-item'

export const AdminDashboard = () => {
  const { mutate: upload, isPending } = useMutation({
    mutationFn: uploadStocks,
    onError: () => toast.error('Upload failed.'),
    onSuccess: () => toast.success('Upload succeeded.'),
  })

  const { mutate: testUpload, isPending: isTestPending } = useMutation({
    mutationFn: uploadStocks,
    onError: () => toast.error('Test failed.'),
    onSuccess: () => toast.success('Test succeeded.'),
  })

  const { mutate: cleanDatabase, isPending: isCleanPending } = useMutation({
    mutationFn: cleanDatabaseFn,
    onError: () => toast.error('Clean failed.'),
    onSuccess: () => toast.success('Clean succeeded.'),
  })

  const { mutate: clearStocks, isPending: isClearPending } = useMutation({
    mutationFn: clearStocksFn,
    onError: () => toast.error('Clear failed.'),
    onSuccess: () => toast.success('Clear succeeded.'),
  })

  const { data, refetch, isLoading } = useQuery({
    queryFn: async () => getLatestInserts(),
    queryKey: ['latest-inserts'],
  })

  return (
    <div className="p-4 lg:p-8 f-col lg:flex-row gap-3 lg:gap-5">
      <Card className="w-full sm:w-[500px] bg-faded border">
        <CardHeader>
          <CardTitle>CONTROL TASKS</CardTitle>
          <CardDescription>Manage stock uploads with tasks</CardDescription>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent className="f-col gap-2">
          <Card className="flex items-center justify-between p-2 px-3">
            <div>
              <p className="text-sm">Upload Stocks</p>
              <p className="text-xs text-gray-400">Initiate stock upload</p>
            </div>
            <div className="flex items-center gap-2">
              {isPending && <Loader size={36} />}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="success"
                      size="icon"
                      onClick={() => upload({})}
                      aria-label="Upload stocks"
                    >
                      <CirclePlay size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Starts an upload queue that inserts stock data into the
                    database.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
          <Card className="flex items-between justify-between p-2 px-3">
            <div>
              <p className="text-sm">Test Upload</p>
              <p className="text-xs text-gray-400">Start a test upload</p>
            </div>
            <div className="flex items-center gap-2">
              {isTestPending && <Loader size={36} />}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="success"
                      size="icon"
                      onClick={() => testUpload({ testRun: true })}
                      aria-label="Test upload"
                    >
                      <CirclePlay size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Test the upload queue while uploading a small subset of
                    stocks.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
          <Card className="flex items-between justify-between p-2 px-3">
            <div>
              <p className="text-sm">Clean database</p>
              <p className="text-xs text-gray-400">Initiate database clean</p>
            </div>
            <div className="flex items-center gap-2">
              {isCleanPending && <Loader size={36} />}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="success"
                      size="icon"
                      onClick={() => cleanDatabase()}
                      aria-label="Clean database"
                    >
                      <CirclePlay size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cleans stock entries with faulty data from the database.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
          <Card className="flex items-between justify-between p-2 px-3">
            <div>
              <p className="text-sm">Clear stocks</p>
              <p className="text-xs text-gray-400">Clear all stock entries</p>
            </div>
            <div className="flex items-center gap-2">
              {isClearPending && <Loader size={36} />}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => clearStocks()}
                      aria-label="Clear stocks"
                    >
                      <CirclePlay size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Removes all stock entries from the database.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        </CardContent>
      </Card>

      <Card className="w-full sm:w-[500px] bg-faded border">
        <CardHeader>
          <div className="flex justify-between">
            <div className="f-col gap-1.5">
              <CardTitle>LATEST INSERTS</CardTitle>
              <CardDescription>Stocks ordered by insert date</CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    isLoading={isLoading}
                    onClick={() => refetch()}
                    aria-label="Refresh latest inserts"
                    size="icon"
                  >
                    <RotateCcw size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Fetch the latest inserts from the database.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <Separator className="mb-2" />
        <CardContent className="f-box">
          {isLoading ? (
            <Loader className="mt-[100px]" />
          ) : (
            <Table aria-label="latest inserts">
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead>Insert/Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {data?.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell>
                      <SymbolItem stock={item} />
                    </TableCell>
                    <TableCell className="text-sm">
                      <p>{item.updatedAt.toISOString().split('T')[0]}</p>
                      <p className="text-gray-400">
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
