import { env } from '@/env.mjs';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import type Stripe from 'stripe';

export const POST = async (request: Request) => {
  const body = await request.text();

  const headerList = await headers();
  const signature = headerList.get('Stripe-Signature') ?? '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return new Response(
      `Webhook Error: ${error instanceof Error ? error.message : 'Unknown Error'}`,
      { status: 400 },
    );
  }

  const session = event.data.object as Stripe.Checkout.Session | undefined;
  if (!session?.metadata?.userId) {
    return new Response('OK');
  }

  if (event.type === 'checkout.session.completed') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await db.user.update({
      data: {
        stripeCurrentPeriodEnd: new Date(
          subscription.billing_cycle_anchor * 1000,
        ),
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeSubscriptionId: subscription.id,
      },
      where: { id: session.metadata.userId },
    });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await db.user.update({
      data: {
        stripeCurrentPeriodEnd: new Date(
          subscription.billing_cycle_anchor * 1000,
        ),
        stripePriceId: subscription.items.data[0]?.price.id,
      },
      where: { stripeSubscriptionId: subscription.id },
    });
  }

  return new Response('OK');
};
