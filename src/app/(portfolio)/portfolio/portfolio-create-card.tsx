"use client";

import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { trpc } from "@/trpc/client";
import { CreatePortfolioSchema } from "@/lib/validators/portfolio";
import { PLANS } from "@/config/plans";
import { Card } from "@nextui-org/card";

interface Props {
  numberOfPortfolios?: number;
}

export default function PortfolioCreateCard({ numberOfPortfolios = 0 }: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const form = useForm({
    resolver: zodResolver(CreatePortfolioSchema),
    defaultValues: {
      title: "",
      isPublic: false,
    },
  });

  const { mutate: createPortfolio, isLoading } =
    trpc.portfolio.create.useMutation({
      onError: () => toast.error("Failed to create portfolio."),
      onSuccess: () => router.refresh(),
    });

  function onSubmit(data: FieldValues) {
    if (numberOfPortfolios >= PLANS[0].maxPortfolios) {
      return toast.warning("Maximum number of portfolios reached.");
    }

    createPortfolio({
      title: data.title,
      isPublic: data.isPublic,
    });

    onClose();
  }

  return (
    <>
      <Card
        onPress={onOpen}
        isPressable
        className="h-[340px] f-box"
        aria-label="Create portfolio"
      >
        <Button
          isIconOnly
          color="primary"
          isLoading={isLoading}
          startContent={!isLoading && <Plus size={20} />}
        />
      </Card>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="f-col">
            <h3 className="text-md">Create Portfolio</h3>
            <p className="text-sm text-zinc-500">
              Create a personal portfolio to track your stocks.
            </p>
          </ModalHeader>
          <ModalBody>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 f-col"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <Input
                      autoFocus
                      label="Title"
                      variant="bordered"
                      description="This is what your portfolio will be called."
                      placeholder="Choose your title..."
                      aria-label="Choose portfolio title"
                      errorMessage={form.formState.errors.title?.message}
                      {...field}
                      required
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-1 space-y-0 rounded-lg border p-4">
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                      <div className="space-y-1 leading-none">
                        <FormLabel>Make public</FormLabel>
                        <p className="text-zinc-400 text-xs">
                          Display portfolio publicly?
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  color="primary"
                  type="submit"
                  className="self-end"
                  aria-label="Create portfolio"
                  isLoading={isLoading}
                >
                  {!isLoading && <Plus size={18} />}
                  Create Portfolio
                </Button>
              </form>
            </Form>
          </ModalBody>
          <ModalBody />
        </ModalContent>
      </Modal>
    </>
  );
}
