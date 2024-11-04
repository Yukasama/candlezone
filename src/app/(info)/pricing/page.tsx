import { Badge } from '@/components/ui/badge';
import { PLANS } from '@/features/payment/config/plans';
import { PricingCard } from '@/features/payment/pricing-card';

export const metadata = { title: 'Pricing' };

export default function Pricing() {
  return (
    <div className="f-col items-center justify-center gap-5 pb-7 pt-16">
      <Badge variant="secondary">Pricing</Badge>
      <h1 className="max-w-[400px] text-center font-['Helvetica'] text-4xl font-bold">
        Choose the plan that fits your needs
      </h1>

      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard key={plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}
