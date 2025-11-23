// services/payment.js
import apiService from './api';
import { API_CONFIG } from '../utils/constants';

class PaymentService {
  async getPlans() {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.PAYMENT.PLANS);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch plans');
    }
  }

  async subscribe(planId, paymentMethodId = null) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE, {
        planId,
        paymentMethodId
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Subscription failed');
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.PAYMENT.CANCEL, {
        subscriptionId
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Cancellation failed');
    }
  }

  async getBillingHistory(params = {}) {
    try {
      const base = API_CONFIG.ENDPOINTS.PAYMENT?.BILLING_HISTORY;
      if (!base) {
        // Backend endpoint not implemented yet; return empty history gracefully
        return { history: [] };
      }
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `${base}?${queryString}` : base;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch billing history');
    }
  }

  async updatePaymentMethod(paymentMethodId) {
    try {
      const response = await apiService.put(`${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE}/payment-method`, {
        paymentMethodId
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Payment method update failed');
    }
  }

  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE}/intent`, {
        amount,
        currency
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Payment intent creation failed');
    }
  }

  async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE}/confirm`, {
        paymentIntentId,
        paymentMethodId
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Payment confirmation failed');
    }
  }

  async downloadInvoice(invoiceId) {
    try {
      const response = await fetch(`${apiService.baseURL}${API_CONFIG.ENDPOINTS.PAYMENT.BILLING_HISTORY}/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Invoice download failed');
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw new Error(error.message || 'Invoice download failed');
    }
  }

  async validateCoupon(couponCode) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE}/validate-coupon`, {
        couponCode
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Coupon validation failed');
    }
  }

  async applyCoupon(couponCode, subscriptionId = null) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE}/apply-coupon`, {
        couponCode,
        subscriptionId
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Coupon application failed');
    }
  }

  async getUsage() {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE}/usage`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch usage data');
    }
  }

  async previewInvoice(planId, couponCode = null) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.PAYMENT.SUBSCRIBE}/preview`, {
        planId,
        couponCode
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Invoice preview failed');
    }
  }

  // Utility methods
  formatPrice(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100); // Assuming amount is in cents
  }

  formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getNextBillingDate(subscription) {
    if (!subscription.current_period_end) return null;
    return new Date(subscription.current_period_end * 1000);
  }

  isSubscriptionActive(subscription) {
    return subscription.status === 'active' || subscription.status === 'trialing';
  }

  isSubscriptionCanceled(subscription) {
    return subscription.status === 'canceled' || subscription.cancel_at_period_end;
  }

  getDaysUntilRenewal(subscription) {
    if (!subscription.current_period_end) return null;
    const now = new Date();
    const renewalDate = new Date(subscription.current_period_end * 1000);
    const diffTime = renewalDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  calculateProration(oldPlan, newPlan, daysRemaining) {
    const oldDailyRate = oldPlan.amount / 30; // Assuming monthly billing
    const newDailyRate = newPlan.amount / 30;
    const proratedCredit = oldDailyRate * daysRemaining;
    const proratedCharge = newDailyRate * daysRemaining;
    return proratedCharge - proratedCredit;
  }
}

export default new PaymentService();