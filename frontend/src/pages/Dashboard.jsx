import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import QRGenerator from '../components/qr/QRGenerator';
import LoadingSpinner from '../components/common/LoadingSpinner';
import qrService from '../services/qr';



const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalQRs: 0,
    totalScans: 0,
    activeCodes: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await qrService.getAnalytics();
      setAnalytics(response.analytics || analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Manage your QR codes and view analytics</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total QR Codes</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.totalQRs}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.weeklyQRs > 0 ? `+${analytics.weeklyQRs} this week` : 'No new codes this week'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Scans</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.totalScans}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.weeklyScans > 0 ? `+${analytics.weeklyScans} this week` : 'No scans this week'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Codes</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics.activeCodes}</p>
          <p className="text-sm text-gray-500 mt-2">
            {analytics.totalQRs > 0 ? `${Math.round((analytics.activeCodes / analytics.totalQRs) * 100)}% active rate` : '0% active rate'}
          </p>
        </div>
      </div>
      
      <QRGenerator />
    </div>
  );
};

export default Dashboard;
