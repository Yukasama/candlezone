"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Upload, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchLatestInserts } from "./latestInserts";
import StockImage from "@/components/stock/stock-image";

export default function AdminAddStocks() {
  const [input, setInput] = useState("");

  const { mutate: testUpload, isLoading: isTestLoading } =
    trpc.stock.testUpload.useMutation({
      onError: () => toast.error("Failed to upload stocks."),
      onSuccess: () => toast.success("Stocks uploaded."),
    });

  const { mutate: upload, isLoading } = useMutation({
    mutationFn: async () =>
      await fetch("/api/cron/upload-stocks", { cache: "no-cache" }),
    onError: () => toast.error("Failed to upload stocks."),
    onSuccess: () => toast.success("Stocks uploaded."),
  });

  const { data: fetchLatest, isLoading: isLatestLoading } = useQuery({
    queryFn: async () => await fetchLatestInserts(),
  });

  return (
    <div className="f-col lg:flex-row gap-4 lg:gap-6">
      <Card className="w-full p-2 gap-1 sm:w-[500px]">
        <CardHeader className="f-col items-start">
          <h3 className="text-md">UPLOAD STOCKS</h3>
          <p className="text-gray-400">Test or start data uploading</p>
        </CardHeader>
        <Divider />
        <CardBody className="gap-3.5">
          <Input
            value={input}
            label="Stock Symbol"
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter stock symbol"
            aria-label="Enter stock symbol"
          />
          <div className="flex gap-3.5">
            <Button
              color="primary"
              isLoading={isTestLoading}
              onClick={() => testUpload(input)}
              aria-label="Test upload stocks">
              {!isTestLoading && <Upload size={18} />}
              Test
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => upload()}
              className="bg-blue-500 text-white"
              aria-label="Upload stocks">
              {!isLoading && <UploadCloud size={18} />}
              Upload
            </Button>
          </div>
        </CardBody>
      </Card>
      <Card className="w-full p-2 gap-1 sm:w-[500px]">
        <CardHeader className="f-col items-start">
          <h3 className="text-md">LATEST INSERTS</h3>
          <p className="text-gray-400">Stocks ordered by insert date</p>
        </CardHeader>
        <Divider />
        <Table className="f-col gap-2" aria-label="latest inserts">
          <TableHeader>
            <TableColumn>Stock</TableColumn>
            <TableColumn>Insert/Update</TableColumn>
          </TableHeader>
          <TableBody
            items={fetchLatest ?? []}
            isLoading={isLatestLoading}
            loadingContent={<Spinner />}>
            {(item) => (
              <TableRow key={item.symbol}>
                <TableCell className="flex items-center gap-1">
                  <StockImage src={item.image} />
                  <div className="f-col">
                    <h4 className="truncate font-medium">{item.companyName}</h4>
                    <p className="text-sm text-gray-400">{item.symbol}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {item.updatedAt.toISOString().split("T")[0]}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
