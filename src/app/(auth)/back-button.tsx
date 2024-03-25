"use client";

import { Button } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="absolute top-5 left-5 button-secondary font-medium"
      aria-label="Back">
      <ArrowLeft size={18} />
      Back
    </Button>
  );
};
