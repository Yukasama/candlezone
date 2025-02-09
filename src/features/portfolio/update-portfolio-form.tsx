'use client';

import { Button } from '@/components/ui/button';
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
import { updatePortfolio as updatePortfolioFn } from '@/features/portfolio/actions/update-portfolio';
import { UpdatePortfolioSchema } from '@/features/portfolio/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Portfolio } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  portfolio: Pick<Portfolio, 'id' | 'title' | 'isPublic' | 'color'>;
}

export const UpdatePortfolioForm = ({ portfolio }: Readonly<Props>) => {
  const form = useForm({
    resolver: zodResolver(UpdatePortfolioSchema),
    defaultValues: {
      title: '',
      isPublic: portfolio.isPublic,
      color: portfolio.color,
    },
  });

  const { mutate: updatePortfolio, isPending } = useMutation({
    mutationFn: updatePortfolioFn,
    onError: () => toast.error('Failed to update order.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
      }
    },
  });

  const onSubmit = () => {
    const title = form.getValues('title');

    if (title === portfolio.title) {
      toast.warning('Title does not have changed.');
      return;
    }
    if (title.length > 25) {
      toast.warning('Title can be no longer than 25 characters.');
      return;
    }

    updatePortfolio({
      portfolioId: portfolio.id,
      title: form.getValues('title'),
      isPublic: form.getValues('isPublic'),
      color: form.getValues('color'),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder="Choose your title..."
                  className="text-base"
                  aria-label="Choose portfolio title"
                  {...field}
                />
              </FormControl>
              <FormDescription className="p-1 text-sm text-gray-400">
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
                  checked={field.value}
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
          size="sm"
          type="submit"
          isLoading={isPending}
          onClick={onSubmit}
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
};
