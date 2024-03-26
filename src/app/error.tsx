"use client";

import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface Props {
  reset: () => void;
}

// export const runtime = "edge";

export default function Error({ reset }: Props) {
  return (
    <div className="f-box mt-[360px]">
      <div className="f-col gap-2.5">
        <h2 className="text-zinc-600 dark:text-zinc-400 text-lg">
          Internal Server Error
        </h2>
        <p className="text-zinc-400 dark:text-zinc-200 text-sm">
          There was an error on our end.
        </p>
        <Button aria-label="Reload page" onClick={() => reset()}>
          <RotateCw size={18} />
          Reload page
        </Button>
      </div>
    </div>
  );
}
