import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { PlanType } from './config/plans';

interface Props {
  plan: PlanType;
}

export const PricingCard = ({ plan }: Readonly<Props>) => {
  return (
    <Card
      className="bg-faded flex h-[450px] min-w-[400px] flex-col justify-between gap-8 shadow-md"
      key={plan.name}
    >
      <CardHeader className="flex flex-col gap-7">
        <div className="flex flex-col gap-1">
          <div className="bg-faded/50 border-accent mb-2 rounded-xl border p-1 px-3">
            {plan.name}
          </div>
          <CardTitle className="text-accent text-3xl">
            {plan.price.amount ? (
              <div className="flex items-end gap-2">
                <p>${plan.price.amount}</p>
                <span className="text-lg font-normal">Per Month</span>
              </div>
            ) : (
              'Free'
            )}
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </div>
        <div className="flex flex-col gap-2">
          {plan.features.map((feature) => (
            <div className="flex items-center gap-3" key={feature}>
              <CheckCircle className="text-success size-5" />
              {feature}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardFooter>
        <Link
          aria-label="Learn more"
          className={buttonVariants()}
          href="/"
          prefetch={false}
        >
          Learn More
        </Link>
      </CardFooter>
    </Card>
  );
};
