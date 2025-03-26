'use client';

import { ColorSelector } from '@/components/color-selector';
import { Button } from '@/components/ui/button';
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
import { updatePortfolio as updatePortfolioFn } from '@/features/portfolio/actions/update-portfolio';
import {
  UpdatePortfolioProps,
  UpdatePortfolioSchema,
} from '@/features/portfolio/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Portfolio } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  portfolio: Pick<Portfolio, 'color' | 'id' | 'isPublic' | 'title'>;
}

export const UpdatePortfolioForm = ({ portfolio }: Readonly<Props>) => {
  const form = useForm({
    defaultValues: {
      color: portfolio.color,
      isPublic: !!portfolio.isPublic,
      title: portfolio.title,
    },
    resolver: zodResolver(UpdatePortfolioSchema.omit({ portfolioId: true })),
  });

  const { isPending, mutate: updatePortfolio } = useMutation({
    mutationFn: updatePortfolioFn,
    onError: () => toast.error('Failed to update order.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
      }
    },
  });

  const onSubmit = (values: Omit<UpdatePortfolioProps, 'portfolioId'>) => {
    updatePortfolio({ ...values, portfolioId: portfolio.id });
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
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
                  aria-label="Choose portfolio title"
                  autoFocus
                  className="text-base"
                  placeholder="Choose your title..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-desc p-1 text-sm">
                Choose a name between 1 and 25 characters.
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
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-0.5 leading-none">
                <FormLabel>Make portfolio public</FormLabel>
                <FormDescription>Display portfolio publicly?</FormDescription>
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
        <Button
          className="self-start"
          disabled={!form.formState.isDirty}
          isLoading={isPending}
          size="sm"
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
};
