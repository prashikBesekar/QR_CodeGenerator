// hooks/useQR.js
import { useState, useEffect, useCallback } from 'react';
import qrService from '../services/qr';
import { QR_CONFIG } from '../utils/constants';

/**
 * Hook for managing QR codes
 * @returns {object} QR management functions and state
 */
export const useQR = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQRCodes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await qrService.getQRList(params);
      setQrCodes(response.qrs || []);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateQR = useCallback(async (qrData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await qrService.generateQR(qrData);
      // Add new QR to the beginning of the list
      setQrCodes(prev => [response.qr, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQR = useCallback(async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await qrService.updateQR(id, updateData);
      // Update QR in the list
      setQrCodes(prev => prev.map(qr => qr.id === id ? { ...qr, ...response.qr } : qr));
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQR = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await qrService.deleteQR(id);
      // Remove QR from the list
      setQrCodes(prev => prev.filter(qr => qr.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateQR = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await qrService.duplicateQR(id);
      // Add duplicated QR to the beginning of the list
      setQrCodes(prev => [response.qr, ...prev]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    qrCodes,
    loading,
    error,
    fetchQRCodes,
    generateQR,
    updateQR,
    deleteQR,
    duplicateQR,
    setError
  };
};

/**
 * Hook for QR code generation with validation
 * @returns {object} QR generation functions and validation
 */
export const useQRGenerator = () => {
  const [qrData, setQrData] = useState('');
  const [qrType, setQrType] = useState('text');
  const [qrColor, setQrColor] = useState(QR_CONFIG.DEFAULT_COLOR);
  const [bgColor, setBgColor] = useState(QR_CONFIG.DEFAULT_BG_COLOR);
  const [size, setSize] = useState(QR_CONFIG.DEFAULT_SIZE);
  const [logo, setLogo] = useState(null);
  const [errorLevel, setErrorLevel] = useState('M');
  const [validationError, setValidationError] = useState('');

  const validateQRData = useCallback(() => {
    try {
      qrService.validateQRData(qrData, qrType);
      setValidationError('');
      return true;
    } catch (error) {
      setValidationError(error.message);
      return false;
    }
  }, [qrData, qrType]);

  const resetForm = useCallback(() => {
    setQrData('');
    setQrType('text');
    setQrColor(QR_CONFIG.DEFAULT_COLOR);
    setBgColor(QR_CONFIG.DEFAULT_BG_COLOR);
    setSize(QR_CONFIG.DEFAULT_SIZE);
    setLogo(null);
    setErrorLevel('M');
    setValidationError('');
  }, []);

  const getQRConfig = useCallback(() => {
    return {
      data: qrData,
      type: qrType,
      color: qrColor,
      bgColor,
      size,
      logo,
      errorLevel
    };
  }, [qrData, qrType, qrColor, bgColor, size, logo, errorLevel]);

  useEffect(() => {
    if (qrData) {
      validateQRData();
    } else {
      setValidationError('');
    }
  }, [qrData, qrType, validateQRData]);

  return {
    qrData,
    setQrData,
    qrType,
    setQrType,
    qrColor,
    setQrColor,
    bgColor,
    setBgColor,
    size,
    setSize,
    logo,
    setLogo,
    errorLevel,
    setErrorLevel,
    validationError,
    isValid: !validationError && qrData.trim() !== '',
    validateQRData,
    resetForm,
    getQRConfig
  };
};

/**
 * Hook for QR code scanning tracking
 * @param {string} qrId - QR code ID to track
 * @returns {object} Scan tracking functions
 */
export const useQRScanning = (qrId) => {
  const [scanCount, setScanCount] = useState(0);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(false);

  const trackScan = useCallback(async (scanData = {}) => {
    if (!qrId) return;
    
    setLoading(true);
    try {
      const response = await qrService.trackScan(qrId, scanData);
      setScanCount(prev => prev + 1);
      setRecentScans(prev => [response.scan, ...prev.slice(0, 9)]); // Keep last 10 scans
      return response;
    } catch (error) {
      console.error('Failed to track scan:', error);
    } finally {
      setLoading(false);
    }
  }, [qrId]);

  const fetchScanData = useCallback(async () => {
    if (!qrId) return;
    
    setLoading(true);
    try {
      const response = await qrService.getQRById(qrId);
      setScanCount(response.qr.scanCount || 0);
      setRecentScans(response.qr.recentScans || []);
    } catch (error) {
      console.error('Failed to fetch scan data:', error);
    } finally {
      setLoading(false);
    }
  }, [qrId]);

  useEffect(() => {
    fetchScanData();
  }, [fetchScanData]);

  return {
    scanCount,
    recentScans,
    loading,
    trackScan,
    fetchScanData
  };
};

/**
 * Hook for bulk QR operations
 * @returns {object} Bulk operation functions
 */
export const useBulkQR = () => {
  const [selectedQRs, setSelectedQRs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectQR = useCallback((qrId) => {
    setSelectedQRs(prev => 
      prev.includes(qrId) 
        ? prev.filter(id => id !== qrId)
        : [...prev, qrId]
    );
  }, []);

  const selectAll = useCallback((qrIds) => {
    setSelectedQRs(qrIds);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedQRs([]);
  }, []);

  const bulkDelete = useCallback(async () => {
    if (selectedQRs.length === 0) return;
    
    setLoading(true);
    setError(null);
    try {
      await qrService.deleteMultipleQRs(selectedQRs);
      setSelectedQRs([]);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedQRs]);

  const bulkGenerate = useCallback(async (qrDataArray) => {
    setLoading(true);
    setError(null);
    try {
      const response = await qrService.bulkGenerate(qrDataArray);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportSelected = useCallback(async (format = 'csv') => {
    if (selectedQRs.length === 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await qrService.exportQRs(format, { ids: selectedQRs });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedQRs]);

  return {
    selectedQRs,
    loading,
    error,
    selectQR,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkGenerate,
    exportSelected,
    hasSelection: selectedQRs.length > 0
  };
};