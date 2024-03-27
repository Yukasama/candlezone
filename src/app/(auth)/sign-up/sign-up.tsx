"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { CheckCircle, CircleX } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { SignUpSchema } from "@/lib/validators/user";
import { useState } from "react";

export const SignUp = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setError("");
      setSuccess("");

      if (data && "error" in data) {
        return setError(data.error);
      }
      if (data && "success" in data) {
        return setSuccess("Confirmation Email sent.");
      }
    },
    onError: () => setError("We currently have trouble signing you up."),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          register({
            email: form.getValues("email"),
            password: form.getValues("password"),
          }),
        )}
        className="gap-3 f-col"
      >
        {success && (
          <Chip color="success" variant="shadow" className="self-center">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle size={18} />
              {success}
            </div>
          </Chip>
        )}
        {error && (
          <Chip color="danger" variant="shadow" className="self-center">
            <div className="flex items-center gap-2 text-white">
              <CircleX size={18} />
              {error}
            </div>
          </Chip>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <Input
              type="email"
              label="Email"
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
        <FormField
          control={form.control}
          name="confPassword"
          render={({ field }) => (
            <Input
              type="password"
              label="Confirm Password"
              labelPlacement="outside"
              disabled={isLoading}
              placeholder="Confirm your Password"
              errorMessage={form.formState.errors.confPassword?.message}
              {...field}
            />
          )}
        />
        <Button
          className="text-[15px] mt-1 button-secondary font-semibold"
          isLoading={isLoading}
          type="submit"
        >
          Sign up with Email
        </Button>
      </form>
    </Form>
  );
};
