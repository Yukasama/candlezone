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
      key={plan.name}
      className="bg-faded flex h-[450px] min-w-[400px] flex-col justify-between gap-8 shadow-md"
    >
      <CardHeader className="flex flex-col gap-7">
        <div className="flex flex-col gap-1">
          <div className="bg-faded/50 mb-2 rounded-xl border border-gray-300 p-1 px-3 dark:border-gray-800">
            {plan.name}
          </div>
          <CardTitle className="text-3xl text-gray-100">
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
            <div key={feature} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {feature}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardFooter>
        <Link
          href="/"
          prefetch={false}
          aria-label="Learn more"
          className={buttonVariants()}
        >
          Learn More
        </Link>
      </CardFooter>
    </Card>
  );
};
