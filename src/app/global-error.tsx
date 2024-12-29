'use client';

import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface Props {
  readonly reset: () => void;
}

export default function GlobalError({ reset }: Props) {
  return (
    <html lang="en">
      <body>
        <div className="f-col mt-[360px] items-center gap-3">
          <div className="f-col items-center">
            <h2 className="text-lg">Oops! Something went wrong.</h2>
            <p className="text-sm text-gray-400">
              There was an error on our end.
            </p>
          </div>
          <Button
            onClick={() => {
              reset();
            }}
          >
            <RotateCw size={18} />
            Reload page
          </Button>
        </div>
      </body>
    </html>
  );
}
