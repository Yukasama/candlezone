import { Separator } from '@/components/ui/separator';
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
        <OAuth provider="google" />
        <OAuth provider="facebook" />
        <OAuth provider="github" />
      </div>
    </>
  );
};
