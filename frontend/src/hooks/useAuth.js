// hooks/useAuth.js
// This is re-exported from AuthContext for convenience
export { useAuth } from '../context/AuthContext';

// Additional auth-related hooks can be added here

/**
 * Hook to check if user has specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean} Whether user has permission
 */
export const usePermission = (permission) => {
  const { user } = useAuth();
  
  if (!user || !user.permissions) {
    return false;
  }
  
  return user.permissions.includes(permission) || user.permissions.includes('admin');
};

/**
 * Hook to check if user has specific role
 * @param {string} role - Role to check
 * @returns {boolean} Whether user has role
 */
export const useRole = (role) => {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return false;
  }
  
  return user.role === role || user.role === 'admin';
};

/**
 * Hook to get user subscription status
 * @returns {object} Subscription information
 */
export const useSubscription = () => {
  const { user } = useAuth();
  
  const subscription = user?.subscription || null;
  const isSubscribed = subscription && subscription.status === 'active';
  const isPremium = isSubscribed && (subscription.plan === 'pro' || subscription.plan === 'enterprise');
  const isTrialing = subscription && subscription.status === 'trialing';
  const isCanceled = subscription && subscription.cancel_at_period_end;
  
  return {
    subscription,
    isSubscribed,
    isPremium,
    isTrialing,
    isCanceled,
    plan: subscription?.plan || 'free'
  };
};

/**
 * Hook to check feature availability based on subscription
 * @param {string} feature - Feature to check
 * @returns {boolean} Whether feature is available
 */
export const useFeature = (feature) => {
  const { plan } = useSubscription();
  
  const features = {
    free: ['basic_qr', 'basic_customization', 'limited_analytics'],
    pro: ['basic_qr', 'basic_customization', 'limited_analytics', 'advanced_qr', 'advanced_customization', 'full_analytics', 'bulk_generation'],
    enterprise: ['basic_qr', 'basic_customization', 'limited_analytics', 'advanced_qr', 'advanced_customization', 'full_analytics', 'bulk_generation', 'api_access', 'white_label', 'priority_support']
  };
  
  return features[plan]?.includes(feature) || false;
};

/**
 * Hook to get usage limits based on subscription
 * @returns {object} Usage limits
 */
export const useUsageLimits = () => {
  const { plan, subscription } = useSubscription();
  
  const limits = {
    free: { qrCodes: 10, scans: 1000, storage: 100 }, // MB
    pro: { qrCodes: 100, scans: 10000, storage: 1000 }, // MB
    enterprise: { qrCodes: -1, scans: -1, storage: -1 } // unlimited
  };
  
  const currentLimits = limits[plan] || limits.free;
  const usage = subscription?.usage || { qrCodes: 0, scans: 0, storage: 0 };
  
  return {
    limits: currentLimits,
    usage,
    remaining: {
      qrCodes: currentLimits.qrCodes === -1 ? -1 : Math.max(0, currentLimits.qrCodes - usage.qrCodes),
      scans: currentLimits.scans === -1 ? -1 : Math.max(0, currentLimits.scans - usage.scans),
      storage: currentLimits.storage === -1 ? -1 : Math.max(0, currentLimits.storage - usage.storage)
    },
    isLimitReached: {
      qrCodes: currentLimits.qrCodes !== -1 && usage.qrCodes >= currentLimits.qrCodes,
      scans: currentLimits.scans !== -1 && usage.scans >= currentLimits.scans,
      storage: currentLimits.storage !== -1 && usage.storage >= currentLimits.storage
    }
  };
};