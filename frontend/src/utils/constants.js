// utils/constants.js

export const API_CONFIG = {
  // Use direct backend URL to avoid proxy/hangs
  BASE_URL: (typeof window !== 'undefined' && window.__API_BASE__) || 'http://localhost:5000/api',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      // The following are not implemented on backend yet; keep placeholders if needed by UI
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    QR: {
      // Backend mounts these under /api/qr
      ROOT: '/qr', // GET (list), POST (create)
      GET_BY_ID: '/qr', // GET /qr/:id
      UPDATE_BY_ID: '/qr', // PUT /qr/:id
      DELETE_BY_ID: '/qr', // DELETE /qr/:id
    },
    ANALYTICS: {
      DASHBOARD: '/analytics/dashboard',
      QR_BY_ID: '/analytics/qr', // GET /analytics/qr/:id
      TRACK_SCAN: '/analytics/track' // POST /analytics/track/:id
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/update',
      CHANGE_PASSWORD: '/user/change-password',
      DELETE_ACCOUNT: '/user/delete'
    },
    PAYMENT: {
      CHECKOUT: '/payment/checkout',
      PORTAL: '/payment/portal',
      CANCEL: '/payment/cancel',
      BILLING_HISTORY: '/payment/history',
      BY_ID: '/payment' // GET/PUT/DELETE /payment/:id
    }
  }
};

export const APP_CONFIG = {
  APP_NAME: 'QRGen Pro',
  VERSION: '1.0.0',
  COMPANY: 'QRGen Technologies',
  SUPPORT_EMAIL: 'support@qrgen.com',
  CONTACT_EMAIL: 'contact@qrgen.com'
};

export const QR_CONFIG = {
  DEFAULT_SIZE: 200,
  MIN_SIZE: 100,
  MAX_SIZE: 500,
  DEFAULT_COLOR: '#000000',
  DEFAULT_BG_COLOR: '#ffffff',
  SUPPORTED_FORMATS: ['PNG', 'JPG', 'SVG', 'PDF'],
  MAX_DATA_LENGTH: 1000
};

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '10 QR codes per month',
      'Basic customization',
      'Standard support',
      'Basic analytics'
    ],
    limits: {
      qrCodes: 10,
      scans: 1000
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 9,
    interval: 'month',
    features: [
      '100 QR codes per month',
      'Advanced customization',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'Bulk generation'
    ],
    limits: {
      qrCodes: 100,
      scans: 10000
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited QR codes',
      'White-label solution',
      '24/7 support',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Team management'
    ],
    limits: {
      qrCodes: -1, // unlimited
      scans: -1 // unlimited
    }
  }
};

export const QR_TYPES = {
  TEXT: 'text',
  URL: 'url',
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  WIFI: 'wifi',
  VCARD: 'vcard',
  LOCATION: 'location'
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language'
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  QR_LIST: '/qr-codes',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  PRICING: '/pricing',
  HELP: '/help'
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  DE: 'de',
  IT: 'it',
  PT: 'pt',
  RU: 'ru',
  ZH: 'zh',
  JA: 'ja',
  KO: 'ko'
};