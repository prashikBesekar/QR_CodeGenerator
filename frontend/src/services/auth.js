// services/auth.js
import apiService from './api';
import { API_CONFIG } from '../utils/constants';

class AuthService {
  async login(email, password) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData) {
    try {
      const { name, email, password, confirmPassword } = userData;
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async logout() {
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error for logout as we want to clear local storage anyway
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiService.get(API_CONFIG.ENDPOINTS.AUTH.ME);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to get user data');
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        refreshToken
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Token refresh failed');
    }
  }

  async forgotPassword(email) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  }

  async resetPassword(token, password) {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        password
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD, {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Password change failed');
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await apiService.put(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, profileData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  }

  async deleteAccount() {
    try {
      const response = await apiService.delete(API_CONFIG.ENDPOINTS.USER.DELETE_ACCOUNT);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Account deletion failed');
    }
  }

  // Utility methods
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  getTokenPayload(token) {
    if (!token) return null;
    
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null;
    }
  }
}

export default new AuthService();