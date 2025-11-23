import User from '../models/User.js';
import { stripe,
     stripeConfig,
     createCustomer, 
     createCheckoutSession, 
     createBillingPortalSession, 
     cancelSubscription as cancelStripeSubscription} from '../utils/stripeUtils.js';

// Create checkout session
export const createCheckout = async (req, res) => {
  try {
    const { plan } = req.body; // 'pro' or 'enterprise'
    const userId = req.user.id;

    if (!['pro', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const user = await User.findById(userId);
    
    // Create Stripe customer if doesn't exist
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await createCustomer(user.email, user.name);
      customerId = customer.id;
      
      // Update user with customer ID
      await User.findByIdAndUpdate(userId, {
        stripeCustomerId: customerId
      });
    }

    // Get price ID for the selected plan
    const priceId = stripeConfig.products[plan];
    
    // Create checkout session
    const session = await createCheckoutSession(
      customerId, 
      priceId,
      { 
        userId: userId.toString(),
        plan 
      }
    );

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create billing portal session
export const createBillingPortal = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'No billing information found'
      });
    }

    const session = await createBillingPortalSession(user.stripeCustomerId);

    res.status(200).json({
      success: true,
      url: session.url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    await cancelStripeSubscription(user.subscriptionId);

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const getPayment = async (req, res) => {
  res.json({ success: true, message: 'getPayment not implemented' });
};

export const updatePayment = async (req, res) => {
  res.json({ success: true, message: 'updatePayment not implemented' });
};

export const deletePayment = async (req, res) => {
  res.json({ success: true, message: 'deletePayment not implemented' });
};



// Stripe webhook handler
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      stripeConfig.webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Helper functions for webhook events
const handleCheckoutCompleted = async (session) => {
  const userId = session.metadata.userId;
  const plan = session.metadata.plan;
  
  // Calculate plan expiry (1 month from now)
  const planExpiry = new Date();
  planExpiry.setMonth(planExpiry.getMonth() + 1);
  
  // Update user plan
  await User.findByIdAndUpdate(userId, {
    plan,
    planExpiry,
    subscriptionId: session.subscription,
    qrLimit: plan === 'pro' ? -1 : -1 // -1 means unlimited
  });
};

const handlePaymentSucceeded = async (invoice) => {
  const customerId = invoice.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  
  if (user) {
    // Extend plan expiry by 1 month
    const planExpiry = new Date(user.planExpiry || new Date());
    planExpiry.setMonth(planExpiry.getMonth() + 1);
    
    await User.findByIdAndUpdate(user._id, { planExpiry });
  }
};

const handleSubscriptionCancelled = async (subscription) => {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  
  if (user) {
    await User.findByIdAndUpdate(user._id, {
      plan: 'free',
      subscriptionId: null,
      qrLimit: 5
    });
  }
};

const handleSubscriptionUpdated = async (subscription) => {
  const customerId = subscription.customer;
  const user = await User.findOne({ stripeCustomerId: customerId });
  
  if (user && subscription.cancel_at_period_end) {
    // Subscription is set to cancel at period end
    // You might want to send an email or update UI
    console.log(`User ${user.email} subscription will cancel at period end`);
  }
};