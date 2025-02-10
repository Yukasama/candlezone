'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      className="absolute top-5 left-5"
      onClick={() => {
        router.back();
      }}
      size="sm"
      variant="secondary"
    >
      <ArrowLeft size={18} />
      Back
    </Button>
  );
};
