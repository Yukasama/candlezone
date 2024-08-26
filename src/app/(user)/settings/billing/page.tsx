import { Separator } from '@/components/ui/separator';

export const metadata = { title: 'Billing Information' };

export default function Page() {
  return (
    <div className="f-col w-full gap-4">
      <div className="f-col gap-1">
        <h2 className="text-2xl font-light">Billing</h2>
        <Separator />
      </div>
    </div>
  );
}
