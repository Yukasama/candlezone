import { Separator } from '@/components/ui/separator';

export const metadata = { title: 'Portfolio Settings' };

export default function AccountPortfolioPage() {
  return (
    <div className="f-col w-full gap-4">
      <div className="f-col gap-1">
        <h2 className="text-2xl font-light">Portfolio Settings</h2>
        <Separator />
      </div>
    </div>
  );
}
