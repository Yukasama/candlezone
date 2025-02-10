'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
  UpdateUserProps,
  UpdateUserSchema,
} from '@/features/user/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { updateUser as updateUserFn } from '../actions/update-user';

interface Props {
  user: Pick<User, 'email' | 'name' | 'biography'>;
}

export const UpdateUserForm = ({ user }: Readonly<Props>) => {
  const form = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name ?? undefined,
      biography: user.biography,
    },
  });

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: updateUserFn,
    onError: () => toast.error('Profile could not be updated.'),
    onSuccess: ({ error }) => {
      if (error) {
        toast.error(error);
      }
    },
  });

  const onSubmit = (values: UpdateUserProps) => {
    updateUser(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter a new username..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your biography..."
                  {...field}
                  maxLength={500}
                  required
                />
              </FormControl>
              <FormDescription>(Max. 500 characters)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="self-start" size="sm" isLoading={isPending}>
          Save changes
        </Button>
      </form>
    </Form>
  );
};
