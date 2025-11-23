// services/qr.js
import apiService from './api';
import { API_CONFIG } from '../utils/constants';

class QRService {
  async generateQR(qrData) {
    try {
      // Backend expects POST /api/qr with { title, url, customization }
      const response = await apiService.post(API_CONFIG.ENDPOINTS.QR.ROOT, qrData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'QR code generation failed');
    }
  }

  async getQRList(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString
        ? `${API_CONFIG.ENDPOINTS.QR.ROOT}?${queryString}`
        : API_CONFIG.ENDPOINTS.QR.ROOT;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch QR codes');
    }
  }

  async getQRById(id) {
    try {
      const response = await apiService.get(`${API_CONFIG.ENDPOINTS.QR.GET_BY_ID}/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch QR code');
    }
  }

  async updateQR(id, updateData) {
    try {
      const response = await apiService.put(`${API_CONFIG.ENDPOINTS.QR.UPDATE_BY_ID}/${id}`, updateData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'QR code update failed');
    }
  }

  async deleteQR(id) {
    try {
      const response = await apiService.delete(`${API_CONFIG.ENDPOINTS.QR.DELETE_BY_ID}/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'QR code deletion failed');
    }
  }

  async deleteMultipleQRs(ids) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.QR.DELETE}/bulk`, { ids });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Bulk deletion failed');
    }
  }

  async getAnalytics(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString
        ? `${API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD}?${queryString}`
        : API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD;
      const response = await apiService.get(endpoint);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch analytics');
    }
  }

  async trackScan(qrId, scanData = {}) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.ANALYTICS.TRACK_SCAN}/${qrId}`, {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        ...scanData
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to track scan');
    }
  }

  async downloadQR(id, format = 'PNG') {
    try {
      const response = await fetch(`${apiService.baseURL}${API_CONFIG.ENDPOINTS.QR.GET}/${id}/download?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw new Error(error.message || 'Download failed');
    }
  }

  async duplicateQR(id) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.QR.GET}/${id}/duplicate`);
      return response;
    } catch (error) {
      throw new Error(error.message || 'QR code duplication failed');
    }
  }

  async bulkGenerate(qrDataArray) {
    try {
      const response = await apiService.post(`${API_CONFIG.ENDPOINTS.QR.GENERATE}/bulk`, {
        qrCodes: qrDataArray
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Bulk generation failed');
    }
  }

  async exportQRs(format = 'csv', filters = {}) {
    try {
      const queryString = new URLSearchParams({ format, ...filters }).toString();
      const response = await fetch(`${apiService.baseURL}${API_CONFIG.ENDPOINTS.QR.LIST}/export?${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw new Error(error.message || 'Export failed');
    }
  }

  // Utility methods for QR validation and formatting
  validateQRData(data, type) {
    if (!data || !data.trim()) {
      throw new Error('QR code data cannot be empty');
    }

    switch (type) {
      case 'url':
        if (!this.isValidUrl(data)) {
          throw new Error('Invalid URL format');
        }
        break;
      case 'email':
        if (!this.isValidEmail(data)) {
          throw new Error('Invalid email format');
        }
        break;
      case 'phone':
        if (!this.isValidPhone(data)) {
          throw new Error('Invalid phone number format');
        }
        break;
      default:
        if (data.length > 1000) {
          throw new Error('QR code data too long (max 1000 characters)');
        }
    }

    return true;
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  formatVCard(contact) {
    const { firstName, lastName, phone, email, organization, url } = contact;
    let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
    
    if (firstName || lastName) {
      vcard += `FN:${firstName || ''} ${lastName || ''}\n`;
      vcard += `N:${lastName || ''};${firstName || ''};;;\n`;
    }
    
    if (phone) vcard += `TEL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (organization) vcard += `ORG:${organization}\n`;
    if (url) vcard += `URL:${url}\n`;
    
    vcard += 'END:VCARD';
    return vcard;
  }

  formatWiFi(wifi) {
    const { ssid, password, security = 'WPA', hidden = false } = wifi;
    return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;
  }

  formatSMS(phone, message) {
    return `SMSTO:${phone}:${message}`;
  }

  formatGeoLocation(latitude, longitude) {
    return `geo:${latitude},${longitude}`;
  }
}

export default new QRService();