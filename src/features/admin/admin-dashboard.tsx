'use client';

import { StockCard } from '@/app/stock-card';
import { CustomTooltip } from '@/components/custom-tooltip';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { env } from '@/env.mjs';
import type { Stock } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { CirclePlay } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'xior';
import { cleanDatabase as cleanDatabaseFn } from './actions/clean-database';

interface Props {
  latestInserts?: Pick<
    Stock,
    'companyName' | 'image' | 'sector' | 'symbol' | 'updatedAt'
  >[];
}

export const AdminDashboard = ({ latestInserts }: Props) => {
  const { isPending, mutate: uploadStocks } = useMutation({
    mutationFn: async () =>
      await axios.get(`${env.NEXT_PUBLIC_HOST_URL}/api/cron/update-stocks`),
    onError: () => toast.error('Upload failed.'),
    onSuccess: () => toast.success('Upload succeeded.'),
  });

  const { isPending: isCleanPending, mutate: cleanDatabase } = useMutation({
    mutationFn: cleanDatabaseFn,
    onError: () => toast.error('Clean failed.'),
    onSuccess: () => toast.success('Clean succeeded.'),
  });

  return (
    <div className="flex flex-col gap-3 p-4 lg:flex-row lg:gap-5 lg:p-8">
      <Card className="bg-faded w-full border sm:w-[500px]">
        <CardHeader>
          <CardTitle>CONTROL TASKS</CardTitle>
          <CardDescription>Manage stock uploads with tasks</CardDescription>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent className="flex flex-col gap-2">
          <Card className="flex items-center justify-between p-2 px-3">
            <div>
              <p className="text-sm">Upload Stocks</p>
              <p className="text-desc text-xs">Initiate stock upload</p>
            </div>
            <div className="flex items-center gap-2">
              {isPending && <Loader size={36} />}
              <CustomTooltip content="Starts an upload queue that inserts stock data into the database.">
                <Button
                  aria-label="Upload stocks"
                  onClick={() => uploadStocks()}
                  size="icon"
                  variant="success"
                >
                  <CirclePlay size={18} />
                </Button>
              </CustomTooltip>
            </div>
          </Card>
          <Card className="items-between flex justify-between p-2 px-3">
            <div>
              <p className="text-sm">Clean database</p>
              <p className="text-desc text-xs">Initiate database clean</p>
            </div>
            <div className="flex items-center gap-2">
              {isCleanPending && <Loader size={36} />}
              <CustomTooltip content="Cleans stock entries with faulty data from the database.">
                <Button
                  aria-label="Clean database"
                  onClick={() => cleanDatabase()}
                  size="icon"
                  variant="success"
                >
                  <CirclePlay size={18} />
                </Button>
              </CustomTooltip>
            </div>
          </Card>
        </CardContent>
      </Card>

      <Card className="bg-faded w-full border sm:w-[500px]">
        <CardHeader>
          <CardTitle>LATEST INSERTS</CardTitle>
          <CardDescription>Stocks ordered by insert date</CardDescription>
        </CardHeader>
        <Separator className="mb-2" />
        <CardContent className="flex items-center justify-center">
          <Table aria-label="latest inserts">
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead>Insert/Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="w-full">
              {latestInserts?.map((item) => (
                <TableRow key={item.symbol}>
                  <TableCell>
                    <StockCard stock={item} />
                  </TableCell>
                  <TableCell className="text-sm">
                    <p>{item.updatedAt.toISOString().split('T')[0]}</p>
                    <p className="text-desc">
                      {item.updatedAt.toISOString().split('T')[1].split('.')[0]}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
