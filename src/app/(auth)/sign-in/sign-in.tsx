"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { SignInSchema } from "@/lib/validators/user";
import { useEffect, useState } from "react";
import { login } from "@/actions/login";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

export default function SignIn() {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;

  useEffect(() => setMounted(true), []);

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const { mutate: signIn, isLoading } = useMutation({
    mutationFn: (values: z.infer<typeof SignInSchema>) =>
      login(values, callbackUrl),
    onSettled: (data) => {
      if (data && "error" in data) {
        toast.error(data.error);
      }
      if (data && "twoFactor" in data) {
        setShowTwoFactor(true);
      }
    },
    onError: () => toast.error("We have trouble signing you in."),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          signIn({
            email: form.getValues("email"),
            password: form.getValues("password"),
            callbackUrl,
          })
        )}
        className="gap-3 f-col">
        {showTwoFactor ? (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <Input
                label="Code"
                type="text"
                placeholder="123456"
                errorMessage={form.formState.errors.code?.message}
                {...field}
              />
            )}
          />
        ) : (
          <>
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
            <Link
              href="/forgot-password"
              className="text-[13px] text-end">
              Forgot Password?
            </Link>
          </>
        )}
        <Button
          color="primary"
          isLoading={isLoading}
          disabled={!mounted}
          type="submit">
          {!isLoading && <LogIn size={18} />}
          {showTwoFactor ? "Confirm" : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
