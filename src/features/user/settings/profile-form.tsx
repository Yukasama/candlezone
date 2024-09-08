'use client';

import { updateUser } from '@/actions/user/update-user';
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
import { UpdateUserSchema } from '@/lib/validators/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  user: Pick<User, 'email' | 'name' | 'biography'> | null;
}

export const ProfileForm = ({ user }: Readonly<Props>) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name ?? '',
      biography: user?.biography ?? '',
    },
  });

  const { mutate: update, isPending } = useMutation({
    mutationFn: () => updateUser(form.getValues()),
    onError: () => toast.error('Profile could not be updated.'),
    onSuccess: () => router.refresh(),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => update())}
        className="f-col gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter a new username..."
                  {...field}
                  required
                />
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
        <Button className="self-start" isLoading={isPending}>
          Save changes
        </Button>
      </form>
    </Form>
  );
};
