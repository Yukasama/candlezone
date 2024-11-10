import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { OAuth } from './components/oauth';

export const OAuthSection = () => {
  return (
    <>
      <div className="f-center justify-between gap-2">
        <Separator className="flex-1" />
        <p className="text-center text-xs text-gray-400">OR CONTINUE WITH</p>
        <Separator className="flex-1" />
      </div>

      <div className="f-col gap-2">
        <Suspense>
          <OAuth provider="google" />
        </Suspense>
        <Suspense>
          <OAuth provider="facebook" />
        </Suspense>
        <Suspense>
          <OAuth provider="github" />
        </Suspense>
      </div>
    </>
  );
};
