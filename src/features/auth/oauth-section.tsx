import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { OAuth } from './components/oauth';

export const OAuthSection = () => {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <Separator className="flex-1" />
        <p className="text-desc text-center text-xs">OR CONTINUE WITH</p>
        <Separator className="flex-1" />
      </div>

      <div className="flex justify-center gap-2">
        <Suspense>
          <OAuth provider="google" />
        </Suspense>
        <Suspense>
          <OAuth provider="github" />
        </Suspense>
        <Suspense>
          <OAuth provider="mastodon" />
        </Suspense>
      </div>
    </>
  );
};
