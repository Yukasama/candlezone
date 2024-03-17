"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightCircle } from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { ForgotPasswordSchema } from "@/lib/validators/user";
import CompanyLogo from "@/components/shared/company-logo";
import { CheckCircle } from "lucide-react";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const form = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { mutate: sendMail, isLoading } = trpc.user.resetPassword.useMutation({
    onError: () => toast.error("Email could not be sent."),
    onSuccess: () => setSent(true),
  });

  return (
    <Card className="md:p-2 w-[400px]">
      <CardHeader className="gap-3.5">
        <CompanyLogo px={50} />
        {sent ? (
          <div
            className="flex text-white gap-1.5 items-center bg-green-600 p-1.5 
              px-3 text-md rounded-md text-[15px]">
            <CheckCircle size={18} />
            Reset Email successfully sent.
          </div>
        ) : (
          <div className="f-col">
            <h3 className="text-lg font-medium">Forgot Your Password?</h3>
            <p className="text-zinc-400 text-[15px]">
              Request a reset link here
            </p>
          </div>
        )}
      </CardHeader>

      <CardBody>
        {!sent && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() =>
                sendMail(form.getValues().email)
              )}
              className="gap-3.5 f-col">
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
              <Button color="primary" isLoading={isLoading} type="submit">
                {!isLoading && <ArrowRightCircle size={18} />}
                Reset Password
              </Button>
            </form>
          </Form>
        )}
      </CardBody>

      <CardFooter className="f-box text-sm">
        {!sent ? "Already signed up?" : "Password successfully changed?"}
        <Link
          href="/sign-in"
          className="rounded-md p-1 px-1.5 font-medium text-primary">
          {!sent ? "Sign In." : "Head to Login."}
        </Link>
      </CardFooter>
    </Card>
  );
}
