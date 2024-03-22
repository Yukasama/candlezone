"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { SignUpSchema } from "@/lib/validators/user";
import { useState } from "react";

export const SignUp = () => {
  const { defaultError } = useCustomToasts();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confPassword: "",
    },
  });

  const { mutate: register, isLoading } = trpc.user.create.useMutation({
    onSettled: (data) => {
      if (data && "error" in data) {
        return toast.error(data.error);
      }
      if (data && "success" in data) {
        setSuccess(true);
      }
    },
    onError: () => defaultError(),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          register({
            email: form.getValues("email"),
            password: form.getValues("password"),
          })
        )}
        className="gap-3 f-col">
        {success && (
          <div className="flex gap-2 p-2 px-4 bg-green-500 text-white rounded-md">
            <CheckCircle size={18} />
            Confirmation Email sent.
          </div>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="text-[15px] mt-1"
          variant="secondary"
          isLoading={isLoading}>
          Sign up with Email
        </Button>
      </form>
    </Form>
  );
};
