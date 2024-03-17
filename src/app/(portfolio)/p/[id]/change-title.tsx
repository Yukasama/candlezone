"use client";

import { trpc } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/react";
import { Portfolio } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  portfolio: Pick<Portfolio, "id" | "title">;
}

export default function ChangeTitle({ portfolio }: Props) {
  const [title, setTitle] = useState(portfolio.title);
  const router = useRouter();

  const { mutate: editTitle, isLoading } = trpc.portfolio.edit.useMutation({
    onError: () => toast.error("Failed to change portfolio title."),
    onSuccess: () => router.refresh(),
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!title) {
      return setTitle(portfolio.title);
    }

    if (title === portfolio.title && isLoading) {
      return;
    }

    if (title.length > 26) {
      return toast.warning("Title can be no longer than 25 characters.");
    }

    editTitle({ portfolioId: portfolio.id, title });
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <Input
        className="border-none p-0 h-7 text-xl hover:bg-zinc-100 dark:hover:bg-zinc-900"
        value={title}
        disabled={isLoading}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSubmit}
      />
      {isLoading && <Spinner size="sm" />}
    </form>
  );
}
