import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeConfig = {
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  products: {
    pro: process.env.STRIPE_PRO_PRICE_ID,
    enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID
  }
};

export const createCustomer = async (email, name) => {
  return await stripe.customers.create({ email, name });
};

export const createCheckoutSession = async (customerId, priceId, metadata) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
    metadata
  });
};

export const createBillingPortalSession = async (customerId) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.FRONTEND_URL}/dashboard`
  });
};

export const cancelSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.del(subscriptionId);
};