const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate short code for QR
const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Format date for analytics
const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Calculate plan limits
const getPlanLimits = (plan) => {
  const limits = {
    free: {
      qrLimit: 5,
      analyticsRetention: 30, // days
      customization: false,
      apiAccess: false
    },
    pro: {
      qrLimit: -1, // unlimited
      analyticsRetention: 365,
      customization: true,
      apiAccess: true
    },
    enterprise: {
      qrLimit: -1,
      analyticsRetention: -1, // unlimited
      customization: true,
      apiAccess: true,
      teamFeatures: true,
      customDomains: true
    }
  };
  
  return limits[plan] || limits.free;
};

// Check if plan feature is available
const hasFeature = (userPlan, feature) => {
  const limits = getPlanLimits(userPlan);
  return limits[feature] === true;
};

// Sanitize filename for uploads
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};
