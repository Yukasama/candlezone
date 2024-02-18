"use client";

import { Button, Input } from "@nextui-org/react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useState } from "react";

export default function AdminAddStocks() {
  const [input, setInput] = useState("");

  const { mutate: uploadStocks, isLoading } = trpc.stock.testUpload.useMutation(
    {
      onError: () => toast.error("Failed to upload stocks."),
      onSuccess: () => toast.success("Stocks uploaded."),
    }
  );

  return (
    <Card className="w-[400px] p-3 f-col gap-3 sm:w-[500px] overflow-hidden">
      <Input
        value={input}
        label="Stock Symbol"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter stock symbol"
        aria-label="Enter stock symbol"
      />
      <Button
        color="primary"
        isLoading={isLoading}
        onClick={() => uploadStocks(input)}
        aria-label="Upload stocks">
        {!isLoading && <Upload size={18} />}
        Test Upload
      </Button>
    </Card>
  );
}
