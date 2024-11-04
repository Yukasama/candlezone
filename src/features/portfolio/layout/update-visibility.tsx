'use client';

import { Loader } from '@/components/loader';
import { updatePortfolio as updatePortfolioFn } from '@/features/portfolio/actions/update-portfolio';
import { cn } from '@/lib/utils';
import { Portfolio } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { Lock, LockOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, type HTMLAttributes } from 'react';
import { toast } from 'sonner';

interface Props extends HTMLAttributes<HTMLButtonElement> {
  portfolio: Pick<Portfolio, 'id' | 'isPublic'>;
}

export const UpdateVisibility = ({ portfolio, className }: Readonly<Props>) => {
  const [isPublic, setIsPublic] = useState(portfolio.isPublic);

  const router = useRouter();
  const { mutate: updateVisibility, isPending } = useMutation({
    mutationFn: () => {
      return updatePortfolioFn({
        portfolioId: portfolio.id,
        isPublic: !isPublic,
      });
    },
    onError: () => {
      toast.error(
        `Failed to set visibility to ${isPublic ? 'private' : 'public'}.`,
      );
      setIsPublic(portfolio.isPublic);
    },
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(
          `Failed to set visibility to ${isPublic ? 'private' : 'public'}.`,
        );
        setIsPublic(portfolio.isPublic);
      }
      toast.success(`Set visibility to ${isPublic ? 'private' : 'public'}.`);
      router.refresh();
    },
  });

  const icon = isPublic ? <LockOpen size={18} /> : <Lock size={18} />;

  return (
    <button
      aria-label="Toggle visibility"
      className={cn('f-center gap-2', className)}
      onClick={() => updateVisibility()}
    >
      {isPending ? <Loader size={18} /> : icon}
      Make {isPublic ? 'private' : 'public'}
    </button>
  );
};
