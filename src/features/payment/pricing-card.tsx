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
import { PlanType } from './plans';

interface Props {
  plan: PlanType;
}

export default function PricingCard({ plan }: Readonly<Props>) {
  return (
    <Card
      key={plan.name}
      className="f-col h-[450px] min-w-[400px] justify-between gap-8 bg-gray-100 shadow-md dark:bg-gray-900/50"
    >
      <CardHeader className="f-col gap-7">
        <div className="f-col gap-1">
          <div className="mb-2 rounded-xl border border-gray-300 bg-gray-100 p-1 px-3 dark:border-gray-800 dark:bg-gray-950/70">
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
        <div className="f-col gap-2">
          {plan.features.map((feature) => (
            <div key={feature} className="f-center gap-3">
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
}
