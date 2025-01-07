'use client';

import { DialogButtons } from '@/components/dialog-buttons';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  CreatePortfolioProps,
  CreatePortfolioSchema,
} from '@/features/portfolio/lib/validators';
import { COLORS } from '@/lib/utils/generate-colors';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { Dispatch, SetStateAction } from 'react';
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
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
    defaultValues: {
      title: '',
      isPublic: false,
      color: COLORS[0],
    },
  });

  const { mutate: createPortfolio, isPending } = useMutation({
    mutationFn: createPortfolioFn,
    onError: () => toast.error('Failed to create portfolio.'),
    onSuccess: ({ error, portfolioId }) => {
      if (error) {
        toast.error('Failed to create portfolio.');
        return;
      }
      if (portfolioId) {
        router.push(`/p/${portfolioId}`);
      }
    },
  });

  const onSubmit = (data: CreatePortfolioProps) => {
    if (numberOfPortfolios >= PLANS[0].maxPortfolios) {
      toast.warning('Maximum number of portfolios reached.');
      return;
    }
    createPortfolio(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="f-col space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose your title..."
                  className="text-base"
                  aria-label="Choose portfolio title"
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
            <FormItem className="flex flex-row items-start -space-y-0.5 space-x-3 rounded-xl border p-4 pb-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-0.5 leading-none">
                <FormLabel>Make public</FormLabel>
                <FormDescription>Display portfolio publicly?</FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => <ColorSelector field={field} />}
        />

        <DialogButtons
          isPending={isPending}
          setOpen={setOpen}
          buttonText="Create"
          buttonLoadingText="Creating"
          buttonDisabled={!form.formState.isValid}
        />
      </form>
    </Form>
  );
};
