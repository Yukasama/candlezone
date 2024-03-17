"use client";

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { UserUpdateSchema } from "@/lib/validators/user";
import { User } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  user: Pick<User, "email" | "name" | "biography"> | null;
}

export default function ProfileForm({ user }: Props) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      name: user?.name ?? "",
      biography: user?.biography ?? "",
    },
  });

  const { mutate: update, isLoading } = trpc.user.update.useMutation({
    onError: () => toast.error("Profile could not be updated."),
    onSuccess: () => router.refresh(),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => update(form.getValues()))}
        className="gap-3 f-col">
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
        <Button
          className="self-start"
          type="submit"
          aria-label="Save changes"
          isLoading={isLoading}>
          Save changes
        </Button>
      </form>
    </Form>
  );
}
