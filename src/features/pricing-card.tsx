import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { PlanType } from '@/config/plans'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Props {
  plan: PlanType
}

export default function PricingCard({ plan }: Readonly<Props>) {
  return (
    <Card
      key={plan.name}
      className="min-w-[400px] h-[450px] f-col justify-between gap-8 bg-gray-100 dark:bg-gray-900/50 shadow-md"
    >
      <CardHeader className="f-col gap-7">
        <div className="f-col gap-1">
          <div className="bg-gray-100 dark:bg-gray-950/70 border border-gray-300 dark:border-gray-800 mb-2 rounded-xl px-3 p-1">
            {plan.name}
          </div>
          <CardTitle className="text-3xl text-gray-100">
            {!plan.price.amount ? (
              'Free'
            ) : (
              <div className="flex gap-2 items-end">
                <p>${plan.price.amount}</p>
                <span className="text-lg font-normal">Per Month</span>
              </div>
            )}
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </div>
        <div className="f-col gap-2">
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
  )
}
