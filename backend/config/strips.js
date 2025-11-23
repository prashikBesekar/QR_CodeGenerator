import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe configuration
const stripeConfig = {
  // Product IDs (create these in Stripe Dashboard)
  products: {
    pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_monthly',
    enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly'
  },
  
  // Webhook endpoint secret
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  
  // Success and cancel URLs
  successUrl: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
  cancelUrl: `${process.env.FRONTEND_URL}/pricing`,
};

// Create Stripe customer
const createCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        environment: process.env.NODE_ENV
      }
    });
    return customer;
  } catch (error) {
    throw new Error(`Failed to create Stripe customer: ${error.message}`);
  }
};

// Create checkout session
const createCheckoutSession = async (customerId, priceId, metadata = {}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: stripeConfig.successUrl,
      cancel_url: stripeConfig.cancelUrl,
      metadata,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });
    return session;
  } catch (error) {
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
};

// Create billing portal session
const createBillingPortalSession = async (customerId) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });
    return session;
  } catch (error) {
    throw new Error(`Failed to create billing portal session: ${error.message}`);
  }
};

// Cancel subscription
const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    return subscription;
  } catch (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

// Get subscription details
const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    throw new Error(`Failed to get subscription: ${error.message}`);
  }
};

export{
  stripe,
  stripeConfig,
  createCustomer,
  createCheckoutSession,
  createBillingPortalSession,
  cancelSubscription,
  getSubscription
};