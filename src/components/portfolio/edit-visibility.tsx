"use client";

import { Portfolio } from "@prisma/client";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Earth, Lock } from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  portfolio: Pick<Portfolio, "id" | "isPublic">;
}

export default function EditVisibility({ portfolio, className }: Props) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(portfolio.isPublic);

  const { mutate: editVisible, isLoading } = trpc.portfolio.edit.useMutation({
    onError: () => toast.error("Failed to change portfolio visibility."),
    onSuccess: () => router.refresh(),
  });

  const onSubmit = () => {
    setIsPublic((prev) => !prev);
    editVisible({ portfolioId: portfolio.id, isPublic });
  };

  const statusIcon = isPublic ? <Earth size={18} /> : <Lock size={18} />;

  return (
    <Button
      size="sm"
      isLoading={isLoading}
      isIconOnly
      aria-label="Toggle visibility"
      className={cn(className, "bg-blue-500 text-white")}
      startContent={!isLoading && statusIcon}
      onClick={onSubmit}
    />
  );
}
