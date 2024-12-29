'use client';

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
import { SymbolItem } from '@/features/stock/components/symbol-item';
import type { Stock } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { CirclePlay } from 'lucide-react';
import { toast } from 'sonner';
import { cleanDatabase as cleanDatabaseFn } from './actions/clean-database';
import { updateRatios as updateRatiosFn } from './actions/update-ratios';
import { updateStocks } from './actions/update-stocks';

interface Props {
  latestInserts?: Pick<
    Stock,
    'symbol' | 'companyName' | 'image' | 'updatedAt'
  >[];
}

export const AdminDashboard = ({ latestInserts }: Props) => {
  const { mutate: upload, isPending } = useMutation({
    mutationFn: updateStocks,
    onError: () => toast.error('Upload failed.'),
    onSuccess: () => toast.success('Upload succeeded.'),
  });

  const { mutate: testUpload, isPending: isTestPending } = useMutation({
    mutationFn: updateStocks,
    onError: () => toast.error('Test failed.'),
    onSuccess: () => toast.success('Test succeeded.'),
  });

  const { mutate: updateRatios, isPending: isRatioPending } = useMutation({
    mutationFn: updateRatiosFn,
    onError: () => toast.error('Ratio update failed.'),
    onSuccess: () => toast.success('Ratio update succeeded.'),
  });

  const { mutate: cleanDatabase, isPending: isCleanPending } = useMutation({
    mutationFn: cleanDatabaseFn,
    onError: () => toast.error('Clean failed.'),
    onSuccess: () => toast.success('Clean succeeded.'),
  });

  return (
    <div className="f-col gap-3 p-4 lg:flex-row lg:gap-5 lg:p-8">
      <Card className="bg-faded w-full border sm:w-[500px]">
        <CardHeader>
          <CardTitle>CONTROL TASKS</CardTitle>
          <CardDescription>Manage stock uploads with tasks</CardDescription>
        </CardHeader>
        <Separator className="mb-6" />
        <CardContent className="f-col gap-2">
          <Card className="f-center justify-between p-2 px-3">
            <div>
              <p className="text-sm">Upload Stocks</p>
              <p className="text-xs text-gray-400">Initiate stock upload</p>
            </div>
            <div className="f-center gap-2">
              {isPending && <Loader size={36} />}
              <CustomTooltip content="Starts an upload queue that inserts stock data into the database.">
                <Button
                  variant="success"
                  size="icon"
                  onClick={() => {
                    upload({});
                  }}
                  aria-label="Upload stocks"
                >
                  <CirclePlay size={18} />
                </Button>
              </CustomTooltip>
            </div>
          </Card>
          <Card className="items-between flex justify-between p-2 px-3">
            <div>
              <p className="text-sm">Test Upload</p>
              <p className="text-xs text-gray-400">Start a test upload</p>
            </div>
            <div className="f-center gap-2">
              {isTestPending && <Loader size={36} />}
              <CustomTooltip content="Test the upload queue while uploading a small subset of stocks.">
                <Button
                  variant="success"
                  size="icon"
                  onClick={() => {
                    testUpload({ testRun: true });
                  }}
                  aria-label="Test upload"
                >
                  <CirclePlay size={18} />
                </Button>
              </CustomTooltip>
            </div>
          </Card>
          <Card className="items-between flex justify-between p-2 px-3">
            <div>
              <p className="text-sm">Ratio Update</p>
              <p className="text-xs text-gray-400">Update the stock ratios</p>
            </div>
            <div className="f-center gap-2">
              {isRatioPending && <Loader size={36} />}
              <CustomTooltip content="Update the ratios of the most popular stocks.">
                <Button
                  variant="success"
                  size="icon"
                  onClick={() => {
                    updateRatios();
                  }}
                  aria-label="Upload ratios"
                >
                  <CirclePlay size={18} />
                </Button>
              </CustomTooltip>
            </div>
          </Card>
          <Card className="items-between flex justify-between p-2 px-3">
            <div>
              <p className="text-sm">Clean database</p>
              <p className="text-xs text-gray-400">Initiate database clean</p>
            </div>
            <div className="f-center gap-2">
              {isCleanPending && <Loader size={36} />}
              <CustomTooltip content="Cleans stock entries with faulty data from the database.">
                <Button
                  variant="success"
                  size="icon"
                  onClick={() => {
                    cleanDatabase();
                  }}
                  aria-label="Clean database"
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
        <CardContent className="f-box">
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
                    <SymbolItem stock={item} />
                  </TableCell>
                  <TableCell className="text-sm">
                    <p>{item.updatedAt.toISOString().split('T')[0]}</p>
                    <p className="text-gray-400">
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
