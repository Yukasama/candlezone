import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { PlanType } from "@/config/plans";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

interface Props {
  plan: PlanType;
}

export default function PricingCard({ plan }: Props) {
  return (
    <Card
      key={plan.name}
      className={`min-w-[400px] h-[450px] f-col justify-between gap-8 ${
        plan.name !== "Premium"
          ? "bg-zinc-100 dark:bg-zinc-900/50 shadow-lg"
          : "bg-gradient-to-br from-orange-500/80 to-amber-500/90 shadow-md shadow-amber-500/30"
      }`}
    >
      <CardHeader className="f-col gap-7">
        <div className="f-col gap-1">
          <div className="bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-300 dark:border-zinc-800 mb-2 rounded-xl">
            {plan.name}
          </div>
          <CardTitle className="text-3xl">
            {!plan.price.amount ? (
              "Free"
            ) : (
              <div className="flex gap-2 items-end">
                <p className={`${plan.name === "Premium" && "text-zinc-100"}`}>
                  ${plan.price.amount}
                </p>
                <span
                  className={`${
                    plan.name === "Premium" && "text-zinc-100"
                  } text-lg font-normal`}
                >
                  Per Month
                </span>
              </div>
            )}
          </CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </div>
        <div className="f-col gap-2">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <CheckCircle
                className={`h-5 w-5 ${
                  plan.name === "Premium" ? "text-green-600" : "text-green-500"
                }`}
              />
              <p className={`${plan.name === "Premium" && "text-zinc-100"}`}>
                {feature}
              </p>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardFooter>
        <Link
          href="/"
          prefetch={false}
          aria-label="Learn more"
          className={buttonVariants({ variant: "secondary" })}
        >
          Learn More
        </Link>
      </CardFooter>
    </Card>
  );
}
