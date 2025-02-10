'use client';

import { DialogButtons } from '@/components/dialog-buttons';
import { ColorSelector } from '@/components/ui/color-selector';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  CreatePortfolioProps,
  CreatePortfolioSchema,
} from '@/features/portfolio/lib/validators';
import { COLORS } from '@/lib/utils/generate-colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PLANS } from '../payment/config/plans';
import { createPortfolio as createPortfolioFn } from './actions/create-portfolio';

interface Props {
  numberOfPortfolios?: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const CreatePortfolioForm = ({
  numberOfPortfolios = 0,
  setOpen,
}: Readonly<Props>) => {
  const [isPublic, setIsPublic] = useState(false);

  const { data: session } = useSession();
  const isAdmin = session?.user.role === 'admin';
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      color: COLORS[0],
      isPublic: false,
      title: '',
    },
    resolver: zodResolver(CreatePortfolioSchema),
  });

  const { isPending, mutate: createPortfolio } = useMutation({
    mutationFn: createPortfolioFn,
    onError: () => toast.error('Failed to create portfolio.'),
    onSuccess: ({ error, portfolioId }) => {
      if (error) {
        toast.error('Failed to create portfolio.');
        return;
      }
      if (portfolioId) {
        setOpen(false);
        router.push(`/p/${portfolioId}`);
      }
    },
  });

  const onSubmit = (data: CreatePortfolioProps) => {
    if (!isAdmin && numberOfPortfolios >= PLANS[0].maxPortfolios) {
      toast.warning('Maximum number of portfolios reached.');
      return;
    }
    createPortfolio(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="text-base"
                  placeholder="Choose your portfolio title..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is what your portfolio will be called.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3 rounded-xl border p-4">
              <FormControl>
                <Switch
                  checked={isPublic}
                  onCheckedChange={(checked) => {
                    setIsPublic(checked);
                    field.onChange(checked);
                  }}
                />
              </FormControl>
              <div className="space-y-0.5">
                <FormLabel className="text-base font-semibold">
                  {isPublic ? 'Public' : 'Private'}
                </FormLabel>
                <FormDescription className="text-desc text-sm">
                  {isPublic
                    ? 'Your portfolio will be visible to everyone.'
                    : 'Only you can see your portfolio.'}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <ColorSelector field={field} label="Portfolio Color" />
          )}
        />

        <DialogButtons
          buttonDisabled={!form.formState.isValid}
          buttonLoadingText="Creating"
          buttonText="Create"
          isPending={isPending}
          setOpen={setOpen}
        />
      </form>
    </Form>
  );
};
