// hooks/useAnalytics.js
import { useState, useEffect, useCallback } from 'react';
import qrService from '../services/qr';

/**
 * Hook for analytics data management
 * @param {object} filters - Analytics filters
 * @returns {object} Analytics data and functions
 */
export const useAnalytics = (filters = {}) => {
  const [analytics, setAnalytics] = useState({
    totalQRs: 0,
    totalScans: 0,
    activeCodes: 0,
    weeklyQRs: 0,
    weeklyScans: 0,
    topPerforming: [],
    scansByDate: [],
    scansByLocation: [],
    scansByDevice: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (customFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const mergedFilters = { ...filters, ...customFilters };
      const response = await qrService.getAnalytics(mergedFilters);
      setAnalytics(response.analytics || analytics);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshAnalytics = useCallback(() => {
    return fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    refreshAnalytics
  };
};

/**
 * Hook for real-time analytics updates
 * @param {number} interval - Update interval in milliseconds
 * @returns {object} Real-time analytics data
 */
export const useRealTimeAnalytics = (interval = 30000) => {
  const [realTimeData, setRealTimeData] = useState({
    activeScans: 0,
    recentScans: [],
    liveVisitors: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await qrService.getAnalytics({ realTime: true });
        setRealTimeData(response.realTime || realTimeData);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
        setIsConnected(false);
      }
    };

    fetchRealTimeData();
    const intervalId = setInterval(fetchRealTimeData, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    realTimeData,
    isConnected
  };
};

/**
 * Hook for analytics date range management
 * @returns {object} Date range state and functions
 */
export const useDateRange = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    preset: '30d'
  });

  const presets = {
    '7d': { days: 7, label: 'Last 7 days' },
    '30d': { days: 30, label: 'Last 30 days' },
    '90d': { days: 90, label: 'Last 90 days' },
    '1y': { days: 365, label: 'Last year' },
    'custom': { days: null, label: 'Custom range' }
  };

  const setPreset = useCallback((preset) => {
    const presetConfig = presets[preset];
    if (!presetConfig) return;

    if (preset === 'custom') {
      setDateRange(prev => ({ ...prev, preset }));
    } else {
      const endDate = new Date();
      const startDate = new Date(Date.now() - presetConfig.days * 24 * 60 * 60 * 1000);
      setDateRange({ startDate, endDate, preset });
    }
  }, []);

  const setCustomRange = useCallback((startDate, endDate) => {
    setDateRange({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      preset: 'custom'
    });
  }, []);

  const isValidRange = useCallback(() => {
    return dateRange.startDate <= dateRange.endDate;
  }, [dateRange]);

  const getDaysDifference = useCallback(() => {
    const diffTime = dateRange.endDate.getTime() - dateRange.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [dateRange]);

  return {
    dateRange,
    presets,
    setPreset,
    setCustomRange,
    isValidRange: isValidRange(),
    daysDifference: getDaysDifference()
  };
};

/**
 * Hook for analytics export functionality
 * @returns {object} Export functions and state
 */
export const useAnalyticsExport = () => {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const exportData = useCallback(async (format, filters = {}) => {
    setExporting(true);
    setExportError(null);
    try {
      const response = await qrService.exportQRs(format, { 
        ...filters, 
        includeAnalytics: true 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `qr-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (err) {
      setExportError(err.message);
      throw err;
    } finally {
      setExporting(false);
    }
  }, []);

  const exportCSV = useCallback((filters) => exportData('csv', filters), [exportData]);
  const exportPDF = useCallback((filters) => exportData('pdf', filters), [exportData]);
  const exportExcel = useCallback((filters) => exportData('xlsx', filters), [exportData]);

  return {
    exporting,
    exportError,
    exportData,
    exportCSV,
    exportPDF,
    exportExcel
  };
};

/**
 * Hook for analytics charts data processing
 * @param {object} rawData - Raw analytics data
 * @returns {object} Processed chart data
 */
export const useChartData = (rawData) => {
  const [chartData, setChartData] = useState({
    scansByDate: [],
    scansByHour: [],
    scansByDevice: [],
    scansByLocation: [],
    topQRCodes: []
  });

  useEffect(() => {
    if (!rawData) return;

    const processedData = {
      scansByDate: rawData.scansByDate?.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        scans: item.count,
        uniqueScans: item.uniqueCount || 0
      })) || [],

      scansByHour: rawData.scansByHour?.map(item => ({
        hour: `${item.hour}:00`,
        scans: item.count
      })) || [],

      scansByDevice: rawData.scansByDevice?.map(item => ({
        device: item.deviceType,
        scans: item.count,
        percentage: item.percentage
      })) || [],

      scansByLocation: rawData.scansByLocation?.map(item => ({
        location: item.country || item.city || 'Unknown',
        scans: item.count,
        coordinates: [item.latitude, item.longitude]
      })) || [],

      topQRCodes: rawData.topPerforming?.map(item => ({
        id: item.id,
        name: item.name || `QR ${item.id}`,
        scans: item.scanCount,
        data: item.data
      })) || []
    };

    setChartData(processedData);
  }, [rawData]);

  return chartData;
};

/**
 * Hook for analytics comparison between periods
 * @param {object} currentPeriod - Current period filters
 * @param {object} previousPeriod - Previous period filters
 * @returns {object} Comparison data and metrics
 */
export const useAnalyticsComparison = (currentPeriod, previousPeriod) => {
  const [comparison, setComparison] = useState({
    current: null,
    previous: null,
    changes: null
  });
  const [loading, setLoading] = useState(false);

  const fetchComparison = useCallback(async () => {
    setLoading(true);
    try {
      const [currentData, previousData] = await Promise.all([
        qrService.getAnalytics(currentPeriod),
        qrService.getAnalytics(previousPeriod)
      ]);

      const current = currentData.analytics;
      const previous = previousData.analytics;

      const changes = {
        totalQRs: {
          value: current.totalQRs - previous.totalQRs,
          percentage: previous.totalQRs > 0 ? ((current.totalQRs - previous.totalQRs) / previous.totalQRs) * 100 : 0
        },
        totalScans: {
          value: current.totalScans - previous.totalScans,
          percentage: previous.totalScans > 0 ? ((current.totalScans - previous.totalScans) / previous.totalScans) * 100 : 0
        },
        activeCodes: {
          value: current.activeCodes - previous.activeCodes,
          percentage: previous.activeCodes > 0 ? ((current.activeCodes - previous.activeCodes) / previous.activeCodes) * 100 : 0
        }
      };

      setComparison({ current, previous, changes });
    } catch (error) {
      console.error('Failed to fetch comparison data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPeriod, previousPeriod]);

  useEffect(() => {
    if (currentPeriod && previousPeriod) {
      fetchComparison();
    }
  }, [fetchComparison]);

  return {
    comparison,
    loading,
    refetch: fetchComparison
  };
};