"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { SignInSchema } from "@/lib/validators/user";
import { useState } from "react";
import { login } from "@/actions/login";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

export const SignIn = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;

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
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <>
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
            <Link href="/forgot-password" className="text-[13px] text-end">
              Forgot Password?
            </Link>
          </>
        )}
        <Button
          className="text-[15px] mt-1"
          variant="secondary"
          isLoading={isLoading}>
          {showTwoFactor ? "Confirm code" : "Sign in with Email"}
        </Button>
      </form>
    </Form>
  );
};
