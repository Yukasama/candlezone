import { env } from '@/env.mjs';
import { getUser } from '@/features/auth/actions/get-user';
import { PLANS } from '@/features/payment/config/plans';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export const stripe = new Stripe(env.STRIPE_API_KEY, { typescript: true });

export const getUserSubscriptionPlan = async () => {
  const user = await getUser();

  const freePlan = {
    ...PLANS[0],
    isCanceled: false,
    isSubscribed: false,
    stripeCurrentPeriodEnd: undefined,
  };

  if (!user?.id) {
    return freePlan;
  }

  const dbUser = await db.user.findUnique({
    select: {
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
    },
    where: { id: user.id },
  });

  if (!dbUser) {
    return freePlan;
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCurrentPeriodEnd &&
      dbUser.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now(),
  );

  const plan = isSubscribed
    ? PLANS.find(({ price }) => price.priceIds.test === dbUser.stripePriceId)
    : undefined;

  let isCanceled = false;
  if (isSubscribed && dbUser.stripeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stripeSubscriptionId,
    );
    isCanceled = stripePlan.cancel_at_period_end;
  }

  return {
    ...plan,
    isCanceled,
    isSubscribed,
    stripeCurrentPeriodEnd: dbUser.stripeCurrentPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    stripeSubscriptionId: dbUser.stripeSubscriptionId,
  };
};
