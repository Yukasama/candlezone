"use client";

import { Portfolio } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Input } from "@nextui-org/react";
import { trpc } from "@/trpc/client";

type Props = {
  portfolio: Pick<Portfolio, "id" | "title">;
};

export default function PortfolioDeleteModal({ portfolio }: Props) {
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const { mutate: deletePortfolio, isLoading } =
    trpc.portfolio.delete.useMutation({
      onError: () => {
        toast.error(`Portfolio '${portfolio.title}' could not be deleted.`);
      },
      onSuccess: () => router.push("/portfolio"),
    });

  function onSubmit() {
    if (title !== "CONFIRM") {
      return toast.warning("Please enter 'CONFIRM' to complete the deletion.");
    }

    deletePortfolio(portfolio.id);

    onClose();
  }

  return (
    <>
      <Button
        className="bg-red-500 text-white"
        isIconOnly
        size="sm"
        onPress={onOpen}
        startContent={<Trash2 size={18} />}
        aria-label="Delete portfolio"
      />

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          <ModalHeader className="f-col">
            <h3 className="w-54 truncate">
              Delete Portfolio {portfolio.title}?
            </h3>
            <p className="text-sm text-zinc-500">
              This action cannot be undone.
            </p>
          </ModalHeader>

          <ModalBody className="grid w-full items-center gap-1.5">
            <Input
              placeholder="CONFIRM"
              labelPlacement="outside"
              aria-label="Confirm deletion of portfolio"
              description="Enter 'CONFIRM' to delete your portfolio."
              onChange={(e) => setTitle(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              className="bg-red-500 text-white"
              isLoading={isLoading}
              onClick={onSubmit}
              aria-label="Delete portfolio">
              {!isLoading && <Trash2 size={18} />}
              Delete Portfolio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
