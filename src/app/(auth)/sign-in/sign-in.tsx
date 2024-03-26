"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import { Form, FormField } from "@/components/ui/form";
import { Input, Button, Chip } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { SignInSchema } from "@/lib/validators/user";
import { useEffect, useState } from "react";
import { login } from "@/actions/login";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { CircleX } from "lucide-react";

export const SignIn = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState("");
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
      setError("");

      if (data && "error" in data) {
        return setError(data.error!);
      }
      if (data && "twoFactor" in data) {
        return setShowTwoFactor(true);
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
        {error && (
          <Chip color="danger" variant="shadow" className="self-center">
            <div className="flex items-center gap-2 text-white">
              <CircleX size={18} />
              {error}
            </div>
          </Chip>
        )}
        {showTwoFactor ? (
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <Input
                type="text"
                label="Code"
                labelPlacement="outside"
                disabled={isLoading}
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
                  labelPlacement="outside"
                  disabled={isLoading}
                  placeholder="john.doe@gmail.com"
                  errorMessage={form.formState.errors.email?.message}
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <Input
                  type="password"
                  label="Password"
                  labelPlacement="outside"
                  disabled={isLoading}
                  placeholder="Enter your Password"
                  errorMessage={form.formState.errors.password?.message}
                  {...field}
                />
              )}
            />
            <Link
              href="/forgot-password"
              className="text-[13px] text-end hover:underline underline-offset-3">
              Forgot Password?
            </Link>
          </>
        )}
        <Button
          className="text-[15px] mt-1 button-secondary font-semibold"
          disabled={!mounted || isLoading}
          isLoading={isLoading}
          type="submit">
          {showTwoFactor ? "Confirm Code" : "Sign in with Email"}
        </Button>
      </form>
    </Form>
  );
};
