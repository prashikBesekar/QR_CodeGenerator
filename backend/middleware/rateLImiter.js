const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator (can be used to limit by user ID instead of IP)
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  standardHeaders: true,
  legacyHeaders: false,
});

// QR creation rate limiter
const qrCreationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 QR codes per minute per user
  message: {
    error: 'Too many QR codes created, please slow down.',
    retryAfter: '1 minute'
  },
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});

// QR scan rate limiter (for analytics tracking)
const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Max 60 scans per minute per IP
  message: {
    error: 'Too many scan requests, please try again later.'
  },
  skip: (req) => {
    // Skip rate limiting for authenticated users with pro plans
    if (req.user && req.user.plan !== 'free') {
      return true;
    }
    return false;
  }
});

// Payment endpoint rate limiter
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 payment attempts per hour
  message: {
    error: 'Too many payment attempts, please try again later.',
    retryAfter: '1 hour'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  qrCreationLimiter,
  scanLimiter,
  paymentLimiter
};