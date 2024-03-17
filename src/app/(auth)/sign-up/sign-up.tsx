"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { CheckCircle, LogIn } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { SignUpSchema } from "@/lib/validators/user";
import { useState } from "react";

export default function SignUp() {
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input
              label="Email"
              type="email"
              variant="bordered"
              errorMessage={form.formState.errors.email?.message}
              placeholder="john.doe@gmail.com"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <Input
              label="Password"
              type="password"
              variant="bordered"
              errorMessage={form.formState.errors.password?.message}
              placeholder="Enter your Password"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="confPassword"
          render={({ field }) => (
            <Input
              label="Confirm Password"
              type="password"
              variant="bordered"
              errorMessage={form.formState.errors.confPassword?.message}
              placeholder="Confirm your Password"
              {...field}
            />
          )}
        />
        {success && (
          <div className="bg-green-500 text-white">
            <CheckCircle size={18} />
            Confirmation Email sent.
          </div>
        )}

        <Button
          color="primary"
          isLoading={isLoading}
          className="mt-2"
          type="submit">
          {!isLoading && <LogIn size={18} />}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
