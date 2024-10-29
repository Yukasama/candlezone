'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PLANS } from '../payment/plans';
import { createPortfolio as createPortfolioFn } from './actions/create-portfolio';

interface Props {
  numberOfPortfolios?: number;
}

export const CreateModal = ({ numberOfPortfolios = 0 }: Readonly<Props>) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
    defaultValues: {
      title: '',
      isPublic: false,
    },
  });

  const { mutate: createPortfolio, isPending } = useMutation({
    mutationFn: createPortfolioFn,
    onError: () => toast.error('Failed to create portfolio.'),
    onSuccess: ({ error, portfolioId }) => {
      if (error) {
        return toast.error('Failed to create portfolio.');
      }
      if (portfolioId) {
        router.push(`/p/${portfolioId}`);
      }
    },
  });

  const onSubmit = (data: CreatePortfolioProps) => {
    if (numberOfPortfolios >= PLANS[0].maxPortfolios) {
      return toast.warning('Maximum number of portfolios reached.');
    }
    createPortfolio(data);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Portfolio</DialogTitle>
        <DialogDescription>
          Create a personal portfolio to track your stocks.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="f-col space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio Title</FormLabel>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder="Choose your title..."
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button isLoading={isPending}>Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
