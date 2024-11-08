'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="absolute left-5 top-5"
      variant="secondary"
      size="sm"
    >
      <ArrowLeft size={18} />
      Back
    </Button>
  );
};
